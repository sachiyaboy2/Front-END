import axios from "axios";

import { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  FaBoxOpen,
  FaEye,
  FaTimes,
  FaShoppingBag,
  FaMagic,
  FaRulerCombined,
  FaTshirt,
  FaSyncAlt,
  FaCreditCard,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

import { Loader } from "../components/loader";

// =====================================================
// GARMENT / MEASUREMENT DISPLAY CONFIG
// =====================================================

const garmentDisplayConfig = {
  "saree-jacket": {
    label: "Saree Jacket",
    fields: [
      { name: "height", label: "උස (Height)" },
      { name: "shoulder", label: "උරපතු මිනුම (Shoulder)" },
      { name: "bust", label: "පපුව වට (Bust)" },
      { name: "abdomen", label: "උදරයේ ප්‍රදේශ මිම්ම (Abdomen)" },
      { name: "frontNeckDepth", label: "ඉදිරි කර ගැඹුර (Front Neck Depth)" },
      { name: "backNeckDepth", label: "පිටුපස කර ගැඹුර (Back Neck Depth)" },
      {
        name: "topToBustPoint",
        label: "ඉහළ සිට බ්‍රා මධ්‍ය ලක්ෂ්‍යය (Top to Bust Point)",
      },
      {
        name: "sideToBustPoint",
        label: "පැත්තෙන් සිට බ්‍රා මධ්‍ය ලක්ෂ්‍යය (Side to Bust Point)",
      },
      { name: "sleeveLength", label: "අත දිග (Sleeve Length)" },
      { name: "sleeveCircumference", label: "අත වට (Sleeve Circumference)" },
      { name: "armhole", label: "අත් කැපුම (Armhole)" },
    ],
  },

  frock: {
    label: "Frock",
    fields: [
      { name: "shoulder", label: "උරහිස (Shoulder)" },
      { name: "waistLength", label: "ඉන දක්වා (Waist Length)" },
      { name: "bust", label: "පපුව (Bust)" },
      { name: "waist", label: "ඉන (Waist)" },
      { name: "sleeveCircumference", label: "අත වට (Sleeve Circumference)" },
      { name: "armhole", label: "අත් කැපුම (Armhole)" },
      { name: "skirtLength", label: "සාය උස (Skirt Length)" },
      { name: "frontNeckDepth", label: "ඉදිරි කර ගැඹුර (Front Neck Depth)" },
    ],
  },

  "crop-top": {
    label: "Crop Top",
    fields: [
      { name: "height", label: "උස (Height)" },
      { name: "shoulder", label: "උරහිස (Shoulder)" },
      { name: "waistLength", label: "ඉන දක්වා (Waist Length)" },
      { name: "bust", label: "පපුව (Bust)" },
      { name: "waist", label: "ඉන (Waist)" },
      { name: "sleeveCircumference", label: "අත වට (Sleeve Circumference)" },
      { name: "armhole", label: "අත් කැපුම (Armhole)" },
      { name: "frontNeckDepth", label: "ඉදිරි කර ගැඹුර (Front Neck Depth)" },
    ],
  },
};

const legacyMeasurementFields = [
  { name: "bust", label: "Bust" },
  { name: "underBust", label: "Under Bust" },
  { name: "waist", label: "Waist" },
  { name: "shoulder", label: "Shoulder" },
  { name: "sleeveLength", label: "Sleeve Length" },
  { name: "sleeveCircumference", label: "Sleeve Circumference" },
  { name: "frontNeck", label: "Front Neck" },
  { name: "backNeck", label: "Back Neck" },
  { name: "jacketLength", label: "Jacket Length" },
];

function getGarmentLabel(garmentType) {
  return garmentDisplayConfig[garmentType]?.label || "Legacy Custom Design";
}

function getOrderMeasurementFields(order) {
  return (
    garmentDisplayConfig[order?.garmentType]?.fields || legacyMeasurementFields
  );
}

export default function MyOrders() {
  const navigate = useNavigate();

  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.tab === "custom" ? "custom" : "products",
  );

  const [productOrders, setProductOrders] = useState([]);

  const [customOrders, setCustomOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedProductOrder, setSelectedProductOrder] = useState(null);

  const [selectedCustomOrder, setSelectedCustomOrder] = useState(null);

  const [customPaymentPlan, setCustomPaymentPlan] = useState("Full Payment");

  const [customDeliveryAddress, setCustomDeliveryAddress] = useState("");

  const [customCity, setCustomCity] = useState("");

  const [customDistrict, setCustomDistrict] = useState("");

  const [isStartingPayment, setIsStartingPayment] = useState(false);

  // =====================================================
  // OPEN CUSTOM ORDER MODAL
  // =====================================================

  function openCustomOrder(order) {
    setSelectedCustomOrder(order);

    setCustomPaymentPlan(
      order.paymentPlan === "Half Payment" ? "Half Payment" : "Full Payment",
    );

    setCustomDeliveryAddress(order.deliveryAddress || "");
    setCustomCity(order.city || "");
    setCustomDistrict(order.district || "");
  }

  // =====================================================
  // REDIRECT TO PAYHERE
  // =====================================================

  function submitToPayHere(actionUrl, paymentData) {
    const form = document.createElement("form");

    form.method = "POST";
    form.action = actionUrl;

    Object.entries(paymentData).forEach(([name, value]) => {
      if (value == null) {
        return;
      }

      const input = document.createElement("input");

      input.type = "hidden";
      input.name = name;
      input.value = String(value);

      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }

  // =====================================================
  // START CUSTOM ORDER PAYMENT
  // =====================================================

  async function payCustomOrder() {
    if (!selectedCustomOrder) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    if (selectedCustomOrder.status === "Cancelled") {
      toast.error("Cancelled orders cannot be paid");
      return;
    }

    if (!Number(selectedCustomOrder.price)) {
      toast.error("Price has not been set yet");
      return;
    }

    if (
      selectedCustomOrder.paymentStatus === "Paid" ||
      selectedCustomOrder.paymentStatus === "Partially Paid" ||
      selectedCustomOrder.paymentStatus === "Chargedback"
    ) {
      toast.error("This order cannot start another payment");
      return;
    }

    if (
      customPaymentPlan !== "Full Payment" &&
      customPaymentPlan !== "Half Payment"
    ) {
      toast.error("Please select a payment plan");
      return;
    }

    if (
      customDeliveryAddress.trim() === "" ||
      customCity.trim() === "" ||
      customDistrict.trim() === ""
    ) {
      toast.error("Please enter your delivery details");
      return;
    }

    try {
      setIsStartingPayment(true);

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/payments/custom/initiate",
        {
          customOrderId: selectedCustomOrder.customOrderId,
          paymentPlan: customPaymentPlan,
          deliveryAddress: customDeliveryAddress.trim(),
          city: customCity.trim(),
          district: customDistrict.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { actionUrl, paymentData, paymentReference } = response.data;

      if (!actionUrl || !paymentData || !paymentReference) {
        throw new Error("Invalid payment gateway response");
      }

      // Only non-sensitive temporary payment context is stored here.
      sessionStorage.setItem(
        "naricraftPendingPayment",
        JSON.stringify({
          paymentReference: paymentReference,
          orderType: "custom",
          customOrderId: selectedCustomOrder.customOrderId,
          clearCart: false,
        }),
      );

      toast.success("Redirecting to secure payment...");
      submitToPayHere(actionUrl, paymentData);
    } catch (err) {
      console.error("Custom Payment Error:", err.message);

      toast.error(
        err.response?.data?.message ||
          "Unable to start payment. Please try again.",
      );
    } finally {
      setIsStartingPayment(false);
    }
  }

  // =====================================================

  // LOAD ORDERS

  // =====================================================

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("Please login to view your orders");

      navigate("/login");

      return;
    }

    try {
      setIsLoading(true);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [productResponse, customResponse] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
          headers,
        }),

        axios.get(import.meta.env.VITE_API_URL + "/api/custom-orders", {
          headers,
        }),
      ]);

      setProductOrders(productResponse.data);

      setCustomOrders(customResponse.data);
    } catch (err) {
      console.log("Load Orders Error:", err);

      toast.error(err.response?.data?.message || "Failed to load your orders");
    } finally {
      setIsLoading(false);
    }
  }

  // =====================================================

  // FORMAT DATE

  // =====================================================

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString();
  }

  // =====================================================

  // STATUS STYLE

  // =====================================================

  function getStatusStyle(status) {
    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    if (status === "Confirmed" || status === "Accepted") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    if (status === "Processing" || status === "In Progress") {
      return "bg-purple-100 text-purple-700 border-purple-200";
    }

    if (status === "Shipped") {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }

    if (
      status === "Delivered" ||
      status === "Completed" ||
      status === "Ready"
    ) {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-gray-100 text-gray-700 border-gray-200";
  }

  // =====================================================

  // PAYMENT STYLE

  // =====================================================

  function getPaymentStyle(status) {
    if (status === "Price Pending") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    if (status === "Payment Pending") {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }

    if (status === "Partially Paid") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    if (status === "Paid") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "Failed" || status === "Chargedback") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-gray-100 text-gray-700 border-gray-200";
  }

  const selectedCustomPrice = Number(selectedCustomOrder?.price || 0);

  const customAmountToPayNow =
    customPaymentPlan === "Half Payment"
      ? Math.round((selectedCustomPrice / 2) * 100) / 100
      : selectedCustomPrice;

  const customBalanceOnDelivery =
    customPaymentPlan === "Half Payment"
      ? Math.max(
          0,
          Math.round((selectedCustomPrice - customAmountToPayNow) * 100) / 100,
        )
      : 0;

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

            HEADER

        ================================================= */}

        <div
          className="

            flex

            flex-col

            sm:flex-row

            sm:items-end

            sm:justify-between

            gap-5

            mb-8

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
              NariCraft Account
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
              My Orders
            </h1>

            <p
              className="

                text-[#8b7567]

                mt-2

              "
            >
              ඔබගේ product orders සහ custom tailoring orders මෙතනින් බලන්න.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrders}
            className="

              inline-flex

              items-center

              justify-center

              gap-2

              px-5

              py-3

              rounded-xl

              bg-[#6b1d2f]

              text-[#f3d975]

              font-bold

              border-2

              border-[#d4af37]

              shadow-[0_4px_0_#d4af37]

              hover:-translate-y-0.5

              active:translate-y-1

              active:shadow-none

              transition-all

            "
          >
            <FaSyncAlt />
            Refresh
          </button>
        </div>

        {/* =================================================

            TABS

        ================================================= */}

        <div
          className="

            grid

            grid-cols-2

            gap-2

            max-w-xl

            bg-[#eee2d5]

            rounded-2xl

            p-1.5

            mb-8

          "
        >
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`

              py-3

              px-4

              rounded-xl

              font-black

              flex

              items-center

              justify-center

              gap-2

              transition-all


              ${
                activeTab === "products"
                  ? "bg-[#6b1d2f] text-[#f3d975] shadow-md"
                  : "text-[#6b1d2f] hover:bg-white"
              }

            `}
          >
            <FaShoppingBag />
            Product Orders
            <span
              className="

                text-xs

                opacity-80

              "
            >
              ({productOrders.length})
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`

              py-3

              px-4

              rounded-xl

              font-black

              flex

              items-center

              justify-center

              gap-2

              transition-all


              ${
                activeTab === "custom"
                  ? "bg-[#6b1d2f] text-[#f3d975] shadow-md"
                  : "text-[#6b1d2f] hover:bg-white"
              }

            `}
          >
            <FaMagic />
            Custom Orders
            <span
              className="

                text-xs

                opacity-80

              "
            >
              ({customOrders.length})
            </span>
          </button>
        </div>

        {/* =================================================

            PRODUCT ORDERS

        ================================================= */}

        {activeTab === "products" && (
          <div>
            {productOrders.length === 0 ? (
              <EmptyOrders
                title="No Product Orders Yet"
                text="ඔබ තවම product order එකක් place කරලා නැහැ."
                buttonText="Explore Products"
                onClick={() => navigate("/products")}
              />
            ) : (
              <div
                className="

                  grid

                  md:grid-cols-2

                  xl:grid-cols-3

                  gap-5

                "
              >
                {productOrders.map((order) => (
                  <div
                    key={order._id || order.orderId}
                    className="

                        bg-white

                        rounded-[25px]

                        border

                        border-[#e1d2c0]

                        shadow-[0_12px_30px_rgba(91,26,43,0.08)]

                        p-5

                        hover:-translate-y-1

                        hover:border-[#d4af37]

                        transition-all

                      "
                  >
                    <div
                      className="

                          flex

                          items-start

                          justify-between

                          gap-3

                        "
                    >
                      <div>
                        <p
                          className="

                              text-xs

                              font-black

                              text-[#b88f25]

                            "
                        >
                          {order.orderId}
                        </p>

                        <h2
                          className="

                              text-lg

                              font-black

                              text-[#4a1624]

                              mt-1

                            "
                        >
                          Product Order
                        </h2>
                      </div>

                      <span
                        className={`

                            px-3

                            py-1

                            rounded-full

                            border

                            text-[10px]

                            font-black


                            ${getStatusStyle(order.status)}

                          `}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div
                      className="

                          grid

                          grid-cols-2

                          gap-4

                          mt-6

                        "
                    >
                      <SmallInfo
                        title="Products"
                        value={order.products?.length || 0}
                      />

                      <SmallInfo
                        title="Total"
                        value={`LKR ${
                          order.totalPrice?.toLocaleString() || "0"
                        }`}
                      />
                    </div>

                    <p
                      className="

                          text-xs

                          text-[#9a8273]

                          mt-5

                        "
                    >
                      {formatDate(order.date || order.createdAt)}
                    </p>

                    <button
                      type="button"
                      onClick={() => setSelectedProductOrder(order)}
                      className="

                          w-full

                          mt-5

                          py-3

                          rounded-xl

                          bg-[#f8f1e8]

                          text-[#6b1d2f]

                          border

                          border-[#e1d2c0]

                          font-bold

                          flex

                          items-center

                          justify-center

                          gap-2

                          hover:bg-[#6b1d2f]

                          hover:text-[#f3d975]

                          transition-all

                        "
                    >
                      <FaEye />
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =================================================

            CUSTOM ORDERS

        ================================================= */}

        {activeTab === "custom" && (
          <div>
            {customOrders.length === 0 ? (
              <EmptyOrders
                title="No Custom Orders Yet"
                text="ඔබේම custom design එකක් අපට එවලා tailoring order එකක් පටන් ගන්න."
                buttonText="Create Custom Design"
                onClick={() => navigate("/custom-design")}
              />
            ) : (
              <div
                className="

                  grid

                  md:grid-cols-2

                  xl:grid-cols-3

                  gap-6

                "
              >
                {customOrders.map((order) => (
                  <div
                    key={order._id || order.customOrderId}
                    className="

                        overflow-hidden

                        bg-white

                        rounded-[26px]

                        border

                        border-[#e1d2c0]

                        shadow-[0_12px_35px_rgba(91,26,43,0.09)]

                        hover:-translate-y-1

                        hover:border-[#d4af37]

                        transition-all

                      "
                  >
                    {/* IMAGE */}

                    <div
                      className="

                          relative

                          h-[230px]

                          bg-[#f6ede2]

                          overflow-hidden

                        "
                    >
                      <img
                        src={order.designImage || "/placeholder.png"}
                        alt="Custom Design"
                        className="

                            w-full

                            h-full

                            object-cover

                          "
                      />

                      <div
                        className="

                            absolute

                            top-4

                            left-4

                            px-3

                            py-1.5

                            rounded-full

                            bg-[#6b1d2f]

                            text-[#f3d975]

                            text-[10px]

                            font-black

                          "
                      >
                        CUSTOM DESIGN
                      </div>
                    </div>

                    <div className="p-5">
                      <div
                        className="

                            flex

                            items-start

                            justify-between

                            gap-3

                          "
                      >
                        <div>
                          <p
                            className="

                                text-xs

                                text-[#b88f25]

                                font-black

                              "
                          >
                            {order.customOrderId}
                          </p>

                          <h2
                            className="

                                text-lg

                                font-black

                                text-[#4a1624]

                                mt-1

                              "
                          >
                            Tailoring Order
                          </h2>
                        </div>

                        <span
                          className={`

                              px-3

                              py-1

                              rounded-full

                              border

                              text-[10px]

                              font-black


                              ${getStatusStyle(order.status)}

                            `}
                        >
                          {order.status}
                        </span>
                      </div>

                      {/* GARMENT TYPE */}

                      <div className="mt-5 flex items-center gap-2 text-sm text-[#6b1d2f] font-black">
                        <FaTshirt />
                        {getGarmentLabel(order.garmentType)}
                      </div>

                      {/* SIZE TYPE */}

                      <div
                        className="

                            mt-5

                            flex

                            items-center

                            gap-2

                            text-sm

                            text-[#6b1d2f]

                            font-bold

                          "
                      >
                        {order.measurementType === "custom" ? (
                          <FaRulerCombined />
                        ) : (
                          <FaTshirt />
                        )}

                        {order.measurementType === "custom"
                          ? "Custom Measurements"
                          : `Standard Size - ${order.standardSize || "-"}`}
                      </div>

                      {/* PRICE */}

                      <div
                        className="

                            mt-5

                            rounded-2xl

                            bg-[#faf7f2]

                            border

                            border-[#eadfd2]

                            p-4

                          "
                      >
                        <p
                          className="

                              text-xs

                              text-[#9a8273]

                              font-bold

                              uppercase

                            "
                        >
                          Quoted Price
                        </p>

                        {order.price ? (
                          <p
                            className="

                                text-2xl

                                font-black

                                text-[#6b1d2f]

                                mt-1

                              "
                          >
                            LKR {order.price.toLocaleString()}
                          </p>
                        ) : (
                          <p
                            className="

                                text-lg

                                font-black

                                text-[#b88f25]

                                mt-1

                              "
                          >
                            Price Pending
                          </p>
                        )}
                      </div>

                      {/* PAYMENT */}

                      <div
                        className="

                            flex

                            items-center

                            justify-between

                            mt-4

                            gap-3

                          "
                      >
                        <span
                          className="

                              text-xs

                              text-[#9a8273]

                            "
                        >
                          Payment
                        </span>

                        <span
                          className={`

                              px-3

                              py-1

                              rounded-full

                              border

                              text-[10px]

                              font-black


                              ${getPaymentStyle(order.paymentStatus)}

                            `}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>

                      {order.status === "Cancelled" && order.cancelReason && (
                        <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-4">
                          <p className="text-[10px] font-black uppercase text-red-600">
                            Cancellation Reason
                          </p>
                          <p className="text-sm text-red-700 mt-2 leading-6">
                            {order.cancelReason}
                          </p>
                        </div>
                      )}

                      <p
                        className="

                            text-xs

                            text-[#9a8273]

                            mt-4

                          "
                      >
                        {formatDate(order.date || order.createdAt)}
                      </p>

                      <button
                        type="button"
                        onClick={() => openCustomOrder(order)}
                        className="

                            w-full

                            mt-5

                            py-3

                            rounded-xl

                            bg-[#6b1d2f]

                            text-[#f3d975]

                            font-bold

                            flex

                            items-center

                            justify-center

                            gap-2

                            shadow-[0_4px_0_#d4af37]

                            active:translate-y-1

                            active:shadow-none

                            transition-all

                          "
                      >
                        <FaEye />
                        View Full Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =================================================

            NORMAL ORDER MODAL

        ================================================= */}

        {selectedProductOrder && (
          <div
            className="

              fixed

              inset-0

              z-[100]

              bg-black/50

              backdrop-blur-sm

              p-4

              flex

              items-center

              justify-center

            "
          >
            <div
              className="

                w-full

                max-w-3xl

                max-h-[90vh]

                overflow-y-auto

                bg-[#faf7f2]

                rounded-[30px]

                border-2

                border-[#d4af37]

                shadow-2xl

              "
            >
              <ModalHeader
                title={selectedProductOrder.orderId}
                text="PRODUCT ORDER DETAILS"
                onClose={() => setSelectedProductOrder(null)}
              />

              <div className="p-6 md:p-8">
                <div
                  className="

                    grid

                    sm:grid-cols-2

                    gap-4

                  "
                >
                  <InfoCard
                    title="Status"
                    value={selectedProductOrder.status}
                  />

                  <InfoCard
                    title="Total"
                    value={`LKR ${
                      selectedProductOrder.totalPrice?.toLocaleString() || "0"
                    }`}
                  />
                </div>

                {/* DELIVERY */}

                <div
                  className="

                    mt-5

                    p-5

                    rounded-2xl

                    bg-white

                    border

                    border-[#eadaca]

                  "
                >
                  <h3
                    className="

                      text-sm

                      font-black

                      text-[#4a1624]

                    "
                  >
                    Delivery Details
                  </h3>

                  <p
                    className="

                      text-sm

                      text-[#806f63]

                      mt-3

                      leading-6

                    "
                  >
                    {selectedProductOrder.fullName}
                    <br />
                    {selectedProductOrder.phone}
                    <br />
                    {selectedProductOrder.address}
                    <br />
                    {selectedProductOrder.city}, {selectedProductOrder.district}
                  </p>
                </div>

                {/* PRODUCTS */}

                <div className="mt-6">
                  <h3
                    className="

                      text-lg

                      font-black

                      text-[#4a1624]

                    "
                  >
                    Products
                  </h3>

                  <div className="space-y-3 mt-4">
                    {selectedProductOrder.products?.map((product, index) => (
                      <div
                        key={product._id || product.productId || index}
                        className="

                            flex

                            items-center

                            gap-4

                            bg-white

                            border

                            border-[#eadaca]

                            rounded-2xl

                            p-4

                          "
                      >
                        <img
                          src={product.image || "/placeholder.png"}
                          alt={product.name}
                          className="

                              w-16

                              h-16

                              object-cover

                              rounded-xl

                            "
                        />

                        <div className="flex-1">
                          <p
                            className="

                                font-black

                                text-[#4a1624]

                              "
                          >
                            {product.name}
                          </p>

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

                              font-black

                              text-[#6b1d2f]

                            "
                        >
                          LKR{" "}
                          {(product.price * product.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedProductOrder.notes && (
                  <NoteBox
                    title="Order Notes"
                    text={selectedProductOrder.notes}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================

            CUSTOM ORDER MODAL

        ================================================= */}

        {selectedCustomOrder && (
          <div
            className="

              fixed

              inset-0

              z-[100]

              bg-black/50

              backdrop-blur-sm

              p-4

              flex

              items-center

              justify-center

            "
          >
            <div
              className="

                w-full

                max-w-4xl

                max-h-[92vh]

                overflow-y-auto

                bg-[#faf7f2]

                rounded-[30px]

                border-2

                border-[#d4af37]

                shadow-2xl

              "
            >
              <ModalHeader
                title={selectedCustomOrder.customOrderId}
                text="CUSTOM DESIGN ORDER"
                onClose={() => setSelectedCustomOrder(null)}
              />

              <div className="p-6 md:p-8">
                {/* DESIGN IMAGE */}

                <div
                  className="

                    max-w-lg

                    mx-auto

                    rounded-[22px]

                    overflow-hidden

                    border

                    border-[#eadaca]

                    bg-white

                  "
                >
                  <img
                    src={selectedCustomOrder.designImage}
                    alt="Custom Design"
                    className="

                      w-full

                      max-h-[500px]

                      object-contain

                    "
                  />
                </div>

                {/* STATUS */}

                <div
                  className="

                    grid

                    sm:grid-cols-3

                    gap-4

                    mt-7

                  "
                >
                  <InfoCard
                    title="Order Status"
                    value={selectedCustomOrder.status}
                  />

                  <InfoCard
                    title="Payment"
                    value={selectedCustomOrder.paymentStatus}
                  />

                  <InfoCard
                    title="Price"
                    value={
                      selectedCustomOrder.price
                        ? `LKR ${selectedCustomOrder.price.toLocaleString()}`
                        : "Price Pending"
                    }
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <InfoCard
                    title="Contact Number"
                    value={selectedCustomOrder.telephone}
                  />
                  <InfoCard
                    title="Customer Email"
                    value={selectedCustomOrder.email}
                  />

                  <InfoCard
                    title="Garment Type"
                    value={getGarmentLabel(selectedCustomOrder.garmentType)}
                  />
                </div>

                {/* MEASUREMENT TYPE */}

                <div
                  className="

                    mt-6

                    bg-white

                    rounded-2xl

                    border

                    border-[#eadaca]

                    p-5

                  "
                >
                  <div
                    className="

                      flex

                      items-center

                      gap-2

                      text-[#b88f25]

                    "
                  >
                    <FaRulerCombined />

                    <p
                      className="

                        text-xs

                        font-black

                        uppercase

                      "
                    >
                      Size / Measurements
                    </p>
                  </div>

                  {selectedCustomOrder.measurementType === "standard" ? (
                    <div className="mt-4">
                      <p
                        className="

                          text-sm

                          text-[#9a8273]

                        "
                      >
                        Standard Size
                      </p>

                      <p
                        className="

                          text-3xl

                          font-black

                          text-[#6b1d2f]

                          mt-1

                        "
                      >
                        {selectedCustomOrder.standardSize}
                      </p>
                    </div>
                  ) : (
                    <div
                      className="

                        grid

                        sm:grid-cols-2

                        lg:grid-cols-3

                        gap-3

                        mt-5

                      "
                    >
                      {getOrderMeasurementFields(selectedCustomOrder).map(
                        (field) => (
                          <Measurement
                            key={field.name}
                            title={field.label}
                            value={
                              selectedCustomOrder.measurements?.[field.name]
                            }
                            unit={selectedCustomOrder.measurementUnit}
                          />
                        ),
                      )}
                    </div>
                  )}
                </div>

                {/* FABRIC */}

                <div
                  className="

                    mt-5

                    bg-white

                    rounded-2xl

                    border

                    border-[#eadaca]

                    p-5

                  "
                >
                  <p
                    className="

                      text-xs

                      font-black

                      text-[#b88f25]

                      uppercase

                    "
                  >
                    Fabric
                  </p>

                  <p
                    className="

                      text-[#4a1624]

                      font-bold

                      mt-2

                    "
                  >
                    {selectedCustomOrder.customerProvidesFabric
                      ? "Customer will provide the fabric ✅"
                      : "Fabric is not provided by customer"}
                  </p>
                </div>

                {selectedCustomOrder.notes && (
                  <NoteBox
                    title="Special Notes"
                    text={selectedCustomOrder.notes}
                  />
                )}

                {selectedCustomOrder.status === "Cancelled" &&
                  selectedCustomOrder.cancelReason && (
                    <div className="mt-5 bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                      <p className="text-xs font-black uppercase text-red-600">
                        Cancellation Reason
                      </p>
                      <p className="text-sm text-red-800 mt-3 leading-7">
                        {selectedCustomOrder.cancelReason}
                      </p>
                      {selectedCustomOrder.cancelledAt && (
                        <p className="text-xs text-red-500 mt-3">
                          Cancelled:{" "}
                          {formatDate(selectedCustomOrder.cancelledAt)}
                        </p>
                      )}
                    </div>
                  )}

                <div
                  className="

                    mt-6

                    rounded-2xl

                    bg-[#6b1d2f]

                    text-white

                    p-5

                  "
                >
                  <div
                    className="

                      flex

                      flex-col

                      sm:flex-row

                      sm:items-center

                      sm:justify-between

                      gap-4

                    "
                  >
                    <div>
                      <p
                        className="

                          text-xs

                          text-[#e7cda7]

                        "
                      >
                        Custom Order Price
                      </p>

                      <p
                        className="

                          text-2xl

                          font-black

                          text-[#f3d975]

                          mt-1

                        "
                      >
                        {selectedCustomOrder.price
                          ? `LKR ${selectedCustomOrder.price.toLocaleString()}`
                          : "Price Pending"}
                      </p>
                    </div>

                    <span
                      className={`

                        px-4

                        py-2

                        rounded-full

                        border

                        text-xs

                        font-black


                        ${getStatusStyle(selectedCustomOrder.status)}

                      `}
                    >
                      {selectedCustomOrder.status}
                    </span>
                  </div>

                  <p
                    className="

                      text-xs

                      text-[#e7cda7]

                      mt-4

                    "
                  >
                    {formatDate(
                      selectedCustomOrder.date || selectedCustomOrder.createdAt,
                    )}
                  </p>
                </div>

                {/* =================================================
                    CUSTOM PAYMENT AREA
                ================================================= */}

                {selectedCustomOrder.price &&
                  selectedCustomOrder.status !== "Cancelled" &&
                  (selectedCustomOrder.paymentStatus === "Payment Pending" ||
                    selectedCustomOrder.paymentStatus === "Failed") && (
                    <div className="mt-6 bg-white border border-[#e1d2c0] rounded-[24px] p-5 md:p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[#fff8e7] border border-[#e6cf8c] text-[#b88f25] flex items-center justify-center">
                          <FaCreditCard />
                        </div>

                        <div>
                          <p className="text-xs font-black uppercase tracking-[2px] text-[#b88f25]">
                            Secure Payment
                          </p>
                          <h3 className="text-xl font-black text-[#4a1624] mt-1">
                            Choose your payment plan
                          </h3>
                        </div>
                      </div>

                      {selectedCustomOrder.paymentStatus === "Failed" && (
                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                          <p className="text-sm font-bold text-red-700">
                            Your previous payment attempt was not completed. You
                            can try again.
                          </p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <button
                          type="button"
                          onClick={() => setCustomPaymentPlan("Full Payment")}
                          className={`text-left rounded-2xl border-2 p-5 transition-all ${
                            customPaymentPlan === "Full Payment"
                              ? "border-[#d4af37] bg-[#fff9e8] shadow-md"
                              : "border-[#eadfd2] bg-white hover:border-[#d4af37]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                customPaymentPlan === "Full Payment"
                                  ? "border-[#6b1d2f] bg-[#6b1d2f]"
                                  : "border-[#cbbbab]"
                              }`}
                            >
                              {customPaymentPlan === "Full Payment" && (
                                <FaCheckCircle className="text-[#f3d975] text-xs" />
                              )}
                            </div>

                            <div>
                              <p className="font-black text-[#4a1624]">
                                Full Payment
                              </p>
                              <p className="text-xs text-[#8b7567] mt-1">
                                Pay the complete custom order price now.
                              </p>
                              <p className="text-lg font-black text-[#6b1d2f] mt-3">
                                LKR {selectedCustomPrice.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCustomPaymentPlan("Half Payment")}
                          className={`text-left rounded-2xl border-2 p-5 transition-all ${
                            customPaymentPlan === "Half Payment"
                              ? "border-[#d4af37] bg-[#fff9e8] shadow-md"
                              : "border-[#eadfd2] bg-white hover:border-[#d4af37]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                customPaymentPlan === "Half Payment"
                                  ? "border-[#6b1d2f] bg-[#6b1d2f]"
                                  : "border-[#cbbbab]"
                              }`}
                            >
                              {customPaymentPlan === "Half Payment" && (
                                <FaCheckCircle className="text-[#f3d975] text-xs" />
                              )}
                            </div>

                            <div>
                              <p className="font-black text-[#4a1624]">
                                50% Advance
                              </p>
                              <p className="text-xs text-[#8b7567] mt-1">
                                Pay 50% now and the remaining 50% on delivery.
                              </p>
                              <p className="text-lg font-black text-[#6b1d2f] mt-3">
                                LKR {customAmountToPayNow.toLocaleString()} now
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>

                      <div className="mt-5 rounded-2xl bg-[#f8f1e8] border border-[#ead8c7] p-4">
                        <div className="flex justify-between gap-4 text-sm">
                          <span className="text-[#8b7567]">Pay now</span>
                          <span className="font-black text-[#6b1d2f]">
                            LKR {customAmountToPayNow.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4 text-sm mt-3">
                          <span className="text-[#8b7567]">
                            Balance on delivery
                          </span>
                          <span className="font-black text-[#4a1624]">
                            LKR {customBalanceOnDelivery.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-xs font-black uppercase tracking-[1px] text-[#b88f25]">
                          Delivery Details
                        </p>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div className="md:col-span-2">
                            <label className="text-xs font-bold text-[#6b1d2f]">
                              Delivery Address
                            </label>
                            <input
                              type="text"
                              value={customDeliveryAddress}
                              onChange={(e) =>
                                setCustomDeliveryAddress(e.target.value)
                              }
                              placeholder="Enter full delivery address"
                              autoComplete="street-address"
                              className="w-full mt-2 px-4 py-3 rounded-xl border border-[#dfcfbf] bg-[#fffdf9] text-[#4a1624] outline-none focus:border-[#d4af37]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#6b1d2f]">
                              City
                            </label>
                            <input
                              type="text"
                              value={customCity}
                              onChange={(e) => setCustomCity(e.target.value)}
                              placeholder="City"
                              autoComplete="address-level2"
                              className="w-full mt-2 px-4 py-3 rounded-xl border border-[#dfcfbf] bg-[#fffdf9] text-[#4a1624] outline-none focus:border-[#d4af37]"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-[#6b1d2f]">
                              District
                            </label>
                            <input
                              type="text"
                              value={customDistrict}
                              onChange={(e) =>
                                setCustomDistrict(e.target.value)
                              }
                              placeholder="District"
                              autoComplete="address-level1"
                              className="w-full mt-2 px-4 py-3 rounded-xl border border-[#dfcfbf] bg-[#fffdf9] text-[#4a1624] outline-none focus:border-[#d4af37]"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isStartingPayment}
                        onClick={payCustomOrder}
                        className="w-full mt-6 py-4 rounded-2xl bg-[#6b1d2f] text-[#f3d975] font-black flex items-center justify-center gap-2 border-2 border-[#d4af37] shadow-[0_5px_0_#d4af37] active:translate-y-1 active:shadow-none disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      >
                        <FaLock />
                        {isStartingPayment
                          ? "Preparing Secure Payment..."
                          : `Pay LKR ${customAmountToPayNow.toLocaleString()} Securely`}
                      </button>

                      <p className="text-[11px] text-[#9a8273] leading-5 mt-4 text-center">
                        Card details are entered on PayHere. NariCraft does not
                        store your card number or CVV.
                      </p>
                    </div>
                  )}

                {selectedCustomOrder.paymentStatus === "Partially Paid" && (
                  <div className="mt-6 rounded-[24px] border-2 border-blue-200 bg-blue-50 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-blue-600 text-2xl" />
                      <div>
                        <p className="font-black text-blue-800">
                          50% Advance Paid
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          The remaining balance will be collected on delivery.
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 mt-5">
                      <SmallInfo
                        title="Total"
                        value={`LKR ${selectedCustomPrice.toLocaleString()}`}
                      />
                      <SmallInfo
                        title="Paid"
                        value={`LKR ${Number(
                          selectedCustomOrder.paidAmount || 0,
                        ).toLocaleString()}`}
                      />
                      <SmallInfo
                        title="Balance"
                        value={`LKR ${Number(
                          selectedCustomOrder.remainingAmount || 0,
                        ).toLocaleString()}`}
                      />
                    </div>

                    {selectedCustomOrder.deliveryAddress && (
                      <p className="text-xs text-blue-800 mt-5 leading-6">
                        Delivery: {selectedCustomOrder.deliveryAddress},{" "}
                        {selectedCustomOrder.city},{" "}
                        {selectedCustomOrder.district}
                      </p>
                    )}
                  </div>
                )}

                {selectedCustomOrder.paymentStatus === "Paid" && (
                  <div className="mt-6 rounded-[24px] border-2 border-green-200 bg-green-50 p-5 md:p-6">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="text-green-600 text-2xl" />
                      <div>
                        <p className="font-black text-green-800">
                          Payment Completed
                        </p>
                        <p className="text-sm text-green-700 mt-1">
                          This custom order is fully paid.
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 mt-5">
                      <SmallInfo
                        title="Total"
                        value={`LKR ${selectedCustomPrice.toLocaleString()}`}
                      />
                      <SmallInfo
                        title="Paid"
                        value={`LKR ${Number(
                          selectedCustomOrder.paidAmount || 0,
                        ).toLocaleString()}`}
                      />
                      <SmallInfo title="Balance" value="LKR 0" />
                    </div>
                  </div>
                )}

                {selectedCustomOrder.paymentStatus === "Chargedback" && (
                  <div className="mt-6 rounded-2xl border-2 border-red-200 bg-red-50 p-5">
                    <p className="font-black text-red-700">
                      Payment Under Review
                    </p>
                    <p className="text-sm text-red-700 mt-2 leading-6">
                      This payment has a chargeback status. Please contact
                      NariCraft support before making another payment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =====================================================

// SMALL COMPONENTS

// =====================================================

function EmptyOrders({ title, text, buttonText, onClick }) {
  return (
    <div
      className="

        min-h-[420px]

        bg-white

        rounded-[30px]

        border

        border-[#e1d2c0]

        flex

        items-center

        justify-center

        text-center

        p-8

      "
    >
      <div
        className="

          max-w-[450px]

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
          <FaBoxOpen size={30} />
        </div>

        <h2
          className="

            text-2xl

            font-black

            text-[#4a1624]

            mt-5

          "
        >
          {title}
        </h2>

        <p
          className="

            text-[#8b7567]

            mt-2

            leading-7

          "
        >
          {text}
        </p>

        <button
          type="button"
          onClick={onClick}
          className="

            mt-7

            px-7

            py-4

            rounded-2xl

            bg-[#6b1d2f]

            text-[#f3d975]

            font-black

            shadow-[0_6px_0_#d4af37]

          "
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

function SmallInfo({ title, value }) {
  return (
    <div
      className="

        bg-[#faf7f2]

        border

        border-[#eadfd2]

        rounded-xl

        p-3

      "
    >
      <p
        className="

          text-xs

          text-[#9a8273]

        "
      >
        {title}
      </p>

      <p
        className="

          font-black

          text-[#4a1624]

          mt-1

        "
      >
        {value}
      </p>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div
      className="

        bg-white

        border

        border-[#eadaca]

        rounded-2xl

        p-5

      "
    >
      <p
        className="

          text-xs

          font-black

          text-[#b88f25]

          uppercase

        "
      >
        {title}
      </p>

      <p
        className="

          text-[#4a1624]

          font-bold

          mt-3

        "
      >
        {value || "-"}
      </p>
    </div>
  );
}

function Measurement({ title, value, unit }) {
  return (
    <div
      className="

        bg-[#faf7f2]

        border

        border-[#eadfd2]

        rounded-xl

        p-4

      "
    >
      <p
        className="

          text-xs

          text-[#9a8273]

        "
      >
        {title}
      </p>

      <p
        className="

          font-black

          text-[#6b1d2f]

          mt-1

        "
      >
        {value || "-"} {value ? unit : ""}
      </p>
    </div>
  );
}

function NoteBox({ title, text }) {
  return (
    <div
      className="

        mt-5

        bg-[#fff4d9]

        border

        border-[#e8cc83]

        rounded-2xl

        p-5

      "
    >
      <p
        className="

          text-xs

          font-black

          uppercase

          text-[#9a6b00]

        "
      >
        {title}
      </p>

      <p
        className="

          text-sm

          text-[#6f5828]

          leading-6

          mt-2

        "
      >
        {text}
      </p>
    </div>
  );
}

function ModalHeader({ title, text, onClose }) {
  return (
    <div
      className="

        bg-[#6b1d2f]

        text-white

        p-6

        rounded-t-[27px]

        flex

        items-start

        justify-between

        gap-4

      "
    >
      <div>
        <p
          className="

            text-[#d4af37]

            text-xs

            font-black

            tracking-[2px]

          "
        >
          {text}
        </p>

        <h2
          className="

            text-2xl

            font-black

            mt-1

          "
        >
          {title}
        </h2>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="

          w-10

          h-10

          rounded-full

          bg-white/10

          flex

          items-center

          justify-center

          hover:bg-white

          hover:text-[#6b1d2f]

          transition-all

        "
      >
        <FaTimes />
      </button>
    </div>
  );
}
