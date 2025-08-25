export function calculateTotal(subtotal: number, taxRate: number = 0.08): number {
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return Math.round(total * 100) / 100;
}

export function validateTotal(actualTotal: number, expectedTotal: number, tolerance: number = 0.01): boolean {
  return Math.abs(actualTotal - expectedTotal) <= tolerance;
} 