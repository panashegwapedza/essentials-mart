/**
 * Architecture-boundary enforcement for the Commerce vertical slice.
 *
 * Encodes the ports-and-adapters layering from ADR-004 (API & Service
 * Architecture) and EIP-027 so that a domain-boundary violation fails CI
 * instead of only being caught in review.
 *
 * Layers (allowed to depend only "inward"):
 *   http          -> application, composition types
 *   composition   -> application, ports, adapters   (the ONLY layer allowed to wire adapters in)
 *   adapters      -> ports, domain
 *   application   -> ports, domain                  (never adapters, never http)
 *   ports/domain  -> nothing else in this service    (framework/infra agnostic)
 */
module.exports = {
  forbidden: [
    {
      name: 'no-domain-to-adapters',
      severity: 'error',
      comment:
        'Domain and application code must not import adapters directly. Route through src/composition (ADR-004, EIP-027).',
      from: { path: '^src/(domain|commerce|buckpay|application)' },
      to: { path: '^src/adapters' },
    },
    {
      name: 'no-domain-to-http',
      severity: 'error',
      comment: 'Domain and application code must not depend on the HTTP transport layer.',
      from: { path: '^src/(domain|commerce|buckpay|application)' },
      to: { path: '^src/http' },
    },
    {
      name: 'no-ports-to-adapters',
      severity: 'error',
      comment: 'Ports define the contract; they must not depend on any concrete adapter implementation.',
      from: { path: '^src/ports' },
      to: { path: '^src/adapters' },
    },
    {
      name: 'no-adapters-to-http',
      severity: 'error',
      comment: 'Adapters are infrastructure implementations of ports; they must not reach into the HTTP layer.',
      from: { path: '^src/adapters' },
      to: { path: '^src/http' },
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies indicate a boundary that has not actually been separated.',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Orphan modules are usually dead code left behind after a refactor.',
      from: { orphan: true },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: { exportsFields: ['exports'], conditionNames: ['import', 'require', 'node', 'default'] },
    reporterOptions: {
      text: { highlightFocused: true },
    },
  },
};
