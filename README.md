# gee_danube_flood_detection
Multi-sensor flood mapping for the June 2024 floods along the Danube River in Bavaria, Germany.

In June 2024, heavy rainfall caused significant flooding along the Danube River and its tributaries in Bavaria. To map the extent of the flood, this analysis combines Sentinel-2 optical imagery and Sentinel-1 SAR data. Optical images provide clear surface information where clouds are absent, while SAR detects water under cloud cover and complements the optical data.

The workflow is implemented in Google Earth Engine, including:
Preprocessing and cloud masking of Sentinel-2 imagery, Optical flood detection using MNDWI thresholds, SAR flood detection using ratio thresholding, Fusion of optical and SAR flood masks for the final extent and Refinement to remove permanent water and steep slopes.

The main outputs include: Pre-flood Sentinel-2 composite (true color), Flood Sentinel-2 composite (true color), Optical flood mask, SAR flood mask (gap filler) and Final fused flood extent.

The maps reveal the areas inundated during the flood. Due to the cloud cover limitations of optical data, the fused product provides a more complete and reliable estimate of the flooded area. Limitations include potential misclassification in urban areas and minor false positives in steep or shadowed terrain.

Requirements to reproduce:
Google Earth Engine account (JavaScript API)
The provided script and AOI definition

This analysis provides a reproducible workflow for rapid flood mapping and can be extended to other river basins using multi-sensor data.
