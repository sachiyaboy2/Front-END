import axios from "axios";

import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import {
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaEye,
  FaMagic,
  FaPhoneAlt,
  FaRulerCombined,
  FaSearch,
  FaSyncAlt,
  FaTimes,
  FaTshirt,
  FaUser,
} from "react-icons/fa";

import { Loader } from "../../components/loader";

// =====================================================
// GARMENT + MEASUREMENT CONFIG
// =====================================================

const garmentMeasurementConfig = {
  "saree-jacket": {
    label: "Saree Jacket",
    fields: [
      { name: "height", title: "Height / උස" },
      { name: "shoulder", title: "Shoulder / උරපතු මිනුම" },
      { name: "bust", title: "Bust / පපුව වට" },
      { name: "abdomen", title: "Abdomen / උදරයේ ප්‍රදේශ මිම්ම" },
      { name: "frontNeckDepth", title: "Front Neck Depth / ඉදිරි කර ගැඹුර" },
      { name: "backNeckDepth", title: "Back Neck Depth / පිටුපස කර ගැඹුර" },
      {
        name: "topToBustPoint",
        title: "Top to Bust Point / ඉහළ සිට බ්‍රා මධ්‍ය ලක්ෂ්‍යය",
      },
      {
        name: "sideToBustPoint",
        title: "Side to Bust Point / බ්‍රා මධ්‍ය ලක්ෂ්‍යය දක්වා",
      },
      { name: "sleeveLength", title: "Sleeve Length / අත දිග" },
      { name: "sleeveCircumference", title: "Sleeve Circumference / අත වට" },
      { name: "armhole", title: "Armhole / අත කැපුම" },
    ],
  },

  frock: {
    label: "Frock",
    fields: [
      { name: "shoulder", title: "Shoulder / උරහිස" },
      { name: "waistLength", title: "Waist Length / ඉන දක්වා" },
      { name: "bust", title: "Bust / පපුව" },
      { name: "waist", title: "Waist / ඉන" },
      { name: "sleeveCircumference", title: "Sleeve Circumference / අත වට" },
      { name: "armhole", title: "Armhole / අත් කැපුම" },
      { name: "skirtLength", title: "Skirt Length / සාය උස" },
      { name: "frontNeckDepth", title: "Front Neck Depth / ඉදිරි කර ගැඹුර" },
    ],
  },

  "crop-top": {
    label: "Crop Top",
    fields: [
      { name: "height", title: "Height / උස" },
      { name: "shoulder", title: "Shoulder / උරහිස" },
      { name: "waistLength", title: "Waist Length / ඉන දක්වා" },
      { name: "bust", title: "Bust / පපුව" },
      { name: "waist", title: "Waist / ඉන" },
      { name: "sleeveCircumference", title: "Sleeve Circumference / අත වට" },
      { name: "armhole", title: "Armhole / අත් කැපුම" },
      { name: "frontNeckDepth", title: "Front Neck Depth / ඉදිරි කර ගැඹුර" },
    ],
  },
};

const legacyMeasurementFields = [
  { name: "bust", title: "Bust" },
  { name: "underBust", title: "Under Bust" },
  { name: "waist", title: "Waist" },
  { name: "shoulder", title: "Shoulder" },
  { name: "sleeveLength", title: "Sleeve Length" },
  { name: "sleeveCircumference", title: "Sleeve Circumference" },
  { name: "frontNeck", title: "Front Neck" },
  { name: "backNeck", title: "Back Neck" },
  { name: "jacketLength", title: "Jacket Length" },
];

function getGarmentLabel(garmentType) {
  return garmentMeasurementConfig[garmentType]?.label || "Legacy Custom Design";
}

function getMeasurementFieldsForOrder(order) {
  return (
    garmentMeasurementConfig[order?.garmentType]?.fields ||
    legacyMeasurementFields
  );
}

export default function AdminCustomOrdersPage() {
  // =====================================================

  // STATES

  // =====================================================

  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [priceInputs, setPriceInputs] = useState({});

  const [cancellingOrder, setCancellingOrder] = useState(null);

  const [cancelReason, setCancelReason] = useState("");

  // =====================================================

  // ORDER STATUSES

  // =====================================================

  const statuses = [
    "Pending",

    "Reviewed",

    "Accepted",

    "In Progress",

    "Ready",

    "Completed",

    "Cancelled",
  ];

  // =====================================================

  // PAYMENT STATUSES

  // =====================================================

  const paymentStatuses = ["Price Pending", "Payment Pending", "Paid"];

  // =====================================================

  // LOAD CUSTOM ORDERS

  // =====================================================

  function loadOrders() {
    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("You need to login first");

      setIsLoading(false);

      return;
    }

    setIsLoading(true);

    axios

      .get(
        import.meta.env.VITE_API_URL + "/api/custom-orders",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      .then((res) => {
        setOrders(res.data);

        const prices = {};

        res.data.forEach((order) => {
          prices[order.customOrderId] = order.price || "";
        });

        setPriceInputs(prices);
      })

      .catch((err) => {
        console.log("Load Custom Orders Error:", err);

        toast.error(
          err.response?.data?.message || "Failed to load custom orders",
        );
      })

      .finally(() => {
        setIsLoading(false);
      });
  }

  // =====================================================

  // LOAD PAGE

  // =====================================================

  useEffect(() => {
    loadOrders();
  }, []);

  // =====================================================

  // UPDATE ORDER INSIDE PAGE

  // =====================================================

  function replaceOrder(updatedOrder) {
    setOrders((oldOrders) => {
      return oldOrders.map((order) => {
        if (order.customOrderId === updatedOrder.customOrderId) {
          return updatedOrder;
        }

        return order;
      });
    });

    setSelectedOrder((oldSelected) => {
      if (oldSelected?.customOrderId === updatedOrder.customOrderId) {
        return updatedOrder;
      }

      return oldSelected;
    });
  }

  // =====================================================

  // UPDATE PRICE

  // =====================================================

  async function updatePrice(customOrderId) {
    const token = localStorage.getItem("token");

    const price = Number(priceInputs[customOrderId]);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid price");

      return;
    }

    try {
      setUpdatingOrderId(customOrderId);

      const response = await axios.put(
        import.meta.env.VITE_API_URL +
          "/api/custom-orders/price/" +
          customOrderId,

        {
          price: price,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      replaceOrder(response.data.order);

      setPriceInputs((old) => ({
        ...old,

        [customOrderId]: response.data.order.price,
      }));

      toast.success("Custom order price updated");
    } catch (err) {
      console.log("Price Update Error:", err);

      toast.error(err.response?.data?.message || "Failed to update price");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  // =====================================================

  // UPDATE ORDER STATUS

  // =====================================================

  async function updateOrderStatus(customOrderId, status, reason = "") {
    const token = localStorage.getItem("token");

    try {
      setUpdatingOrderId(customOrderId);

      const response = await axios.put(
        import.meta.env.VITE_API_URL +
          "/api/custom-orders/status/" +
          customOrderId,
        {
          status: status,
          cancelReason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      replaceOrder(response.data.order);

      toast.success(
        status === "Cancelled"
          ? "Order cancelled successfully"
          : "Order status updated",
      );

      return true;
    } catch (err) {
      console.log("Status Update Error:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
      return false;
    } finally {
      setUpdatingOrderId(null);
    }
  }

  function handleStatusChange(order, newStatus) {
    if (newStatus === "Cancelled") {
      setCancellingOrder(order);
      setCancelReason("");
      return;
    }

    updateOrderStatus(order.customOrderId, newStatus);
  }

  // =====================================================

  // UPDATE PAYMENT STATUS

  // =====================================================

  async function updatePaymentStatus(customOrderId, paymentStatus) {
    const token = localStorage.getItem("token");

    try {
      setUpdatingOrderId(customOrderId);

      const response = await axios.put(
        import.meta.env.VITE_API_URL +
          "/api/custom-orders/payment/" +
          customOrderId,

        {
          paymentStatus: paymentStatus,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      replaceOrder(response.data.order);

      toast.success("Payment status updated");
    } catch (err) {
      console.log("Payment Update Error:", err);

      toast.error(
        err.response?.data?.message || "Failed to update payment status",
      );
    } finally {
      setUpdatingOrderId(null);
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

    if (status === "Reviewed") {
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    }

    if (status === "Accepted") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    if (status === "In Progress") {
      return "bg-purple-100 text-purple-700 border-purple-200";
    }

    if (status === "Ready") {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }

    if (status === "Completed") {
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

    if (status === "Paid") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    return "bg-gray-100 text-gray-700 border-gray-200";
  }

  // =====================================================

  // FILTER ORDERS

  // =====================================================

  const filteredOrders = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const matchesSearch =
        searchText === "" ||
        order.customOrderId?.toLowerCase().includes(searchText) ||
        order.fullName?.toLowerCase().includes(searchText) ||
        order.email?.toLowerCase().includes(searchText) ||
        order.telephone?.toLowerCase().includes(searchText);

      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  // =====================================================

  // STATISTICS

  // =====================================================

  const pendingCount = orders.filter(
    (order) => order.status === "Pending",
  ).length;

  const pricePendingCount = orders.filter(
    (order) => !order.price || order.paymentStatus === "Price Pending",
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "Completed",
  ).length;

  // =====================================================

  // LOADING

  // =====================================================

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div
      className="

        w-full

        min-h-full

        bg-[#f6ede2]

        p-4

        md:p-7

      "
    >
      {/* =================================================

          HEADER

      ================================================= */}

      <div
        className="

          flex

          flex-col

          lg:flex-row

          lg:items-end

          lg:justify-between

          gap-5

          mb-7

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
            NariCraft Admin
          </p>

          <h1
            className="

              text-3xl

              font-black

              text-[#4a1624]

              mt-2

            "
          >
            Custom Design Orders
          </h1>

          <p
            className="

              text-sm

              text-[#8b7567]

              mt-2

              max-w-2xl

            "
          >
            Customer designs, measurements, fabric details, quoted prices and
            tailoring progress මෙතනින් manage කරන්න.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOrders}
          className="

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

            flex

            items-center

            justify-center

            gap-2

          "
        >
          <FaSyncAlt />
          Refresh Orders
        </button>
      </div>

      {/* =================================================

          STATISTICS

      ================================================= */}

      <div
        className="

          grid

          sm:grid-cols-2

          xl:grid-cols-4

          gap-4

          mb-7

        "
      >
        <StatCard
          icon={<FaMagic />}
          title="Total Custom Orders"
          value={orders.length}
        />

        <StatCard
          icon={<FaClock />}
          title="Pending Review"
          value={pendingCount}
        />

        <StatCard
          icon={<FaDollarSign />}
          title="Price Pending"
          value={pricePendingCount}
        />

        <StatCard
          icon={<FaCheckCircle />}
          title="Completed"
          value={completedCount}
        />
      </div>

      {/* =================================================

          SEARCH + FILTER

      ================================================= */}

      <div
        className="

          bg-white

          rounded-[22px]

          border

          border-[#e1d2c0]

          shadow-[0_8px_25px_rgba(91,26,43,0.06)]

          p-4

          mb-7


          flex

          flex-col

          lg:flex-row

          gap-4

        "
      >
        <div
          className="

            flex-1

            flex

            items-center

            gap-3

            px-4

            rounded-xl

            bg-[#faf7f2]

            border

            border-[#dfd0bf]

            focus-within:border-[#d4af37]

          "
        >
          <FaSearch
            className="

              text-[#b88f25]

            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Order ID, customer, email or phone..."
            className="

              w-full

              py-3

              bg-transparent

              outline-none

              text-[#4a1624]

            "
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="

            min-w-[190px]

            p-3

            rounded-xl

            bg-[#faf7f2]

            border

            border-[#dfd0bf]

            font-bold

            text-[#4a1624]

            outline-none

          "
        >
          <option value="All">All Statuses</option>

          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* =================================================

          EMPTY

      ================================================= */}

      {filteredOrders.length === 0 ? (
        <div
          className="

            min-h-[400px]

            bg-white

            rounded-[28px]

            border

            border-[#e1d2c0]

            flex

            items-center

            justify-center

            text-center

            p-8

          "
        >
          <div>
            <div
              className="

                w-20

                h-20

                rounded-full

                bg-[#f8f1e8]

                text-[#6b1d2f]

                flex

                items-center

                justify-center

                mx-auto

              "
            >
              <FaTshirt size={30} />
            </div>

            <h2
              className="

                text-2xl

                font-black

                text-[#4a1624]

                mt-5

              "
            >
              No Custom Orders Found
            </h2>

            <p
              className="

                text-[#8b7567]

                mt-2

              "
            >
              Custom tailoring orders will appear here.
            </p>
          </div>
        </div>
      ) : (
        /* =================================================

            ORDER CARDS

        ================================================= */

        <div
          className="

            grid

            xl:grid-cols-2

            gap-6

          "
        >
          {filteredOrders.map((order) => (
            <div
              key={order._id || order.customOrderId}
              className="

                  bg-white

                  rounded-[28px]

                  border

                  border-[#e1d2c0]

                  shadow-[0_12px_35px_rgba(91,26,43,0.08)]

                  overflow-hidden

                  hover:border-[#d4af37]

                  transition-all

                "
            >
              <div
                className="

                    grid

                    md:grid-cols-[190px_1fr]

                  "
              >
                {/* ================= IMAGE ================= */}

                <div
                  className="

                      h-[240px]

                      md:h-full

                      min-h-[280px]

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
                </div>

                {/* ================= DETAILS ================= */}

                <div className="p-5">
                  <div
                    className="

                        flex

                        items-start

                        justify-between

                        gap-4

                      "
                  >
                    <div>
                      <p
                        className="

                            text-[#b88f25]

                            text-xs

                            font-black

                            tracking-wide

                          "
                      >
                        {order.customOrderId}
                      </p>

                      <h2
                        className="

                            text-xl

                            font-black

                            text-[#4a1624]

                            mt-1

                          "
                      >
                        {order.fullName}
                      </h2>

                      <p
                        className="

                            text-xs

                            text-[#9a8273]

                            mt-1

                          "
                      >
                        {order.email}
                      </p>
                    </div>

                    <span
                      className={`

                          px-3

                          py-1

                          rounded-full

                          border

                          text-[10px]

                          font-black

                          whitespace-nowrap


                          ${getStatusStyle(order.status)}

                        `}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* ================= MEASUREMENT TYPE ================= */}

                  <div
                    className="

                        flex

                        items-center

                        gap-2

                        mt-5

                        text-sm

                        font-bold

                        text-[#6b1d2f]

                      "
                  >
                    <FaTshirt />

                    <span>{getGarmentLabel(order.garmentType)}</span>

                    <span className="text-[#b88f25]">•</span>

                    <span>
                      {order.measurementType === "custom"
                        ? `Custom Measurements (${order.measurementUnit})`
                        : `Standard Size - ${order.standardSize}`}
                    </span>
                  </div>

                  {/* ================= PRICE ================= */}

                  <div
                    className="

                        grid

                        grid-cols-2

                        gap-3

                        mt-5

                      "
                  >
                    <div
                      className="

                          rounded-xl

                          bg-[#faf7f2]

                          border

                          border-[#eadfd2]

                          p-3

                        "
                    >
                      <p
                        className="

                            text-[10px]

                            uppercase

                            text-[#9a8273]

                            font-bold

                          "
                      >
                        Quoted Price
                      </p>

                      <p
                        className="

                            font-black

                            text-[#6b1d2f]

                            mt-1

                          "
                      >
                        {order.price
                          ? `LKR ${order.price.toLocaleString()}`
                          : "Price Pending"}
                      </p>
                    </div>

                    <div
                      className="

                          rounded-xl

                          bg-[#faf7f2]

                          border

                          border-[#eadfd2]

                          p-3

                        "
                    >
                      <p
                        className="

                            text-[10px]

                            uppercase

                            text-[#9a8273]

                            font-bold

                          "
                      >
                        Payment
                      </p>

                      <span
                        className={`

                            inline-flex

                            mt-1

                            px-2

                            py-1

                            rounded-full

                            border

                            text-[9px]

                            font-black


                            ${getPaymentStyle(order.paymentStatus)}

                          `}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {order.status === "Cancelled" && order.cancelReason && (
                    <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3">
                      <p className="text-[10px] font-black uppercase text-red-600">
                        Cancellation Reason
                      </p>
                      <p className="text-xs text-red-700 mt-1 leading-5">
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
                    {formatDate(order.createdAt || order.date)}
                  </p>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
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
                    View & Manage Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =================================================

          FULL DETAILS MODAL

      ================================================= */}

      {selectedOrder && (
        <div
          className="

            fixed

            inset-0

            z-[100]

            bg-black/55

            backdrop-blur-sm

            flex

            items-center

            justify-center

            p-3

            md:p-5

          "
        >
          <div
            className="

              w-full

              max-w-6xl

              max-h-[94vh]

              overflow-y-auto

              bg-[#faf7f2]

              rounded-[30px]

              border-2

              border-[#d4af37]

              shadow-2xl

            "
          >
            {/* ===============================================

                MODAL HEADER

            =============================================== */}

            <div
              className="

                sticky

                top-0

                z-10

                bg-[#6b1d2f]

                text-white

                p-5

                md:p-6

                rounded-t-[27px]

                flex

                items-start

                justify-between

                gap-5

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
                  CUSTOM ORDER DETAILS
                </p>

                <h2
                  className="

                    text-2xl

                    md:text-3xl

                    font-black

                    mt-1

                  "
                >
                  {selectedOrder.customOrderId}
                </h2>

                <p
                  className="

                    text-[#e7cda7]

                    text-xs

                    mt-2

                  "
                >
                  {formatDate(selectedOrder.createdAt || selectedOrder.date)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="

                  w-11

                  h-11

                  shrink-0

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

            <div className="p-5 md:p-8">
              {/* ===============================================

                  IMAGE + CUSTOMER

              =============================================== */}

              <div
                className="

                  grid

                  lg:grid-cols-[380px_1fr]

                  gap-6

                "
              >
                {/* IMAGE */}

                <div>
                  <p
                    className="

                      text-xs

                      font-black

                      text-[#b88f25]

                      uppercase

                      mb-3

                    "
                  >
                    Customer Design
                  </p>

                  <div
                    className="

                      bg-white

                      border

                      border-[#eadaca]

                      rounded-[22px]

                      overflow-hidden

                    "
                  >
                    <img
                      src={selectedOrder.designImage || "/placeholder.png"}
                      alt="Customer Design"
                      className="

                        w-full

                        max-h-[520px]

                        object-contain

                      "
                    />
                  </div>
                </div>

                {/* CUSTOMER INFO */}

                <div>
                  <p
                    className="

                      text-xs

                      font-black

                      text-[#b88f25]

                      uppercase

                      mb-3

                    "
                  >
                    Customer Information
                  </p>

                  <div
                    className="

                      grid

                      sm:grid-cols-2

                      gap-4

                    "
                  >
                    <InfoCard
                      icon={<FaUser />}
                      title="Customer"
                      value={selectedOrder.fullName}
                    />

                    <InfoCard
                      icon={<FaPhoneAlt />}
                      title="Telephone"
                      value={selectedOrder.telephone}
                    />

                    <InfoCard
                      icon={<FaMagic />}
                      title="Email"
                      value={selectedOrder.email}
                    />

                    <InfoCard
                      icon={<FaTshirt />}
                      title="Garment Type"
                      value={getGarmentLabel(selectedOrder.garmentType)}
                    />

                    <InfoCard
                      icon={<FaTshirt />}
                      title="Fabric"
                      value={
                        selectedOrder.customerProvidesFabric
                          ? "Customer provides fabric"
                          : "Customer does not provide fabric"
                      }
                    />
                  </div>

                  {/* MEASUREMENT TYPE */}

                  <div
                    className="

                      mt-4

                      bg-white

                      border

                      border-[#eadaca]

                      rounded-2xl

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
                        Measurement Type
                      </p>
                    </div>

                    <p
                      className="

                        text-lg

                        font-black

                        text-[#4a1624]

                        mt-3

                      "
                    >
                      {selectedOrder.measurementType === "custom"
                        ? "Custom Measurements"
                        : `Standard Size - ${selectedOrder.standardSize}`}
                    </p>

                    {selectedOrder.measurementType === "custom" && (
                      <p
                        className="

                          text-sm

                          text-[#9a8273]

                          mt-1

                        "
                      >
                        Measurement Unit:{" "}
                        <strong>
                          {selectedOrder.measurementUnit === "in"
                            ? "Inches"
                            : "Centimeters"}
                        </strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ===============================================

                  CUSTOM MEASUREMENTS

              =============================================== */}

              {selectedOrder.measurementType === "custom" && (
                <div className="mt-8">
                  <div
                    className="

                      flex

                      items-center

                      gap-3

                      mb-4

                    "
                  >
                    <div
                      className="

                        w-10

                        h-10

                        rounded-xl

                        bg-[#6b1d2f]

                        text-[#f3d975]

                        flex

                        items-center

                        justify-center

                      "
                    >
                      <FaRulerCombined />
                    </div>

                    <div>
                      <h3
                        className="

                          text-xl

                          font-black

                          text-[#4a1624]

                        "
                      >
                        Body Measurements
                      </h3>

                      <p
                        className="

                          text-xs

                          text-[#9a8273]

                          mt-1

                        "
                      >
                        All customer measurements provided for this tailoring
                        order.
                      </p>
                    </div>
                  </div>

                  <div
                    className="

                      grid

                      sm:grid-cols-2

                      lg:grid-cols-3

                      gap-4

                    "
                  >
                    {getMeasurementFieldsForOrder(selectedOrder).map(
                      (field) => (
                        <MeasurementCard
                          key={field.name}
                          title={field.title}
                          value={selectedOrder.measurements?.[field.name]}
                          unit={selectedOrder.measurementUnit}
                        />
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* ===============================================

                  NOTES

              =============================================== */}

              <div
                className="

                  mt-8

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

                    text-[#9a6b00]

                    uppercase

                  "
                >
                  Customer Special Notes
                </p>

                <p
                  className="

                    text-sm

                    text-[#6f5828]

                    leading-7

                    mt-2

                  "
                >
                  {selectedOrder.notes || "No special notes provided."}
                </p>
              </div>

              {selectedOrder.status === "Cancelled" &&
                selectedOrder.cancelReason && (
                  <div className="mt-5 bg-red-50 border-2 border-red-200 rounded-2xl p-5">
                    <p className="text-xs font-black uppercase text-red-600">
                      Cancellation Reason
                    </p>
                    <p className="text-sm text-red-800 mt-3 leading-7">
                      {selectedOrder.cancelReason}
                    </p>
                    {selectedOrder.cancelledAt && (
                      <p className="text-xs text-red-500 mt-3">
                        Cancelled: {formatDate(selectedOrder.cancelledAt)}
                      </p>
                    )}
                  </div>
                )}

              {/* ===============================================

                  ADMIN MANAGEMENT

              =============================================== */}

              <div
                className="

                  mt-8

                  bg-white

                  border-2

                  border-[#d4af37]

                  rounded-[24px]

                  p-5

                  md:p-6

                "
              >
                <p
                  className="

                    text-[#b88f25]

                    text-xs

                    font-black

                    uppercase

                    tracking-[2px]

                  "
                >
                  Admin Controls
                </p>

                <h3
                  className="

                    text-xl

                    font-black

                    text-[#4a1624]

                    mt-2

                  "
                >
                  Price & Order Management
                </h3>

                <div
                  className="

                    grid

                    lg:grid-cols-3

                    gap-5

                    mt-6

                  "
                >
                  {/* ================= PRICE ================= */}

                  <div>
                    <label
                      className="

                        text-sm

                        font-black

                        text-[#5b1a2b]

                      "
                    >
                      Quoted Price
                    </label>

                    <div
                      className="

                        flex

                        mt-2

                        rounded-xl

                        border

                        border-[#dfd0bf]

                        overflow-hidden

                        bg-[#faf7f2]

                      "
                    >
                      <span
                        className="

                          px-4

                          flex

                          items-center

                          font-bold

                          text-[#9a7652]

                          border-r

                          border-[#dfd0bf]

                        "
                      >
                        LKR
                      </span>

                      <input
                        type="number"
                        min="1"
                        value={priceInputs[selectedOrder.customOrderId] ?? ""}
                        onChange={(e) =>
                          setPriceInputs((old) => ({
                            ...old,

                            [selectedOrder.customOrderId]: e.target.value,
                          }))
                        }
                        placeholder="Enter price"
                        className="

                          w-full

                          p-3

                          bg-transparent

                          outline-none

                          text-[#4a1624]

                          font-bold

                        "
                      />
                    </div>

                    <button
                      type="button"
                      disabled={updatingOrderId === selectedOrder.customOrderId}
                      onClick={() => updatePrice(selectedOrder.customOrderId)}
                      className="

                        w-full

                        mt-3

                        py-3

                        rounded-xl

                        bg-[#6b1d2f]

                        text-[#f3d975]

                        font-bold

                        disabled:opacity-50

                      "
                    >
                      Save Quoted Price
                    </button>
                  </div>

                  {/* ================= ORDER STATUS ================= */}

                  <div>
                    <label
                      className="

                        text-sm

                        font-black

                        text-[#5b1a2b]

                      "
                    >
                      Tailoring Status
                    </label>

                    <select
                      value={selectedOrder.status}
                      disabled={updatingOrderId === selectedOrder.customOrderId}
                      onChange={(e) =>
                        handleStatusChange(selectedOrder, e.target.value)
                      }
                      className="

                        w-full

                        mt-2

                        p-3

                        rounded-xl

                        bg-[#faf7f2]

                        border

                        border-[#dfd0bf]

                        text-[#4a1624]

                        font-bold

                        outline-none

                      "
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <span
                      className={`

                        inline-flex

                        mt-3

                        px-3

                        py-1

                        rounded-full

                        border

                        text-xs

                        font-black


                        ${getStatusStyle(selectedOrder.status)}

                      `}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* ================= PAYMENT ================= */}

                  <div>
                    <label
                      className="

                        text-sm

                        font-black

                        text-[#5b1a2b]

                      "
                    >
                      Payment Status
                    </label>

                    <select
                      value={selectedOrder.paymentStatus}
                      disabled={updatingOrderId === selectedOrder.customOrderId}
                      onChange={(e) =>
                        updatePaymentStatus(
                          selectedOrder.customOrderId,

                          e.target.value,
                        )
                      }
                      className="

                        w-full

                        mt-2

                        p-3

                        rounded-xl

                        bg-[#faf7f2]

                        border

                        border-[#dfd0bf]

                        text-[#4a1624]

                        font-bold

                        outline-none

                      "
                    >
                      {paymentStatuses.map((paymentStatus) => (
                        <option key={paymentStatus} value={paymentStatus}>
                          {paymentStatus}
                        </option>
                      ))}
                    </select>

                    <span
                      className={`

                        inline-flex

                        mt-3

                        px-3

                        py-1

                        rounded-full

                        border

                        text-xs

                        font-black


                        ${getPaymentStyle(selectedOrder.paymentStatus)}

                      `}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* ===============================================

                  SUMMARY

              =============================================== */}

              <div
                className="

                  mt-6

                  rounded-[22px]

                  bg-[#6b1d2f]

                  text-white

                  p-6

                "
              >
                <div
                  className="

                    flex

                    flex-col

                    sm:flex-row

                    sm:items-center

                    sm:justify-between

                    gap-5

                  "
                >
                  <div>
                    <p
                      className="

                        text-xs

                        text-[#e7cda7]

                      "
                    >
                      Current Quoted Price
                    </p>

                    <p
                      className="

                        text-3xl

                        font-black

                        text-[#f3d975]

                        mt-1

                      "
                    >
                      {selectedOrder.price
                        ? `LKR ${selectedOrder.price.toLocaleString()}`
                        : "Price Pending"}
                    </p>
                  </div>

                  <div
                    className="

                      flex

                      flex-wrap

                      gap-2

                    "
                  >
                    <span
                      className={`

                        px-4

                        py-2

                        rounded-full

                        border

                        text-xs

                        font-black


                        ${getStatusStyle(selectedOrder.status)}

                      `}
                    >
                      {selectedOrder.status}
                    </span>

                    <span
                      className={`

                        px-4

                        py-2

                        rounded-full

                        border

                        text-xs

                        font-black


                        ${getPaymentStyle(selectedOrder.paymentStatus)}

                      `}
                    >
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {cancellingOrder && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-[28px] border-2 border-red-200 shadow-2xl p-6">
            <p className="text-xs font-black uppercase tracking-[2px] text-red-500">
              Cancel Custom Order
            </p>

            <h2 className="text-2xl font-black text-[#4a1624] mt-2">
              Cancellation Reason
            </h2>

            <p className="text-sm text-[#8b7567] mt-2">
              {cancellingOrder.customOrderId} — {cancellingOrder.fullName}
            </p>

            <div className="mt-5 rounded-xl bg-red-50 border border-red-200 p-4">
              <p className="text-sm font-bold text-red-700">
                මේ reason එක customerගේ My Orders page එකේ පෙන්වනවා.
              </p>
            </div>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows="5"
              placeholder="Why is this order being cancelled?"
              className="w-full mt-4 p-4 rounded-xl bg-[#faf7f2] border border-[#dfd0bf] outline-none resize-none focus:border-red-400 text-[#4a1624]"
            />

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setCancellingOrder(null);
                  setCancelReason("");
                }}
                className="py-3 rounded-xl border-2 border-[#6b1d2f] text-[#6b1d2f] font-bold"
              >
                Go Back
              </button>

              <button
                type="button"
                disabled={updatingOrderId === cancellingOrder.customOrderId}
                onClick={async () => {
                  if (cancelReason.trim() === "") {
                    toast.error("Cancellation reason is required");
                    return;
                  }

                  const success = await updateOrderStatus(
                    cancellingOrder.customOrderId,
                    "Cancelled",
                    cancelReason.trim(),
                  );

                  if (success) {
                    setCancellingOrder(null);
                    setCancelReason("");
                  }
                }}
                className="py-3 rounded-xl bg-red-600 text-white font-black disabled:opacity-50"
              >
                {updatingOrderId === cancellingOrder.customOrderId
                  ? "Cancelling..."
                  : "Confirm Cancellation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================

// STAT CARD

// =====================================================

function StatCard({ icon, title, value }) {
  return (
    <div
      className="

        bg-white

        border

        border-[#e1d2c0]

        rounded-2xl

        p-5

        shadow-[0_8px_25px_rgba(91,26,43,0.06)]

      "
    >
      <div
        className="

          w-11

          h-11

          rounded-xl

          bg-[#f8f1e8]

          text-[#6b1d2f]

          flex

          items-center

          justify-center

        "
      >
        {icon}
      </div>

      <p
        className="

          text-xs

          text-[#9a8273]

          mt-4

        "
      >
        {title}
      </p>

      <p
        className="

          text-3xl

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

// =====================================================

// INFO CARD

// =====================================================

function InfoCard({ icon, title, value }) {
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
      <div
        className="

          flex

          items-center

          gap-2

          text-[#b88f25]

        "
      >
        {icon}

        <p
          className="

            text-xs

            font-black

            uppercase

          "
        >
          {title}
        </p>
      </div>

      <p
        className="

          text-[#4a1624]

          font-bold

          mt-3

          break-words

        "
      >
        {value || "-"}
      </p>
    </div>
  );
}

// =====================================================

// MEASUREMENT CARD

// =====================================================

function MeasurementCard({ title, value, unit }) {
  return (
    <div
      className="

        bg-white

        border

        border-[#eadaca]

        rounded-2xl

        p-4

      "
    >
      <p
        className="

          text-xs

          text-[#9a8273]

          font-bold

        "
      >
        {title}
      </p>

      <p
        className="

          text-xl

          font-black

          text-[#6b1d2f]

          mt-2

        "
      >
        {value ?? "-"}

        {value != null && (
          <span
            className="

              text-xs

              text-[#b88f25]

              ml-1

            "
          >
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}
