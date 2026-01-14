import { useEffect, useState } from "react";
import type { Product } from "../types/products";
import { fetchProducts } from "../api/products";


export function useProducts() {
    
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        let mounted = true;

        async function loadProducts() {
            
            try {
                setLoading(true);
                setError(null);

                const data = await fetchProducts()
                if(mounted){
                    setProducts(data.products)
                }

            } catch (e) {
                if(mounted){
                    const msg = e instanceof Error ? e.message : "Unknown error";
                    setError(msg); 
                }
            } finally{
                if (mounted) setLoading(false);
            }


        }

        loadProducts();

        // now its time to return the products which we have saved in state

        
    }, [])

    return {products, loading, error}
}