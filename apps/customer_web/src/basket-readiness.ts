export type BasketReadinessDecision = {
  ready: boolean;
  reason: string;
};

type BasketIntelligenceLike = {
  items?: unknown;
  summary?: {
    itemCount?: unknown;
  };
};

export function evaluateBasketReadiness(
  readiness: BasketIntelligenceLike | null | undefined,
): BasketReadinessDecision {
  if (!readiness || !Array.isArray(readiness.items) || readiness.items.length === 0) {
    return {
      ready: false,
      reason: 'Basket readiness could not be verified.',
    };
  }

  if (
    readiness.summary &&
    readiness.summary.itemCount !== undefined &&
    (
      !Number.isInteger(Number(readiness.summary.itemCount)) ||
      Number(readiness.summary.itemCount) !== readiness.items.length
    )
  ) {
    return {
      ready: false,
      reason: 'Basket readiness response is inconsistent.',
    };
  }

  const blockingItem = readiness.items.find((item: any) =>
    !item ||
    typeof item !== 'object' ||
    item.status !== 'healthy' ||
    item.issue !== null,
  ) as { issue?: unknown } | undefined;

  if (blockingItem) {
    return {
      ready: false,
      reason:
        typeof blockingItem.issue === 'string' && blockingItem.issue.trim()
          ? blockingItem.issue
          : 'Your basket has availability issues. Review Basket Intelligence before placing the order.',
    };
  }

  return {
    ready: true,
    reason: 'Basket is ready for checkout.',
  };
}
