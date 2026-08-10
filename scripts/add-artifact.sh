#!/usr/bin/env bash
# ABOUTME: Vendors a standalone HTML artifact into public/artifact-docs/ with a full document wrap.
# ABOUTME: Usage: scripts/add-artifact.sh <source.html> <slug> "<Title>"
set -euo pipefail
src="${1:?usage: add-artifact.sh <source.html> <slug> \"<Title>\"}"
slug="${2:?missing slug}"
title="${3:?missing title}"
cd "$(dirname "$0")/.."

# Docs MUST live outside the /artifacts route namespace: sirv (vite preview) and any
# static host with extensionless resolution would let /artifacts/<slug>.html shadow the
# /artifacts/<slug> viewer route. Enforced by src/data/artifacts.test.ts.
dest="public/artifact-docs/${slug}.html"
[ -e "$dest" ] && { echo "FAIL: $dest already exists"; exit 1; }

if grep -qi '<!doctype' "$src"; then
  cp "$src" "$dest"
else
  # Artifact-tool HTML is a fragment: no doctype/head/body. Wrap it.
  { printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8" />\n'
    printf '<meta name="viewport" content="width=device-width, initial-scale=1" />\n'
    printf '<title>%s</title>\n' "$title"
    printf '<style>*, *::before, *::after { box-sizing: border-box; } body { margin: 0; }</style>\n'
    printf '</head>\n<body>\n'
    cat "$src"
    printf '\n</body>\n</html>\n'
  } > "$dest"
fi

echo "vendored: $dest"
cat <<EOF

Next, add to src/data/artifacts.ts ARTIFACTS:
  {
    slug: '${slug}',
    title: '${title}',
    project: 'TODO',
    oneLiner: 'TODO',
    published: '$(date +%F)',
    docPath: '/artifact-docs/${slug}.html',
    note: '',
  },

Then: bun run test && bun run test:e2e
EOF
