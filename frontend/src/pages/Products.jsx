import { useState,useEffect } from "react";
import { getAllProducts } from "../services/productService";
import { Link ,Navigate ,useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

function Products() {
  const [products ,setProducts] = useState([]);
  const [loading ,setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages , setTotslPages] = useState("1");
  const [search , setSearch] = useState("");

  useEffect(()=>{
    const fetchProduct = async()=>{
        setLoading(true);
        setError("");
        try {
          const response = await getAllProducts({page, limit:10 ,search});
          setProducts(response.products || []);
          setTotslPages(response.totalPages || 1);
        } catch (error) {
          setError(error.response?.data?.message || "No product found")
        }finally{
          setLoading(false);
        }
    };
    fetchProduct();} ,[page, search]);
    if(loading)return <p>Loading Products..</p>
    if(error)return <p style={{color:"red"}}>{error}</p>;

    const handleChange = (e)=>{
      setPage(1);
      setSearch(e.target.value);
    }

  return (
    <div>
      <input placeholder="Search Products" value={search} onChange={handleChange}></input>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {products.map((p)=>{
          return <ProductCard key={p._id} product={p}/>
        })}
      </div>
      {products.length ===0 && <p>No Products Found</p>}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
    </div>
  )
}

export default Products;
