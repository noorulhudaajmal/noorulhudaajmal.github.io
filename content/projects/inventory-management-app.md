---
title: Inventory and Trading Analytics Dashboard for a Logistics Firm
summary: >-
  A real-time dashboard for Ammonite LLC that consolidates internal inventory data,
  commodity prices, freight rates, geopolitical events and company news from five sources
  into one decision-support tool.
category: data
order: 10
thumbnail: /assets/icons/IMA_main.jpeg
context: Client project, Ammonite LLC (intermodal logistics)
facts:
  Domain: Logistics · inventory · trading
  Data sources: Internal DB · yfinance · Telegram · MoverDB · ControlRisk
tags: [Python, Pandas, yfinance, BeautifulSoup, Plotly, Web scraping, Data dashboards]
links:
  code: https://github.com/noorulhudaajmal/Inventory-Management-Dashboard-v1
  specs: /assets/projects/ima/IMA-Specification Document.pdf
demo:
  url: ""
  embed: false
---

## Overview

The project was done for a shipping company that offers intermodal logistics services to
traders, retailers, freight forwarders, shipping lines and related groups. The goal was to
give the company real-time insights and analytics for informed decisions about inventory
management and trading.

**Client:** [Ammonite LLC](https://www.ammoniteco.com/), intermodal logistics. Ammonite
commissioned the project to give their team a consolidated, real-time view of inventory
and trading data, replacing fragmented manual reporting with a live analytics dashboard.

Ammonite LLC works in container logistics and needs real-time information from multiple
data streams, such as commodity markets, freight pricing indices and geopolitical
calendars, but had no single platform that brought them together. Decisions about
inventory levels, trading prices and logistics planning meant gathering information from
disparate sources by hand.

I designed and built a comprehensive Python dashboard that integrates all of these data
sources into a unified interface. Each tab targets a specific operational need: high-level
inventory snapshots, sales and cost breakdowns, live commodity prices, port activity, a
global event calendar and news pulled directly from the company's Telegram channel.

**Project steps**

1. Requirements gathering with the Ammonite LLC team.
2. Data collection from internal and external sources.
3. Data cleaning and preprocessing pipelines.
4. Dashboard layout design.
5. Feature implementation and Plotly visualisations.

## Dashboard tabs

The dashboard is organised as eight tabs, each covering a distinct operational area.
Together they give the Ammonite team a complete, real-time picture of their inventory,
trading and logistics activity.

| Tab | Purpose |
|---|---|
| Overview | Snapshot of key metrics: inventory levels and financial performance at a glance |
| Sales analytics | Detailed analysis of inventory sales and cost structure, with trend visualisations |
| Inventory in/out | Tracks inventory movement for accurate stock management and replenishment timing |
| Sales' ports | Sales activity across shipping ports, supporting logistics planning and coordination |
| Trading prices | Real-time commodity price analysis for informed trading and procurement decisions |
| Macro | Live commodity market data from yfinance: prices, trends and market movements |
| Calendar | Geopolitical event calendar from ControlRisk, flagging global events that affect operations |
| News | Company updates consolidated in real time from Ammonite's Telegram channel |

<div class="gallery">
  <figure><img src="/assets/projects/ima/inv-overview.png" alt="Overview tab" loading="lazy"><figcaption>Overview.</figcaption></figure>
  <figure><img src="/assets/projects/ima/inv-sales-costs.png" alt="Sales and costs tab" loading="lazy"><figcaption>Sales and costs.</figcaption></figure>
  <figure><img src="/assets/projects/ima/trading_prices_1.png" alt="Trading prices tab" loading="lazy"><figcaption>Trading prices.</figcaption></figure>
  <figure><img src="/assets/projects/ima/trading_prices_2.png" alt="Trading prices tab, continued" loading="lazy"><figcaption>Trading prices (continued).</figcaption></figure>
  <figure><img src="/assets/projects/ima/commodities.png" alt="Commodities tab" loading="lazy"><figcaption>Commodities.</figcaption></figure>
  <figure><img src="/assets/projects/ima/calendar.png" alt="Calendar tab" loading="lazy"><figcaption>Calendar.</figcaption></figure>
</div>

<div class="lightbox" id="gallery-lightbox" aria-hidden="true">
  <button class="lightbox-close" aria-label="Close image">&times;</button>
  <img class="lightbox-image" src="" alt="">
  <p class="lightbox-caption"></p>
</div>

## Data sources

The platform integrates five distinct data sources, internal company data plus four
external APIs and web sources, to give Ammonite LLC a unified view.

| Source | Type | Description |
|---|---|---|
| Internal databases | Internal | Inventory levels, sales transactions, cost records and port activity from Ammonite's internal systems |
| yfinance API | API | Live commodity prices and market trend data, fetched with the yfinance Python library for the Commodities and Trading tabs |
| MoverDB.com | Web scraping | Sea-freight container shipping rates to and from the US, scraped to populate the Trading Prices tab with current freight costs |
| ControlRisk.com | Web scraping | Geopolitical calendar data for the Calendar tab: global events that could affect shipping routes, tariffs or market conditions |
| Company Telegram channel | Telegram | News and updates pulled directly from Ammonite's internal Telegram channel and shown in the News tab |

**Processing stack:** Pandas, BeautifulSoup, Plotly, yfinance.

## Project goals

### Real-time decision support

Give Ammonite LLC live insight into inventory, trading prices, commodity markets and
global events, so the team can make informed, timely decisions without collecting data
by hand.

### Operational efficiency

Make it simpler to track inventory movement, analyse sales and costs, and monitor port
activity, reducing manual reporting effort and speeding up analysis.

## Outcome

The platform gave Ammonite LLC a consolidated, real-time analytics hub. A live dashboard
replaced fragmented manual data collection, bringing together internal inventory data,
commodity markets, freight pricing, global events and company communications in one
place.

With data from five distinct sources instantly accessible and presented visually, the app
reduced the time Ammonite's team spends gathering and reconciling information. They can
focus on what the data means for inventory decisions and trading strategy instead of on
collecting it.
