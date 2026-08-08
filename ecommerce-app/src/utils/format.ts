/**
 * Formats a number as an Indian Rupee amount, e.g. formatCurrency(12345) -> "₹12,345".
 * Centralizing this avoids each page picking a different (and sometimes locale-inconsistent)
 * way to render prices.
 */
export function formatCurrency(amount: number | null | undefined): string {
  const value = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;
  return `₹${value.toLocaleString('en-IN')}`;
}
