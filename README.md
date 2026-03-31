# gee_danube_flood_detection
# Multi-sensor Flood Mapping – Danube River, Bavaria (June 2024)

In June 2024, heavy rainfall caused significant flooding along the Danube River and its tributaries in Bavaria, Germany. To map the extent of this event, a flood mapping workflow was implemented in Google Earth Engine using Sentinel-2 (optical) and Sentinel-1 (SAR) data, leveraging the complementary strengths of both sensors.

---

## Methodology

The workflow consists of:

- Preprocessing and cloud masking of Sentinel-2 imagery  
- Optical flood detection using MNDWI thresholding  
- SAR flood detection using automated thresholding  
- Fusion of optical and SAR flood masks  
- Refinement using slope and permanent water masks  

---

## Results

The pre-flood Sentinel-2 composite established baseline conditions, while the flood-period composite highlighted inundated areas, though partially limited by cloud cover. The optical flood mask effectively delineated open water in cloud-free regions, whereas the SAR flood mask detected inundation in cloud-covered and vegetated areas, filling gaps in the optical data. These outputs were fused to produce the final flood extent, representing the most reliable estimate of inundation. Flood statistics were also computed for districts along the Danube and its tributaries to provide an administrative perspective of the impacts.

<p align="center">
  <img src="figures/final_flood_map.jpg" width="600"/>
</p>

*Figure: Final fused flood extent along the Danube River in Bavaria, June 2024.*

---

## Conclusion

This project demonstrates a robust and scalable approach to flood mapping using Google Earth Engine. By combining optical and SAR datasets, the workflow produces a reliable representation of flood extent under diverse environmental conditions. The methodology can be applied to other regions for flood monitoring, risk assessment, and disaster response.

---

## Requirements

To reproduce this workflow, you will need:

- A Google Earth Engine account  
- Basic knowledge of the GEE JavaScript API  
- The provided script and AOI definition  

---


Author: Patience Birungi
