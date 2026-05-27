# Pricing Data

This file documents the assumptions used by the deterministic engine.

## Tool Coverage

- Cursor
- GitHub Copilot
- Claude
- ChatGPT
- Anthropic API
- OpenAI API
- Gemini
- Windsurf

## Pricing Assumptions

- Cursor Pro is modeled at $20 per user/month, Cursor Pro+ at $60 per user/month, and Cursor Teams at $40 per user/month.
- GitHub Copilot Pro is modeled at $10 per user/month, Copilot Business at $19 per user/month, and Copilot Enterprise at $39 per user/month.
- Claude Pro is modeled at $20 per month, and Claude Team is modeled at $30 per member/month with a 5-member minimum.
- ChatGPT Plus is modeled at $20 per month, and ChatGPT Business is modeled at $30 per seat/month with a 2-seat minimum.
- Windsurf Pro is modeled at $20 per user/month, and Windsurf Teams at $40 per user/month.
- API tools are modeled as usage-based, so the optimizer focuses on routing and caching rather than seat reduction.
- Startup credits are treated as context only, not recurring monthly savings.

## Rule Thresholds

- A recommendation must clear a conservative savings threshold before it is shown as a downgrade.
- API savings are capped at a modest percentage of current spend because token-level usage data is not collected.
- Strong CTA: monthly savings of at least $500
- Soft CTA: monthly savings between $100 and $499
- Honest CTA: monthly savings below $100
