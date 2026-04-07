#!/bin/bash

# DEPRECATED: Legacy Vercel Ignore Build Script
#
# Deploy selection is now owned by GitHub Actions:
# - .github/workflows/cd.yml
# - scripts/ci/compute-impacts.mjs
#
# This script intentionally returns "proceed" to avoid split ownership
# and should not be used as a deploy decision source.
#
# Usage: ./scripts/vercel-ignore-build.sh [project-name]
# Returns: 1 = proceed with build

PROJECT=$1

echo "[DEPRECATED] scripts/vercel-ignore-build.sh ($PROJECT)"
echo "[DEPRECATED] Selective deploy source of truth is GitHub Actions (cd.yml + compute-impacts.mjs)."
echo "[DEPRECATED] Returning proceed (exit 1) to avoid dashboard-level deploy gating drift."

exit 1
