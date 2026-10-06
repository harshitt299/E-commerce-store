import { useState } from "react";
import { getAllProducts } from "../services/productService";
import { Link ,Navigate } from "react-router-dom";

function Products() {
  const [products ,setProducts] = useState("");
  const [loading ,setLoading] = useState(loading);
  const [error, setError] = useState(false);
  const [pagination , setPagination] = useState("");

  
  return (
    <div>
      Products
    </div>
  )
}

export default Products
