import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  FaBoxOpen,
  FaEye,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTimes,
  FaUser,
  FaSyncAlt,
} from "react-icons/fa";

import { Loader } from "../../components/loader";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // =====================================================
  // STATUSES
  // =====================================================

  const statuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // =====================================================
  // LOAD ORDERS
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
        import.meta.env.VITE_API_URL + "/api/orders",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      .then((res) => {
        setOrders(res.data);

        setIsLoading(false);
      })

      .catch((err) => {
        console.log(err);

        toast.error(err.response?.data?.message || "Failed to load orders");

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
  // UPDATE ORDER STATUS
  // =====================================================

  async function updateOrderStatus(orderId, newStatus) {
    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("You need to login first");

      return;
    }

    try {
      setUpdatingOrderId(orderId);

      await axios.put(
        import.meta.env.VITE_API_URL + "/api/orders/status/" + orderId,

        {
          status: newStatus,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // ==========================================
      // UPDATE PAGE WITHOUT RELOADING
      // ==========================================

      setOrders(
        orders.map((order) => {
          if (order.orderId === orderId) {
            return {
              ...order,
              status: newStatus,
            };
          }

          return order;
        }),
      );

      // Modal එක open නම් ඒකත් update කරන්න
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus,
        });
      }

      toast.success("Order status updated successfully");
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message || "Failed to update order status",
      );
    } finally {
      setUpdatingOrderId(null);
    }
  }

  // =====================================================
  // STATUS COLOR
  // =====================================================

  function getStatusStyle(status) {
    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }

    if (status === "Confirmed") {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }

    if (status === "Processing") {
      return "bg-purple-100 text-purple-700 border-purple-200";
    }

    if (status === "Shipped") {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }

    if (status === "Delivered") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-gray-100 text-gray-700 border-gray-200";
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
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-4
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
            Customer Orders
          </h1>

          <p
            className="
              text-sm
              text-[#8b7567]
              mt-2
            "
          >
            View and manage customer orders.
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
          EMPTY
      ================================================= */}

      {orders.length === 0 ? (
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
              No Orders Yet
            </h2>

            <p
              className="
                text-[#8b7567]
                mt-2
              "
            >
              Customer orders will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="
            bg-white
            rounded-[28px]
            border
            border-[#e1d2c0]
            shadow-[0_15px_40px_rgba(91,26,43,0.10)]
            overflow-hidden
          "
        >
          {/* =================================================
              DESKTOP TABLE
          ================================================= */}

          <div
            className="
              hidden
              lg:block
              overflow-x-auto
            "
          >
            <table className="w-full">
              <thead
                className="
                  bg-[#6b1d2f]
                  text-[#f3d975]
                "
              >
                <tr>
                  <th className="text-left p-4">Order ID</th>

                  <th className="text-left p-4">Customer</th>

                  <th className="text-left p-4">Products</th>

                  <th className="text-left p-4">Total</th>

                  <th className="text-left p-4">Status</th>

                  <th className="text-left p-4">Date</th>

                  <th className="text-center p-4">Details</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="
                      border-b
                      border-[#eadfd2]
                      hover:bg-[#fffaf5]
                      transition-colors
                    "
                  >
                    {/* ORDER ID */}

                    <td
                      className="
                        p-4
                        font-black
                        text-[#6b1d2f]
                        whitespace-nowrap
                      "
                    >
                      {order.orderId}
                    </td>

                    {/* CUSTOMER */}

                    <td className="p-4">
                      <p
                        className="
                          font-bold
                          text-[#4a1624]
                        "
                      >
                        {order.fullName}
                      </p>

                      <p
                        className="
                          text-xs
                          text-[#9a8273]
                          mt-1
                        "
                      >
                        {order.phone}
                      </p>
                    </td>

                    {/* PRODUCTS */}

                    <td className="p-4">
                      <p
                        className="
                          font-bold
                          text-[#4a1624]
                        "
                      >
                        {order.products?.length || 0} item(s)
                      </p>

                      <p
                        className="
                          text-xs
                          text-[#9a8273]
                          mt-1
                        "
                      >
                        Qty:{" "}
                        {order.products?.reduce(
                          (total, product) => total + product.quantity,
                          0,
                        ) || 0}
                      </p>
                    </td>

                    {/* TOTAL */}

                    <td
                      className="
                        p-4
                        font-black
                        text-[#6b1d2f]
                        whitespace-nowrap
                      "
                    >
                      LKR {order.totalPrice?.toLocaleString()}
                    </td>

                    {/* STATUS */}

                    <td className="p-4">
                      <div
                        className="
                          flex
                          flex-col
                          gap-2
                          min-w-[150px]
                        "
                      >
                        <span
                          className={`
                            w-fit
                            px-3
                            py-1
                            rounded-full
                            border
                            text-xs
                            font-black
                            ${getStatusStyle(order.status)}
                          `}
                        >
                          {order.status}
                        </span>

                        <select
                          value={order.status}
                          disabled={updatingOrderId === order.orderId}
                          onChange={(e) =>
                            updateOrderStatus(order.orderId, e.target.value)
                          }
                          className="
                            w-full
                            p-2
                            rounded-lg
                            border
                            border-[#d8c7b5]
                            bg-[#faf7f2]
                            text-[#4a1624]
                            text-xs
                            font-bold
                            outline-none
                            focus:border-[#6b1d2f]
                            disabled:opacity-50
                          "
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>

                        {updatingOrderId === order.orderId && (
                          <p
                            className="
                              text-[10px]
                              text-[#b88f25]
                              font-bold
                            "
                          >
                            Updating...
                          </p>
                        )}
                      </div>
                    </td>

                    {/* DATE */}

                    <td
                      className="
                        p-4
                        text-xs
                        text-[#806f63]
                      "
                    >
                      {formatDate(order.date)}
                    </td>

                    {/* VIEW */}

                    <td
                      className="
                        p-4
                        text-center
                      "
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="
                          w-10
                          h-10
                          rounded-xl
                          bg-[#f8f1e8]
                          text-[#6b1d2f]
                          border
                          border-[#e1d2c0]
                          inline-flex
                          items-center
                          justify-center
                          hover:bg-[#6b1d2f]
                          hover:text-[#f3d975]
                          transition-all
                        "
                      >
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =================================================
              MOBILE / TABLET
          ================================================= */}

          <div
            className="
              lg:hidden
              p-4
              space-y-4
            "
          >
            {orders.map((order) => (
              <div
                key={order._id}
                className="
                  border
                  border-[#eadaca]
                  rounded-2xl
                  p-5
                  bg-[#fffaf5]
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
                        text-[#b88f25]
                        font-black
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
                      {order.fullName}
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
                    mt-5
                  "
                >
                  <div>
                    <p
                      className="
                        text-xs
                        text-[#9a8273]
                      "
                    >
                      Products
                    </p>

                    <p
                      className="
                        font-bold
                        text-[#4a1624]
                        mt-1
                      "
                    >
                      {order.products?.length || 0}
                    </p>
                  </div>

                  <div>
                    <p
                      className="
                        text-xs
                        text-[#9a8273]
                      "
                    >
                      Total
                    </p>

                    <p
                      className="
                        font-black
                        text-[#6b1d2f]
                        mt-1
                      "
                    >
                      LKR {order.totalPrice?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* STATUS SELECT MOBILE */}

                <div className="mt-5">
                  <p
                    className="
                      text-xs
                      text-[#9a8273]
                      mb-2
                    "
                  >
                    Change Status
                  </p>

                  <select
                    value={order.status}
                    disabled={updatingOrderId === order.orderId}
                    onChange={(e) =>
                      updateOrderStatus(order.orderId, e.target.value)
                    }
                    className="
                      w-full
                      p-3
                      rounded-xl
                      border
                      border-[#d8c7b5]
                      bg-white
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
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(order)}
                  className="
                    w-full
                    mt-4
                    py-3
                    rounded-xl
                    bg-[#6b1d2f]
                    text-[#f3d975]
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <FaEye />
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================
          DETAILS MODAL
      ================================================= */}

      {selectedOrder && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/50
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
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
            {/* MODAL HEADER */}

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
                  ORDER DETAILS
                </p>

                <h2
                  className="
                    text-2xl
                    font-black
                    mt-1
                  "
                >
                  {selectedOrder.orderId}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
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

            <div className="p-6 md:p-8">
              {/* CUSTOMER */}

              <div
                className="
                  grid
                  md:grid-cols-2
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
                  title="Phone"
                  value={selectedOrder.phone}
                />
              </div>

              {/* ADDRESS */}

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
                  <FaMapMarkerAlt />

                  <p
                    className="
                      text-xs
                      font-black
                      uppercase
                    "
                  >
                    Delivery Address
                  </p>
                </div>

                <p
                  className="
                    text-[#4a1624]
                    font-bold
                    mt-3
                  "
                >
                  {selectedOrder.address}
                </p>

                <p
                  className="
                    text-sm
                    text-[#806f63]
                    mt-1
                  "
                >
                  {selectedOrder.city}, {selectedOrder.district}
                </p>
              </div>

              {/* PRODUCTS */}

              <div className="mt-7">
                <h3
                  className="
                    text-lg
                    font-black
                    text-[#4a1624]
                  "
                >
                  Ordered Products
                </h3>

                <div
                  className="
                    mt-4
                    space-y-3
                  "
                >
                  {selectedOrder.products?.map((product, index) => (
                    <div
                      key={product._id || product.productId || index}
                      className="
                          bg-white
                          border
                          border-[#eadaca]
                          rounded-2xl
                          p-4
                          flex
                          items-center
                          gap-4
                        "
                    >
                      <img
                        src={product.image || "/placeholder.png"}
                        alt={product.name}
                        className="
                            w-16
                            h-16
                            rounded-xl
                            object-cover
                            bg-[#f6ede2]
                          "
                      />

                      <div
                        className="
                            flex-1
                            min-w-0
                          "
                      >
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
                          {product.productId}
                        </p>

                        <p
                          className="
                              text-xs
                              text-[#806f63]
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
                            whitespace-nowrap
                          "
                      >
                        LKR{" "}
                        {(product.price * product.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* NOTES */}

              {selectedOrder.notes && (
                <div
                  className="
                    mt-6
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
                    Customer Notes
                  </p>

                  <p
                    className="
                      text-sm
                      text-[#6f5828]
                      mt-2
                      leading-6
                    "
                  >
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              {/* STATUS CHANGE IN MODAL */}

              <div
                className="
                  mt-6
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
                    text-[#9a8273]
                    uppercase
                  "
                >
                  Order Status
                </p>

                <select
                  value={selectedOrder.status}
                  disabled={updatingOrderId === selectedOrder.orderId}
                  onChange={(e) =>
                    updateOrderStatus(selectedOrder.orderId, e.target.value)
                  }
                  className="
                    w-full
                    mt-3
                    p-3
                    rounded-xl
                    bg-[#faf7f2]
                    border
                    border-[#d8c7b5]
                    font-bold
                    text-[#4a1624]
                    outline-none
                    focus:border-[#6b1d2f]
                  "
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* TOTAL */}

              <div
                className="
                  mt-7
                  bg-[#6b1d2f]
                  rounded-2xl
                  p-5
                  text-white
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
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
                      Order Total
                    </p>

                    <p
                      className="
                        text-2xl
                        font-black
                        text-[#f3d975]
                        mt-1
                      "
                    >
                      LKR {selectedOrder.totalPrice?.toLocaleString()}
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
                      ${getStatusStyle(selectedOrder.status)}
                    `}
                  >
                    {selectedOrder.status}
                  </span>
                </div>

                <p
                  className="
                    text-xs
                    text-[#e7cda7]
                    mt-4
                  "
                >
                  {formatDate(selectedOrder.date)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =====================================================
// INFO CARD
// =====================================================

function InfoCard(props) {
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
        {props.icon}

        <p
          className="
            text-xs
            font-black
            uppercase
          "
        >
          {props.title}
        </p>
      </div>

      <p
        className="
          text-[#4a1624]
          font-bold
          mt-3
        "
      >
        {props.value || "-"}
      </p>
    </div>
  );
}
