import { useEffect, useState } from "react";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCartItems(cart);
  }, []);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const increaseQty = (id) => {
    const updatedCart = cartItems.map((item) =>
      item._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    updateCart(updatedCart);
  };

  const decreaseQty = (id) => {
    const updatedCart = cartItems
      .map((item) =>
        item._id === id
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      )
      .filter((item) => item.quantity > 0);

    updateCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(
      (item) => item._id !== id
    );

    updateCart(updatedCart);
  };

  const totalPrice = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  const handleCartPayment = async () => {
    if (cartItems.length === 0) {
      alert("Cart is Empty 🛒");
      return;
    }

    try {
      const res = await fetch(
        "https://backend-ecommerse-1.onrender.com/api/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: totalPrice,
          }),
        }
      );

      const order = await res.json();

      const options = {
        key: "rzp_test_SUwbJYIpjpefPG",
        amount: order.amount,
        currency: "INR",
        name: "E-Power Studio",
        description: "Cart Checkout",
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
            alert("🎉 Payment Successful");

            localStorage.removeItem("cart");
            setCartItems([]);
          } else {
            alert("❌ Payment Failed");
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
      alert("Payment Error");
    }
  };

  return (
    <section className="products-section">
      <h2>Your Cart</h2>

      {cartItems.length === 0 ? (
        <h3 style={{ marginTop: "20px" }}>
          🛒 Your Cart Is Empty
        </h3>
      ) : (
        <>
          <div className="product-grid">
            {cartItems.map((item) => (
              <article
                key={item._id}
                className="product-card"
              >
                <div className="product-image-wrap">
                  <img
                    src={`https://backend-ecommerse-1.onrender.com/product/${item.profile}`}
                    alt={item.name}
                  />
                </div>

                <div className="product-info">
                  <h3>{item.name}</h3>

                  <p className="price">
                    ₹{item.price}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      onClick={() =>
                        decreaseQty(item._id)
                      }
                    >
                      -
                    </button>

                    <span>
                      Qty : {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQty(item._id)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="hero-btn"
                    style={{
                      marginTop: "12px",
                    }}
                    onClick={() =>
                      removeItem(item._id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h2>
              Total Amount : ₹{totalPrice}
            </h2>

            <button
              className="hero-btn"
              onClick={handleCartPayment}
              style={{
                marginTop: "15px",
                backgroundColor: "#ff3e6c",
                width: "100%",
              }}
            >
              💳 Proceed To Payment
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default CartPage;