---
title: Temporal Analysis of Circadian Behaviour Data (Pallidus MR1)
summary: >-
  An analysis platform built for the Kravitz Lab (Washington University in St. Louis) that
  turns multi-subject, multi-day activity recordings into circadian segmentations,
  group comparisons and hypothesis tests (t-test, ANOVA) with reproducible reports.
category: data
order: 4
featured: true
thumbnail: /assets/icons/PTA_main.png
context: Built for the Kravitz Lab, Washington University in St. Louis
facts:
  Domain: Neuroscience · behavioural research
  Data source: Pallidus MR1 Activity Monitoring System
  Statistics: t-test · ANOVA · circadian segmentation
tags: [Python, Pandas, NumPy, SciPy, Streamlit, Plotly, XlsxWriter]
links:
  code: https://github.com/noorulhudaajmal/Temporal-Analysis-of-Pallidus-MR1-Dataset
  report: /assets/projects/PTA/Palliuds-MR1-Analysis.pdf
demo:
  type: youtube
  url: "https://www.youtube.com/watch?v=B-VsX_qz_Ks"
  embed: true
  note: "Watch a walkthrough of the platform."
---

## Overview

This interactive research platform supports uploading, exploring and statistically
analysing circadian behavioural activity data collected with the **Pallidus MR1 Activity
Monitoring System**. It enables temporal analysis of subjects' activity patterns and
includes automated report generation to support research documentation and publication
workflows.

The platform was developed for the [Kravitz Lab](https://kravitzlab.com/) at Washington
University in St. Louis, a neuroscience research group studying neural circuit function
and behavioural outcomes. It supports their analysis of Pallidus MR1 data recorded across
multi-subject, multi-day experiments.

The Pallidus MR1 system records timestamped activity for multiple experimental subjects
over extended periods. The resulting behavioural time series capture circadian rhythms,
group dynamics and responses to pharmacological or genetic interventions. Analysing these
datasets by hand in spreadsheets is slow, error-prone and hard to scale across dozens of
subjects or multiple experimental runs. Researchers need to explore temporal patterns,
compare experimental groups and apply statistical validation quickly, without writing
bespoke analysis scripts for each experiment.

I developed an interactive Python platform that combines time-series visualisation,
circadian segmentation, statistical hypothesis testing and automated Excel report
generation in a single researcher-facing interface. This makes behavioural data analysis
fast and reproducible.

## Problem statement

Large-scale behavioural time-series datasets are analytically challenging. Multi-subject
experiments recorded over days or weeks produce high-dimensional data with complex
temporal structure (circadian cycles, treatment-response windows and inter-subject
variability) that is difficult to examine systematically in a spreadsheet.

Researchers also need to validate findings statistically by comparing treatment and
control groups with appropriate tests. Without integrated tools, this usually means
custom code for every experiment, which slows time-to-insight and introduces
reproducibility risks.

- **High dimensionality:** dozens of subjects recorded simultaneously.
- **Long time horizons:** experiments span days or weeks.
- **Circadian variability:** activity patterns shift between day and night.
- **Group comparisons:** treatment vs. control analysis is required.

## Research hypotheses

A core objective was to give researchers the statistical tools to validate specific
behavioural hypotheses from neuroscience literature and their experimental design. The
platform was built around three primary hypotheses about circadian activity patterns and
inter-subject dynamics.

|        | Hypothesis                                                                                                                                                                                      | Statistical test                                                      |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| **H1** | **Nocturnal activity elevation.** Subjects are more active at night than during the day, consistent with the nocturnal behaviour typically observed in rodent model systems.                    | t-test: day vs. night activity per subject and group                  |
| **H2** | **Light/dark-cycle variability.** Activity varies significantly between light/dark cycles over the experiment, indicating consistent circadian entrainment rather than random fluctuation.      | ANOVA: multi-cycle activity variance across the full recording period |
| **H3** | **Inter-subject behavioural influence.** One subject's activity influences others', suggesting social or environmental coupling that may reflect neural circuit interactions or group dynamics. | ANOVA: cross-subject activity correlation and group-level comparison  |

**Statistical methods used**

- **Independent t-test** for two-group comparisons (day vs. night, treatment vs. control).
- **One-way ANOVA** for multi-group and multi-cycle comparisons.

**Capabilities**

- Interactive time-series visualisation with day/night highlights.
- Custom group definition and side-by-side comparison.
- SD bands and mean activity trend overlays.
- Automated Excel report export with all statistics.

<div class="gallery">
  <figure>
    <img src="/assets/projects/PTA/pmr1.png" alt="Activity analysis dashboard" loading="lazy">
    <figcaption>Circadian Activity Overview</figcaption>
  </figure>

  <figure>
    <img src="/assets/projects/PTA/pmr2.png" alt="Circadian activity patterns" loading="lazy">
    <figcaption>Group Activity Patterns</figcaption>
  </figure>

  <figure>
    <img src="/assets/projects/PTA/pmr3.png" alt="Group comparison and statistics" loading="lazy">
    <figcaption>Group Statistics</figcaption>
  </figure>

  <figure>
    <img src="/assets/projects/PTA/pmr4.png" alt="Statistical analysis and visualisation" loading="lazy">
    <figcaption>Statistical Summary</figcaption>
  </figure>

  <figure>
    <img src="/assets/projects/PTA/pmr5.png" alt="Raw Pallidus MR1 activity data" loading="lazy">
    <figcaption>Raw Pallidus MR1 Data</figcaption>
  </figure>
</div>

<div class="lightbox" id="gallery-lightbox" aria-hidden="true">
  <button class="lightbox-close" aria-label="Close image">&times;</button>
  <img class="lightbox-image" src="" alt="">
  <p class="lightbox-caption"></p>
</div>

## Data processing pipeline

1. **Dataset upload and ingestion.** Researchers upload raw MR1 CSV datasets through the Streamlit interface. The system validates the file structure, identifies device columns and prepares the dataset for processing (Streamlit, file upload).
2. **Data cleaning and standardisation.** Irrelevant metadata columns are removed, missing timestamps are handled and column names are standardised. This keeps downstream processing consistent however the MR1 exports the data (Pandas).
3. **Timestamp parsing and resampling.** Raw timestamp strings are converted to datetime objects and activity is resampled to hourly intervals. This reduces noise and aligns the data for temporal trend analysis and circadian comparisons.
4. **Circadian segmentation.** Records are segmented automatically into day and night periods by timestamp, so diurnal and nocturnal activity patterns can be analysed separately. These patterns are central to circadian behavioural research.
5. **Group aggregation and statistics.** Mean activity, standard deviation and group-level aggregates are computed for each experimental group. t-tests and ANOVA evaluate the statistical significance of observed behavioural differences (Pandas, SciPy).
6. **Visualisation and report export.** Interactive Plotly charts show day/night shading and SD bands. Structured Excel reports (XlsxWriter) contain all computed metrics, group comparisons and statistical test results.

**Metrics computed**

| Symbol | Metric                                    |
| ------ | ----------------------------------------- |
| μ      | Mean activity level per subject and group |
| σ      | Standard deviation and variability bands  |
| Δ      | Day vs. night activity differentials      |
| _p_    | p-values from t-tests and ANOVA           |
| Σ      | Group-level aggregation summaries         |

## Technology stack

| Area                        | Tools             |
| --------------------------- | ----------------- |
| Language                    | Python            |
| Interface and visualisation | Streamlit, Plotly |
| Data processing             | Pandas, NumPy     |
| Statistics and reporting    | SciPy, XlsxWriter |

## Challenges and solutions

### Multi-subject scale

**Challenge.** Experiments may contain dozens of subjects recorded simultaneously across
multiple monitoring devices, which makes manual aggregation and comparison impractical
at any meaningful scale.

**Solution.** Efficient Pandas aggregation pipelines process multi-device datasets and
compute group-level statistics in a single pass, regardless of subject count.

### Circadian temporal structure

**Challenge.** Behavioural activity varies strongly between day and night. This pattern is
invisible in raw data and easy to miss in standard time-series analysis without deliberate
segmentation.

**Solution.** Automatic day/night segmentation by timestamp and hourly resampling reveal
circadian patterns clearly, through shaded visualisation and separate statistics for each
period.

### Statistical rigour

**Challenge.** Neuroscience research requires rigorous statistical validation before
conclusions can be drawn or published. Different tests are often needed depending on the
number of groups and the data distribution.

**Solution.** t-tests and ANOVA are integrated directly into the platform through SciPy.
Researchers get immediate hypothesis testing with p-value reporting, without any extra
coding.

## Outcome

The platform gave the Kravitz Lab a scalable behavioural analysis system that
researchers can use directly. It supports interactive exploration of behavioural
datasets, automated day/night comparisons, integrated hypothesis testing and streamlined
report generation for research documentation.

By combining data cleaning, time-series visualisation, circadian segmentation, group
comparison and statistical testing in a single Streamlit application, the platform made
the research workflow much more efficient. It reduced the time and technical overhead
needed to go from raw MR1 activity data to validated behavioural findings.
