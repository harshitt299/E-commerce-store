import React from 'react'
import { Link } from 'react-router-dom'

function ProductCard({product}) {
  return (
    <Link to={`/products/${product._id}`} style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 12,
        textDecoration: "none",
        color: "inherit",
      }}>
         <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 6 }}
         />
        <h3 style={{ margin: "8px 0 4px" }}>{product.name}</h3>
        <p style={{ margin: 0, fontWeight: 600 }}>₹{product.price}</p>
        <p style={{ margin: 0, fontWeight: 600 }}>₹{product.description}</p>
        <p style={{ margin: 0, fontWeight: 600 }}>₹{product.brand}</p>
        <p style={{ margin: 0, fontWeight: 600 }}>₹{product.category}</p>
        <p style={{ margin: 0, fontWeight: 600 }}>₹{product.rating}</p>

    </Link>
  )
}

export default ProductCard
{Product}