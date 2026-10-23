---
title: Fiber Ring Detection and Measurement from Few Unlabelled Microscopy Images
summary: >-
  A two-stage hybrid pipeline, combining YOLO detection with OpenCV geometric analysis and
  least-squares ellipse fitting, that measures ring structures in fiber cross-sections from
  only 4–8 unlabelled, distorted microscopy images.
category: vision
order: 3
featured: true
thumbnail: /assets/icons/fiber_rings_exp_main.png
context: Industrial quality control
facts:
  Domain: Computer vision · industrial QA
  Approach: Hybrid YOLO + classical CV
  Dataset size: 4–8 unlabelled images
  Stage 1: YOLO object detection
  Stage 2: OpenCV geometric analysis
tags: [Python, YOLO, OpenCV, NumPy, ONNX Runtime, Ellipse fitting, HSV segmentation]
links:
  code: https://github.com/noorulhudaajmal/ring-detection-experiment
demo:
  url: ""
  embed: false
---

## Overview

This computer vision system automatically detects and measures ring structures in
microscopic cross-section images of industrial fibers. The rings represent distinct
internal layers (fiber core, intermediate structural material and outer cladding), and
their geometry is a direct indicator of manufacturing quality.

The dataset was extremely limited: only 4–8 images with no labelled annotations, made
worse by uneven lighting, microscope reflections and visibly distorted ring shapes.
These factors made traditional machine-learning segmentation unreliable, since it needs
large labelled datasets to generalise.

To solve this, I designed a two-stage hybrid system that combines deep learning with
classical computer vision. A YOLO-based object detection model first identifies regions
of interest containing individual fiber rings. Each detected region then goes through an
OpenCV-based geometric analysis pipeline that extracts precise measurements, including
ring radii, layer thickness and structural ratios. This approach produced accurate
automated measurements despite the small dataset and the difficult microscopy
conditions.

**Likely fiber applications:** sports-equipment strings, high-strength cordage, advanced
textiles and composite reinforcement.

## Problem statement

Fiber manufacturers need to measure ring structures in cross-section images to verify
layer thickness, structural symmetry and manufacturing consistency, and to catch
potential production defects. Manual measurement is slow and subjective. The conditions
of this dataset made standard automated approaches equally inadequate.

Simple computer vision techniques are unreliable on noisy microscopy images with
inconsistent lighting, and conventional deep learning models need large labelled datasets
that did not exist here. Neither approach alone was sufficient under these combined
constraints.

- Microscope reflections cause bright artefacts.
- Rings appear distorted rather than as perfect circles.
- ML segmentation is impractical without labelled training data.
- Only 4–8 sample images are available.
- There are no labels, annotations or ground truth.
- Illumination varies strongly and unevenly.

## Solution

I implemented a two-stage hybrid pipeline that separates the **detection** problem from
the **measurement** problem, using the most appropriate technique for each rather than
forcing a single approach to do both.

**Stage 1, deep learning: YOLO object detection.** A YOLO-based model detects regions
containing individual fiber rings and outputs a bounding box around each ring of
interest. This isolates individual fiber segments from the larger microscopy image and
handles scene-level noise that would confuse a purely geometric approach.

**Stage 2, classical CV: OpenCV geometric analysis.** Each detected region of interest
is processed through an OpenCV pipeline that extracts precise geometric measurements.
Classical algorithms are deterministic, need no training data and produce reproducible
results, which makes them the right choice where measurement accuracy matters most.

## System architecture

1. **Microscope image.** The raw, unprocessed cross-section capture is the input.
2. **YOLO object detection (stage 1).** The model detects fiber ring regions and outputs a bounding box per region of interest (YOLO, ONNX Runtime).
3. **Region cropping.** Individual ring regions are isolated from the detected bounding boxes.
4. **OpenCV processing pipeline (stage 2).** Each region goes through HSV segmentation, noise filtering, contour detection and ellipse fitting (OpenCV, NumPy).
5. **Geometric measurements.** The pipeline outputs ring radius, core-to-cladding ratio, layer thickness and other structural metrics.

<div class="callout" markdown="1">
**Why this hybrid architecture works**

YOLO handles detection robustly despite imaging noise; its learned representations
generalise better than hand-crafted rules when lighting and positioning vary. Classical
CV handles measurement precisely without labelled training data. Neither approach alone
would be sufficient, but together they cover the full pipeline.
</div>

**Measurements extracted**

- Ring radius per detected layer.
- Layer thickness (Δ between rings).
- Core-to-cladding ratios.
- Ellipse semi-axes (*a*, *b*) and orientation.
- Structural coverage metrics.

## OpenCV processing pipeline (stage 2 detail)

1. **Colour-space conversion.** Cropped regions are converted from RGB to HSV to separate brightness from colour. This makes downstream segmentation far less sensitive to illumination differences between images (OpenCV, HSV).
2. **Colour-based segmentation.** HSV threshold masks isolate the distinct fiber layers (core, intermediate structure and outer cladding) by their colour in the cross-section image (thresholding, masking).
3. **Noise reduction and morphological filtering.** Before contour extraction, erosion, dilation, opening and closing reduce microscope reflections, fill gaps in ring boundaries and remove small noise artefacts.
4. **Contour detection.** Contours extracted from the filtered binary mask identify potential ring boundaries. Candidates are then filtered by area, hierarchy and shape checks to eliminate false detections and keep only genuine rings.
5. **Ellipse fitting.** An ellipse is fitted to each detected contour to model rings that are not perfectly circular, capturing geometric variation caused by fiber deformation or imaging angle. This step outputs the semi-axes, centre coordinates and orientation of each ring (least squares).
6. **Geometric validation and measurement.** Rings are checked for correct concentric nesting and layer order. Final measurements are then extracted, including ring radius, layer thickness, core-to-cladding ratios and structural coverage metrics.

<div class="callout" markdown="1">
**Why ellipse fitting rather than circle detection**

Standard Hough circle detection assumes perfectly circular rings. Fiber deformation and
the microscope's viewing angle produce elliptical distortions that break this assumption,
causing missed detections and incorrect radius values. Least-squares ellipse fitting finds
the best-fit ellipse for any contour shape, capturing the true ring geometry however far
it deviates from a circle.
</div>

## Visual results

<div class="gallery">
  <figure>
    <img src="/assets/projects/FRD/raw_image.png" alt="Raw microscope cross-section image with uneven illumination and reflections">
    <figcaption>Original raw microscope image: unprocessed input with uneven illumination, microscope reflections and distorted rings.</figcaption>
  </figure>
  <figure>
    <img src="/assets/projects/FRD/processed_image_1.0.png" alt="Detected rings overlaid on the microscope image">
    <figcaption>Annotated detected rings: extracted rings overlaid on the input.</figcaption>
  </figure>
</div>

<div class="lightbox" id="gallery-lightbox" aria-hidden="true">
  <button class="lightbox-close" aria-label="Close image">&times;</button>
  <img class="lightbox-image" src="" alt="">
  <p class="lightbox-caption"></p>
</div>

| Ring ID | Blue radius (mm) | White radius (mm) | Radius ratio | Coverage ratio | Confidence |
|---:|---:|---:|---:|---:|---:|
| 1 | 22.36 | 11.70 | 0.52 | 0.27 | 0.89 |
| 2 | 22.88 | 9.36 | 0.41 | 0.17 | 0.87 |
| 3 | 20.54 | 12.48 | 0.61 | 0.37 | 0.87 |
| 4 | 25.48 | 10.66 | 0.42 | 0.18 | 0.80 |
| 5 | 20.80 | 0.00 | — | — | 0.76 |
| 6 | 23.14 | 9.36 | 0.40 | 0.16 | 0.72 |
| 7 | 22.10 | 7.28 | 0.33 | 0.11 | 0.46 |

## Technology stack

| Area | Tools |
|---|---|
| Language | Python |
| Deep learning | YOLO, ONNX Runtime |
| Libraries | OpenCV, NumPy |
| Techniques | Object detection, image segmentation, morphological filtering, contour detection, ellipse fitting, geometric feature extraction |

## Challenges and solutions

### Extremely limited and unlabelled data

**Challenge.** Only 4–8 images were available, with no labels, annotations or ground
truth. This made supervised deep-learning segmentation infeasible from the start.

**Solution.** YOLO handles robust region detection and classical CV handles precise
measurement. Separating the two tasks meant neither required a large labelled
segmentation dataset.

### Lighting variation and reflections

**Challenge.** Microscope lighting produced bright specular reflections and inconsistent
brightness gradients across images, corrupting edge detection and direct segmentation.

**Solution.** Converting to HSV separated brightness from colour information, and
morphological filtering then suppressed reflection artefacts before ring-boundary
detection.

### Distorted ring geometry

**Challenge.** Rings appeared elliptical rather than circular because of fiber
deformation and the microscope's viewing angle. This broke the assumptions of Hough circle
detection and produced inaccurate radius estimates.

**Solution.** Least-squares ellipse fitting on the detected contours captured
non-circular ring geometry and reliably estimated the semi-axes and orientation, even with
distortion present.

## Outcome

The system automated the analysis of fiber cross-section images and produced consistent,
reproducible structural measurements across all available samples. It needed no training
labels, no per-image manual tuning and no intervention once the pipeline was configured.

Key outcomes included automated YOLO-based detection of fiber ring regions, precise
geometric measurement of distorted rings through ellipse fitting, and a significant
reduction in manual inspection effort, from hours to minutes per batch. The hybrid
architecture shows how combining deep-learning robustness with classical-CV precision
can solve real problems that neither approach could solve alone, particularly under
severe data constraints.
