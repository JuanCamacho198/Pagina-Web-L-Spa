import { describe, expect, it } from 'vitest';

import { computeImpacts, resolveDeployMode } from '../compute-impacts.mjs';

function computeWithRange(env, range) {
  return computeImpacts({
    env,
    range,
    changedFiles: ['apps/backend/src/index.ts'],
  });
}

describe('deploy mode branch mapping', () => {
  it('uses preview mode for pull requests', () => {
    expect(resolveDeployMode({ eventName: 'pull_request', refName: 'main' })).toBe('preview');
  });

  it('uses preview mode for develop pushes', () => {
    expect(resolveDeployMode({ eventName: 'push', refName: 'develop' })).toBe('preview');
  });

  it('uses production mode for main pushes', () => {
    expect(resolveDeployMode({ eventName: 'push', refName: 'main' })).toBe('production');
  });
});

describe('fail-closed range fallback behavior', () => {
  it('forces deploy intents to false when range resolution fails', () => {
    const result = computeWithRange(
      {
        eventName: 'push',
        refName: 'main',
        headSha: 'head-sha',
      },
      {
        resolved: false,
        base: null,
        head: 'head-sha',
        strategy: null,
        fallbackReason: 'Unable to resolve valid git commit range; using fail-closed deploy intent.',
      },
    );

    expect(result.outputs.deploy_mode).toBe('production');
    expect(result.outputs.deploy_frontend).toBe('false');
    expect(result.outputs.deploy_backend).toBe('false');
    expect(result.summary.range.resolved).toBe(false);
    expect(result.summary.range.fallbackReason).toMatch(/fail-closed deploy intent/i);
    expect(result.outputs.impact_classes).toBe('none');
  });
});
