import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaCreditCard,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

import axios from "axios";

import { loadCart } from "../utils/cart";
import { Loader } from "../components/loader";

function normalizeSriLankanMobile(value) {
  const compact = String(value || "")
    .trim()
    .replace(/[\s()-]/g, "");

  if (/^07\d{8}$/.test(compact)) {
    return compact;
  }

  if (/^\+947\d{8}$/.test(compact)) {
    return "0" + compact.slice(3);
  }

  if (/^947\d{8}$/.test(compact)) {
    return "0" + compact.slice(2);
  }

  return null;
}

export default function CheckOutPage() {
  const navigate = useNavigate();

  const location = useLocation();

  // =====================================================
  // CART / BUY NOW PRODUCTS
  // =====================================================

  const isBuyNow =
    location.state?.buyNow === true && location.state?.product != null;

  const [cart, setCart] = useState(isBuyNow ? [location.state.product] : []);

  const [isCartLoading, setIsCartLoading] = useState(!isBuyNow);

  // =====================================================
  // LOAD NORMAL CART FROM DATABASE
  // Buy Now එකෙන් ආවා නම් database cart එක load කරන්නේ නැහැ.
  // =====================================================

  useEffect(() => {
    if (isBuyNow) {
      return;
    }

    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("You need to login to checkout");
      navigate("/login");
      return;
    }

    async function getCart() {
      try {
        setIsCartLoading(true);

        const items = await loadCart();

        setCart(items);
      } catch (error) {
        console.error("Load Checkout Cart Error:", error.message);

        if (error.response?.status === 401 || error.code === "LOGIN_REQUIRED") {
          toast.error("Please login again");
          navigate("/login");
          return;
        }

        toast.error(error.response?.data?.message || "Unable to load cart");
      } finally {
        setIsCartLoading(false);
      }
    }

    getCart();
  }, [isBuyNow, navigate]);

  // =====================================================
  // CUSTOMER DETAILS
  // =====================================================

  const [fullName, setFullName] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");

  const [district, setDistrict] = useState("");

  const [notes, setNotes] = useState("");

  const [isOrdering, setIsOrdering] = useState(false);

  const [paymentPlan, setPaymentPlan] = useState("Full Payment");

  // If the order is created successfully but payment initiation fails,
  // reuse the same order on retry instead of creating a duplicate order.
  const [createdOrderId, setCreatedOrderId] = useState(null);

  // =====================================================
  // TOTAL PRICE
  // Frontend display only.
  // Backend calculates real total again.
  // =====================================================

  const totalPrice = cart.reduce((total, product) => {
    return total + Number(product.price || 0) * Number(product.quantity || 0);
  }, 0);

  // =====================================================
  // PAYMENT DISPLAY VALUES
  // Frontend display only.
  // Backend calculates the real payment amount again.
  // =====================================================

  const amountToPayNow =
    paymentPlan === "Half Payment"
      ? Math.round((totalPrice / 2) * 100) / 100
      : totalPrice;

  const balanceOnDelivery =
    paymentPlan === "Half Payment"
      ? Math.round((totalPrice - amountToPayNow) * 100) / 100
      : 0;
  // =====================================================
  // TOTAL QUANTITY
  // =====================================================

  const totalQuantity = cart.reduce((total, product) => {
    return total + Number(product.quantity || 0);
  }, 0);

  // =====================================================
  // PURCHASE CART
  // =====================================================

  async function purchaseCart() {
    // ============================================
    // CHECK LOGIN
    // ============================================

    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("You need to login to purchase");

      navigate("/login");

      return;
    }

    // ============================================
    // CUSTOMER DETAILS
    // ============================================

    if (
      fullName.trim() === "" ||
      phone.trim() === "" ||
      address.trim() === "" ||
      city.trim() === "" ||
      district.trim() === ""
    ) {
      toast.error("Please fill all required delivery details");

      return;
    }

    const normalizedPhone = normalizeSriLankanMobile(phone);

    if (!normalizedPhone) {
      toast.error("Enter a valid Sri Lankan mobile number such as 0771234567");

      return;
    }

    // ============================================
    // CART
    // ============================================

    if (cart.length === 0) {
      toast.error("Your cart is empty");

      return;
    }

    // ============================================
    // PAYMENT PLAN
    // ============================================

    if (paymentPlan !== "Full Payment" && paymentPlan !== "Half Payment") {
      toast.error("Please select a payment plan");

      return;
    }

    // ============================================
    // PRODUCTS
    // ============================================

    const products = [];

    for (let i = 0; i < cart.length; i++) {
      products.push({
        productId: cart[i].productId,

        quantity: Number(cart[i].quantity),
      });
    }

    // ============================================
    // ORDER DATA
    //
    // Notice:
    // We do NOT send totalPrice.
    // Backend calculates real total.
    // ============================================

    const orderData = {
      fullName: fullName.trim(),

      phone: normalizedPhone,

      address: address.trim(),

      city: city.trim(),

      district: district.trim(),

      notes: notes.trim(),

      products: products,
    };

    try {
      setIsOrdering(true);

      // ==========================================
      // STEP 1
      // CREATE NARICRAFT ORDER
      // ==========================================

      let orderIdForPayment = createdOrderId;

      if (!orderIdForPayment) {
        const orderResponse = await axios.post(
          import.meta.env.VITE_API_URL + "/api/orders",

          orderData,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const createdOrder = orderResponse.data.order;

        if (!createdOrder?.orderId) {
          throw new Error("Order was created without an order ID");
        }

        orderIdForPayment = createdOrder.orderId;
        setCreatedOrderId(orderIdForPayment);
      }

      // ==========================================
      // STEP 2
      // CREATE PAYMENTS.LK SANDBOX CHECKOUT
      // ==========================================

      const paymentResponse = await axios.post(
        import.meta.env.VITE_API_URL + "/api/payments/product/initiate",

        {
          orderId: orderIdForPayment,

          paymentPlan: paymentPlan,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { checkoutUrl, paymentReference } = paymentResponse.data;

      if (!checkoutUrl || !paymentReference) {
        throw new Error("Invalid Payments.lk checkout response");
      }

      // ==========================================
      // TEMPORARY PAYMENT CONTEXT
      //
      // sessionStorage instead of localStorage:
      // less persistent / better privacy.
      //
      // No personal customer data is saved here.
      // ==========================================

      sessionStorage.setItem(
        "naricraftPendingPayment",

        JSON.stringify({
          paymentReference: paymentReference,

          orderId: orderIdForPayment,

          clearCart: !isBuyNow,
        }),
      );

      toast.success("Redirecting to Payments.lk secure checkout...");

      // ==========================================
      // IMPORTANT
      //
      // Do NOT clear cart here.
      // Payment is not verified yet.
      // The order becomes Paid only after the
      // verified Payments.lk webhook reaches backend.
      // ==========================================

      window.location.assign(checkoutUrl);
    } catch (error) {
      console.error("Checkout Payment Error:", error.message);

      toast.error(
        error.response?.data?.message ||
          "Unable to start payment. Please try again.",
      );
    } finally {
      setIsOrdering(false);
    }
  }

  if (isCartLoading) {
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
            PAGE HEADER
        ================================================= */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-5
            mb-10
          "
        >
          <div>
            <p
              className="
                text-[#b88f25]
                text-xs
                font-black
                tracking-[3px]
                uppercase
              "
            >
              Final Step
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
              Checkout
            </h1>

            <p
              className="
                text-[#8b7567]
                mt-3
                max-w-xl
              "
            >
              ඔබගේ delivery details ලබාදී order එක confirm කිරීමට සූදානම් වෙන්න.
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

          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              hidden
              sm:flex
              items-center
              gap-2
              px-5
              py-3
              rounded-xl
              bg-white
              border-2
              border-[#6b1d2f]
              text-[#6b1d2f]
              font-bold
              hover:bg-[#6b1d2f]
              hover:text-[#f3d975]
              transition-all
            "
          >
            <FaArrowLeft size={13} />
            Back
          </button>
        </div>

        {/* =================================================
            EMPTY CART
        ================================================= */}

        {cart.length === 0 ? (
          <div
            className="
              min-h-[400px]
              flex
              items-center
              justify-center
            "
          >
            <div
              className="
                max-w-[450px]
                w-full
                bg-white
                rounded-[30px]
                border
                border-[#e1d2c0]
                shadow-[0_18px_45px_rgba(91,26,43,0.10)]
                p-10
                text-center
              "
            >
              <FaBoxOpen
                className="
                  text-[#6b1d2f]
                  text-4xl
                  mx-auto
                "
              />

              <h2
                className="
                  text-2xl
                  font-black
                  text-[#4a1624]
                  mt-5
                "
              >
                Your Cart is Empty
              </h2>

              <p
                className="
                  text-[#8b7567]
                  text-sm
                  mt-3
                "
              >
                Checkout කරන්න කලින් product එකක් cart එකට add කරන්න.
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
              lg:grid-cols-[1fr_380px]
              gap-8
              items-start
            "
          >
            {/* =================================================
                LEFT SIDE - DELIVERY DETAILS
            ================================================= */}

            <div
              className="
                bg-white
                rounded-[30px]
                border
                border-[#e1d2c0]
                shadow-[0_18px_45px_rgba(91,26,43,0.10)]
                p-6
                md:p-8
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-7
                "
              >
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-[#6b1d2f]
                    text-[#f3d975]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FaMapMarkerAlt />
                </div>

                <div>
                  <h2
                    className="
                      text-xl
                      font-black
                      text-[#4a1624]
                    "
                  >
                    Delivery Details
                  </h2>

                  <p
                    className="
                      text-xs
                      text-[#9a8273]
                      mt-1
                    "
                  >
                    Where should we deliver your order?
                  </p>
                </div>
              </div>

              {/* =================================================
                  FULL NAME + PHONE
              ================================================= */}

              <div
                className="
                  grid
                  md:grid-cols-2
                  gap-5
                "
              >
                {/* FULL NAME */}

                <div>
                  <label
                    className="
                      text-sm
                      font-bold
                      text-[#5b1a2b]
                    "
                  >
                    Full Name *
                  </label>

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-3
                      px-4
                      border
                      border-[#dfd0bf]
                      bg-[#faf7f2]
                      rounded-xl
                      focus-within:border-[#6b1d2f]
                    "
                  >
                    <FaUser
                      className="
                        text-[#b88f25]
                      "
                    />

                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="
                        w-full
                        py-4
                        bg-transparent
                        outline-none
                        text-[#4a1624]
                      "
                    />
                  </div>
                </div>

                {/* PHONE */}

                <div>
                  <label
                    className="
                      text-sm
                      font-bold
                      text-[#5b1a2b]
                    "
                  >
                    Phone Number *
                  </label>

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-3
                      px-4
                      border
                      border-[#dfd0bf]
                      bg-[#faf7f2]
                      rounded-xl
                      focus-within:border-[#6b1d2f]
                    "
                  >
                    <FaPhoneAlt
                      className="
                        text-[#b88f25]
                      "
                    />

                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07X XXX XXXX"
                      className="
                        w-full
                        py-4
                        bg-transparent
                        outline-none
                        text-[#4a1624]
                      "
                    />
                  </div>
                </div>
              </div>

              {/* =================================================
                  ADDRESS
              ================================================= */}

              <div className="mt-5">
                <label
                  className="
                    text-sm
                    font-bold
                    text-[#5b1a2b]
                  "
                >
                  Delivery Address *
                </label>

                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House number, street, village..."
                  rows="4"
                  className="
                    w-full
                    mt-2
                    p-4
                    bg-[#faf7f2]
                    border
                    border-[#dfd0bf]
                    rounded-xl
                    outline-none
                    resize-none
                    text-[#4a1624]
                    focus:border-[#6b1d2f]
                  "
                />
              </div>

              {/* =================================================
                  CITY + DISTRICT
              ================================================= */}

              <div
                className="
                  grid
                  md:grid-cols-2
                  gap-5
                  mt-5
                "
              >
                {/* CITY */}

                <div>
                  <label
                    className="
                      text-sm
                      font-bold
                      text-[#5b1a2b]
                    "
                  >
                    City *
                  </label>

                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="
                      w-full
                      mt-2
                      p-4
                      bg-[#faf7f2]
                      border
                      border-[#dfd0bf]
                      rounded-xl
                      outline-none
                      text-[#4a1624]
                      focus:border-[#6b1d2f]
                    "
                  />
                </div>

                {/* DISTRICT */}

                <div>
                  <label
                    className="
                      text-sm
                      font-bold
                      text-[#5b1a2b]
                    "
                  >
                    District *
                  </label>

                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="District"
                    className="
                      w-full
                      mt-2
                      p-4
                      bg-[#faf7f2]
                      border
                      border-[#dfd0bf]
                      rounded-xl
                      outline-none
                      text-[#4a1624]
                      focus:border-[#6b1d2f]
                    "
                  />
                </div>
              </div>

              {/* =================================================
                  NOTES
              ================================================= */}

              <div className="mt-5">
                <label
                  className="
                    text-sm
                    font-bold
                    text-[#5b1a2b]
                  "
                >
                  Order Notes
                  <span
                    className="
                      text-[#9a8273]
                      font-normal
                      ml-2
                    "
                  >
                    Optional
                  </span>
                </label>

                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions..."
                  rows="3"
                  className="
                    w-full
                    mt-2
                    p-4
                    bg-[#faf7f2]
                    border
                    border-[#dfd0bf]
                    rounded-xl
                    outline-none
                    resize-none
                    text-[#4a1624]
                    focus:border-[#6b1d2f]
                  "
                />
              </div>
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
                  tracking-[3px]
                  font-black
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
                Your Order
              </h2>

              <div
                className="
                  w-full
                  h-[1px]
                  bg-[#eadfd2]
                  my-6
                "
              />

              {/* =================================================
                  PRODUCTS
              ================================================= */}

              <div
                className="
                  max-h-[300px]
                  overflow-y-auto
                  pr-1
                  space-y-4
                "
              >
                {cart.map((product) => (
                  <div
                    key={product.productId}
                    className="
                        flex
                        items-center
                        gap-3
                      "
                  >
                    <img
                      src={product.image || "/placeholder.png"}
                      alt={product.name}
                      className="
                          w-14
                          h-14
                          object-cover
                          rounded-xl
                          border
                          border-[#eadaca]
                        "
                    />

                    <div
                      className="
                          flex-1
                          min-w-0
                        "
                    >
                      <h3
                        className="
                            font-bold
                            text-sm
                            text-[#4a1624]
                            truncate
                          "
                      >
                        {product.name}
                      </h3>

                      <p
                        className="
                            text-xs
                            text-[#9a8273]
                            mt-1
                          "
                      >
                        Qty: {product.quantity}
                      </p>
                    </div>

                    <p
                      className="
                          text-sm
                          font-black
                          text-[#6b1d2f]
                          whitespace-nowrap
                        "
                    >
                      LKR {(product.price * product.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="
                  w-full
                  h-[1px]
                  bg-[#eadfd2]
                  my-6
                "
              />

              {/* PRODUCTS */}

              <div
                className="
                  flex
                  justify-between
                  text-sm
                "
              >
                <span
                  className="
                    text-[#8b7567]
                  "
                >
                  Products
                </span>

                <span
                  className="
                    font-bold
                    text-[#4a1624]
                  "
                >
                  {cart.length}
                </span>
              </div>

              {/* QUANTITY */}

              <div
                className="
                  flex
                  justify-between
                  text-sm
                  mt-4
                "
              >
                <span
                  className="
                    text-[#8b7567]
                  "
                >
                  Total Quantity
                </span>

                <span
                  className="
                    font-bold
                    text-[#4a1624]
                  "
                >
                  {totalQuantity}
                </span>
              </div>

              {/* DELIVERY */}

              <div
                className="
                  flex
                  justify-between
                  text-sm
                  mt-4
                "
              >
                <span
                  className="
                    text-[#8b7567]
                  "
                >
                  Delivery
                </span>

                <span
                  className="
                    font-bold
                    text-[#b88f25]
                  "
                >
                  Calculated later
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

              {/* TOTAL */}

              <div
                className="
                  flex
                  items-end
                  justify-between
                  gap-5
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
                      text-[10px]
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
                  <span
                    className="
                      text-xs
                      mr-1
                    "
                  >
                    LKR
                  </span>

                  {totalPrice.toLocaleString()}
                </p>
              </div>

              {/* =================================================
                     PAYMENT PLAN
              ================================================= */}

              <div
                className="
                    w-full
                    h-[1px]
                    bg-[#eadfd2]
                    my-6
                "
              />

              <div>
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    mb-4
                  "
                >
                  <FaCreditCard
                    className="
        text-[#b88f25]
      "
                  />

                  <h3
                    className="
        text-sm
        font-black
        text-[#4a1624]
      "
                  >
                    Choose Payment Plan
                  </h3>
                </div>

                {/* FULL PAYMENT */}

                <button
                  type="button"
                  onClick={() => setPaymentPlan("Full Payment")}
                  className={`
      w-full
      text-left
      rounded-2xl
      border-2
      p-4
      transition-all

      ${
        paymentPlan === "Full Payment"
          ? "border-[#d4af37] bg-[#fff9e8] shadow-md"
          : "border-[#eadfd2] bg-white hover:border-[#d4af37]"
      }
    `}
                >
                  <div
                    className="
        flex
        items-start
        justify-between
        gap-4
      "
                  >
                    <div
                      className="
          flex
          gap-3
        "
                    >
                      <div
                        className={`
            w-6
            h-6
            rounded-full
            border-2
            flex
            items-center
            justify-center
            shrink-0

            ${
              paymentPlan === "Full Payment"
                ? "border-[#6b1d2f] bg-[#6b1d2f]"
                : "border-[#cbbbab]"
            }
          `}
                      >
                        {paymentPlan === "Full Payment" && (
                          <FaCheckCircle
                            className="
                text-[#f3d975]
                text-xs
              "
                          />
                        )}
                      </div>

                      <div>
                        <p
                          className="
              font-black
              text-[#4a1624]
            "
                        >
                          Full Payment
                        </p>

                        <p
                          className="
              text-xs
              text-[#8b7567]
              mt-1
            "
                        >
                          Pay the full order amount securely now.
                        </p>
                      </div>
                    </div>

                    <p
                      className="
          font-black
          text-[#6b1d2f]
          whitespace-nowrap
        "
                    >
                      LKR {totalPrice.toLocaleString()}
                    </p>
                  </div>
                </button>

                {/* HALF PAYMENT */}

                <button
                  type="button"
                  onClick={() => setPaymentPlan("Half Payment")}
                  className={`
      w-full
      text-left
      rounded-2xl
      border-2
      p-4
      mt-3
      transition-all

      ${
        paymentPlan === "Half Payment"
          ? "border-[#d4af37] bg-[#fff9e8] shadow-md"
          : "border-[#eadfd2] bg-white hover:border-[#d4af37]"
      }
    `}
                >
                  <div
                    className="
        flex
        items-start
        justify-between
        gap-4
      "
                  >
                    <div
                      className="
          flex
          gap-3
        "
                    >
                      <div
                        className={`
            w-6
            h-6
            rounded-full
            border-2
            flex
            items-center
            justify-center
            shrink-0

            ${
              paymentPlan === "Half Payment"
                ? "border-[#6b1d2f] bg-[#6b1d2f]"
                : "border-[#cbbbab]"
            }
          `}
                      >
                        {paymentPlan === "Half Payment" && (
                          <FaCheckCircle
                            className="
                text-[#f3d975]
                text-xs
              "
                          />
                        )}
                      </div>

                      <div>
                        <p
                          className="
              font-black
              text-[#4a1624]
            "
                        >
                          50% Advance
                        </p>

                        <p
                          className="
              text-xs
              text-[#8b7567]
              mt-1
            "
                        >
                          Pay 50% now and the remaining 50% on delivery.
                        </p>
                      </div>
                    </div>

                    <p
                      className="
          font-black
          text-[#6b1d2f]
          whitespace-nowrap
        "
                    >
                      LKR {amountToPayNow.toLocaleString()}
                    </p>
                  </div>
                </button>

                {/* PAYMENT BREAKDOWN */}

                <div
                  className="
      mt-4
      rounded-2xl
      bg-[#f8f1e8]
      border
      border-[#ead8c7]
      p-4
    "
                >
                  <div
                    className="
        flex
        justify-between
        text-sm
      "
                  >
                    <span
                      className="
          text-[#8b7567]
        "
                    >
                      Pay now
                    </span>

                    <span
                      className="
          font-black
          text-[#6b1d2f]
        "
                    >
                      LKR {amountToPayNow.toLocaleString()}
                    </span>
                  </div>

                  <div
                    className="
        flex
        justify-between
        text-sm
        mt-3
      "
                  >
                    <span
                      className="
          text-[#8b7567]
        "
                    >
                      Balance on delivery
                    </span>

                    <span
                      className="
          font-black
          text-[#4a1624]
        "
                    >
                      LKR {balanceOnDelivery.toLocaleString()}
                    </span>
                  </div>

                  <div
                    className="
        flex
        items-start
        gap-2
        mt-4
        pt-4
        border-t
        border-[#dfcfbf]
      "
                  >
                    <FaLock
                      className="
          text-[#b88f25]
          mt-0.5
          shrink-0
        "
                    />

                    <p
                      className="
          text-[11px]
          leading-5
          text-[#8b7567]
        "
                    >
                      Payment is processed securely by Payments.lk. NariCraft
                      does not store your card number or CVV.
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  PLACE ORDER
              ================================================= */}

              <button
                type="button"
                onClick={purchaseCart}
                disabled={isOrdering}
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
                  disabled:opacity-60
                  disabled:cursor-not-allowed
                  disabled:translate-y-0
                "
              >
                {isOrdering
                  ? "Preparing Secure Payment..."
                  : `Pay LKR ${amountToPayNow.toLocaleString()} Securely`}
              </button>

              {/* BACK TO CART */}

              <Link
                to="/cart"
                className="
                  mt-5
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-sm
                  font-bold
                  text-[#6b1d2f]
                  hover:text-[#d4af37]
                  transition-colors
                "
              >
                <FaArrowLeft size={11} />
                Back to Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
