---
title: Full Fine-Tuning vs. LoRA for Dialogue Summarisation with Flan-T5
summary: >-
  A controlled comparison of zero-shot, full fine-tuning and PEFT/LoRA on DialogSum. LoRA
  outperformed full fine-tuning on all four ROUGE metrics (+5.98 points ROUGE-1 over the
  base model) while training only adapter parameters.
category: genai
order: 7
thumbnail: /assets/icons/DSLLM-main.png
context: Generative AI with LLMs (DeepLearning.AI)
facts:
  Fine-tuning: Full fine-tuning vs. PEFT / LoRA
  Dataset: knkarthick/dialogsum (Hugging Face)
tags: [Python, Flan-T5, Hugging Face, PEFT, LoRA, PyTorch, ROUGE]
links:
  code: https://github.com/noorulhudaajmal/Generative-AI-with-LLMs
demo:
  # A Hugging Face Space works well here; set embed: true to show it inline.
  url: ""
  embed: false
---

## Overview

This comparative study looks at full fine-tuning and parameter-efficient fine-tuning
(PEFT) with LoRA adapters on Flan-T5 for daily-life dialogue summarisation. It shows that
PEFT achieves better ROUGE scores at a much lower computational cost.

<div class="callout" markdown="1">
The project was completed as part of the [DeepLearning.AI](https://www.deeplearning.ai/)
course *Generative AI with LLMs*, which covers foundational LLM concepts, fine-tuning
methods and alignment techniques.
</div>

It explores how to adapt a pre-trained language model to one task, daily-life dialogue
summarisation, using two different fine-tuning strategies. The base model is Flan-T5,
Google's instruction-tuned T5 variant, loaded from Hugging Face together with the
[`knkarthick/dialogsum`](https://huggingface.co/datasets/knkarthick/dialogsum) dataset of
conversational dialogue–summary pairs.

The key question is whether PEFT with LoRA adapters can match or outperform traditional
full fine-tuning while using a fraction of the trainable parameters and compute. ROUGE
scores and qualitative evaluation confirm that it can. PEFT with LoRA improves ROUGE-1 by
5.98 points over the original model and outperforms full fine-tuning on all four ROUGE
metrics.

**Approaches compared**

1. Zero-shot baseline with the original Flan-T5.
2. Full fine-tuning, updating all model parameters.
3. PEFT/LoRA, training only the adapter layers.

## Project steps

1. **Dataset loading.** Load the `knkarthick/dialogsum` dataset from Hugging Face Datasets, which pairs everyday conversational dialogues with reference summaries for training and evaluation.
2. **Model initialisation.** Load the Flan-T5 base model and its tokenizer from Hugging Face Transformers as the starting point for both fine-tuning approaches.
3. **Zero-shot baseline.** Run inference with the unmodified Flan-T5 to measure initial ROUGE scores and review output quality before any fine-tuning.
4. **Data preprocessing.** Format dialogue–summary pairs into structured prompts. Every training example follows the same template to steer the model towards summarisation (prompt engineering, tokenisation).
5. **Full fine-tuning.** Train all Flan-T5 parameters on the full dataset with standard supervised fine-tuning. Learning rate, epochs, weight decay and maximum steps are configured and tracked (PyTorch).
6. **PEFT with LoRA.** Add LoRA adapter layers to the base model, freeze all original parameters and train only the adapters. LoRA rank, alpha, target modules (q, v) and dropout are configured.
7. **Model evaluation.** Evaluate both models qualitatively by human review of summary quality, and quantitatively with ROUGE-1/2/L/Lsum against reference summaries from the DialogSum test set.

**Input prompt format**

```
Summarize the following conversation.

Chris: This is his part of the conversation.
Antje: This is her part of the conversation.

Summary:
```

<div class="callout" markdown="1">
**Why PEFT / LoRA**

Full fine-tuning updates every model parameter, which is expensive for large models and
risks catastrophic forgetting. LoRA inserts low-rank adapter matrices into the attention
layers, freezes the original weights and trains only the adapters. This cuts the number
of trainable parameters by orders of magnitude while preserving the model's general
capabilities.
</div>

## Training configuration

### Full fine-tuning: standard parameter training

All Flan-T5 weights are updated during training on the complete DialogSum dataset.

| Parameter | Description | Value |
|---|---|---:|
| `learning_rate` | Rate of weight updates | 1e-5 |
| `num_epochs` | Training iterations | 15 |
| `weight_decay` | L2 regularisation | 0.01 |
| `max_steps` | Maximum training steps | 10 |

### PEFT / LoRA: adapter-only training

The base model is frozen and only the LoRA adapter layers are trained, so the parameter
overhead is minimal.

| LoRA parameter | Description | Value |
|---|---|---:|
| rank (`r`) | Low-rank matrix size | 32 |
| `lora_alpha` | Scaling factor | 32 |
| `target_modules` | Adapted layers | q, v |
| `lora_dropout` | Dropout rate | 0.05 |

| General training parameter | Value |
|---|---:|
| `learning_rate` | 1e-3 |
| `num_epochs` | 1 |
| `max_steps` | 150 |

## Results and evaluation

### ROUGE score comparison

| Metric | Original | Full FT | PEFT (LoRA) | PEFT vs. original |
|---|---:|---:|---:|---:|
| ROUGE-1 | 0.2409 | 0.2329 | **0.3007** | +5.98 pts |
| ROUGE-2 | 0.1177 | 0.0724 | **0.1434** | +2.57 pts |
| ROUGE-L | 0.2200 | 0.2015 | **0.2475** | +2.75 pts |
| ROUGE-Lsum | 0.2213 | 0.2015 | **0.2506** | +2.93 pts |

The PEFT model outperformed full fine-tuning on all four ROUGE metrics. With a 5.98-point
ROUGE-1 gain over the baseline, PEFT with LoRA proved both more effective and more
efficient, training only adapter parameters instead of the entire model.

### Qualitative summary examples

**Full fine-tuning comparison**

| | Summary |
|---|---|
| Reference | Person1 teaches Person2 how to upgrade software and hardware in Person2's system. |
| Original | Person1: Have you considered upgrading your system? |
| Full FT | Person1: I'm thinking of upgrading my computer. |

**PEFT comparison**

| | Summary |
|---|---|
| Reference | Person1 teaches Person2 how to upgrade software and hardware in Person2's system. |
| Original | Person1: I'm thinking of upgrading my computer. |
| PEFT | Upgrade your computer. |

## Technology stack

| Area | Tools |
|---|---|
| Language | Python |
| Model and fine-tuning | Flan-T5, PEFT, LoRA |
| Hugging Face | Transformers, Datasets |
| Training and evaluation | PyTorch, ROUGE |

## Outcome

The PEFT-enhanced Flan-T5 model outperformed full fine-tuning on all four ROUGE metrics,
improving ROUGE-1 by 5.98 points over the original baseline. This confirms that
LoRA-based PEFT is not only more computationally efficient but also more effective for
adapting large language models to domain-specific summarisation tasks.

The project reinforced a key insight from the LLM fine-tuning literature: updating all
model parameters is rarely necessary and can even hurt performance on narrow tasks,
through overfitting or catastrophic forgetting. Adapter-based methods such as LoRA offer
a better balance of efficiency and accuracy, which makes them the preferred approach for
production LLM fine-tuning.
