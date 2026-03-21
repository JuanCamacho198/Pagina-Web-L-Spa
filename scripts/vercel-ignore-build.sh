#!/bin/bash

# Vercel Ignore Build Script
# Usage: ./scripts/vercel-ignore-build.sh [project-name]
# Returns: 0 = cancel build, 1 = proceed with build

PROJECT=$1

# Get the commit range from Vercel env or use git defaults
if [ -n "$VERCEL_GIT_COMMIT_REF" ]; then
  COMMIT_RANGE="$VERCEL_GIT_PREVIOUS_SHA..$VERCEL_GIT_COMMIT_SHA"
else
  COMMIT_RANGE="HEAD^..HEAD"
fi

case $PROJECT in
  frontend)
    # Frontend only changes
    if git diff --quiet $COMMIT_RANGE -- 'apps/frontend/**'; then
      echo "No changes in frontend, canceling build."
      exit 0
    fi
    echo "Changes detected in frontend, proceeding with build."
    exit 1
    ;;
  backend)
    # Backend + packages (shared code)
    if git diff --quiet $COMMIT_RANGE -- 'apps/backend/**' 'packages/**'; then
      echo "No changes in backend or packages, canceling build."
      exit 0
    fi
    echo "Changes detected in backend/packages, proceeding with build."
    exit 1
    ;;
  *)
    echo "Unknown project: $PROJECT"
    exit 1
    ;;
esac
