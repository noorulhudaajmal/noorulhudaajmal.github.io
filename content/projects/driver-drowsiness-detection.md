---
title: Real-Time Driver Drowsiness Detection on Embedded Hardware
summary: >-
  Bachelor's capstone. Two CNNs (eye state, yawning) combined through a modified PERCLOS
  score, running fully on-device on a Raspberry Pi 4 with an infrared camera, plus
  accelerometer-based accident detection. 88% detection accuracy.
category: vision
order: 5
thumbnail: /assets/icons/DDD_main.jpeg
context: Bachelor's capstone project (final-year project), Software Engineering, NUST
facts:
  Domain: Edge AI · road safety · embedded computer vision
  Hardware: Raspberry Pi 4 · IR camera · MPU6050 accelerometer
  Models: 2× CNN (eye state + yawning)
  Algorithm: Modified PERCLOS
tags: [Python, TensorFlow Lite, OpenCV, Dlib, Raspberry Pi 4, Django, React, PERCLOS]
links:
  code: https://github.com/noorulhudaajmal/driver-drowsiness-detection-using-onboard-camera
  report: /assets/projects/DDD/Driver Drowsiness Detection Using Onboard Camera.pdf
  design: /assets/projects/DDD/Software Design Specifications.docx.pdf
demo:
  url: /assets/projects/DDD/demo.html
  video: ""
  type: web
  embed: true
---

## Overview

This real-time embedded AI system monitors a driver's facial behaviour with an infrared
camera to detect drowsiness. It combines CNN-based eye-state and yawning detection with a
modified PERCLOS algorithm on a Raspberry Pi, and triggers a buzzer alert before fatigue
leads to an accident. It was developed as the capstone project of my bachelor's degree,
combining embedded systems, computer vision and machine learning on a real-world
road-safety problem.

Driver fatigue is a leading cause of road accidents worldwide. Long-distance driving,
night shifts and irregular sleep progressively impair a driver's alertness, often without
them realising it until it is too late. Some modern vehicles include driver monitoring
systems, but these are typically proprietary solutions found only in high-end vehicles
and are not available as affordable aftermarket options.

This project addresses that gap with a low-cost, edge-based driver monitoring system that
can be installed in any vehicle. An infrared camera continuously captures the driver's
face, and the eye and mouth regions are extracted. Two convolutional neural networks
predict eye closure and yawning in real time, and a modified PERCLOS algorithm combines
both signals into a drowsiness score. If the score exceeds a threshold, a buzzer alerts
the driver immediately.

The system also includes an accelerometer-based accident detection module that saves
recent footage automatically when a collision is detected. A companion web portal
(Django + React) distributes model updates and collects real-world feedback for
continuous improvement.

<div class="callout" markdown="1">
**Design constraint**

All inference runs on-device and needs no internet connection. The TensorFlow Lite models
are optimised for the Raspberry Pi 4's constrained compute budget.
</div>

## Problem statement

Driver fatigue significantly increases the risk of road accidents. Drowsiness develops
gradually and is hard for drivers to self-monitor; by the time a driver notices the
fatigue, their reaction time and attention are already compromised. Existing driver
monitoring solutions are either built into expensive new vehicles or require proprietary
hardware. No widely accessible, affordable aftermarket system existed that could be
retrofitted to any car for real-time drowsiness detection.

- Fatigue is a leading global cause of road accidents.
- Drivers cannot reliably self-assess drowsiness in real time.
- OEM monitoring systems are available only in premium vehicles.
- No affordable aftermarket solution existed for retrofitting.
- Edge inference is needed, since rural and remote areas lack connectivity.
- Night driving requires an infrared camera for low-light operation.

## System architecture

1. **Infrared camera and MPU6050 accelerometer.** Continuous face capture and 3-axis motion sensing.
2. **Video capture module.** Raspberry Pi camera interface, frame extraction and a circular buffer (OpenCV, Raspberry Pi 4).
3. **Image preprocessing.** Grayscale conversion and 68-point facial landmark detection (Dlib).
4. **Feature extraction.** The left-eye, right-eye and mouth regions are cropped and resized.
5. **Deep-learning inference.** A CNN detects eye state and a second CNN detects yawning (TensorFlow Lite).
6. **Drowsiness estimation.** Modified PERCLOS: a weighted combination of eye-closure and yawning scores.
7. **Driver alert.** A buzzer alarm triggers when the threshold is breached.
8. **Accident detection.** Sudden deceleration above 8 m/s² saves recent footage locally.

| Edge hardware | Role |
|---|---|
| Raspberry Pi 4 | Main compute unit |
| Infrared camera module | Night-vision-capable face capture |
| MPU6050 accelerometer | 3-axis motion sensing |
| Onboard buzzer | Real-time driver alert |

**Companion web portal (Django, React, JavaScript)**

- Download updated ML models to the device.
- Upload accident footage for review.
- Submit feedback and issue reports.

## Drowsiness detection pipeline

The detection pipeline processes each video frame in real time. Dlib's 68-point facial
landmark model locates key facial features, and the left-eye, right-eye and mouth regions
are cropped from them and passed to the CNN models. The PERCLOS scoring algorithm then
combines the two model outputs into a continuous drowsiness estimate.

| Model | Task | Input |
|---|---|---|
| CNN 1: eye-state detection | Binary classifier: are the driver's eyes open or closed? | Cropped eye region |
| CNN 2: yawning detection | Binary classifier detecting yawning across consecutive frames | Cropped mouth region |

### Modified PERCLOS drowsiness score

```
score = 0.75 × eye_closure + 0.25 × yawning
```

PERCLOS (percentage of eye closure) is a validated fatigue metric: the proportion of time
the eyes are at least 80% closed over a rolling window. This implementation extends
standard PERCLOS with a weighted yawning component, which reduces the false positives
that come from relying on eye closure alone. If the computed score exceeds the predefined
threshold, the buzzer alarm triggers immediately.

### Facial landmark extraction

Dlib's 68-point model locates facial features precisely in each frame, so regions are
extracted consistently regardless of head pose or slight movement.

| Region | Landmarks |
|---|---|
| Left eye | 36–41 |
| Right eye | 42–47 |
| Mouth | 48–67 |

### Accident detection trigger

The MPU6050 accelerometer continuously monitors vehicle acceleration. If sudden
deceleration exceeds 8 m/s², the system saves the most recent frames from its circular
buffer to local storage for post-incident review and model improvement.

## Design diagrams

These diagrams document the system design: the high-level architecture, the data flow
between components and the interactions between modules.

<div class="gallery">
  <figure>
    <img src="/assets/projects/DDD/architecture-diagram-1.png"
         alt="System architecture diagram" loading="lazy">
    <figcaption>System Architecture</figcaption>
  </figure>

  <figure>
    <img src="/assets/projects/DDD/dataflow-1.png"
         alt="Data-flow diagram" loading="lazy">
    <figcaption>Data Flow</figcaption>
  </figure>

  <figure>
    <img src="/assets/projects/DDD/activity-diagram-1.png"
         alt="Activity diagram" loading="lazy">
    <figcaption>Activity Diagram</figcaption>
  </figure>
</div>

<div class="lightbox" id="gallery-lightbox" aria-hidden="true">
  <button class="lightbox-close" aria-label="Close image">&times;</button>
  <img class="lightbox-image" src="" alt="">
  <p class="lightbox-caption"></p>
</div>

## Technology stack

| Area | Tools |
|---|---|
| Languages | Python, JavaScript |
| Machine learning | TensorFlow, TensorFlow Lite |
| Computer vision | OpenCV, Dlib |
| Embedded hardware | Raspberry Pi 4, IR camera, MPU6050 |
| Web platform | Django, React |
| Testing | Pytest |

## Challenges and solutions

### Real-time inference on edge hardware

**Challenge.** Running two CNN models plus facial landmark detection in real time on a
Raspberry Pi 4 required significant optimisation. Dropped frames would degrade detection
reliability.

**Solution.** The models were converted to TensorFlow Lite for hardware-optimised
inference, grayscale preprocessing reduced input dimensionality, and efficient OpenCV
pipelines kept per-frame processing overhead to a minimum.

### Robust facial feature detection

**Challenge.** The eye and mouth regions had to be extracted accurately and consistently.
Slight misalignment or missed detections would feed errors directly into the drowsiness
score and generate false alarms.

**Solution.** Dlib's 68-point facial landmark model consistently localised feature regions
with sub-pixel accuracy, despite head-pose variation, illumination changes and minor
movement.

### Reducing false-positive alerts

**Challenge.** Using eye closure alone as a drowsiness signal causes false alarms. Normal
blinking, looking away or brief occlusions can trigger alerts and reduce the driver's
confidence in the system.

**Solution.** A modified PERCLOS metric combines eye-closure frequency (weight 0.75) with
yawning frequency (weight 0.25) over a rolling window. This significantly improved
specificity without hurting sensitivity, and the system reached **88% detection
accuracy**.

## Outcome

The system demonstrated real-time detection of driver fatigue using computer vision and
edge AI inference, running entirely on a low-cost Raspberry Pi 4 with no cloud
dependency. This makes it viable as an affordable aftermarket safety solution for any
vehicle.

Key outcomes included reliable detection of eye closure and yawning, real-time alerts
through the onboard buzzer, automatic recording of accident footage through the
accelerometer module, and a modular architecture that supports ongoing model improvement
through the companion web portal. The project shows how embedded AI can improve road
safety by monitoring driver attentiveness in real time without expensive OEM hardware.
