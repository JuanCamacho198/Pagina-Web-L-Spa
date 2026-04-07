import { describe, expect, it } from 'vitest';

import { classifyFile, computeImpacts } from '../compute-impacts.mjs';

function runWithFiles(changedFiles) {
  return computeImpacts({
    env: {
      eventName: 'push',
      refName: 'develop',
      headSha: 'head-sha',
    },
    range: {
      resolved: true,
      base: 'base-sha',
      head: 'head-sha',
      strategy: 'test-range',
      fallbackReason: null,
    },
    changedFiles,
  });
}

describe('compute-impacts path matrix', () => {
  it('classifies frontend-only changes', () => {
    const result = runWithFiles(['apps/frontend/src/routes/+page.svelte']);

    expect(result.outputs.deploy_frontend).toBe('true');
    expect(result.outputs.deploy_backend).toBe('false');
    expect(result.outputs.impact_classes).toBe('frontend');
  });

  it('classifies backend-only changes', () => {
    const result = runWithFiles(['apps/backend/src/index.ts']);

    expect(result.outputs.deploy_frontend).toBe('false');
    expect(result.outputs.deploy_backend).toBe('true');
    expect(result.outputs.impact_classes).toBe('backend');
  });

  it('fans out shared-types changes to both deploys', () => {
    const result = runWithFiles(['packages/shared-types/src/user.ts']);

    expect(result.outputs.deploy_frontend).toBe('true');
    expect(result.outputs.deploy_backend).toBe('true');
    expect(result.outputs.impact_classes).toBe('shared');
  });

  it('treats database package changes as backend-only', () => {
    const result = runWithFiles(['packages/database/src/schema.ts']);

    expect(result.outputs.deploy_frontend).toBe('false');
    expect(result.outputs.deploy_backend).toBe('true');
    expect(result.outputs.impact_classes).toBe('backend');
  });

  it('treats workspace toolchain changes as shared', () => {
    const result = runWithFiles(['package.json', '.github/workflows/cd.yml']);

    expect(result.outputs.deploy_frontend).toBe('true');
    expect(result.outputs.deploy_backend).toBe('true');
    expect(result.outputs.impact_classes).toBe('shared');
  });

  it('keeps docs-only changes as no deploy', () => {
    const result = runWithFiles(['docs/vercel-monorepo-config.md']);

    expect(result.outputs.deploy_frontend).toBe('false');
    expect(result.outputs.deploy_backend).toBe('false');
    expect(result.outputs.impact_classes).toBe('none');
  });
});

describe('compute-impacts rule behavior', () => {
  it('falls back unmapped paths to shared', () => {
    const result = classifyFile('scripts/new-tooling/custom.ts');

    expect(result.className).toBe('shared');
    expect(result.rule).toBe('fallback-unmapped');
  });
});
