# ostrum-site

Landing page for **ostrum.ai** / **www.ostrum.ai**. A single static
`index.html`; there is no build step for hosting — deploy the file as-is.

## Deploying

Hosting is AWS Amplify, app **`project-ostrum`** (`d2lyt3e6f32gdl`), branch
`main`, in account **858364568434** (CLI profile `orchestrator-agent`,
us-east-1). Deploys are **manual zip deploys** — this repo is not connected
to any hosting and pushes here deploy nothing.

```bash
zip -q site.zip index.html
OUT=$(aws amplify create-deployment --app-id d2lyt3e6f32gdl --branch-name main --profile orchestrator-agent --region us-east-1)
curl -sS -T site.zip "$(echo "$OUT" | jq -r .zipUploadUrl)"
aws amplify start-deployment --app-id d2lyt3e6f32gdl --branch-name main \
  --job-id "$(echo "$OUT" | jq -r .jobId)" --profile orchestrator-agent --region us-east-1
```

Verify: `https://ostrum.ai` serves the new content (CloudFront may cache —
check the `age` header).

## ⚠️ Never connect this repo to an Amplify app

Amplify has **no API to disconnect** a repo, and a repo-connected app
rejects all zip deploys. On 2026-08-30 this repo was mistakenly connected
to the **console's** Amplify app (`ostrum`, serving app.ostrum.ai), which
overwrote the console with the landing page and required replacing that
app entirely via CloudFormation. Full postmortem: `DEPLOYMENT.md`
("Frontend hosting") in the `kevhelperbot/project-ostrum` monorepo.

- Landing content goes ONLY to `project-ostrum` (`d2lyt3e6f32gdl`).
- The console app (`ostrum`, now `d1dyc1vxu3t90p`) belongs to the monorepo's
  CI — never deploy this site there.
- A dead Amplify webhook from the incident may linger in this repo's GitHub
  settings; it points at a deleted app and can be removed.

## Local preview

```bash
npm install
npm run preview   # vite preview at 127.0.0.1
```

`scripts/build.mjs` produces a `dist/` for a different hosting experiment
(OpenAI Sites worker format) — it is unrelated to the Amplify deploy above.
