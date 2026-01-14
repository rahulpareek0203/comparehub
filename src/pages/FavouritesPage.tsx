import { useEffect, useState } from "react";
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

export default function FavouritesPage() {
  const [favIds, setFavIds] = useState<number[]>([]);
  const [items, setItems] = useState<ProductLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setFavIds(loadIds("fav_ids"));
  }, []);

  useEffect(() => {
    async function run() {
      setLoading(true);
      setErr(null);

      try {
        if (favIds.length === 0) {
          setItems([]);
          return;
        }
        const data = await Promise.all(favIds.map((id) => fetchProductById(id)));
        setItems(data);
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Failed to load favourites.");
      } finally {
        setLoading(false);
      }
    }
    run();
  }, [favIds]);

  function removeFav(id: number) {
    const next = favIds.filter((x) => x !== id);
    setFavIds(next);
    saveIds("fav_ids", next);
  }

  function clearFavs() {
    setFavIds([]);
    saveIds("fav_ids", []);
  }

  return (
    <main className="w-full px-6 py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Favourites</h1>
          <p className="text-sm text-gray-500">
            {favIds.length} saved item{favIds.length === 1 ? "" : "s"}
          </p>
        </div>

        {favIds.length > 0 && (
          <button
            onClick={clearFavs}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Clear favourites
          </button>
        )}
      </div>

      {loading && (
        <div className="mt-6 rounded-xl border bg-white p-6 text-gray-700">
          Loading favourites…
        </div>
      )}

      {err && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {err}
        </div>
      )}

      {!loading && !err && favIds.length === 0 && (
        <div className="mt-6 rounded-xl border bg-white p-8 text-center">
          <div className="text-lg font-medium">No favourites yet</div>
          <p className="mt-2 text-sm text-gray-500">
            Tap “Add to Favourite” on any product to save it here.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Browse products
          </Link>
        </div>
      )}

      {!loading && !err && favIds.length > 0 && (
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white p-5">
              <img
                src={p.thumbnail}
                alt={p.title}
                className="h-40 w-full rounded-lg object-contain bg-gray-50"
              />

              <div className="mt-4">
                <div className="font-semibold">{p.title}</div>

                <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600">
                  {p.brand && <span className="rounded-full bg-gray-100 px-2 py-1">{p.brand}</span>}
                  {p.category && <span className="rounded-full bg-gray-100 px-2 py-1">{p.category}</span>}
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-lg font-semibold">€ {p.price}</div>
                  <button
                    onClick={() => removeFav(p.id)}
                    className="text-sm font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
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
          ))}
        </section>
      )}
    </main>
  );
}
