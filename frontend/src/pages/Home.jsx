import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

const CATS = ["electronics", "fashion", "home", "books", "sports"];

function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts({ page: 1, limit: 8 })
      .then((r) => setFeatured(r.products || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* utility strip */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-5 overflow-x-auto px-4 py-2.5 text-sm text-stone-600">
          {CATS.map((c) => (
            <Link key={c} to={`/products?category=${c}`} className="whitespace-nowrap capitalize hover:text-stone-900 hover:underline">
              {c}
            </Link>
          ))}
          <Link to="/products" className="ml-auto hidden shrink-0 whitespace-nowrap font-medium text-stone-900 hover:underline sm:block">
            View all →
          </Link>
        </div>
      </div>

      {/* hero — plain merchandising banner, no gradient blobs */}
      <section className="border-b border-stone-200 bg-[#f1ede6]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              New season collection
            </p>
            <h1 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-stone-900 md:text-[40px] md:leading-[1.1]">
              Everyday prices on brands you already buy.
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-6 text-stone-600">
              Electronics, fashion and home essentials with 7-day returns and cash on delivery.
            </p>
            <div className="mt-6 flex gap-3">
              <Link
                to="/products"
                className="rounded-md bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
              >
                Shop products
              </Link>
              <Link
                to="/products?category=electronics"
                className="rounded-md border border-stone-400 bg-transparent px-5 py-2.5 text-sm font-semibold text-stone-900 hover:border-stone-900"
              >
                Electronics
              </Link>
            </div>
            <div className="mt-6 flex gap-6 text-xs text-stone-500">
              <span>✓ 7-day returns</span>
              <span>✓ COD available</span>
              <span>✓ Secure payments</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-3">
              {featured.slice(0, 4).map((p) => (
                <Link key={p._id} to={`/products/${p._id}`} className="overflow-hidden rounded-lg border border-stone-200 bg-white">
                  <img src={p.images?.[0]} alt={p.name} className="aspect-square w-full object-cover" loading="lazy" />
                  <div className="p-2">
                    <p className="truncate text-xs font-medium text-stone-900">{p.name}</p>
                    <p className="text-xs font-bold text-stone-900">₹{Number(p.price).toLocaleString("en-IN")}</p>
                  </div>
                </Link>
              ))}
              {loading && <p className="col-span-2 py-10 text-center text-sm text-stone-400">Loading picks…</p>}
            </div>
          </div>
        </div>
      </section>

      {/* featured grid */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-stone-900">Featured this week</h2>
            <p className="mt-1 text-sm text-stone-500">Pulled live from the catalogue — not hardcoded.</p>
          </div>
          <Link to="/products" className="text-sm font-medium text-stone-900 underline underline-offset-4">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-stone-200" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
            <p className="text-sm font-medium text-stone-900">No products yet</p>
            <p className="mt-1 text-sm text-stone-500">Add products from the backend to see them here.</p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* service promises */}
      <section className="border-t border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:grid-cols-3">
          {[
            ["Cash on delivery", "Pay at your doorstep. No advance needed."],
            ["7-day returns", "Changed your mind? Easy doorstep pickup."],
            ["Secure checkout", "UPI, cards and netbanking via Razorpay."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-lg border border-stone-200 p-4">
              <p className="text-sm font-bold text-stone-900">{t}</p>
              <p className="mt-1 text-sm text-stone-500">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
