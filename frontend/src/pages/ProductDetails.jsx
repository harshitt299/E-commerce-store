import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById } from "../services/productService";
import { addToCart } from "../services/cartService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");

  useEffect(() => {
    const fetchOne = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getProductById(id);
        setProduct(res.product || res);
        setSelectedImg(0);
        setQty(1);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchOne();
  }, [id]);

  if (loading)
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-lg bg-stone-200" />
          <div className="space-y-3">
            <div className="h-6 w-2/3 animate-pulse rounded bg-stone-200" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
            <div className="h-20 animate-pulse rounded bg-stone-200" />
          </div>
        </div>
      </div>
    );
  if (error) return <p className="mx-auto max-w-7xl px-4 py-10 text-sm text-red-700">{error}</p>;
  if (!product) return <p className="mx-auto max-w-7xl px-4 py-10 text-sm">Product not found</p>;

  const imgs = product.images?.length ? product.images : [];
  const out = (product.stock ?? 0) <= 0;

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addToCart(id, qty);
      navigate("/cart");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else alert(err.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  const checkPin = (e) => {
    e.preventDefault();
    if (/^\d{6}$/.test(pin)) setPinMsg(`Delivery to ${pin} in 3–5 days. COD available.`);
    else setPinMsg("Enter a valid 6-digit pincode.");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <p className="text-xs text-stone-500">
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        <Link to="/products" className="hover:underline">Products</Link> /{" "}
        <span className="text-stone-900">{product.name}</span>
      </p>

      <div className="mt-4 grid gap-8 md:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
            {imgs.length > 0 ? (
              <img src={imgs[selectedImg]} alt={product.name} className="aspect-square w-full object-cover" />
            ) : (
              <div className="flex aspect-square items-center justify-center text-sm text-stone-400">No image</div>
            )}
          </div>
          {imgs.length > 1 && (
            <div className="mt-3 flex gap-2">
              {imgs.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImg(i)}
                  className={`overflow-hidden rounded-md border ${i === selectedImg ? "border-stone-900" : "border-stone-200"}`}
                >
                  <img src={src} alt="" className="h-16 w-16 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
            {product.brand || product.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-stone-900">{product.name}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm">
            <span className="rounded bg-green-700 px-1.5 py-0.5 font-semibold text-white">
              {(product.ratings?.average ?? 0).toFixed ? Number(product.ratings?.average ?? 0).toFixed(1) : product.ratings?.average} ★
            </span>
            <span className="text-stone-500">{product.ratings?.count ?? 0} ratings</span>
          </p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-stone-900">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-stone-500">Inclusive of all taxes</p>
          <p className={`mt-3 text-sm font-semibold ${out ? "text-red-700" : "text-green-700"}`}>
            {out ? "Out of stock" : `In stock${product.stock ? ` — ${product.stock} left` : ""}`}
          </p>

          <p className="mt-4 text-sm leading-6 text-stone-600">{product.description}</p>

          {!out && (
            <div className="mt-5 flex items-center gap-3">
              <div className="flex items-center rounded-md border border-stone-300">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 text-lg text-stone-600 hover:text-stone-900">−</button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock || 10, q + 1))} className="px-3 py-2 text-lg text-stone-600 hover:text-stone-900">+</button>
              </div>
              <button
                disabled={adding}
                onClick={handleAdd}
                className="flex-1 rounded-md bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-50"
              >
                {adding ? "Adding…" : "Add to cart"}
              </button>
            </div>
          )}

          <form onSubmit={checkPin} className="mt-5 rounded-lg border border-stone-200 bg-white p-3">
            <p className="text-xs font-semibold text-stone-900">Delivery</p>
            <div className="mt-2 flex gap-2">
              <input
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Pincode"
                inputMode="numeric"
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
              />
              <button className="shrink-0 rounded-md border border-stone-900 px-3 py-2 text-sm font-medium">Check</button>
            </div>
            {pinMsg && <p className="mt-2 text-xs text-stone-600">{pinMsg}</p>}
          </form>

          <dl className="mt-5 divide-y divide-stone-100 rounded-lg border border-stone-200 bg-white text-sm">
            {[
              ["Brand", product.brand || "—"],
              ["Category", product.category || "—"],
              ["Stock", String(product.stock ?? "—")],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between px-4 py-2.5">
                <dt className="text-stone-500">{k}</dt>
                <dd className="font-medium text-stone-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
