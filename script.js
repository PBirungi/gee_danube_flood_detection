//Load study area
var aoi = ee.Geometry.Polygon([
  [
    [9.98, 48.29],
    [13.30, 48.29],
    [13.30, 49.05],
    [9.98, 49.05],
    [9.98, 48.29]
  ]
]);
Map.centerObject(aoi, 9);
Map.addLayer(aoi, {color:red}, 'AOI'};

//Define period of study
var preStart = '2024-04-01'; 
var preEnd = '2024-05-25';
var floodStart = '2024-06-01'; 
var floodEnd = '2024-06-15';

// Working with Optical data (Sentinel-2) 
function maskS2(image) {
  var scl = image.select('SCL');
  return image.updateMask(scl.neq(9).and(scl.neq(10)));
};

var s2Col = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED").filterBounds(aoi).map(maskS2);
var preS2 = s2Col.filterDate(preStart, preEnd).median().clip(aoi);
var floodS2 = s2Col.filterDate(floodStart, floodEnd).median().clip(aoi);

var mndwiPre = preS2.normalizedDifference(['B3', 'B11']);
var mndwiFlood = floodS2.normalizedDifference(['B3', 'B11']);
var floodOptical = mndwiFlood.gt(-0.05).and(mndwiPre.lt(-0.05)).rename('flood_mask');

// Working with SAR (Sentinel-1) to fill the gaps in the optical data
var s1Col = ee.ImageCollection('COPERNICUS/S1_GRD')
              .filterBounds(aoi)
              .filter(ee.Filter.eq('instrumentMode', 'IW'))
              .filter(ee.Filter.eq('transmitterReceiverPolarisation', ['VV', 'VH']))
              .filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'));

var preS1 = s1Col.filterDate(preStart, preEnd).median().select('VV');
var floodS1 = s1Col.filterDate(floodStart, floodEnd).mean().select('VV');

// SAR Ratio-based Thresholding
var floodSAR = floodS1.divide(preS1).lt(0.8).rename('flood_mask').clip(aoi);

// Optical and SAR data fusion
var opticalMask = floodS2.select('B2').mask(); 
var fusedFlood = ee.Image(0).rename('flood_mask').where(opticalMask, floodOptical).where(opticalMask.not(), floodSAR);

// Post processing to improve accuracy of the flood mask
var slope = ee.Algorithms.Terrain(ee.Image("NASA/NASADEM_HGT/001")).select('slope');
var permWater = ee.Image("JRC/GSW1_4/GlobalSurfaceWater").select('occurrence').gt(80);

var finalOptical = floodOptical.updateMask(slope.lt(5)).updateMask(permWater.not()).selfMask();
var finalSAR = floodSAR.updateMask(slope.lt(5)).updateMask(permWater.not()).selfMask();
var finalFused = fusedFlood.updateMask(slope.lt(5)).updateMask(permWater.not()).selfMask();

// Visualization 
Map.addLayer(preS2, {bands:['B4','B3','B2'], min:0, max:3000}, 'Pre-Flood Baseline');
Map.addLayer(floodS2, {bands:['B4','B3','B2'], min:0, max:3000}, 'Flood');
Map.addLayer(finalOptical, {palette: ['orange']}, 'Optical Extent');
Map.addLayer(finalSAR, {palette: ['blue']}, 'SAR Extent (Gap Filler)');
Map.addLayer(finalFused, {palette: ['red']}, 'FINAL FUSED EXTENT');

// Export Results
var region = aoi;

// Pre-flood S2
Export.image.toDrive({
  image: preS2.select(['B4','B3','B2']).visualize({
    bands:['B4','B3','B2'],
    min:0,
    max:0.3,
    gamma:1.2
  }),
  description: 'Bavaria_PreFlood_S2',
  folder: 'Bavaria_Flood_Maps',
  fileNamePrefix: 'PreFlood_S2',
  scale: 10,
  region: region,
  maxPixels: 1e13
});

// Flood S2
Export.image.toDrive({
  image: floodS2.select(['B4','B3','B2']).visualize({
    bands:['B4','B3','B2'],
    min:0,
    max:0.3,
    gamma:1.2
  }),
  description: 'Bavaria_Flood_S2',
  folder: 'Bavaria_Flood_Maps',
  fileNamePrefix: 'Flood_S2',
  scale: 10,
  region: region,
  maxPixels: 1e13
});

// Optical flood mask
Export.image.toDrive({
  image: finalOptical.unmask(0).toByte(),
  description: 'Bavaria_Flood_Optical',
  folder: 'Bavaria_Flood_Maps',
  fileNamePrefix: 'Flood_Optical',
  scale: 10,
  region: region,
  maxPixels: 1e13
});

// SAR flood mask (gap filler)
Export.image.toDrive({
  image: finalSAR.unmask(0).toByte(),
  description: 'Bavaria_Flood_SAR',
  folder: 'Bavaria_Flood_Maps',
  fileNamePrefix: 'Flood_SAR',
  scale: 10,
  region: region,
  maxPixels: 1e13
});

// Final fused flood mask
Export.image.toDrive({
  image: finalFused.unmask(0).toByte(),
  description: 'Bavaria_Flood_Fused',
  folder: 'Bavaria_Flood_Maps',
  fileNamePrefix: 'Flood_Fused',
  scale: 10,
  region: region,
  maxPixels: 1e13
});
