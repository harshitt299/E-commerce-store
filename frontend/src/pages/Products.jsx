import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

const CATS = ["", "electronics", "fashion", "home", "books", "sports"];

function Products() {
  const [params, setParams] = useSearchParams();
  const urlSearch = params.get("search") || "";
  const urlCat = params.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [search, setSearch] = useState(urlSearch);
  const [cat, setCat] = useState(urlCat);
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    setSearchInput(urlSearch);
    setSearch(urlSearch);
    setCat(urlCat);
    setPage(1);
  }, [urlSearch, urlCat]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAllProducts({
          page,
          limit: 12,
          search: search || undefined,
          category: cat || undefined,
          maxPrice: maxPrice || undefined,
        });
        setProducts(response.products || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        setError(err.response?.data?.message || "No product found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [page, search, cat, maxPrice]);

  const pickCat = (c) => {
    const next = new URLSearchParams(params);
    if (c) next.set("category", c);
    else next.delete("category");
    setParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-stone-900">
            {cat ? `${cat[0].toUpperCase()}${cat.slice(1)}` : "All products"}
          </h1>
          <p className="mt-0.5 text-sm text-stone-500">
            {search ? `Results for “${search}”` : "Browse the full catalogue"}
          </p>
        </div>
        <input
          placeholder="Search products"
          value={searchInput}
          onChange={(e) => { setPage(1); setSearchInput(e.target.value); }}
          className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm sm:w-64"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <button
            key={c || "all"}
            onClick={() => pickCat(c)}
            className={
              cat === c
                ? "rounded-full bg-stone-900 px-3.5 py-1.5 text-xs font-semibold text-white"
                : "rounded-full border border-stone-300 bg-white px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:border-stone-900 hover:text-stone-900"
            }
          >
            {c ? c[0].toUpperCase() + c.slice(1) : "All"}
          </button>
        ))}
        <select
          value={maxPrice}
          onChange={(e) => { setPage(1); setMaxPrice(e.target.value); }}
          className="ml-auto rounded-md border border-stone-300 bg-white px-2 py-1.5 text-xs text-stone-700"
        >
          <option value="">Any price</option>
          <option value="500">Under ₹500</option>
          <option value="2000">Under ₹2,000</option>
          <option value="10000">Under ₹10,000</option>
        </select>
      </div>

      {loading ? (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg bg-stone-200" />
          ))}
        </div>
      ) : error ? (
        <p className="mt-8 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-stone-300 bg-white p-12 text-center">
          <p className="font-medium text-stone-900">No products found</p>
          <p className="mt-1 text-sm text-stone-500">Try a different search or category.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default Products;
