import { Link } from "react-router-dom";

function stars(avg) {
  if (!avg) return "New";
  return `${avg.toFixed(1)} ★`;
}

function ProductCard({ product }) {
  const img = product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image";
  const out = (product.stock ?? 0) <= 0;
  return (
    <Link
      to={`/products/${product._id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white transition hover:border-stone-300 hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={img}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
        {out && (
          <span className="absolute left-2 top-2 rounded bg-stone-900 px-2 py-0.5 text-[11px] font-semibold text-white">
            Out of stock
          </span>
        )}
        {product.isFeatured && !out && (
          <span className="absolute left-2 top-2 rounded bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
          {product.brand || product.category || "Store"}
        </p>
        <p className="line-clamp-2 text-sm font-medium leading-snug text-stone-900">{product.name}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-500">
          <span className="rounded bg-green-700 px-1.5 py-0.5 font-semibold text-white">
            {stars(product.ratings?.average)}
          </span>
          <span>({product.ratings?.count ?? 0})</span>
        </p>
        <p className="mt-1 text-[15px] font-bold text-stone-900">₹{Number(product.price).toLocaleString("en-IN")}</p>
      </div>
    </Link>
  );
}

export default ProductCard;
