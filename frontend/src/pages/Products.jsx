import { useState, useEffect } from "react";
import { getAllProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAllProducts({ page, limit: 12, search });
        setProducts(response.products || []);
        setTotalPages(response.totalPages || 1);
      } catch (err) {
        setError(err.response?.data?.message || "No product found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [page, search]);

  if (loading) return <p>Loading Products..</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 16 }}>
      <input
        placeholder="Search Products"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginTop: 12 }}>
        {products.map((p) => {
          return <ProductCard key={p._id} product={p} />;
        })}
      </div>
      {products.length === 0 && <p>No Products Found</p>}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default Products;
