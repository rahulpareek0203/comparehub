export async function getProductSummary(productId: string | number) {
  const r = await fetch(`http://localhost:3001/api/products/${productId}/ai-summary`);
  if (!r.ok) throw new Error("No summary yet");
  return r.json();
}

export async function generateProductSummary(productId: string | number) {
  const r = await fetch(`http://localhost:3001/api/products/${productId}/ai-summary`, {
    method: "POST",
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data?.error || "Failed to generate");
  return data;
}