---
title: Chest CT Cancer Classification with MLflow and CI/CD
summary: >-
  Transfer learning (VGG16, MobileNet, ResNet50) for chest CT classification, built as an
  end-to-end MLOps exercise: configurable data ingestion, MLflow experiment tracking and a
  GitHub Actions → Docker → AWS deployment pipeline.
category: systems
order: 8
thumbnail: /assets/icons/CCC-main.png
context: MLOps learning project
facts:
  Domain: Medical imaging · MLOps
  Tracking: MLflow experiment logging
  Deployment: Docker · AWS EC2 · GitHub Actions
tags: [Python, Keras, VGG16, MobileNet, ResNet50, MLflow, Docker, GitHub Actions, AWS EC2, Streamlit]
links:
  code: https://github.com/noorulhudaajmal/chest-cancer-classification-using-MLfLow
  dataset: https://www.kaggle.com/datasets/mohamedhanyyy/chest-ctscan-images/data
demo:
  # The project ships a Streamlit app; link or embed a hosted copy here.
  url: ""
  embed: false
---

## Overview

This deep learning project classifies chest cancer from CT scan images. It was built as
an end-to-end MLOps learning exercise covering transfer learning with pre-trained CNNs,
MLflow experiment tracking and a full CI/CD deployment pipeline using GitHub Actions,
Docker and AWS EC2.

<div class="callout" markdown="1">
**MLOps learning project**

I built this project while learning MLOps practices, specifically to get hands-on
experience with experiment tracking, model versioning, containerisation and CI/CD
deployment pipelines in a real deep learning context.
</div>

The project combines deep learning for medical image classification with a full MLOps
pipeline. The goal was not only a working classifier but practice with the infrastructure
and workflows that make ML models reproducible, trackable and deployable in production.

Chest cancer is detected from CT scan images using transfer learning with pre-trained
convolutional neural networks (VGG16, MobileNet and ResNet50) in Keras. MLflow is used
throughout training to log hyperparameters, track metrics across experiments, store model
artefacts and compare runs. The deployment pipeline uses GitHub Actions to build a Docker
image on each commit, push it to AWS ECR and deploy the updated application to an EC2
instance, where a Streamlit app serves real-time predictions. Data ingestion uses the
Strategy pattern with YAML configuration, so local, Kaggle and Google Drive sources are
interchangeable.

**Data source.** The
[Kaggle chest CT scan dataset](https://www.kaggle.com/datasets/mohamedhanyyy/chest-ctscan-images/data)
for binary cancer classification. The ingestion method is configured in YAML and supports
the Kaggle API, Google Drive or local file paths without code changes.

## Pre-trained models

Three pre-trained Keras CNN architectures were used and compared, each fine-tuned on the
chest CT scan dataset. MLflow tracked each model's training run separately, so metrics
can be compared directly across architectures.

| Model | Family | Description |
|---|---|---|
| **VGG16** | Deep CNN · Oxford VGG Group | A 16-layer convolutional network with a uniform 3×3 filter architecture. A strong image-classification baseline with well-understood feature representations from ImageNet pre-training. |
| **MobileNet** | Lightweight CNN · Google | Depthwise-separable convolutions give efficient inference with far fewer parameters. Suited to resource-constrained deployment while keeping accuracy competitive. |
| **ResNet50** | Residual network · Microsoft | A 50-layer residual network whose skip connections solve the vanishing-gradient problem. It allows deeper feature extraction without degradation and performs strongly on medical imaging tasks. |

## Experiment tracking with MLflow

1. **Data ingestion.** The dataset source is set in a YAML file, and the Strategy pattern switches between the Kaggle API, Google Drive and local paths without code changes. Raw CT scan images are fetched and staged for preprocessing.
2. **Preprocessing and augmentation.** CT images are resized to each model's input size, normalised and augmented with flips, rotations and zoom to improve generalisation on the limited medical dataset (Keras ImageDataGenerator).
3. **Transfer-learning fine-tuning.** ImageNet weights are loaded for each model. The classification head is replaced with task-specific dense layers, and the upper layers are fine-tuned on the CT dataset with configurable training parameters.
4. **MLflow experiment logging.** Each training run is logged to MLflow with its hyperparameters, epoch-level metrics and trained model artefact, for versioning and comparison.
5. **Model comparison and selection.** The MLflow UI compares all tracked runs side by side, and the best-performing model is registered in the MLflow Model Registry for deployment.

**What MLflow tracks per run:** model architecture, learning rate, batch size, number of
epochs, dropout rate, training loss, validation loss, training accuracy, validation
accuracy and the serialised model artefact. Together these allow full reproducibility and
comparison across runs.

**What the YAML config controls**

- Data source type (Kaggle / Drive / local).
- Model architecture selection.
- Training hyperparameters.
- Augmentation settings.

## CI/CD and deployment pipeline

GitHub Actions automates the build, containerisation and deployment of the application on
every code push. The project practises the kind of automated deployment workflow used in
production ML systems.

**Git push → GitHub Actions → Docker build → push to ECR → deploy to EC2 → Streamlit app**

1. A code push triggers the GitHub Actions workflow automatically.
2. A Docker image is built with all dependencies and model artefacts.
3. The image is pushed to AWS Elastic Container Registry (ECR).
4. The EC2 instance pulls the latest image and restarts the container.
5. The Streamlit app serves real-time predictions from the deployed model.

| Infrastructure component | Role |
|---|---|
| GitHub Actions | CI/CD automation runner |
| Docker | Reproducible container packaging |
| AWS ECR | Private Docker image registry |
| AWS EC2 | Cloud compute for model serving |

<div class="callout" markdown="1">
**Why this pipeline matters**

Every push builds and deploys automatically. This removes manual deployment steps and
keeps the production model in line with the latest committed code. Containerisation
ensures the app runs identically in development and production.
</div>

## Technology stack

| Area | Tools |
|---|---|
| Language | Python |
| Deep learning | Keras, VGG16, MobileNet, ResNet50 |
| MLOps | MLflow |
| CI/CD and cloud | GitHub Actions, Docker, AWS EC2, AWS ECR |

## Key learnings

### MLflow experiment tracking

**What I learned.** Managing and comparing many training runs across model architectures
and hyperparameter sets quickly becomes unmanageable without structured tracking.

**Takeaway.** MLflow's experiment logging, metric-comparison UI and model registry give a
structured workflow for reproducible ML experimentation that scales across team members
and projects.

### Containerised ML deployment

**What I learned.** Deploying ML applications to cloud infrastructure introduces
dependency-management and environment-consistency problems that don't arise in local
development.

**Takeaway.** Docker containers encapsulate the whole application environment, which
makes deployments fully reproducible and eliminates environment-specific failures between
development and production.

### CI/CD for ML pipelines

**What I learned.** Building and deploying ML applications by hand after every change is
slow and error-prone, and it doesn't scale to team-based or frequent-iteration workflows.

**Takeaway.** GitHub Actions automates the full build–push–deploy pipeline on every
commit, which enforces consistent deployment practice and makes releases immediate and
reliable.

### Configurable data ingestion

**What I learned.** Hard-coding data sources into training pipelines creates brittle code
that breaks when datasets move, when team members have different access, or when the
ingestion method has to change.

**Takeaway.** The Strategy pattern with YAML configuration separates ingestion logic from
the pipeline. Switching between Kaggle, Google Drive and local data becomes trivial and
needs no changes to the training code.

## Outcome

The project delivered a working chest cancer classification system and built practical
experience across the full MLOps stack: experiment tracking with MLflow, containerised
deployment with Docker, and cloud serving on AWS EC2 through an automated GitHub Actions
pipeline.

Beyond the classification task, the project shows that the infrastructure around ML
models matters as much as model accuracy. Experiment logging, reproducible packaging,
automated deployment and configurable pipelines are what make a system maintainable,
improvable and operable in production.
