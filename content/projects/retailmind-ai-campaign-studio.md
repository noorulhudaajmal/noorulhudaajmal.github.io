---
title: RetailMind, a Multi-Agent System for Marketing Campaign Generation
summary: >-
  Four tool-using LLM agents (market research, design, copywriting, packaging) coordinated
  in a sequential pipeline that turns a product from live inventory into a complete
  campaign in about 2–3 minutes.
category: genai
order: 9
thumbnail: /assets/icons/retailmind_main.png
facts:
  Type: Multi-agent AI system
  Agents: 4 specialised AI agents (sequential pipeline)
  Models: GPT-4o-mini · DALL·E 3
  Research tool: Tavily Search API (agentic loops)
  Campaign time: ~2–3 minutes end-to-end
tags: [Python, GPT-4o-mini, DALL·E 3, Tavily, Streamlit, SQLite, OpenAI function calling, Multi-agent]
links:
  code: https://github.com/noorulhudaajmal/ai-starter/tree/master/mini_projects/marketing_assistant_agent
demo:
  url: ""
---

## Overview

RetailMind is a multi-agent AI platform that automates end-to-end marketing campaign
creation for retail. It coordinates four agents (market research, graphic design,
copywriting and packaging) to produce professional campaigns complete with AI visuals,
trend analysis, multimodal copy and an executive report, all in under three minutes.

A store manager selects a product from live inventory and configures the campaign:
target demographic, season, brand tone and campaign goal. The system then runs the four
specialised agents to produce a complete, professional campaign package in minutes.

The core of the design is the orchestration pattern. Each agent has a defined role and
specific tools, and produces structured output that feeds the next stage:

- The market research agent runs autonomous tool-use loops over Tavily web search and product-catalogue queries.
- The graphic designer agent turns the research into DALL·E 3 image prompts.
- The copywriter agent uses vision-language reasoning to analyse the generated image alongside the trend data.
- The packaging agent assembles everything into an executive Markdown report.

This architecture cuts campaign development from days to minutes while keeping the
quality professional, at roughly US$0.20–0.50 per campaign run.

**The bottleneck this solves**

- Hiring cross-functional teams is expensive for every campaign.
- Agencies take weeks to turn work around and offer limited customisation.
- Generic templates fail to differentiate products.
- Inventory and trend data are isolated in separate systems.

## Agent pipeline

### Agent 1: Market research

Runs autonomous tool-use loops over Tavily web search and the product catalogue until it
converges on a high-confidence trend analysis or hits the iteration limit. It identifies
emerging trends, consumer sentiment and competitive positioning for the selected product
and demographic.

*Tools:* Tavily web search, product-catalogue queries, agentic loop, OpenAI function
calling. *Output:* trend summary, market intelligence, product-fit score.

### Agent 2: Graphic designer

Turns the research insights into a cinematic DALL·E 3 prompt tuned for premium aesthetics
and the brand tone. It generates the campaign image, then writes a caption and tagline
anchored to the visual.

*Tools:* GPT-4o-mini (prompt generation), DALL·E 3 (image generation), cinematic
prompting. *Output:* image (PNG), caption, tagline.

### Agent 3: Copywriter

Uses multimodal (vision-language) reasoning to analyse the AI-generated image and the
trend data together. It produces a portfolio of campaign copy calibrated to audience and
channel: a hero quote, CTAs, short- and long-form ad variants and hashtags.

*Tools:* GPT-4o-mini vision, multimodal reasoning, multi-channel copy. *Output:* hero
quote, CTA, hashtags, social / email / landing-page copy.

### Agent 4: Packaging

Polishes the research findings and collects all campaign assets (visuals, copy, metadata
and strategic justification) into a structured, executive-ready Markdown report with
tables and narrative context. It saves the report to the outputs directory and logs the
campaign to the database.

*Tools:* GPT-4o-mini, Markdown report, SQLite. *Output:* `campaign_report_{sku}.md`,
campaign archived to the database.

**Architecture benefits**

- **Specialisation:** each agent has a focused domain and toolset.
- **Parallelisable:** the agents after research can run concurrently.
- **Cost-efficient:** GPT-4o-mini handles reasoning; DALL·E 3 is used only for imagery.
- **Auditable:** every reasoning step and tool call is logged.
- **Extensible:** new agents or tools plug in without refactoring.

**SQLite inventory:** 28 products across 8 categories, 800 sales-history records, and a
campaign archive with metadata.

## Key features

| Feature | Description |
|---|---|
| Agentic tool use | The market research agent loops autonomously over web search and catalogue queries and stops on convergence or at the iteration limit. No manual orchestration is needed. |
| Multimodal analysis | The copywriter reasons over the AI-generated image and the trend data together using vision-language capabilities, producing contextually rich, image-grounded copy. |
| Live inventory integration | Products are queried from a live SQLite database, so stock levels, pricing and metadata feed into campaign positioning and output stays relevant. |
| AI-generated visuals | DALL·E 3 generates images from cinematic prompts aligned with the brand tone. Images are saved to the outputs directory and embedded in the final executive report. |
| Demographic targeting | Gender, age group, season and brand-tone parameters flow consistently through all four agents, so every deliverable is aligned with the audience. |
| Real-time streaming | Streaming callbacks log agent progress live. Users see which agent is running and which tools it is calling, which builds transparency and trust. |
| Multi-channel copy | A single run produces social media, email and landing-page copy variants, plus a hero quote, CTA and hashtag recommendations. |
| Executive reports | The packaging agent assembles structured Markdown briefs with metadata tables, market intelligence, visual assets and strategic justification, ready to share. |
<video controls preload="none" playsinline poster="/assets/projects/rm/poster.png" aria-label="RetailMind marketing assistant demo">
  <source src="/assets/projects/rm/marketing_assistant_agent.mp4" type="video/mp4">
  Your browser does not support embedded video. <a href="/assets/projects/rm/marketing_assistant_agent.mp4">Download the demo video</a>.
</video>

## Output deliverables

- **Campaign image:** an AI-generated PNG from DALL·E 3 with cinematic, brand-aligned visual direction.
- **Market intelligence:** trend research, consumer sentiment and competitive positioning from live web data.
- **Creative brief:** hero quote, tagline, caption and CTA copy calibrated to audience and brand tone.
- **Multi-channel copy:** short- and long-form ad copy for social, email and landing-page channels.
- **Hashtag set:** curated, trend-aligned hashtag recommendations for social distribution.
- **Executive report:** a structured Markdown brief with tables, visuals, copy and strategic narrative.

## Sample output

Campaign generated for a **Celestial Gold Pendant** (women · all seasons · minimalist
tone).

**Creative copy**

> "Embrace the cosmos with timeless elegance."
>
> *Wear Your Dreams, Shine Bright*

- **Social:** "Elevate your look with our exquisite Celestial Gold Pendant—where dreams meet elegance."
- **Email:** "Discover the allure of the stars... a perfect blend of elegance and personal significance."
- **Hashtags:** #CelestialJewelry #GoldPendant #MoonAndStar #PersonalizedStyle #LayeredLooks

**Market intelligence.** The research identified trends towards celestial jewellery,
personalisation and layering. It positioned the product as an expression of
individuality that matches current consumer sentiment, with a **product-fit score of
9/10**.

**Deliverables produced:** AI-generated campaign image (PNG), executive Markdown brief,
multi-channel copy variants, and the campaign archived to the database.

## Business impact

<div class="stats">
  <div><b>~3 min</b><span>campaign generation time</span></div>
  <div><b>$0.50</b><span>max cost per campaign</span></div>
  <div><b>4</b><span>specialised AI agents</span></div>
  <div><b>6+</b><span>deliverables per run</span></div>
</div>

## Technology stack

### Core AI / ML

| Component | Technology | Role |
|---|---|---|
| LLM backbone | GPT-4o-mini | Reasoning, tool orchestration, multimodal analysis |
| Image generation | DALL·E 3 | AI-generated campaign visuals |
| Web research | Tavily API | Real-time trend and market intelligence |
| Tool calling | OpenAI functions | Structured agentic tool-use loops |

### Backend, data and UI

| Component | Technology | Role |
|---|---|---|
| Database | SQLite | Inventory, products, sales history, campaigns |
| Concurrency | asyncio + queues | Real-time log streaming to the UI |
| Web UI | Streamlit | Product selection, form input, live progress |
| Language | Python 3.9+ | End-to-end system implementation |

## Outcome

RetailMind demonstrates agentic AI orchestration applied to a real-world marketing
workflow. Campaign generation is split across four specialised agents, each with its own
tools, reasoning pattern and output format. The system delivers professional creative
output at near-zero marginal cost, with full auditability and transparent tool use.

The main contribution is combining three patterns in one orchestrated pipeline:
tool-use agentic loops (market research), multimodal vision-language reasoning
(copywriting) and generative image creation (design). This pattern applies directly to
many knowledge-work domains beyond retail marketing. The architecture is extensible by
design, so new agents or tools can be added without refactoring. It suits both boutique
retail and enterprise-scale deployment.
