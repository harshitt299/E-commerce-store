import { useState,useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById} from "../services/productService";
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
    if(loading)return <p>Loading Products..</p>
    if(error)return <p style={{color:"red"}}>{error}</p>;
    if(!product) return <p>Product not Found</p>


  const imgs = product.images?.length ? product.images : [];

  const handleAdd = async () => {
    setAdding(true);
    try {
      await addToCart(id, qty);
      navigate("/cart");
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else alert(err.response?.data?.message || "Add fail");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: 24, padding: 20, flexWrap: "wrap" }}>
      <div style={{ flex: "1 1 300px" }}>
        {imgs.length > 0 && (
          <img
            src={imgs[selectedImg]}
            alt={product.name}
            style={{ width: "100%", maxHeight: 400, objectFit: "contain", border: "1px solid #eee", borderRadius: 8 }}
          />
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {imgs.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${product.name} ${i}`}
              onClick={() => setSelectedImg(i)}
              style={{ width: 60, height: 60, objectFit: "cover", border: i === selectedImg ? "2px solid black" : "1px solid #ccc", cursor: "pointer" }}
            />
          ))}
        </div>
      </div>
      <div style={{ flex: "1 1 300px" }}>
        <h2>{product.name}</h2>
        <p style={{ color: "#666" }}>{product.brand} • {product.category}</p>
        <h3>₹ {product.price}</h3>
        <p>⭐ {product.ratings?.average ?? 0} ({product.ratings?.count ?? 0} reviews)</p>
        <p>{product.description}</p>
        <p style={{ fontWeight: 600, color: product.stock > 0 ? "green" : "red" }}>
          {product.stock > 0 ? `In stock (${product.stock})` : "Out of stock"}
        </p>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
          <span>{qty}</span>
          <button onClick={() => setQty((q) => Math.min(product.stock || 10, q + 1))}>+</button>
        </div>
        <button disabled={product.stock <= 0 || adding} onClick={handleAdd} style={{ marginTop: 12, padding: "10px 18px" }}>
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}

export default ProductDetails;
