// Utilities for safely measuring SVG geometry.
//
// `getBBox()` returns an empty box (all zeros) whenever the measured element
// lives inside a `display: none` subtree — for example a closed Bubble Card
// pop-up. Baking such a box into a `viewBox` makes the text collapse to zero
// size and it never recovers until the next data change happens while visible.
// These helpers refuse to return a degenerate measurement and provide a small
// one-shot observer to re-run scaling once the element becomes visible again.

/**
 * Returns the bounding box of an SVG element, but only when it is actually
 * rendered. If the element is detached or lives inside a `display: none`
 * subtree, `getBBox()` yields an empty box; in that case `null` is returned so
 * callers can defer instead of persisting a broken measurement.
 */
export function getRenderedBBox(
  element: SVGGraphicsElement | null | undefined
): DOMRect | null {
  if (!element || !element.isConnected) return null;

  const box = element.getBBox();
  if (box.width === 0 && box.height === 0) return null;

  return box;
}

/**
 * One-shot helper that runs `callback` the first time an observed element gains
 * a non-zero box (i.e. transitions from `display: none` to visible). It then
 * disconnects itself. Re-arming happens automatically on the next deferral.
 */
export class RescaleOnVisible {
  private observer?: ResizeObserver;

  constructor(private readonly callback: () => void) {}

  /** Start watching `target`. No-op if already watching. */
  public observe(target: Element): void {
    if (this.observer) return;

    this.observer = new ResizeObserver((entries) => {
      const hasSize = entries.some(
        (entry) => entry.contentRect.width > 0 && entry.contentRect.height > 0
      );
      if (!hasSize) return;

      this.disconnect();
      this.callback();
    });
    this.observer.observe(target);
  }

  /** Stop watching and release the observer. Safe to call repeatedly. */
  public disconnect(): void {
    this.observer?.disconnect();
    this.observer = undefined;
  }
}
