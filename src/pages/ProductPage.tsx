// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import type { Product } from "../types/products";
// import { getProductSummary, generateProductSummary } from "../api/ai";

// type LocationState = { product: Product };

// export default function ProductPage() {
//   const location = useLocation();

//   const [summary, setSummary] = useState<any | null>(null);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiError, setAiError] = useState<string | null>(null);

//   const product_obj = (location.state as LocationState | null)?.product;

//   // ✅ Guard: if user refreshes / opens directly, state can be missing
//   if (!product_obj) {
//     return (
//       <main className="container">
//         <p>
//           Product data not found. Please go back and open the product from the
//           results page.
//         </p>
//       </main>
//     );
//   }

//   const id = product_obj.id;

//   useEffect(() => {
//     async function loadCachedSummary() {
//       try {
//         setAiError(null);
//         const data = await getProductSummary(id);
//         setSummary(data.summary);
//       } catch {
//         // No cached summary yet is fine
//         setSummary(null);
//       }
//     }

//     loadCachedSummary();
//   }, [id]);

//   async function handleGenerate() {
//     try {
//       setAiLoading(true);
//       setAiError(null);

//       const data = await generateProductSummary(id);
//       setSummary(data.summary);
//     } catch (e) {
//       setAiError(e instanceof Error ? e.message : "Unknown error");
//     } finally {
//       setAiLoading(false);
//     }
//   }

  


//    return (
//     <main className="container">
//       <div className="product_layout">
//         {/* LEFT: Product details */}
//         <section className="product_left">
//           <div className="product_media">
//             <img
//               src={product_obj.thumbnail}
//               alt={product_obj.title}
//               className="product_image"
//             />
//           </div>

//           <div className="product_info">
//             <h1 className="product_title">{product_obj.title}</h1>

//             <div className="product_meta">
//               <span className="pill">{product_obj.brand}</span>
//               <span className="pill">{product_obj.category}</span>
//             </div>

//             <div className="product_price">€ {product_obj.price}</div>

//             {/* {product_obj.description && (
//               <p className="product_desc">{product_obj.description}</p>
//             )} */}
//           </div>
//         </section>

//         {/* RIGHT: AI Summary panel */}
//         <aside className="product_right">
//           <div className="ai_panel">
//             <div className="ai_header">
//               <h3 className="ai_title">AI Summary</h3>
//               <div className="ai_subtitle">
//                 Quick highlights for this product
//               </div>
//             </div>

//             {!summary && (
//               <button
//                 className="ai_button"
//                 type="button"
//                 onClick={handleGenerate}
//                 disabled={aiLoading}
//               >
//                 {aiLoading ? "Generating..." : "Generate summary"}
//               </button>
//             )}

//             {aiError && <div className="ai_error">{aiError}</div>}

//             {summary && (
//               <div className="ai_output">
//                 {/* BART text summary format */}
//                 {summary.text && <p className="ai_text">{summary.text}</p>}

//                 {/* Structured JSON format */}
//                 {summary.one_liner && (
//                   <>
//                     <p className="ai_text">
//                       <b>{summary.one_liner}</b>
//                     </p>

//                     <div className="ai_block">
//                       <div className="ai_block_title">Pros</div>
//                       <ul className="ai_list">
//                         {summary.pros?.map((x: string, i: number) => (
//                           <li key={i}>{x}</li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div className="ai_block">
//                       <div className="ai_block_title">Cons</div>
//                       <ul className="ai_list">
//                         {summary.cons?.map((x: string, i: number) => (
//                           <li key={i}>{x}</li>
//                         ))}
//                       </ul>
//                     </div>

//                     <div className="ai_block">
//                       <div className="ai_block_title">Best for</div>
//                       <ul className="ai_list">
//                         {summary.best_for?.map((x: string, i: number) => (
//                           <li key={i}>{x}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   </>
//                 )}
//               </div>
//             )}

//             {summary && (
//               <button
//                 className="ai_button_secondary"
//                 type="button"
//                 onClick={handleGenerate}
//                 disabled={aiLoading}
//               >
//                 {aiLoading ? "Regenerating..." : "Regenerate"}
//               </button>
//             )}
//           </div>
//         </aside>
//       </div>
//     </main>
//   );
// }

import "../styles/globals.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import type { Product } from "../types/products";
import { getProductSummary, generateProductSummary } from "../api/ai";

type LocationState = { product: Product };

type Summary = {
  text?: string;
  one_liner?: string;
  pros?: string[];
  cons?: string[];
  best_for?: string[];
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function loadCartIds() {
    const raw = localStorage.getItem("cart_ids")
    return raw? JSON.parse(raw) : [];
}
function loadFavIds() {
    const raw = localStorage.getItem("fav_ids")
    return raw? JSON.parse(raw) : [];
}
function saveCartIds(ids: number[]) {
    localStorage.setItem("cart_ids", JSON.stringify(ids))
}
function saveFavIds(ids: number[]) {
  localStorage.setItem("fav_ids", JSON.stringify(ids));
}


export default function Home() {
    const location = useLocation();

    const [summary, setSummary] = useState<Summary | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const [cartIds, setCartIds] = useState<number[]>([])
    const [favIds, setFavIds] = useState<number[]>([])

    const product_fetched = (location.state as LocationState | null)?.product;

    if (!product_fetched) {
        return (
        <main className="max-w-3xl mx-auto p-6">
            <p className="text-gray-700">
                Product data not found. Please go back and open the product from the
                results page.
            </p>
        </main>
        );
    }

    const id = product_fetched.id;

    useEffect(() => {
            async function loadCachedSummary() {
            try {
                setAiError(null);
                const data = await getProductSummary(id);
                setSummary(data.summary);
            } catch {
                setSummary(null);
            }
            }

            loadCachedSummary();
    }, [id]);

    useEffect(() => {

        setCartIds(loadCartIds())
        setFavIds(loadFavIds())
    }, [])

    function handleAddtoCart() {
        
        const product_id = product_fetched.id

        if(!cartIds.includes(id)){
            // const updated_ids = setCartIds(...cartIds, id)

            const next = [...cartIds, id];
            console.log("cartids", next)
            setCartIds(next);
            saveCartIds(next);
        }
    }

    function handleToggleFav() {
        
        const product_id = product_fetched.id

        const next = favIds.includes(id)?
                        favIds.filter((id) => id !== product_id):
                         [...favIds, id]

        setFavIds(next);
        saveFavIds(next);
    }

    async function handleGenerate() {
        try {
        setAiLoading(true);
        setAiError(null);

        const data = await generateProductSummary(id);
        setSummary(data.summary);
        } catch (e) {
        setAiError(e instanceof Error ? e.message : "Unknown error");
        } finally {
        setAiLoading(false);
        }
    }

  // ----- Reviews + stats -----
  const reviews = (product_fetched as any).reviews ?? [];
  const totalReviews = reviews.length;

  // average from reviews array (fallback to product_fetched.rating if no reviews)
  const avgFromReviews =
    totalReviews > 0
      ? reviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 0), 0) / totalReviews
      : Number(product_fetched.rating) || 0;

  const roundedAvg = Math.round(avgFromReviews);

  // counts per rating (1..5)
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const r of reviews) {
    const v = Math.round(Number(r.rating) || 0);
    const clamped = Math.min(5, Math.max(1, v));
    ratingCounts[clamped] += 1;
  }

  // helper for bar width
  const pct = (count: number) => (totalReviews === 0 ? 0 : Math.round((count / totalReviews) * 100));

  return (
    <main className="w-full px-6 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
        {/* LEFT: PRODUCT DETAILS */}
        <section className="bg-white rounded-xl border p-6">
          {/* Top product row */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex justify-center lg:justify-start">
              <img
                src={product_fetched.thumbnail}
                alt={product_fetched.title}
                className="w-64 h-64 object-contain"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-semibold">{product_fetched.title}</h1>

              {/* ⭐ Rating under title (rounded) */}
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      viewBox="0 0 24 24"
                      className={`h-5 w-5 ${i < roundedAvg ? "fill-yellow-500" : "fill-gray-300"}`}
                    >
                      <path d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.76 1.64 7.03z" />
                    </svg>
                  ))}
                </div>

                <span className="text-sm text-gray-700 font-medium">{roundedAvg}/5</span>
                <span className="text-sm text-gray-500">({totalReviews} reviews)</span>
              </div>

              {/* Pills */}
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
                  {product_fetched.brand}
                </span>
                <span className="px-3 py-1 text-sm rounded-full bg-gray-100">
                  {product_fetched.category}
                </span>
              </div>

              {/* Price */}
              <div className="mt-4 text-3xl font-bold">€ {product_fetched.price}</div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                    {/* Add to Cart */}
                    <button
                        type="button"
                        className="flex-1 rounded-lg px-6 py-3 text-white font-medium bg-orange-600 text-white hover:bg-orange-700"
                        onClick = {handleAddtoCart}
                    >
                        {cartIds.includes(product_fetched.id)? "Added to Cart ✓": "Add to Cart" }
                    </button>

                    {/* Add to Favourite */}
                    <button
                        type="button"
                        className="flex-1 rounded-lg border px-6 py-3 font-medium text-gray-800 bg-blue-600 text-white hover:bg-blue-700"
                        onClick = {handleToggleFav}
                    >
                        {favIds.includes(product_fetched.id) ? "♥ Saved" : "♡ Add to Favourite"}
                    </button>
             </div>

            </div>
          </div>

          {/* Reviews + Stats */}
          <div className="mt-8 border-t pt-6">
            <h2 className="text-lg font-semibold">Reviews</h2>

            {/* ✅ Stats block ABOVE reviews */}
            <div className="mt-4 rounded-xl border bg-gray-50 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="text-sm text-gray-500">Total reviews</div>
                  <div className="text-2xl font-semibold">{totalReviews}</div>
                </div>

                <div className="sm:text-right">
                  <div className="text-sm text-gray-500">Average rating</div>
                  <div className="flex sm:justify-end items-center gap-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          viewBox="0 0 24 24"
                          className={`h-4 w-4 ${i < roundedAvg ? "fill-yellow-500" : "fill-gray-300"}`}
                        >
                          <path d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.76 1.64 7.03z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{roundedAvg}/5</span>
                  </div>
                </div>
              </div>

              {/* Rating distribution */}
              <div className="mt-4 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = ratingCounts[star] ?? 0;
                  const percent = pct(count);

                  return (
                    <div key={star} className="grid grid-cols-[52px_1fr_44px] items-center gap-3">
                      <div className="text-sm text-gray-600">{star} ★</div>

                      {/* Bar */}
                      <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full bg-yellow-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="text-sm text-gray-600 text-right">{count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews list */}
            {totalReviews === 0 ? (
              <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
                No reviews available for this product yet.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {reviews.slice(0, 3).map((r: any, idx: number) => {
                  const rRounded = Math.round(Number(r.rating) || 0);
                  const clamped = Math.min(5, Math.max(1, rRounded));

                  return (
                    <div key={idx} className="rounded-xl border p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-medium text-gray-900">{r.reviewerName}</div>
                          <div className="text-xs text-gray-500">
                            {r.date ? formatDate(r.date) : ""}
                          </div>
                        </div>

                        {/* review stars (rounded) */}
                        <div className="flex items-center gap-1 shrink-0">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                              key={i}
                              viewBox="0 0 24 24"
                              className={`h-4 w-4 ${i < clamped ? "fill-yellow-500" : "fill-gray-300"}`}
                            >
                              <path d="M12 17.3l-6.18 3.73 1.64-7.03L2 9.24l7.19-.61L12 2l2.81 6.63 7.19.61-5.46 4.76 1.64 7.03z" />
                            </svg>
                          ))}
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-gray-700">{r.comment}</p>

                      {r.reviewerEmail && (
                        <div className="mt-3 text-xs text-gray-400">{r.reviewerEmail}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT: AI SUMMARY */}
        <aside className="bg-white rounded-xl border p-6 lg:sticky lg:top-6 h-fit">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-semibold">AI Summary</h3>
              <p className="text-sm text-gray-500">Quick highlights for this product</p>
            </div>

            {!summary && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={aiLoading}
                className="w-full rounded-lg bg-black text-white py-2 hover:opacity-90 disabled:opacity-60"
              >
                {aiLoading ? "Generating..." : "Generate summary"}
              </button>
            )}

            {aiError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {aiError}
              </div>
            )}

            {summary && (
              <div className="space-y-5">
                {summary.text && <p className="text-gray-800">{summary.text}</p>}

                {summary.one_liner && (
                  <>
                    <p className="font-medium">{summary.one_liner}</p>

                    <div>
                      <h4 className="font-semibold mb-2">Pros</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {(summary.pros ?? []).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Cons</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {(summary.cons ?? []).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Best for</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {(summary.best_for ?? []).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={aiLoading}
                  className="w-full rounded-lg bg-black text-white py-2 hover:opacity-90 disabled:opacity-60"
                >
                  {aiLoading ? "Regenerating..." : "Regenerate"}
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
