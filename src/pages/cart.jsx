import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { FaMinus, FaPlus, FaShoppingBag, FaTrash } from "react-icons/fa";

import { Loader } from "../components/loader";
import { addToCart, loadCart, removeFromCart } from "../utils/cart";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingProductId, setUpdatingProductId] = useState(null);

  const navigate = useNavigate();

  // =====================================================
  // LOAD CART FROM DATABASE
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("Please login to view your cart");
      navigate("/login");
      return;
    }

    refreshCart();
  }, [navigate]);

  // =====================================================
  // REFRESH CART
  // =====================================================

  async function refreshCart() {
    try {
      setIsLoading(true);

      const items = await loadCart();

      setCart(items);
    } catch (error) {
      console.log("Load Cart Error:", error);

      if (error.response?.status === 401 || error.code === "LOGIN_REQUIRED") {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Unable to load cart");
    } finally {
      setIsLoading(false);
    }
  }

  // =====================================================
  // INCREASE QUANTITY
  // =====================================================

  async function increaseQuantity(product) {
    if (product.quantity >= product.labelNo) {
      toast.error(`Only ${product.labelNo} item(s) available in stock`);
      return;
    }

    try {
      setUpdatingProductId(product.productId);

      const items = await addToCart(product, 1);

      setCart(items);
    } catch (error) {
      console.log("Increase Cart Error:", error);

      toast.error(error.response?.data?.message || "Unable to update cart");
    } finally {
      setUpdatingProductId(null);
    }
  }

  // =====================================================
  // DECREASE QUANTITY
  // =====================================================

  async function decreaseQuantity(product) {
    try {
      setUpdatingProductId(product.productId);

      const items = await addToCart(product, -1);

      setCart(items);
    } catch (error) {
      console.log("Decrease Cart Error:", error);

      toast.error(error.response?.data?.message || "Unable to update cart");
    } finally {
      setUpdatingProductId(null);
    }
  }

  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  async function removeProduct(product) {
    try {
      setUpdatingProductId(product.productId);

      const items = await removeFromCart(product.productId);

      setCart(items);

      toast.success("Product removed from cart");
    } catch (error) {
      console.log("Remove Cart Error:", error);

      toast.error(error.response?.data?.message || "Unable to remove product");
    } finally {
      setUpdatingProductId(null);
    }
  }

  // =====================================================
  // TOTAL PRICE
  // =====================================================

  const totalPrice = cart.reduce((total, product) => {
    return total + product.price * product.quantity;
  }, 0);

  // =====================================================
  // TOTAL QUANTITY
  // =====================================================

  const totalQuantity = cart.reduce((total, product) => {
    return total + product.quantity;
  }, 0);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className="
        w-full
        min-h-screen
        bg-[#faf7f2]
        px-4
        md:px-8
        py-10
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
        "
      >
        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <div className="mb-10">
          <p
            className="
              text-[#b88f25]
              text-xs
              font-black
              tracking-[3px]
              uppercase
            "
          >
            Your Selection
          </p>

          <h1
            className="
              text-3xl
              md:text-4xl
              font-black
              text-[#4a1624]
              mt-2
            "
          >
            Shopping Cart
          </h1>

          <p
            className="
              text-[#8b7567]
              mt-3
            "
          >
            ඔබ තෝරාගත් NariCraft products මෙතනින් manage කරන්න.
          </p>

          <div
            className="
              w-20
              h-1
              rounded-full
              bg-[#d4af37]
              mt-5
            "
          />
        </div>

        {/* =================================================
            EMPTY CART
        ================================================= */}

        {cart.length === 0 ? (
          <div
            className="
              min-h-[420px]
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                max-w-[480px]
                w-full
                bg-white
                rounded-[30px]
                border
                border-[#e1d2c0]
                shadow-[0_18px_45px_rgba(91,26,43,0.10)]
                px-8
                py-12
                text-center
              "
            >
              <div
                className="
                  w-20
                  h-20
                  mx-auto
                  rounded-full
                  bg-[#f8f1e8]
                  text-[#6b1d2f]
                  flex
                  items-center
                  justify-center
                "
              >
                <FaShoppingBag size={30} />
              </div>

              <h2
                className="
                  text-2xl
                  font-black
                  text-[#4a1624]
                  mt-6
                "
              >
                Your Cart is Empty
              </h2>

              <p
                className="
                  text-[#8b7567]
                  text-sm
                  leading-7
                  mt-3
                "
              >
                ඔබ කැමති NariCraft design එකක් තෝරාගෙන cart එකට add කරන්න.
              </p>

              <Link
                to="/products"
                className="
                  inline-flex
                  mt-7
                  px-7
                  py-4
                  rounded-2xl
                  bg-[#6b1d2f]
                  text-[#f3d975]
                  font-bold
                  shadow-[0_6px_0_#d4af37]
                  hover:-translate-y-1
                  hover:shadow-[0_8px_0_#d4af37]
                  active:translate-y-1
                  active:shadow-none
                  transition-all
                "
              >
                Explore Products
              </Link>
            </div>
          </div>
        ) : (
          <div
            className="
              grid
              lg:grid-cols-[1fr_360px]
              gap-8
              items-start
            "
          >
            {/* =================================================
                LEFT SIDE - CART PRODUCTS
            ================================================= */}

            <div
              className="
                flex
                flex-col
                gap-5
              "
            >
              {cart.map((product) => (
                <div
                  key={product.productId}
                  onClick={() => {
                    navigate(`/overview/${product.productId}`);
                  }}
                  className="
                    bg-white
                    rounded-[26px]
                    border
                    border-[#e1d2c0]
                    shadow-[0_12px_30px_rgba(91,26,43,0.08)]
                    p-4
                    md:p-5

                    flex
                    flex-col
                    sm:flex-row
                    gap-5

                    cursor-pointer

                    hover:-translate-y-1
                    hover:border-[#d4af37]
                    hover:shadow-[0_18px_40px_rgba(91,26,43,0.14)]

                    transition-all
                    duration-300
                  "
                >
                  {/* ================= IMAGE ================= */}

                  <div
                    className="
                      w-full
                      sm:w-[150px]
                      h-[190px]
                      shrink-0
                      overflow-hidden
                      rounded-2xl
                      bg-[#f6ede2]
                      border
                      border-[#eadaca]
                    "
                  >
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      className="
                        w-full
                        h-full
                        object-cover
                        hover:scale-105
                        transition-transform
                        duration-500
                      "
                    />
                  </div>

                  {/* ================= DETAILS ================= */}

                  <div
                    className="
                      flex-1
                      flex
                      flex-col
                      justify-between
                    "
                  >
                    <div>
                      <p
                        className="
                          text-[10px]
                          font-black
                          tracking-[2px]
                          text-[#b88f25]
                        "
                      >
                        {product.productId}
                      </p>

                      <h2
                        className="
                          text-xl
                          md:text-2xl
                          font-black
                          text-[#4a1624]
                          mt-2
                          transition-colors
                        "
                      >
                        {product.name}
                      </h2>

                      <p
                        className="
                          text-sm
                          text-[#9a8273]
                          mt-2
                        "
                      >
                        Stock: {product.labelNo}
                      </p>
                    </div>

                    {/* ================= BOTTOM ================= */}

                    <div
                      className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-end
                        justify-between
                        gap-5
                        mt-6
                      "
                    >
                      {/* ================= PRICE ================= */}

                      <div>
                        <p
                          className="
                            text-[10px]
                            uppercase
                            font-bold
                            text-[#9a8273]
                          "
                        >
                          Price
                        </p>

                        <p
                          className="
                            text-2xl
                            font-black
                            text-[#6b1d2f]
                            mt-1
                          "
                        >
                          <span
                            className="
                              text-xs
                              mr-1
                            "
                          >
                            LKR
                          </span>

                          {product.price?.toLocaleString()}
                        </p>
                      </div>

                      {/* ================= QUANTITY + DELETE ================= */}

                      <div
                        className="
                          flex
                          items-center
                          gap-3
                        "
                      >
                        {/* ================= QUANTITY ================= */}

                        <div
                          className="
                            flex
                            items-center
                            gap-3
                            bg-[#f8f1e8]
                            border
                            border-[#eadaca]
                            rounded-xl
                            px-2
                            py-2
                          "
                        >
                          {/* MINUS */}

                          <button
                            type="button"
                            disabled={updatingProductId === product.productId}
                            onClick={(e) => {
                              e.stopPropagation();

                              decreaseQuantity(product);
                            }}
                            className="
                              w-8
                              h-8
                              rounded-lg
                              bg-white
                              text-[#6b1d2f]
                              flex
                              items-center
                              justify-center
                              border
                              border-[#e1d2c0]
                              hover:bg-[#6b1d2f]
                              hover:text-white
                              transition-all
                              disabled:opacity-50
                              disabled:cursor-not-allowed
                            "
                          >
                            <FaMinus size={10} />
                          </button>

                          {/* QUANTITY NUMBER */}

                          <span
                            className="
                              min-w-[25px]
                              text-center
                              font-black
                              text-[#4a1624]
                            "
                          >
                            {product.quantity}
                          </span>

                          {/* PLUS */}

                          <button
                            type="button"
                            disabled={
                              updatingProductId === product.productId ||
                              product.quantity >= product.labelNo
                            }
                            onClick={(e) => {
                              e.stopPropagation();

                              increaseQuantity(product);
                            }}
                            className="
                              w-8
                              h-8
                              rounded-lg
                              bg-[#6b1d2f]
                              text-[#f3d975]
                              flex
                              items-center
                              justify-center
                              hover:scale-105
                              transition-all
                              disabled:opacity-50
                              disabled:cursor-not-allowed
                              disabled:hover:scale-100
                            "
                          >
                            <FaPlus size={10} />
                          </button>
                        </div>

                        {/* ================= DELETE ================= */}

                        <button
                          type="button"
                          disabled={updatingProductId === product.productId}
                          onClick={(e) => {
                            e.stopPropagation();

                            removeProduct(product);
                          }}
                          title="Remove Product"
                          className="
                            w-11
                            h-11
                            rounded-xl
                            bg-red-50
                            border
                            border-red-200
                            text-red-500
                            flex
                            items-center
                            justify-center
                            hover:bg-red-500
                            hover:text-white
                            hover:scale-105
                            transition-all
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                            disabled:hover:scale-100
                          "
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* =================================================
                RIGHT SIDE - ORDER SUMMARY
            ================================================= */}

            <div
              className="
                bg-white
                rounded-[28px]
                border
                border-[#e1d2c0]
                shadow-[0_18px_45px_rgba(91,26,43,0.10)]
                p-6
                lg:sticky
                lg:top-6
              "
            >
              <p
                className="
                  text-[10px]
                  font-black
                  tracking-[3px]
                  text-[#b88f25]
                "
              >
                NARICRAFT
              </p>

              <h2
                className="
                  text-2xl
                  font-black
                  text-[#4a1624]
                  mt-2
                "
              >
                Order Summary
              </h2>

              <div
                className="
                  w-full
                  h-[1px]
                  bg-[#eadfd2]
                  my-6
                "
              />

              {/* ================= PRODUCTS ================= */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-sm
                "
              >
                <span className="text-[#8b7567]">Products</span>

                <span
                  className="
                    font-bold
                    text-[#4a1624]
                  "
                >
                  {cart.length}
                </span>
              </div>

              {/* ================= TOTAL QUANTITY ================= */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-sm
                  mt-4
                "
              >
                <span className="text-[#8b7567]">Total Quantity</span>

                <span
                  className="
                    font-bold
                    text-[#4a1624]
                  "
                >
                  {totalQuantity}
                </span>
              </div>

              <div
                className="
                  w-full
                  h-[1px]
                  bg-[#eadfd2]
                  my-6
                "
              />

              {/* ================= TOTAL ================= */}

              <div
                className="
                  flex
                  items-end
                  justify-between
                "
              >
                <div>
                  <p
                    className="
                      text-xs
                      uppercase
                      font-bold
                      text-[#9a8273]
                    "
                  >
                    Total
                  </p>

                  <p
                    className="
                      text-xs
                      text-[#9a8273]
                      mt-1
                    "
                  >
                    Delivery excluded
                  </p>
                </div>

                <p
                  className="
                    text-2xl
                    font-black
                    text-[#6b1d2f]
                  "
                >
                  <span className="text-xs mr-1">LKR</span>

                  {totalPrice.toLocaleString()}
                </p>
              </div>

              {/* =================================================
                  PROCEED TO CHECKOUT
              ================================================= */}

              <Link
                to="/checkout"
                className="
                  w-full
                  mt-7
                  py-4
                  rounded-2xl
                  bg-[#6b1d2f]
                  text-[#f3d975]
                  font-black
                  shadow-[0_6px_0_#d4af37]
                  hover:-translate-y-1
                  hover:shadow-[0_8px_0_#d4af37]
                  active:translate-y-1
                  active:shadow-none
                  transition-all
                  flex
                  items-center
                  justify-center
                "
              >
                Proceed to Checkout
              </Link>

              {/* ================= CONTINUE SHOPPING ================= */}

              <Link
                to="/products"
                className="
                  w-full
                  mt-5
                  flex
                  justify-center
                  text-sm
                  font-bold
                  text-[#6b1d2f]
                  hover:text-[#d4af37]
                  transition-colors
                "
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
