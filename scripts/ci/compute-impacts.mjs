#!/usr/bin/env node

import { appendFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

function getEnv(overrides = {}) {
  return {
    eventName: overrides.eventName ?? process.env.GITHUB_EVENT_NAME ?? '',
    refName: overrides.refName ?? process.env.GITHUB_REF_NAME ?? '',
    headSha: overrides.headSha ?? process.env.GITHUB_SHA ?? safeGit('rev-parse', 'HEAD'),
    beforeSha:
      overrides.beforeSha ??
      process.env.GITHUB_EVENT_BEFORE ??
      process.env.GITHUB_BEFORE ??
      process.env.BEFORE_SHA ??
      '',
    prBaseSha: overrides.prBaseSha ?? process.env.PR_BASE_SHA ?? process.env.GITHUB_BASE_SHA ?? '',
    baseRef: overrides.baseRef ?? process.env.GITHUB_BASE_REF ?? process.env.PR_BASE_REF ?? '',
    inputBaseSha: overrides.inputBaseSha ?? process.env.INPUT_BASE_SHA ?? process.env.BASE_SHA ?? '',
    outputPath: overrides.outputPath ?? process.env.GITHUB_OUTPUT,
  };
}

const CLASS_KEYS = ['frontend', 'backend', 'shared', 'none'];

function safeGit(...args) {
  try {
    return execFileSync('git', args, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

function runGit(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function commitExists(sha) {
  if (!sha || /^0+$/.test(sha)) {
    return false;
  }

  try {
    execFileSync('git', ['cat-file', '-e', `${sha}^{commit}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

export function resolveDeployMode(env = getEnv()) {
  if (env.eventName === 'pull_request' || env.eventName === 'pull_request_target') {
    return 'preview';
  }

  if (env.refName === 'main') {
    return 'production';
  }

  if (env.refName === 'develop') {
    return 'preview';
  }

  if (env.eventName === 'workflow_dispatch') {
    return env.refName === 'main' ? 'production' : 'preview';
  }

  return 'preview';
}

export function resolveRange(env = getEnv()) {
  const candidates = [];

  if (env.eventName === 'pull_request' && env.prBaseSha && env.headSha) {
    candidates.push({ base: env.prBaseSha, head: env.headSha, strategy: 'pr-base-sha' });
  }

  if (env.eventName === 'push' && env.beforeSha && env.headSha) {
    candidates.push({ base: env.beforeSha, head: env.headSha, strategy: 'push-before-sha' });
  }

  if (env.eventName === 'workflow_dispatch' && env.inputBaseSha && env.headSha) {
    candidates.push({ base: env.inputBaseSha, head: env.headSha, strategy: 'manual-input-base' });
  }

  if (env.baseRef) {
    safeGit('fetch', '--no-tags', '--depth=1', 'origin', env.baseRef);
    const mergeBase = safeGit('merge-base', 'HEAD', `origin/${env.baseRef}`);
    if (mergeBase && env.headSha) {
      candidates.push({ base: mergeBase, head: env.headSha, strategy: 'merge-base-origin-ref' });
    }
  }

  const previous = safeGit('rev-parse', 'HEAD^');
  if (previous && env.headSha) {
    candidates.push({ base: previous, head: env.headSha, strategy: 'head-parent-fallback' });
  }

  for (const candidate of candidates) {
    if (commitExists(candidate.base) && commitExists(candidate.head)) {
      return {
        resolved: true,
        base: candidate.base,
        head: candidate.head,
        strategy: candidate.strategy,
        fallbackReason: null,
      };
    }
  }

  return {
    resolved: false,
    base: null,
    head: env.headSha || null,
    strategy: null,
    fallbackReason: 'Unable to resolve valid git commit range; using fail-closed deploy intent.',
  };
}

const rules = [
  {
    className: 'frontend',
    rule: 'apps/frontend/**',
    test: (file) => file.startsWith('apps/frontend/'),
  },
  {
    className: 'backend',
    rule: 'apps/backend/**',
    test: (file) => file.startsWith('apps/backend/'),
  },
  {
    className: 'shared',
    rule: 'packages/shared-types/**',
    test: (file) => file.startsWith('packages/shared-types/'),
  },
  {
    className: 'backend',
    rule: 'packages/database/**',
    test: (file) => file.startsWith('packages/database/'),
  },
  {
    className: 'shared',
    rule: 'workspace-toolchain',
    test: (file) =>
      file === 'package.json' ||
      file === 'bun.lock' ||
      file === 'bun.lockb' ||
      file === 'pnpm-lock.yaml' ||
      file === 'turbo.json' ||
      file.startsWith('tsconfig') ||
      file.startsWith('.github/workflows/'),
  },
  {
    className: 'none',
    rule: 'docs-only',
    test: (file) => file.startsWith('docs/') || /\.mdx?$/i.test(file),
  },
  {
    className: 'shared',
    rule: 'fallback-unmapped',
    test: () => true,
  },
];

export function classifyFile(file) {
  const matchedRule = rules.find((rule) => rule.test(file));
  return {
    file,
    className: matchedRule.className,
    rule: matchedRule.rule,
  };
}

function setOutput(outputPath, name, value) {
  if (!outputPath) {
    return;
  }

  appendFileSync(outputPath, `${name}=${value}\n`, 'utf8');
}

function asJson(value) {
  return JSON.stringify(value);
}

export function computeImpacts(options = {}) {
  const env = getEnv(options.env);
  const deployMode = resolveDeployMode(env);
  const range = options.range ?? resolveRange(env);
  const providedChangedFiles = Array.isArray(options.changedFiles) ? options.changedFiles : null;

  let changedFiles = [];
  let classifications = [];

  if (range.resolved) {
    if (providedChangedFiles) {
      changedFiles = providedChangedFiles.filter(Boolean);
    } else {
      const diff = runGit('diff', '--name-only', `${range.base}..${range.head}`);
      changedFiles = diff ? diff.split('\n').filter(Boolean) : [];
    }
    classifications = changedFiles.map(classifyFile);
  }

  const impactCounts = Object.fromEntries(CLASS_KEYS.map((key) => [key, 0]));
  for (const item of classifications) {
    impactCounts[item.className] += 1;
  }

  const impactClasses = new Set(classifications.map((item) => item.className));
  if (impactClasses.size === 0) {
    impactClasses.add('none');
    impactCounts.none += 1;
  }

  const hasShared = impactClasses.has('shared');
  const deployFrontend = range.resolved && (hasShared || impactClasses.has('frontend'));
  const deployBackend = range.resolved && (hasShared || impactClasses.has('backend'));
  const impactFrontend = impactClasses.has('frontend');
  const impactBackend = impactClasses.has('backend');
  const impactShared = impactClasses.has('shared');
  const impactNone = impactClasses.has('none');

  const summary = {
    eventName: env.eventName,
    refName: env.refName,
    deployMode,
    range,
    changedFilesCount: changedFiles.length,
    changedFiles: changedFiles.slice(0, 250),
    changedFilesTruncated: changedFiles.length > 250,
    matchedRules: classifications,
    impactCounts,
    impactClasses: [...impactClasses].sort(),
    deployIntent: {
      frontend: deployFrontend,
      backend: deployBackend,
    },
    impactFlags: {
      frontend: impactFrontend,
      backend: impactBackend,
      shared: impactShared,
      none: impactNone,
    },
  };

  return {
    summary,
    outputs: {
      deploy_frontend: String(deployFrontend),
      deploy_backend: String(deployBackend),
      deploy_mode: deployMode,
      impact_frontend: String(impactFrontend),
      impact_backend: String(impactBackend),
      impact_shared: String(impactShared),
      impact_none: String(impactNone),
      impact_classes: [...impactClasses].sort().join(','),
      impact_summary: asJson(summary),
    },
  };
}

function main() {
  const env = getEnv();
  const result = computeImpacts({ env });

  for (const [name, value] of Object.entries(result.outputs)) {
    setOutput(env.outputPath, name, value);
  }

  process.stdout.write(`${result.outputs.impact_summary}\n`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
