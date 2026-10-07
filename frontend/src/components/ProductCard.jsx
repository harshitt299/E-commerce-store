import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  const img = product.images?.[0] || "https://via.placeholder.com/300x180?text=No+Image";
  return (
    <Link to={`/products/${product._id}`} style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        textDecoration: "none",
        color: "inherit",
      }}>
         <img
        src={img}
        alt={product.name}
        style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 6 }}
         />
        <h3 style={{ margin: "8px 0 4px" }}>{product.name}</h3>
        <p style={{ margin: 0, fontSize: 13, color: "#666" }}>{product.brand} • {product.category}</p>
        <p style={{ margin: "4px 0", fontWeight: 700 }}>₹ {product.price}</p>
        <p style={{ margin: 0, fontSize: 13 }}>⭐ {product.ratings?.average ?? 0} ({product.ratings?.count ?? 0})</p>
        {product.stock <= 0 && <p style={{ color: "red" }}>Out of stock</p>}

    </Link>
  )
}

export default ProductCard;
