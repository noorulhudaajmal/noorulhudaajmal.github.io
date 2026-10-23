---
title: AutoVision ModelOps, an Automated Training and Deployment Pipeline for Object Recognition
summary: >-
  The MLOps pipeline behind Living Image's object-recognition platform. It covers data
  ingestion, augmentation, training, containerised deployment, monitoring, and a retraining
  loop that turns new deployment video into training data.
category: systems
order: 6
thumbnail: /assets/icons/autovision.png
context: Built for the Living Image platform
facts:
  Domain: Computer vision · MLOps
  Infrastructure: Microsoft Azure
  Deployment target: Azure Container Instances
  Pipeline automation: GitHub Actions · Azure Functions
tags: [Python, Azure Custom Vision, Docker, GitHub Actions, Azure Container Registry, Azure Container Instances, PostgreSQL, Azure Service Bus]
links:
  website: https://www.livingimage.app/
demo:
  type: youtube
  url: "https://www.youtube.com/watch?v=ENXuyonbwNQ"
  embed: true
  note: "A quick walkthrough of the project."
---

## Overview

AutoVision ModelOps is a production machine-learning pipeline that automates the full
lifecycle of object detection models: from raw labelled data, through training and
containerised packaging, to cloud deployment.

The pipeline was built as part of the ML infrastructure for
[Living Image](https://www.livingimage.app/). The platform connects real-world objects,
such as museum artifacts, retail products and other physical points of interest, to
digital content delivered through a camera interface. When a user points a phone at an
object, the object is recognised and its multimedia content opens. The platform powers
interactive experiences in museums, retail spaces and cultural venues, so the accuracy
of the underlying detection models is essential.

To support this at scale, the pipeline had to be a unified, automated system running on
Azure. It streamlines retraining and deploying detection models across different
locations and object collections, while keeping monitoring, logging and release
management consistent. It also provides an iterative fine-tuning loop: new video
collected from deployments is processed automatically into additional training samples,
so the models keep improving with minimal manual intervention.

## Problem statement

Computer vision models that recognise real-world objects need frequent updates as
environments change, new objects are added and datasets grow. In a traditional manual
workflow, someone has to collect data, retrain, export artefacts and redeploy services
by hand, and the operational burden compounds at scale.

Without a structured MLOps pipeline, reliable visual recognition becomes expensive to
maintain, slow to iterate on and difficult to scale across multiple client deployments.

## Key features

- End-to-end automated model lifecycle management.
- API-driven dataset ingestion and validation.
- Data augmentation pipeline for better generalisation.
- Automated training orchestration on managed cloud infrastructure.
- Containerised inference packaging and deployment to Azure.
- Iterative fine-tuning loop fed by new video data.
- Automated Slack failure alerts for pipeline monitoring.
- Centralised metadata logging and a model version registry.

## System architecture

The system follows a layered ModelOps architecture. Coordinated components run from the
process trigger and data ingestion at the edge of the pipeline to operational monitoring
in production. Each layer is managed independently but communicates through
well-defined interfaces, so components can be updated or replaced without disrupting the
overall flow.

<div class="gallery" style="display: grid; grid-template-columns: 1fr; width: 100%; max-width: 100%;">
  <figure style="width: 100%; max-width: 100%; margin: 0;">
    <img
      src="/assets/projects/AVMLOps/autovision_system_architecture.jpg"
      alt="AutoVision ModelOps end-to-end architecture"
      loading="lazy"
      style="display: block; width: 100%; height: auto; max-height: none; object-fit: contain; cursor: zoom-in;"
    >
    <figcaption style="text-align: center; margin-top: 12px;">
      Figure 1. AutoVision ModelOps End-to-End System Architecture
    </figcaption>
  </figure>
</div>

<div class="lightbox" id="gallery-lightbox" aria-hidden="true">
  <button class="lightbox-close" aria-label="Close image">&times;</button>
  <img class="lightbox-image" src="" alt="">
  <p class="lightbox-caption"></p>
</div>

1. **Data ingestion layer.** Collects labelled image and video media from external services through internal APIs, validates incoming data and stages it in Azure Blob Storage for downstream processing.
2. **Data processing layer.** Normalises datasets, validates annotations and applies augmentation with OpenCV and NumPy to increase the diversity and robustness of the training data.
3. **Model training layer.** Orchestrates training iterations and experiment monitoring in Azure Custom Vision, and manages the iteration lifecycle, performance evaluation and checkpoint promotion.
4. **Export and packaging layer.** Converts trained models into containerised inference services, builds Docker images and pushes versioned artefacts to Azure Container Registry.
5. **Deployment layer.** Pulls versioned containers from ACR and deploys them to Azure Container Instances as scalable, real-time prediction endpoints for the Living Image platform.
6. **Operations and monitoring layer.** Keeps experiment metadata and model version records in PostgreSQL, routes pipeline events through Azure Service Bus and sends failure alerts to engineers through Slack.

## Technology stack

| Area | Tools |
|---|---|
| Languages | Python, Bash, YAML |
| ML and data | Azure Custom Vision, OpenCV, object detection, YOLO |
| Cloud and infrastructure | Azure Container Registry, Azure Container Instances, Azure Blob Storage, Azure Functions, Azure Service Bus |
| DevOps and automation | Docker, GitHub Actions, CI/CD pipelines |
| Data systems and alerting | PostgreSQL, Slack API |

## Engineering considerations

### Reliable automation

External APIs and cloud services were integrated with retry logic and failure recovery,
so every stage of the pipeline runs stably without supervision.

### Dataset quality management

Preprocessing pipelines enforce annotation validation and augmentation strategies. This
keeps training inputs consistent and high-quality, however the data arrives at ingestion.

### Model lifecycle management

Training iterations, metadata and deployment states are tracked centrally in PostgreSQL.
This supports reproducible releases, version control and rollback across environments.

### Deployment consistency

Containerised inference services give predictable runtime behaviour across all client
deployments and eliminate environment-specific configuration drift at the prediction
layer.

### Operational observability

Automated Slack alerts notify engineers immediately when training or deployment pipelines
fail. Together with centralised metadata logging, this shortened failure detection and
recovery from hours to minutes.

### Continuous improvement loop

The trigger supports both training and retraining. For retraining, new video data is
processed automatically into additional training samples, so models improve
incrementally with minimal manual dataset curation or engineering effort.

## Outcome

AutoVision ModelOps gives Living Image a scalable foundation for automated computer
vision operations. The team can retrain, deploy and monitor object detection models for
any client location or object collection with minimal manual intervention. Compared with
the manual workflow, it reduces retraining and deployment effort by more than 70%
(estimated).

Running the ML lifecycle end to end greatly reduces the overhead of maintaining visual
recognition models, shortens iteration cycles and enforces consistent deployment
practice. This directly supports Living Image in keeping its recognition models accurate
and current as client environments change. The pipeline is the core ML infrastructure
behind Living Image's object recognition system.
