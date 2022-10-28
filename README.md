# HAND Multi-Depth Component
## Introduction
This repository contains the multi-depth component of HAND and is designed as a platform-independent component. The module first computes the water depth matrix for every single pixel on the map. Then, by comparing the water depth assigned to each pixel and its HAND value, the inundation status of any pixel is determined--inundated if the depth is greater than the HAND, and dry otherwise. 

The three multi-depth functions are Da (taking the average of a list of depths given at certain locations weighted by the upstream areas the pixel at each location drains), Dl (taking the average of a list of depths given at certain locations weighted by the upstream lengths the pixel at each location controls), and Dlocal (apply the depths directly to corresponding upstream pixels without taking the average). 

## Example
The controlled upstream areas and stream lengths are computed based on D8 flow directions in the example we provided. These can also be obtained directly from field measurements or measurements from maps. If the area and stream length arrays are provided, the computed two arrays will be overwritten. It is worth noting that the stream flow values used in the example are fake numbers just for demonstration purposes and do not correspond to a real-world scenario. 
![image](https://user-images.githubusercontent.com/49577873/198705473-286e9bae-9db1-4f90-81c3-ab82c2096eeb.png)


## Explanation
Functions and helpful code comments are all included in f.js file. The files folder contains the HAND, drainage area, and a derived product, parent, using D8 flow matrix. parent is organized in such a way that any element with an index of an integer multiple of 8 is the total number of the adjancent pixels that drains to the current pixel (the index divided by 8), followed by the index of at most seven possible surounding parent pixels. Any pixel can have at most seven instead of eight parent pixels because the computation of HAND requires the removal of artificial pits and flat areas, and therefore, any adjacent nine-pixel group should have an outlet.

## Acknowledgements & Citation
This project is developed by the University of Iowa Hydroinformatics Lab (UIHI Lab): https://hydroinformatics.uiowa.edu/ 

**Li, Z., Duque, F.Q., Grout, T., Bates, B. and Demir, I., 2022. Comparative Analysis of Performance and Mechanisms of Flood Inundation Map Generation using Height Above Nearest Drainage. https://doi.org/10.31223/X59K9G**

## Contact
Please feel free to reach out to the authors (<ins>zhouyayan-li@uiowa.edu</ins>) if you have any questions.


