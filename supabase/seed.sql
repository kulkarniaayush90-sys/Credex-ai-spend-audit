insert into public.audit_reports (id, report_json, created_at)
values (
  'sample01',
  '{
    "id": "sample01",
    "createdAt": "2026-05-27T12:00:00.000Z",
    "teamSize": 11,
    "primaryUseCase": "Product engineering and customer ops",
    "summary": "This sample report shows a meaningful chance to trim overlapping AI subscriptions and rightsize seats without hurting velocity.",
    "confidenceLabel": "strong",
    "ctaLevel": "strong",
    "totals": {
      "monthlyCurrent": 930,
      "monthlyOptimized": 420,
      "monthlySavings": 510,
      "annualSavings": 6120
    },
    "recommendations": []
  }'::jsonb,
  now()
)
on conflict (id) do nothing;

