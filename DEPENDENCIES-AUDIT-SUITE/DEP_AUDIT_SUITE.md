<!-- PRESERVATION RULE: Never delete or replace content. Append or annotate only. -->
# Arteria Dependency Audit Suite

## Overview
This document outlines the standard operating procedure (SOP) for conducting dependency security audits and updates for the Arteria project.

The process ensures that:
- AI Agents and Engineers follow a standardized vulnerability check.
- Logs are strictly maintained with timestamps.
- Zero-day or high-severity vulnerabilities are patched promptly.
- The `DOCU/SBOM.md` is updated accurately.

## 1. Triggering an Audit
An audit is triggered by running the root-level script:
```bat
Audit_Deps.bat
```

**What it does:**
1. Runs `npm audit` to capture known security vulnerabilities across the workspace.
2. Runs `npm outdated` to capture semantic version drift.
3. Outputs the exact results to `DOCU/debugs/npm_audit_latest.log` and `DOCU/debugs/npm_outdated_latest.log`.

## 2. Reviewing Logs
**For Engineers & AI Agents:**
After execution, immediately inspect:
- `DOCU/debugs/npm_audit_latest.log`: Look for any `high` or `critical` severity reports.
- `DOCU/debugs/npm_outdated_latest.log`: Look for major version discrepancies (e.g., React Native or Expo framework drifts).

## 3. Resolving Vulnerabilities
If vulnerabilities are found:
1. Run `npm audit fix` or `npm audit fix --force` as appropriate.
2. If forced fixes are required, ensure unit tests run successfully afterward:
   ```bash
   npm run test
   ```
3. Record the explicit packages fixed in standard commit/changelog locations.

## 4. Documentation Upkeep
**MANDATORY:** You must update `DOCU/SBOM.md` when dependencies are bumped or fixed.
1. Update the **Verification Update** section at the top of `SBOM.md` with the current date.
2. Note any prominent fixes (e.g., "Patched 2 high severity vulnerabilities in svgo and flatted").
3. Update the package table rows to reflect any version bumps that occurred during the `npm audit fix`.

## 5. Artifacts & Logging
By default, the `.bat` file handles timestamped logging through OS variables. Ensure these logs remain untouched until the next audit overwrites them. DO NOT delete historical `debugs/` manually unless instructed.
