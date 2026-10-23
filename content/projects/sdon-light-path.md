---
title: Machine Learning for Lightpath Control in Software-Defined Optical Networks
summary: >-
  Learning an inverse controller for photonic switching: a multi-label classifier-chain
  model that predicts 20 interdependent switch states from optical signal wavelengths,
  reaching 95% precision and 96% recall. Contributed to an IEEE ACP 2022 paper.
category: research
order: 2
featured: true
thumbnail: /assets/icons/ONT_main.png
context: Research internship, Optical Networking Technologies Lab, NUST
period: Jun – Oct 2022
publication: khan2022acp
facts:
  Domain: Optical networks · ML-based control
  Task type: Multi-label classification (8 inputs → 20 binary outputs)
  Model: XGBoost + classifier chains
tags: [Python, XGBoost, Scikit-learn, Classifier chains, Pandas, NumPy, GridSearchCV]
links:
  paper: https://ieeexplore.ieee.org/abstract/document/10089124
demo:
  url: ""
  embed: false
---

## Overview

This project was completed during a research internship at the Optical Networking
Technologies Lab, NUST, focusing on **Software-Defined Optical Networks (SDON)**. SDON is
an emerging paradigm that combines optical fibre communication infrastructure with
programmable network control planes. The goal was a machine learning model that predicts
the control states of a photonic switching system from the wavelengths of the incoming
optical signals.

Photonic switches dynamically route light signals through fibre-optic networks.
Determining the correct control configuration for these switches is complex. The number
of possible wavelength combinations and corresponding switch states grows rapidly with
network scale, which makes real-time rule-based control difficult to maintain.

I developed a multi-label classification model, using XGBoost and classifier chains,
that acts as an **inverse controller**. It learns the mapping from optical signal
wavelengths to the required switch states from system data, rather than computing it
analytically. This simplifies the control problem considerably and shows how ML can
replace complex optimisation algorithms in optical network management.

### How SDON works

- Light signals carry data through fibre-optic cables.
- Photonic switches route signals to the correct destinations.
- Control systems configure switch states dynamically.
- Correct routing is essential for low-latency, high-bandwidth communication.

<div class="callout" markdown="1">
**The inverse control framing**

Traditional controllers compute switch states from system rules. This model inverts that:
given the wavelengths of the incoming signals, it directly predicts which switch states
are required, which removes the need for explicit rule engineering.
</div>

## Problem statement

Photonic switching systems require precise, simultaneous control of multiple switch
parameters to route light signals correctly through an optical network. Traditional
approaches rely on rule-based configurations, manual parameter tuning or complex
optimisation algorithms. All of these become harder to manage as the number of
wavelengths and switch states grows.

Formally, the task is **multi-label classification**. Given 8 input features
representing the incoming wavelength combination, predict the binary state of 20 control
switches simultaneously, where the switch states are not independent of one another.

- The number of wavelength and switch-state combinations is large.
- Rule-based control fails to scale with network complexity.
- 20 binary outputs must be predicted simultaneously.
- Switch states are interdependent, not independent labels.
- Data from both simulations and real systems introduces noise.

## System architecture

1. **Source.** Optical network simulations and system logs provide wavelength measurements and recorded switch states.
2. **Data collection.** Wavelength-combination features and control-switch state labels are collected.
3. **Data preprocessing.** Inputs are normalised and denoised, then split 80/20 into train and test sets (Pandas, NumPy).
4. **Machine learning model.** Classifier chains with XGBoost are tuned through GridSearchCV (XGBoost, Scikit-learn).
5. **Switch-state prediction.** The model outputs 20 binary control states, one per photonic switch.
6. **Predicted control configuration.** The output is a complete switch configuration for the photonic routing system.

| | Size | Description |
|---|---:|---|
| **Input** | 8 | Wavelength-combination features representing optical signal properties |
| **Output** | 20 | Binary control variables, one per photonic switch state (0 or 1) |

## Model design: classifier chains

The core modelling challenge is that the 20 binary switch states are not independent.
One switch's state may constrain or influence the state of others. Standard binary
relevance, which trains one classifier per label independently, ignores these
dependencies and underperforms on correlated outputs.

A **classifier chain** addresses this directly by arranging 20 binary classifiers in
sequence. Each classifier predicts one switch state using the predictions of all previous
classifiers as additional input features. This lets the model build up dependency
information progressively across the output space.

Each classifier in the chain uses **XGBoost** as the base estimator. Gradient boosting
gives high accuracy, efficient training and built-in regularisation, which provides
robustness against noisy data from mixed simulation and real-system sources.

<figure>
  <img src="/assets/projects/ONT/classifier-chain-diagram.png" alt="Classifier chain architecture diagram">
  <figcaption>Figure 1. Classifier chain showing sequential dependency propagation across the 20 binary switch outputs.</figcaption>
</figure>

**How classifier chains work**

1. Classifier 1 predicts switch state 1 from the wavelength features.
2. Classifier 2 predicts switch state 2 using the wavelength features and the prediction from classifier 1.
3. Every subsequent classifier sees all prior predictions as additional features.
4. Classifier 20 has the richest context: all 19 prior predictions.

**Why XGBoost as the base estimator**

- High accuracy on structured tabular data.
- Efficient training with gradient boosting.
- Built-in L2 regularisation.
- Robust to noise from mixed data sources.

## Model performance

<div class="stats">
  <div><b>0.040</b><span>Hamming loss</span></div>
  <div><b>95%</b><span>Precision</span></div>
  <div><b>96%</b><span>Recall</span></div>
  <div><b>95.6%</b><span>Macro F1</span></div>
</div>

### Tuned hyperparameters

| Parameter | Description | Value |
|---|---|---:|
| `n_estimators` | Number of boosting trees | 140 |
| `max_depth` | Maximum tree depth | 5 |
| `reg_lambda` | L2 regularisation term | 1 |

### Full evaluation metrics

| Metric | Description | Score |
|---|---|---:|
| Hamming loss | Fraction of incorrectly predicted labels | 0.040 |
| Precision | Correct predictions among all predicted positives | 95% |
| Recall | Correct predictions among all actual positives | 96% |
| Macro F1 | Balanced harmonic mean of precision and recall | 95.6% |

## Technology stack

| Area | Tools |
|---|---|
| Language | Python |
| Machine learning | XGBoost, Scikit-learn, GridSearchCV |
| Data processing | Pandas, NumPy |

## Challenges and solutions

### Multi-label prediction at scale

**Challenge.** The system had to predict 20 binary control states simultaneously, a
multi-output problem that a single standard classifier cannot solve without structural
changes.

**Solution.** I used Scikit-learn's classifier chain method to decompose the problem into
20 sequential binary classifiers, each building on the outputs of its predecessors.

### Complex switch interdependencies

**Challenge.** Photonic switch states are not independent. The state of one control
parameter directly affects which states are valid or required for others in the network
configuration.

**Solution.** Sequential prediction through the chain lets each model use prior
predictions as features. This captures inter-label dependencies that independent
classifiers would miss entirely.

### Data noise and variability

**Challenge.** Training data came from both optical network simulations and real photonic
systems. This introduced distribution differences, measurement noise and variability
between sources.

**Solution.** Feature normalisation and preprocessing pipelines harmonised the inputs, and
XGBoost's built-in L2 regularisation improved robustness against noisy labels.

## Outcome

The system learned the relationship between optical signal wavelengths and photonic
switch control states, achieving over 95% precision and recall across 20 simultaneous
binary outputs. The classifier-chain architecture captured inter-switch dependencies that
standard independent multi-label methods fail to model.

Beyond the predictive accuracy, the project demonstrates a broader principle. ML-based
inverse models can replace complex, hand-engineered control algorithms in high-speed
communication infrastructure, making network control more scalable, adaptive and
maintainable as optical topologies grow. The work contributed to a peer-reviewed paper
at the IEEE Asia Communications and Photonics Conference (ACP) 2022.
