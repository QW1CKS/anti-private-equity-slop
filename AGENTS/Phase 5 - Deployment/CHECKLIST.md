# Phase 5 Checklist - Deployment

## Related Docs
- Overview: [../../README.md](../../README.md)
- Product requirements: [../../PRD.md](../../PRD.md)
- Workflow instructions: [../../.github/copilot-instructions.md](../../.github/copilot-instructions.md)
- Active phase state: [../ACTIVE_PHASE.md](../ACTIVE_PHASE.md)
- Progress dashboard: [../PROGRESS_DASHBOARD.md](../PROGRESS_DASHBOARD.md)
- Phase README: [./README.md](./README.md)

## Phase Goal
Ship a reproducible, security-reviewed extension release with clear rollback and maintenance readiness.

## Asset-Driven Execution Order
1. Gem Orchestrator
2. GitHub Actions Expert
3. Security Reviewer
4. TypeScript MCP Expert
5. Playwright Tester
6. Critical Thinking Reviewer

## Evidence Contract (mandatory)
- [ ] Append deployment actions to `.github/agent_memory/03_actions.tsv`.
- [ ] Append deployment ownership transfers to `.github/agent_memory/05_handoffs.tsv`.
- [ ] Record release artifact paths, checksum/version references, and command evidence.
- [ ] Record go/no-go decision evidence and sign-off owner.

## Deployment Scope

### In Scope
- [ ] Build reproducibility and packaging integrity.
- [ ] CI gate enforcement for release candidates.
- [ ] Security/compliance readiness checks.
- [ ] Rollback and post-release support readiness.

### Out of Scope
- [ ] New runtime features.
- [ ] Risky refactors unrelated to release stability.

## Detailed Agent Tasks

### 1) Gem Orchestrator - Release Governance
- [ ] Define release checkpoints: candidate build, validation, security sign-off, packaging, launch decision.
- [ ] Define explicit release owner and backup owner.
- [ ] Define stop-ship conditions and escalation path.
- [ ] Define required evidence bundle for launch approval.
- [ ] Define post-release monitoring and response ownership.

### 2) GitHub Actions Expert - CI/CD Release Gate
- [ ] Confirm `build.yml` passes for release branch/commit.
- [ ] Verify workflow triggers and branch coverage align with release process.
- [ ] Verify least-privilege permissions strategy for workflows.
- [ ] Verify action version immutability strategy (pinning plan and maintenance policy).
- [ ] Verify dependency/security checks are represented in release criteria.
- [ ] Document CI-related manual steps required before tagging/releasing.

### 3) Security Reviewer - Pre-Release Security Sign-Off
- [ ] Perform final security sweep on release-bound changes.
- [ ] Confirm no hardcoded secrets, leaked tokens, or sensitive config artifacts.
- [ ] Confirm extension permission posture remains minimal and justified.
- [ ] Confirm dependency and license posture is acceptable for release.
- [ ] Confirm unresolved security findings are either fixed or explicitly risk-accepted by owner.

### 4) TypeScript MCP Expert - Build and Packaging Integrity
- [ ] Verify TypeScript build output consistency and no unexpected compile-time regressions.
- [ ] Verify dist packaging contains only intended runtime assets.
- [ ] Verify version metadata consistency across manifest and release docs.
- [ ] Verify source-to-dist traceability for key runtime files.

### 5) Playwright Tester - Final User Flow Validation
- [ ] Validate critical user flows on packaged build equivalent behavior.
- [ ] Validate warning and dismissal behavior under representative browsing routes.
- [ ] Validate no severe UX regressions before launch.
- [ ] Capture final screenshots/log evidence for release record.

### 6) Critical Thinking Reviewer - Go/No-Go Challenge
- [ ] Challenge release confidence claims against actual evidence.
- [ ] Challenge whether rollback is practical and tested enough.
- [ ] Challenge whether deferred defects meaningfully threaten launch quality.
- [ ] Challenge whether monitoring/support plan can detect and handle live issues quickly.

## Hook-Driven Compliance Gate (Phase 5)
- [ ] Tool Guardian: no destructive deployment-time command attempts.
- [ ] Secrets Scanner: clean scan on release candidate change set.
- [ ] Dependency License Checker: no blocked-license additions in release candidate.
- [ ] Session Logger: deployment-phase audit trail exists and is retained per policy.

## Skill Usage Gate (Phase 5)
- [ ] `webapp-testing`: final browser behavior verification done and evidenced.
- [ ] `javascript-typescript-jest`: release-adjacent automated checks remain green and relevant.
- [ ] `security-review`: final security report completed with severity summary.

## Release Artifact Checklist
- [ ] Release build artifacts generated from clean state.
- [ ] Artifact naming/versioning matches release documentation.
- [ ] Package integrity verified after creation.
- [ ] Installation smoke-check steps documented for unpacked extension flow.
- [ ] Rollback package/source reference identified and reachable.

## Post-Release Preparedness
- [ ] Incident response contact/owner defined.
- [ ] Known issues list prepared.
- [ ] Verification checklist for first post-release patch prepared.
- [ ] Monitoring/log review cadence defined for early release window.

## Exit Criteria
- [ ] All release gates pass with evidence.
- [ ] Security and CI sign-offs are complete.
- [ ] Rollback and maintenance readiness is documented.
- [ ] Final handoff entry recorded in memory logs.

## Command Evidence
- Build: `npm run build`
- Test: `npm test`
- Lint: `npm run lint`
