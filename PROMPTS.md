# Prompts

## Summary Prompt

The summary generator sends the following instructions to Anthropic:

- Write for a startup founder or engineering lead
- Keep the output around 100 words
- Be specific and grounded in the supplied numbers
- Do not invent savings not present in the audit
- End with a practical next step

## Fallback Summary Pattern

If Anthropic is unavailable, the app falls back to a deterministic template summary built from the audit report. That fallback references:

- Team size
- Primary use case
- Top one to three savings opportunities
- A tone matched to the savings level

