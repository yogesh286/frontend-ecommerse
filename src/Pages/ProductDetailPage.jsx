import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function ProductDetailPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function getData() {
      const res = await fetch(
        "https://backend-ecommerse-1.onrender.com/productid/" + productId
      );
      const data = await res.json();
      setProduct(data);
    }

    getData();
  }, [productId]);

  const addToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) => item._id === product._id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(existingCart)
    );

    alert("🛒 Product Added To Cart");
  };

  const handlePayment = async () => {
    try {
      const res = await fetch(
        "https://backend-ecommerse-1.onrender.com/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: product.price,
          }),
        }
      );

      const order = await res.json();

      const options = {
        key: "rzp_test_SUwbJYIpjpefPG",
        amount: order.amount,
        currency: "INR",
        name: "My Store",
        description: product.name,
        order_id: order.id,

        handler: async function (response) {
          const verifyRes = await fetch(
            "https://backend-ecommerse-1.onrender.com/api/verify-payment",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(response),
            }
          );

          const data = await verifyRes.json();

          if (data.success) {
            alert("Payment Successful 🎉");
          } else {
            alert("Payment Failed ❌");
          }
        },

        theme: {
          color: "#ff3e6c",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Error in payment");
    }
  };

  if (!product) {
    return <h2>Loading...</h2>;
  }

  return (
    <section className="products-section">
      <div className="product-detail-layout">
        <div className="product-image-wrap">
          <img
            src={`https://backend-ecommerse-1.onrender.com/product/${product.profile}`}
            alt={product.name}
          />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>

          <div className="product-bottom">
            <span className="price">₹{product.price}</span>
          </div>

          <h5 className="product-size-title">
            SELECT SIZE :-
          </h5>

          <div className="radias-parent">
            <div className="radias-class">XS</div>
            <div className="radias-class">S</div>
            <div className="radias-class">M</div>
            <div className="radias-class">L</div>
            <div className="radias-class">XL</div>
            <div className="radias-class">XXL</div>
          </div>

          <button
            className="hero-btn"
            onClick={addToCart}
            style={{
              marginTop: "16px",
              backgroundColor: "#ff3e6c",
            }}
          >
            👜 Add to Cart
          </button>

          <button
            className="hero-btn"
            onClick={handlePayment}
            style={{ marginTop: "16px" }}
          >
            💳 Buy Now
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailPage;