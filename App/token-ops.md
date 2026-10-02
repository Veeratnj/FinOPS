# Feature: Token Analysis

## Objective

Create a complete **Enterprise Token Analysis** module for the AIOps Platform.

This module helps organizations monitor, analyze, optimize, and reduce LLM token usage and operational costs across multiple AI providers.

The design should follow the existing dark theme used in the application.

Theme

- Dark UI
- Primary Color: #39FF14
- Background: #0B0B0B
- Card Background: #151515
- Border Radius: 12px
- Modern enterprise dashboard
- Responsive
- Built using React + TypeScript + Tailwind + Ant Design

---

# Left Menu

Add a new sidebar menu

Token Analysis

Icon:
Activity / Coins / Layers

Route

/token-analysis

---

# Page Header

Title

Token Analysis

Subtitle

Analyze, optimize, and reduce AI token usage across all providers.

---

# Summary Cards

Display 8 KPI cards.

1. Total Tokens

Description

Total prompt and completion tokens.

2. Prompt Tokens

3. Completion Tokens

4. Cached Tokens

5. Embedding Tokens

6. Total Cost

7. Avg Tokens / Request

8. Estimated Savings

Each card contains

- icon
- value
- trend %
- sparkline
- comparison with previous period

---

# Filters

Top toolbar

Provider

- OpenAI
- Anthropic
- Gemini
- Azure OpenAI
- Groq
- Ollama
- Bedrock
- Mistral

Model

Project

Department

Agent

User

API Key

Date Range

Environment

- Dev
- QA
- Production

Search Box

---

# Section 1

Token Usage Trend

Charts

Line Chart

Metrics

Prompt Tokens

Completion Tokens

Total Tokens

Allow

Daily

Weekly

Monthly

Custom

---

# Section 2

Token Distribution

Pie Chart

Show

Prompt Tokens

Completion Tokens

Embedding

Cached

Reasoning

Tool Calls

Image Tokens

Audio Tokens

Hover displays

Percentage

Tokens

Cost

---

# Section 3

Provider Usage

Table

Columns

Provider

Requests

Tokens

Cost

Latency

Success Rate

Trend

Include

OpenAI

Claude

Gemini

Groq

Azure

Bedrock

---

# Section 4

Model Comparison

Table

Model

Requests

Prompt Tokens

Completion Tokens

Average Cost

Average Latency

Quality Score

---

# Section 5

Top Token Consumers

Tabs

Top Users

Top Projects

Top Agents

Top API Keys

Each table contains

Name

Requests

Tokens

Cost

Last Active

---

# Section 6

Prompt Analysis

Display

Largest Prompt

Average Prompt Size

Longest Conversation

Repeated Prompts

Prompt Efficiency Score

AI should highlight

Redundant Instructions

Duplicate Context

Large Examples

Repeated Messages

Large System Prompt

---

# Section 7

Context Window Analysis

Cards

Current Context

Maximum Context

Remaining Context

Usage %

Progress Bar

Show warning when

80%

90%

95%

---

# Section 8

Cache Analysis

Cards

Cache Hit Rate

Cache Miss

Tokens Saved

Money Saved

Repeated Prompts

Recommendations

---

# Section 9

Token Optimization

This is the most important feature.

Create a large card called

AI Optimization Assistant

User pastes a prompt.

Click

Analyze Prompt

The AI analyzes

Prompt Size

Context

System Prompt

Examples

Duplicate Text

Formatting

Instructions

Output

Current Tokens

Estimated Tokens

Estimated Savings %

Estimated Cost Reduction

Optimization Score

0-100

Generate an optimized prompt.

Display side-by-side comparison.

Current Prompt

Optimized Prompt

Buttons

Copy

Replace

Export

Apply

---

# Section 10

Optimization Suggestions

Display recommendation cards.

Example

Reduce Prompt Length

Estimated Savings

42%

Priority

High

--------------------------------

Remove Duplicate Instructions

Estimated Savings

18%

Priority

Medium

--------------------------------

Use Cached Prompt

Estimated Savings

11%

Priority

Medium

--------------------------------

Switch Model

GPT-5

↓

GPT-4.1-mini

Estimated Savings

63%

--------------------------------

Compress RAG Context

Estimated Savings

35%

--------------------------------

Summarize Conversation

Estimated Savings

28%

--------------------------------

Reduce Output Tokens

Estimated Savings

16%

Each recommendation should have

Apply

Ignore

View Details

---

# Section 11

Token Forecast

Predict

Tomorrow

Next Week

Next Month

Quarter

Forecast

Tokens

Cost

Growth

Budget

Use

Area Chart

---

# Section 12

Anomaly Detection

Cards

Abnormal Token Spike

Large Prompt

Infinite Loop

Prompt Injection

Repeated Requests

Cost Spike

Severity

Low

Medium

High

Critical

---

# Section 13

Alerts

Create configurable alert rules.

Examples

Notify when

Daily Tokens > 2 Million

Monthly Cost > $1000

Context Usage > 90%

Prompt > 15K Tokens

Cache Hit < 20%

Email

Slack

Teams

Webhook

---

# Section 14

Cost Breakdown

Bar Chart

Group by

Provider

Department

Project

User

Model

Agent

---

# Section 15

RAG Token Analysis

Cards

Embedding Tokens

Retrieved Chunks

Average Chunk Size

Knowledge Hits

Context Compression

---

# Section 16

Export

Allow export as

CSV

Excel

PDF

JSON

---

# Section 17

API Usage

Table

API Key

Requests

Tokens

Cost

Errors

Rate Limit

Latency

---

# AI Optimization Assistant

When Analyze Prompt is clicked

Simulate AI analysis.

Show

Current Prompt

4200 Tokens

↓

Optimized Prompt

1900 Tokens

Savings

55%

Estimated Cost Saved

$42/month

Optimization Score

91/100

Reason

Removed redundant instructions

Compressed context

Reduced examples

Removed duplicate messages

Used concise wording

Suggested model downgrade

---

# Dashboard Layout

--------------------------------------------------

Summary Cards

--------------------------------------------------

Token Trend | Token Distribution

--------------------------------------------------

Provider Usage | Model Comparison

--------------------------------------------------

Top Consumers | Prompt Analysis

--------------------------------------------------

Context Window | Cache Analysis

--------------------------------------------------

AI Optimization Assistant

--------------------------------------------------

Optimization Suggestions

--------------------------------------------------

Forecast | Cost Breakdown

--------------------------------------------------

Alerts | Anomalies

--------------------------------------------------

Export | API Usage

--------------------------------------------------

# UI Requirements

Use reusable React components.

Use Ant Design Cards.

Use Ant Design Tables.

Use Recharts for all charts.

Use Progress bars.

Use Statistic cards.

Use Tag components.

Use Badge status indicators.

Use responsive grid layout.

Support dark mode.

Include loading skeletons.

Include empty states.

Include pagination.

Include search.

Include sorting.

Include filtering.

Use mock JSON data.

All charts should animate smoothly.

The page should match the style of the existing AgentOps dashboard.