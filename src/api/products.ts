import type { ProductsResponse } from "../types/products";

export async function fetchProducts() : Promise<ProductsResponse> {
    const result  = await fetch(`https://dummyjson.com/products`)

    if (!result.ok) {
        throw new Error(`Failed to fetch products: ${result.status}`);
    }

    return result.json()
}

export async function saveProductsIntoDB() {
    const result = await fetch("http://localhost:3001/api/seed", {method: "POST",});
    return result.json()
}

const API_BASE_URL = "http://localhost:3001";

export async function fetchProductById(id: number) {
  const res = await fetch(`${API_BASE_URL}/api/products/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);

  const data = await res.json();
  return data.product; // ✅ important
}
