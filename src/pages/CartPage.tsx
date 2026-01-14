import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProductById } from "../api/products";

type ProductLite = {
  id: number;
  title: string;
  brand?: string;
  category?: string;
  thumbnail?: string;
  price: number;
};

function loadIds(key: string): number[] {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function saveIds(key: string, ids: number[]) {
  localStorage.setItem(key, JSON.stringify(ids));
}

export default function CartPage() {
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [items, setItems] = useState<ProductLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Load cart IDs on first render
  useEffect(() => {
    setCartIds(loadIds("cart_ids"));
  }, []);

  // Fetch product details whenever cart IDs change
  useEffect(() => {
    async function run() {
      setLoading(true);
      setErr(null);

      try {
        if (cartIds.length === 0) {
          setItems([]);
          return;
        }

        const data = await Promise.all(cartIds.map((id) => fetchProductById(id)));
        setItems(data);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed to load cart.");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [cartIds]);

  function removeFromCart(id: number) {
    const next = cartIds.filter((x) => x !== id);
    setCartIds(next);
    saveIds("cart_ids", next);
  }

  function clearCart() {
    setCartIds([]);
    saveIds("cart_ids", []);
  }

  const total = useMemo(() => {
    return items.reduce((sum, p) => sum + (p.price ?? 0), 0);
  }, [items]);

  return (
    <main className="w-full px-6 py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Your Cart</h1>
          <p className="text-sm text-gray-500">
            {cartIds.length} item{cartIds.length === 1 ? "" : "s"}
          </p>
        </div>

        {cartIds.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Clear cart
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-6 rounded-xl border bg-white p-6 text-gray-700">
          Loading cart…
        </div>
      )}

      {err && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && cartIds.length === 0 && (
        <div className="mt-6 rounded-xl border bg-white p-8 text-center">
          <div className="text-lg font-medium">Your cart is empty</div>
          <p className="mt-2 text-sm text-gray-500">
            Browse products and add them to your cart.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Go to homepage
          </Link>
        </div>
      )}

      {!loading && !err && cartIds.length > 0 && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
          {/* Left list */}
          <section className="space-y-4">
            {items.map((p) => (
              <div key={p.id} className="rounded-xl border bg-white p-5">
                <div className="flex gap-4">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="h-24 w-24 rounded-lg object-contain bg-gray-50"
                  />

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-semibold">{p.title}</div>

                        <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-600">
                          {p.brand && (
                            <span className="rounded-full bg-gray-100 px-2 py-1">
                              {p.brand}
                            </span>
                          )}
                          {p.category && (
                            <span className="rounded-full bg-gray-100 px-2 py-1">
                              {p.category}
                            </span>
                          )}
                        </div>

                        
                      </div>

                      {/* ✅ Dummy quantity control (UI only, no logic) */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="flex items-center rounded-lg border">
                            <button
                              type="button"
                              disabled
                              className="px-3 py-1.5 text-lg text-gray-400 cursor-not-allowed"
                            >
                              −
                            </button>

                            <div className="px-4 py-1.5 font-medium">1</div>

                            <button
                              type="button"
                              disabled
                              className="px-3 py-1.5 text-lg text-gray-400 cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-sm text-gray-500">Quantity</span>
                        </div>

                      <div className="text-right">
                        <div className="text-lg font-semibold">€ {p.price}</div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(p.id)}
                          className="mt-2 text-sm font-medium text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <Link
                        to="/product"
                        state={{ product: p }}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Right summary */}
          <aside className="rounded-xl border bg-white p-6 h-fit lg:sticky lg:top-20">
            <div className="text-lg font-semibold">Order summary</div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">€ {total.toFixed(2)}</span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="mt-4 border-t pt-4 flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="text-xl font-semibold">€ {total.toFixed(2)}</span>
            </div>

            <button
              className="mt-5 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              type="button"
            >
              Checkout
            </button>

            <p className="mt-3 text-xs text-gray-500">
              Checkout is a demo button for now.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
