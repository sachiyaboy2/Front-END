import axios from "axios";

import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import {
  FaBox,
  FaBoxOpen,
  FaCheckCircle,
  FaClock,
  FaCoins,
  FaExclamationTriangle,
  FaMagic,
  FaShoppingBag,
  FaSyncAlt,
  FaTshirt,
  FaUserSlash,
  FaUsers,
} from "react-icons/fa";

import { Loader } from "../../components/loader";

export default function AdminDashboard() {
  // =====================================================
  // STATE
  // =====================================================

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // LOAD
  // =====================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin login required");

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/admin/dashboard",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setData(response.data);
    } catch (err) {
      console.log("Dashboard Load Error:", err);

      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to load dashboard",
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // MONEY
  // =====================================================

  function formatMoney(value) {
    return Number(value || 0).toLocaleString("en-LK");
  }

  // =====================================================
  // DATE
  // =====================================================

  function formatDate(value) {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  }

  // =====================================================
  // MAX MONTH REVENUE
  // =====================================================

  const maximumMonthlyRevenue = useMemo(() => {
    if (!data?.monthlyRevenue?.length) {
      return 1;
    }

    return Math.max(
      ...data.monthlyRevenue.map((month) => Number(month.revenue || 0)),

      1,
    );
  }, [data]);

  // =====================================================
  // MAX STATUS
  // =====================================================

  const maximumStatusCount = useMemo(() => {
    if (!data?.orderStatus?.length) {
      return 1;
    }

    return Math.max(
      ...data.orderStatus.map((status) => Number(status.count || 0)),

      1,
    );
  }, [data]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return <Loader />;
  }

  // =====================================================
  // ERROR / EMPTY
  // =====================================================

  if (!data) {
    return (
      <div
        className="
          min-h-[500px]
          flex
          items-center
          justify-center
          bg-[#f6ede2]
          p-5
        "
      >
        <div
          className="
            text-center
            bg-white
            border
            border-[#e1d2c0]
            rounded-[28px]
            p-10
          "
        >
          <FaExclamationTriangle
            className="
              text-[#d99b21]
              text-4xl
              mx-auto
            "
          />

          <h2
            className="
              text-2xl
              font-black
              text-[#4f1424]
              mt-5
            "
          >
            Dashboard Unavailable
          </h2>

          <button
            type="button"
            onClick={loadDashboard}
            className="
              mt-6
              px-6
              py-3
              rounded-xl
              bg-[#6b1d2f]
              text-[#f3d975]
              font-black
            "
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const summary = data.summary || {};

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
              md:text-4xl
              font-black
              text-[#4a1624]
              mt-2
            "
          >
            Dashboard
          </h1>

          <p
            className="
              text-[#8b7567]
              text-sm
              mt-2
            "
          >
            Store performance, orders, customers සහ stock overview.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          className="
            px-5
            py-3
            rounded-xl
            bg-[#6b1d2f]
            text-[#f3d975]
            font-black
            border-2
            border-[#d4af37]
            shadow-[0_4px_0_#d4af37]
            flex
            items-center
            justify-center
            gap-2
            hover:-translate-y-0.5
            active:translate-y-1
            active:shadow-none
            transition-all
          "
        >
          <FaSyncAlt />
          Refresh Dashboard
        </button>
      </div>

      {/* =================================================
          MAIN STATISTICS
      ================================================= */}

      <div
        className="
          grid
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
        "
      >
        <MainStatCard
          icon={<FaCoins />}
          title="Total Revenue"
          value={`LKR ${formatMoney(summary.totalRevenue)}`}
          description={`Products LKR ${formatMoney(
            summary.productRevenue,
          )} • Custom LKR ${formatMoney(summary.customRevenue)}`}
          featured
        />

        <MainStatCard
          icon={<FaShoppingBag />}
          title="Product Orders"
          value={summary.productOrders || 0}
          description="Normal store orders"
        />

        <MainStatCard
          icon={<FaMagic />}
          title="Custom Orders"
          value={summary.customOrders || 0}
          description="Custom tailoring orders"
        />

        <MainStatCard
          icon={<FaUsers />}
          title="Customers"
          value={summary.customers || 0}
          description="Registered customer accounts"
        />
      </div>

      {/* =================================================
          SECONDARY STATISTICS
      ================================================= */}

      <div
        className="
          grid
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4
          mt-4
        "
      >
        <SmallStatCard
          icon={<FaClock />}
          title="Active Orders"
          value={summary.activeOrders || 0}
        />

        <SmallStatCard
          icon={<FaCheckCircle />}
          title="Completed"
          value={summary.completedOrders || 0}
        />

        <SmallStatCard
          icon={<FaExclamationTriangle />}
          title="Low Stock"
          value={summary.lowStockCount || 0}
        />

        <SmallStatCard
          icon={<FaUserSlash />}
          title="Blocked Users"
          value={summary.blockedUsers || 0}
        />
      </div>

      {/* =================================================
          REVENUE CHART + ORDER STATUS
      ================================================= */}

      <div
        className="
          grid
          xl:grid-cols-[1.7fr_1fr]
          gap-6
          mt-7
        "
      >
        {/* ===============================================
            REVENUE CHART
        =============================================== */}

        <section
          className="
            bg-white
            rounded-[26px]
            border
            border-[#e1d2c0]
            shadow-[0_12px_35px_rgba(91,26,43,0.06)]
            p-5
            md:p-6
          "
        >
          <SectionHeader
            smallTitle="SALES OVERVIEW"
            title="Revenue • Last 6 Months"
          />

          <div
            className="
              mt-8
              h-[290px]
              flex
              items-end
              gap-3
              sm:gap-5
              border-b
              border-[#eadfd2]
            "
          >
            {data.monthlyRevenue?.map((month) => {
              const percentage = Math.max(
                (Number(month.revenue || 0) / maximumMonthlyRevenue) * 100,

                month.revenue > 0 ? 5 : 1,
              );

              return (
                <div
                  key={month.key}
                  className="
                      flex-1
                      h-full
                      flex
                      flex-col
                      justify-end
                      items-center
                      group
                    "
                >
                  {/* TOOLTIP */}

                  <div
                    className="
                        text-center
                        opacity-0
                        group-hover:opacity-100
                        transition-opacity
                        mb-2
                      "
                  >
                    <p
                      className="
                          text-[10px]
                          font-black
                          text-[#6b1d2f]
                          whitespace-nowrap
                        "
                    >
                      LKR {formatMoney(month.revenue)}
                    </p>
                  </div>

                  {/* BAR */}

                  <div
                    className="
                        relative
                        w-full
                        max-w-[58px]
                        h-[220px]
                        flex
                        items-end
                      "
                  >
                    <div
                      style={{
                        height: `${percentage}%`,
                      }}
                      className="
                          w-full
                          rounded-t-xl
                          bg-gradient-to-t
                          from-[#6b1d2f]
                          to-[#d4af37]
                          min-h-[3px]
                          transition-all
                          duration-500
                          group-hover:brightness-110
                        "
                    />
                  </div>

                  {/* MONTH */}

                  <p
                    className="
                        text-xs
                        font-black
                        text-[#806f63]
                        py-3
                      "
                  >
                    {month.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* SPLIT */}

          <div
            className="
              grid
              sm:grid-cols-2
              gap-3
              mt-5
            "
          >
            <RevenueMini
              title="Product Revenue"
              value={summary.productRevenue}
            />

            <RevenueMini title="Custom Revenue" value={summary.customRevenue} />
          </div>
        </section>

        {/* ===============================================
            ORDER STATUS
        =============================================== */}

        <section
          className="
            bg-white
            rounded-[26px]
            border
            border-[#e1d2c0]
            shadow-[0_12px_35px_rgba(91,26,43,0.06)]
            p-5
            md:p-6
          "
        >
          <SectionHeader smallTitle="ORDER FLOW" title="Order Status" />

          <div
            className="
              space-y-5
              mt-8
            "
          >
            {data.orderStatus?.map((item) => {
              const width =
                (Number(item.count || 0) / maximumStatusCount) * 100;

              return (
                <div key={item.label}>
                  <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                      "
                  >
                    <p
                      className="
                          text-sm
                          font-bold
                          text-[#5b1a2b]
                        "
                    >
                      {item.label}
                    </p>

                    <span
                      className="
                          min-w-8
                          text-center
                          rounded-full
                          bg-[#f8f1e8]
                          text-[#6b1d2f]
                          text-xs
                          font-black
                          px-2
                          py-1
                        "
                    >
                      {item.count}
                    </span>
                  </div>

                  <div
                    className="
                        w-full
                        h-2.5
                        rounded-full
                        bg-[#eee3d7]
                        overflow-hidden
                        mt-2
                      "
                  >
                    <div
                      style={{
                        width: `${width}%`,
                      }}
                      className="
                          h-full
                          rounded-full
                          bg-[#6b1d2f]
                          transition-all
                          duration-500
                        "
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* =================================================
          RECENT ORDERS
      ================================================= */}

      <section
        className="
          bg-white
          rounded-[26px]
          border
          border-[#e1d2c0]
          shadow-[0_12px_35px_rgba(91,26,43,0.06)]
          mt-7
          overflow-hidden
        "
      >
        <div className="p-5 md:p-6">
          <SectionHeader smallTitle="LATEST ACTIVITY" title="Recent Orders" />
        </div>

        {data.recentOrders?.length === 0 ? (
          <div
            className="
              py-14
              text-center
              text-[#9a8273]
            "
          >
            No orders yet.
          </div>
        ) : (
          <div
            className="
              overflow-x-auto
            "
          >
            <table
              className="
                w-full
                min-w-[850px]
              "
            >
              <thead
                className="
                  bg-[#6b1d2f]
                  text-[#f3d975]
                "
              >
                <tr>
                  <TableHead>Order</TableHead>

                  <TableHead>Customer</TableHead>

                  <TableHead>Type</TableHead>

                  <TableHead>Amount</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Date</TableHead>
                </tr>
              </thead>

              <tbody>
                {data.recentOrders.map((order) => (
                  <tr
                    key={`${order.type}-${order._id}`}
                    className="
                        border-b
                        border-[#eee2d5]
                        last:border-0
                        hover:bg-[#fffaf4]
                      "
                  >
                    <td
                      className="
                          p-4
                          font-black
                          text-[#b88f25]
                        "
                    >
                      {order.id}
                    </td>

                    <td className="p-4">
                      <p
                        className="
                            font-black
                            text-[#4a1624]
                          "
                      >
                        {order.customer}
                      </p>

                      <p
                        className="
                            text-xs
                            text-[#9a8273]
                            mt-1
                          "
                      >
                        {order.phone || "No phone"}
                      </p>
                    </td>

                    <td className="p-4">
                      <OrderTypeBadge type={order.type} />
                    </td>

                    <td
                      className="
                          p-4
                          font-black
                          text-[#5b1a2b]
                        "
                    >
                      {order.amount > 0
                        ? `LKR ${formatMoney(order.amount)}`
                        : "Pending"}
                    </td>

                    <td className="p-4">
                      <StatusBadge status={order.status} />
                    </td>

                    <td
                      className="
                          p-4
                          text-xs
                          text-[#806f63]
                        "
                    >
                      {formatDate(order.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* =================================================
          LOW STOCK
      ================================================= */}

      <section
        className="
          bg-white
          rounded-[26px]
          border
          border-[#e1d2c0]
          shadow-[0_12px_35px_rgba(91,26,43,0.06)]
          mt-7
          p-5
          md:p-6
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
          <SectionHeader smallTitle="INVENTORY" title="Low Stock Products" />

          <div
            className="
              flex
              gap-2
            "
          >
            <InventoryBadge title="Low" value={summary.lowStockCount || 0} />

            <InventoryBadge
              title="Out"
              value={summary.outOfStockCount || 0}
              danger
            />
          </div>
        </div>

        {data.lowStockProducts?.length === 0 ? (
          <div
            className="
              py-12
              text-center
            "
          >
            <FaCheckCircle
              className="
                text-green-600
                text-4xl
                mx-auto
              "
            />

            <p
              className="
                font-black
                text-[#4a1624]
                mt-4
              "
            >
              Stock levels look good
            </p>
          </div>
        ) : (
          <div
            className="
              grid
              sm:grid-cols-2
              lg:grid-cols-4
              gap-4
              mt-6
            "
          >
            {data.lowStockProducts.map((product) => (
              <div
                key={product._id}
                className="
                    border
                    border-[#eadaca]
                    rounded-2xl
                    overflow-hidden
                    bg-[#faf7f2]
                  "
              >
                <div
                  className="
                      h-[130px]
                      bg-[#eee3d7]
                    "
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="
                          w-full
                          h-full
                          object-cover
                        "
                    />
                  ) : (
                    <div
                      className="
                          w-full
                          h-full
                          flex
                          items-center
                          justify-center
                          text-[#b88f25]
                        "
                    >
                      <FaTshirt size={30} />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p
                    className="
                        font-black
                        text-[#4a1624]
                        truncate
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

                  <div
                    className="
                        flex
                        items-end
                        justify-between
                        gap-3
                        mt-4
                      "
                  >
                    <div>
                      <p
                        className="
                            text-[10px]
                            uppercase
                            font-bold
                            text-[#9a8273]
                          "
                      >
                        Remaining
                      </p>

                      <p
                        className="
                            text-2xl
                            font-black
                            text-orange-600
                          "
                      >
                        {product.stock}
                      </p>
                    </div>

                    <FaBoxOpen
                      className="
                          text-[#b88f25]
                          text-xl
                        "
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// =====================================================
// MAIN STAT CARD
// =====================================================

function MainStatCard({ icon, title, value, description, featured = false }) {
  return (
    <div
      className={`
        rounded-[24px]
        border
        p-5
        shadow-[0_10px_30px_rgba(91,26,43,0.06)]
        transition-all
        hover:-translate-y-1

        ${
          featured
            ? "bg-[#6b1d2f] border-[#d4af37] text-white"
            : "bg-white border-[#e1d2c0]"
        }
      `}
    >
      <div
        className={`
          w-12
          h-12
          rounded-xl
          flex
          items-center
          justify-center

          ${
            featured
              ? "bg-[#d4af37] text-[#5b1a2b]"
              : "bg-[#f8f1e8] text-[#6b1d2f]"
          }
        `}
      >
        {icon}
      </div>

      <p
        className={`
          text-xs
          font-bold
          mt-5

          ${featured ? "text-[#e7cda7]" : "text-[#9a8273]"}
        `}
      >
        {title}
      </p>

      <p
        className={`
          text-2xl
          xl:text-3xl
          font-black
          mt-1

          ${featured ? "text-[#f3d975]" : "text-[#4a1624]"}
        `}
      >
        {value}
      </p>

      <p
        className={`
          text-[11px]
          mt-3
          leading-5

          ${featured ? "text-[#ead8cc]" : "text-[#a38d7d]"}
        `}
      >
        {description}
      </p>
    </div>
  );
}

// =====================================================
// SMALL STAT
// =====================================================

function SmallStatCard({ icon, title, value }) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        border
        border-[#e1d2c0]
        p-4
        flex
        items-center
        gap-4
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
          shrink-0
        "
      >
        {icon}
      </div>

      <div>
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
            text-xl
            font-black
            text-[#4a1624]
          "
        >
          {value}
        </p>
      </div>
    </div>
  );
}

// =====================================================
// SECTION HEADER
// =====================================================

function SectionHeader({ smallTitle, title }) {
  return (
    <div>
      <p
        className="
          text-[10px]
          text-[#b88f25]
          tracking-[2px]
          font-black
          uppercase
        "
      >
        {smallTitle}
      </p>

      <h2
        className="
          text-xl
          font-black
          text-[#4a1624]
          mt-1
        "
      >
        {title}
      </h2>
    </div>
  );
}

// =====================================================
// REVENUE MINI
// =====================================================

function RevenueMini({ title, value }) {
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
          text-lg
          font-black
          text-[#6b1d2f]
          mt-1
        "
      >
        LKR {Number(value || 0).toLocaleString("en-LK")}
      </p>
    </div>
  );
}

// =====================================================
// TABLE HEAD
// =====================================================

function TableHead({ children }) {
  return (
    <th
      className="
        text-left
        p-4
        text-xs
        font-black
        uppercase
      "
    >
      {children}
    </th>
  );
}

// =====================================================
// ORDER TYPE
// =====================================================

function OrderTypeBadge({ type }) {
  const custom = type === "Custom";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        px-3
        py-1
        rounded-full
        text-xs
        font-black
        border

        ${
          custom
            ? "bg-purple-50 text-purple-700 border-purple-200"
            : "bg-blue-50 text-blue-700 border-blue-200"
        }
      `}
    >
      {custom ? <FaMagic /> : <FaShoppingBag />}

      {type}
    </span>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ status }) {
  let classes = "bg-gray-100 text-gray-700 border-gray-200";

  if (status === "Pending") {
    classes = "bg-yellow-100 text-yellow-700 border-yellow-200";
  }

  if (status === "Confirmed" || status === "Accepted") {
    classes = "bg-blue-100 text-blue-700 border-blue-200";
  }

  if (
    status === "Processing" ||
    status === "Reviewed" ||
    status === "In Progress"
  ) {
    classes = "bg-purple-100 text-purple-700 border-purple-200";
  }

  if (status === "Shipped" || status === "Ready") {
    classes = "bg-orange-100 text-orange-700 border-orange-200";
  }

  if (status === "Delivered" || status === "Completed") {
    classes = "bg-green-100 text-green-700 border-green-200";
  }

  if (status === "Cancelled") {
    classes = "bg-red-100 text-red-700 border-red-200";
  }

  return (
    <span
      className={`
        inline-flex
        px-3
        py-1
        rounded-full
        text-[10px]
        font-black
        border
        whitespace-nowrap
        ${classes}
      `}
    >
      {status}
    </span>
  );
}

// =====================================================
// INVENTORY BADGE
// =====================================================

function InventoryBadge({ title, value, danger = false }) {
  return (
    <div
      className={`
        rounded-xl
        border
        px-4
        py-2
        text-center

        ${
          danger ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"
        }
      `}
    >
      <p
        className={`
          text-[9px]
          uppercase
          font-black

          ${danger ? "text-red-500" : "text-orange-500"}
        `}
      >
        {title}
      </p>

      <p
        className={`
          text-lg
          font-black

          ${danger ? "text-red-700" : "text-orange-700"}
        `}
      >
        {value}
      </p>
    </div>
  );
}
