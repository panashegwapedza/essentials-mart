/**
 * Architecture-boundary enforcement for the Commerce vertical slice.
 * ADR-004 / EIP-027: core code must remain independent of adapters and HTTP.
 */
module.exports = {
  forbidden: [
    {
      name: 'no-domain-to-adapters',
      severity: 'error',
      comment: 'Domain/application code must not import adapters directly.',
      from: { path: '^src/(domain|commerce|buckpay|application)' },
      to: { path: '^src/adapters' },
    },
    {
      name: 'no-domain-to-http',
      severity: 'error',
      comment: 'Domain/application code must not depend on HTTP transport.',
      from: { path: '^src/(domain|commerce|buckpay|application)' },
      to: { path: '^src/http' },
    },
    {
      name: 'no-ports-to-adapters',
      severity: 'error',
      comment: 'Ports must not depend on concrete adapters.',
      from: { path: '^src/ports' },
      to: { path: '^src/adapters' },
    },
    {
      name: 'no-adapters-to-http',
      severity: 'error',
      comment: 'Adapters must not depend on the HTTP layer.',
      from: { path: '^src/adapters' },
      to: { path: '^src/http' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies violate service boundaries.',
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
  },
};
