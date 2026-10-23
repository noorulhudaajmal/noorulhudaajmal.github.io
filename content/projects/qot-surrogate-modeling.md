---
title: Efficient QoT Surrogate Modelling for Elastic Optical Networks
summary: >-
  Can a lightweight ML model stand in for physical-layer QoT estimation inside network
  resource management? A study on 1.35M lightpaths covering feature sufficiency,
  distribution shift, calibration and downstream modulation decisions (~98% violation
  recall and precision).
category: research
order: 1
featured: true
thumbnail: /assets/icons/qot-surrogate.svg
facts:
  Dataset: QoT Dataset 04 · Fraunhofer HHI / PLATON
  Topology: CORONET CONUS · 75 nodes · 99 bidirectional links
  Research task: QoT classification · OSNR/BER regression · resource decisions
  Surrogate: Gradient-boosted model · topology + transceiver + network state
  Validation: Route holdout · congestion shift · calibration · decision analysis
tags: [Python, XGBoost / GBM, scikit-learn, SHAP, QoT estimation, Optical networks, Resource management, Distribution shift, Calibration]
links:
  code: ""
  report: ""
demo:
  # Add a hosted demo (e.g. Hugging Face Space or Streamlit app).
  url: ""
  embed: false
  note: ""
---

> Can an efficient data-driven model approximate physical-layer QoT well enough to serve
> as a low-cost QoT oracle for network resource-management decisions?

## Overview

Elastic Optical Networks (EONs) need accurate Quality of Transmission (QoT) estimates
when provisioning lightpaths, but repeatedly evaluating analytical physical-layer models
inside resource-management procedures is costly. Fraunhofer HHI's PLATON simulator
provides such estimates through its analytical channel model.

This study asks whether a lightweight ML model can learn the relationship between
topology, transceiver configuration and network state well enough to act as a
**computational surrogate** for that model. Using 1.35M lightpath samples from QoT
Dataset 04, the work proceeds in four phases:

1. **What determines QoT?** Dataset characterisation and feature ablation.
2. **Can ML serve as an efficient QoT surrogate?** Model comparison on the violation class.
3. **Does the surrogate generalise and remain trustworthy?** Route holdout, congestion shift and calibration.
4. **Can QoT predictions improve provisioning decisions?** Modulation and route-selection experiments.

The resulting gradient-boosted model reaches approximately 98% violation recall and
precision on the full feature set. Used as a feasibility oracle, it identifies a median
+1 modulation-tier improvement over PLATON's reach-table provisioning in the evaluated
scenarios.

## Dataset and methodology

<div class="stats">
  <div><b>1.35M</b><span>raw lightpath samples</span></div>
  <div><b>852K</b><span>after deduplication</span></div>
  <div><b>35</b><span>features per sample</span></div>
  <div><b>5,550</b><span>unique route pairs</span></div>
</div>

QoT Dataset 04 (Fraunhofer HHI / PLATON) contains lightpath samples generated from eight
PLATON simulations of the CORONET CONUS topology: 75 nodes, 99 bidirectional links,
37.5 GHz channel spacing, 96 channels per link and an HD-FEC BER threshold of
3.8×10⁻³. I use the lightpath representation (35 features, 4 targets), which provides
aggregated network-state information per lightpath, rather than the 1.4 TB per-link
network-status tensor.

**Data validation.** 496,028 exact duplicate rows were removed, leaving 852,265 unique
observations with the original class balance preserved. No identical feature vector was
associated with conflicting targets. Because the released data contains no simulation
identifier, true leave-one-simulation-out validation was not possible; route-pair holdout
and congestion-shift experiments are used as complementary generalisation tests.

<div class="callout" markdown="1">
**Evaluating an imbalanced problem**

With a 93.7% / 6.3% class split, aggregate F1 is misleading: an early topology-only model
reached aggregate F1 ≈ 0.97 while missing 83.5% of actual violations. All results are
therefore reported on the violation class (recall, precision, F1).
</div>

Features were organised into nested groups for ablation:

| Group | Features | Description |
|---|---:|---|
| A | 8 | Topology only: path length, link statistics, span count, node degree |
| B | 11 | + Transceiver: frequency, modulation order, line rate |
| C | 31 | + Network state: occupancy, interfering BER, neighbour-slot features |
| D | 32 | + connection line rate (redundant, dropped after this stage) |

SNR was excluded because it is a fixed log-linear transform of OSNR (r = 1.0); connection
and node identifiers were excluded as identifiers.

## Building the surrogate

Feature ablation revealed a clear information hierarchy. Topology alone is insufficient;
adding transceiver configuration produces the largest gain, and explicit network-state
features add a smaller but measurable improvement.

| Feature set | Best model | Viol. recall | Viol. precision | Viol. F1 |
|---|---|---:|---:|---:|
| A: Topology only | Random forest | 0.587 | 0.153 | 0.242 |
| B: + Transceiver | GBM | 0.974 | 0.978 | 0.976 |
| **C: + Network state** | **GBM (selected)** | **0.980** | **0.982** | **0.981** |
| D: All features | GBM | 0.980 | 0.983 | 0.982 |

For OSNR regression, the GBM reaches R² = 0.9989 with feature set B and 0.9995 with set
C. Logistic regression offers a distinct operating point, reaching 0.998 violation recall
at lower precision (~0.75).

<div class="callout" markdown="1">
**Low-latency inference**

The selected GBM needs approximately 0.002–0.003 ms per sample at under 1 MB model size,
which makes it suitable as a QoT component inside repeated decision procedures. A direct
implementation-level benchmark against GN-model evaluation remains future work.
</div>

## Generalisation and calibration

Two group-aware split strategies were used: **route holdout** (unseen source–destination
pairs) and **congestion leave-one-out** (quartile bins of average link occupancy). They
were complemented by a conservative random split grouped by connection ID to prevent
leakage between load-balanced lightpaths of the same connection.

| Split strategy | GBM recall | GBM precision |
|---|---:|---:|
| Random, full data (grouped by connection) | 0.9804 | 0.9791 |
| Route holdout: unseen (src, dst) pairs | 0.981 | — |
| Congestion LOO: average over 4 bins | 0.975 | — |
| Congestion LOO: high-congestion bin only | 0.953 | — |

Held-out routes showed no measurable degradation, so the surrogate is not simply
memorising routes seen during training. Distribution shift is the real failure mode:
when high-congestion examples were withheld during training, violation recall dropped to
0.953, which is the regime where a missed violation costs the most. PR-AUC stayed at
≥ 0.9999, so the risk *ranking* remained strong while the default decision threshold
became misaligned.

| Strategy (high-congestion regime) | GBM recall | Brier score |
|---|---:|---:|
| Baseline (0.5 threshold) | 0.952 | 0.0028 |
| Isotonic calibration | 0.975 | 0.0024 |
| Threshold-tuned for recall | 0.977 | 0.0028 |
| **Isotonic + threshold-tuned** | **0.975** | **0.0024** |

GBM and logistic regression were miscalibrated in opposite directions. GBM was
overconfident, which explains its recall drop under shift, while logistic regression was
underconfident, which explains its high but precision-costly recall. Combining isotonic
calibration with threshold tuning gives well-calibrated probabilities that can be used as
risk scores, together with a targeted recall floor.

<div class="callout" markdown="1">
**Recommended production configuration**

GBM on feature set C, isotonic-calibrated, with the decision threshold tuned to the
deployment's required recall floor.
</div>

## Decision experiments

### Experiment 1: QoT-aware modulation selection

The calibrated surrogate is used as a feasibility oracle over candidate modulation
formats. For each observed lightpath state, it selects the highest-order format that
satisfies the QoT criterion. This turns the prediction problem into a resource-management
decision.

The surrogate recommends a more efficient modulation than PLATON in 68.8% of evaluated
scenarios. Across all scenarios, the median improvement is +1 modulation tier; among
scenarios with identified upside, it is +2 tiers (100% line-rate uplift). The
recommendations passed three checks:

- **Monotonicity.** In 100% of 20,000 scenarios, violation probability did not decrease as modulation order increased, so the surrogate learned the correct qualitative physics.
- **Ground-truth agreement.** 97.7% of real violations were flagged at PLATON's actual choice, and 99.88% of feasible cases were approved.
- **Extrapolation safety.** 99.9% of the largest upgrade recommendations (3+ tiers) fall on short and medium routes with dense training support.

### Experiment 2: Route and modulation selection

A restricted surrogate using only topology and modulation features (no network state)
gives independent evidence of the same effect.

| Metric | Value |
|---|---:|
| Restricted surrogate: violation recall | 0.983 |
| Restricted surrogate: violation precision | 0.957 |
| Route match with PLATON's choice | 79.2% |
| Modulation match (given the same route) | 30.2% |

Only 30.2% of modulation decisions agree with PLATON when the selected route is the
same. This independently supports the finding of Experiment 1, using a different design
and feature set, that instance-specific QoT information can identify opportunities missed
by static reach-table provisioning.

## Feature importance

Permutation importance (scored on violation-class average precision) and SHAP
(TreeExplainer) were computed independently and agree on the top five features.

- **Dominant: `mod_order`.** This is the direct physical driver, through BER's dependence on modulation cardinality. Multivariate importance ranked it as the operative feature over the collinear `lp_linerate`; once `mod_order` is included, `lp_linerate` has no remaining importance.
- **Dominant: `num_spans`.** Per-span ASE noise accumulates, so longer, noisier paths directly degrade QoT. This is consistent with the structure of the analytical channel model.
- **Secondary:** `freq`, `path_len` and `avg_link_occ`. `freq` outranks explicit occupancy aggregates in both rankings. This supports its role as a compressed congestion proxy, since First-Fit spectrum allocation encodes congestion at assignment time.
- **Modifiers:** neighbour BER and occupancy features give real but secondary gains.

Agreement between the two importance methods, the observed congestion trends and the
modulation monotonicity together suggest that the surrogate learns physically meaningful
relationships rather than dataset-specific correlations.

## Key findings

1. **QoT information is hierarchical.** Topology alone is insufficient. Transceiver configuration provides the largest gain, and network state adds a smaller improvement. Under PLATON's First-Fit allocation policy, `freq` emerges as an important indirect congestion signal.
2. **Evaluation must match the operational risk.** With a 93.7% / 6.3% imbalance, aggregate metrics hide catastrophic violation misses.
3. **The surrogate generalises, but distribution shift matters.** It is stable on unseen routes, while unseen high congestion degrades recall. Calibration and threshold tuning recover most of the loss without retraining.
4. **Instance-specific QoT estimation can improve provisioning.** Modulation selection with the surrogate finds a median +1 tier improvement over reach-table decisions.
5. **This points toward ML-assisted resource optimisation.** Richer per-link state would enable joint routing, modulation and spectrum optimisation.

## Limitations and future work

**Limitations**

- *Lightpath-level scope.* Aggregated network-state descriptors are used; the per-link network-status tensor was out of scope, so the decision experiments are not network-wide joint optimisation.
- *Simulation identity.* The released data has no simulation identifier, which prevents true leave-one-simulation-out validation.
- *Fixed scenario.* The data covers a single topology, with a fixed 28 GBd symbol rate and −3 dBm launch power across all modulation formats.
- *Route-selection confound.* Divergence from PLATON's route choices cannot be cleanly attributed to QoT versus spectrum availability.

**Future directions**

- Use calibrated violation probabilities as constraints in a formal route, modulation and spectrum optimisation problem.
- Model per-link and per-channel network state with graph- or attention-based architectures.
- Benchmark end-to-end computational cost against direct GN-model evaluation in the same simulation environment.

## Outcome

This study demonstrates that a lightweight gradient-boosted model can serve as a
high-performing QoT surrogate for lightpath-level decision support in optical networks.
On QoT Dataset 04, the model achieves approximately 98% violation recall and precision and
remains robust on held-out routes. It also exposes a measurable failure mode under unseen
high-congestion conditions, which calibration and threshold selection can mitigate.

More importantly, the surrogate is not treated only as a predictor; it is used as a QoT
feasibility oracle for resource decisions. The modulation-selection experiment identifies
a median +1 modulation-tier improvement over PLATON's reach-table provisioning, and an
independent route-and-modulation experiment supports the same underlying observation. The
resulting research direction is ML-assisted, QoT-constrained routing, modulation and
spectrum optimisation using richer network-state representations.
