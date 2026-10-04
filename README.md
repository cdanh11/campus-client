# Campus Client

Campus Client is the web frontend for Campus Service, maintained in a separate repository. Backend repository: https://github.com/cdanh11/campus-service. Clone both repositories as sibling folders; each has independent dependencies, commands, tests and CI.

## Status

Phase 7 approved for implementation: React, TypeScript, Vite, Ant Design, React Router and TanStack Query. Repository initialization only; no application feature or test result is claimed yet. See docs/plans/phase-7-frontend.md. Backend Phase 6 is merged at 7d130f4.

## Local layout

```text
D:\Project\
  campus-service\
  campus-client\
```

Node.js 24 LTS is available on the current development host. Installation/build commands will be documented once package.json exists and commands have actually been verified. Secrets and production credentials must never be stored in frontend code or VITE_* variables.
