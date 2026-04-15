import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function CategoryPage() {

  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [categorydata, setcategorydata] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function Datacategory() {
      try {
        const res = await fetch(`https://backend-ecommerse-1.onrender.com/product/${categoryName}`);
        const data = await res.json();
        setcategorydata(data);
      } catch (err) {
        console.log("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    Datacategory();
  }, [categoryName]);

  if (loading) return <h2>Loading...</h2>;

  return (
    <section className="products-section">
      <div className="section-header">
        <h2>{categoryName}</h2>
        <p>
          {categorydata.length} item
          {categorydata.length === 1 ? "" : "s"} in this category
        </p>
      </div>

      <div className="product-grid">
        {categorydata.map((p) => (
          <article
            key={p._id}
            className="product-card"
            onClick={() => navigate(`/product/${p._id}`)}
          >
            <div className="product-image-wrap">
              <img src={`https://backend-ecommerse-1.onrender.com/product/${p.profile}`} alt={p.name} />
            </div>

            <div className="product-info">
              <h3>{p.name}</h3>
              <div className="product-bottom">
                <span className="price">₹{p.price}</span>
                {p.originalPrice && (
                  <span className="original">₹{p.originalPrice}</span>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CategoryPage;