import axios from "axios";

import { useEffect, useRef, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import {
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaLock,
} from "react-icons/fa";

import { clearCart } from "../utils/cart";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();

  const [status, setStatus] = useState("checking");

  const [payment, setPayment] = useState(null);

  const cartClearedRef = useRef(false);

  // =====================================================
  // PAYMENT REFERENCE
  // =====================================================

  const paymentReference = searchParams.get("payment_ref");

  // =====================================================
  // PAYMENT CONTEXT
  // =====================================================

  function getPendingPaymentContext() {
    try {
      const pendingString = sessionStorage.getItem("naricraftPendingPayment");

      if (!pendingString) {
        return null;
      }

      return JSON.parse(pendingString);
    } catch {
      return null;
    }
  }

  // =====================================================
  // CLEAR DATABASE CART
  // =====================================================

  async function clearPurchasedCart(pending) {
    if (cartClearedRef.current) {
      return;
    }

    if (pending?.clearCart !== true) {
      return;
    }

    cartClearedRef.current = true;

    try {
      await clearCart();
    } catch (error) {
      console.error("Cart Clear Error:", error.message);

      // IMPORTANT:
      // Payment already succeeded.
      // Cart clear failure must not
      // change payment status.
    }
  }

  // =====================================================
  // VERIFY PAYMENT
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    // =========================================
    // REQUIRED DATA
    // =========================================

    if (!paymentReference || !token) {
      setStatus("error");

      return;
    }

    let stopped = false;

    let timer = null;

    async function verifyPayment(attempt = 0) {
      if (stopped) {
        return;
      }

      try {
        const response = await axios.get(
          import.meta.env.VITE_API_URL +
            "/api/payments/status/" +
            encodeURIComponent(paymentReference),

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (stopped) {
          return;
        }

        const data = response.data;

        setPayment(data);

        // =======================================
        // VERIFIED SUCCESS
        // =======================================

        if (
          data.paymentAttemptStatus === "Success" &&
          (data.paymentStatus === "Paid" ||
            data.paymentStatus === "Partially Paid")
        ) {
          const pending = getPendingPaymentContext();

          if (pending?.paymentReference === paymentReference) {
            await clearPurchasedCart(pending);
          }

          sessionStorage.removeItem("naricraftPendingPayment");

          setStatus("success");

          return;
        }

        // =======================================
        // FAILED / CANCELLED / CHARGEDBACK
        // =======================================

        if (
          ["Failed", "Cancelled", "Chargedback"].includes(
            data.paymentAttemptStatus,
          )
        ) {
          setStatus("failed");

          sessionStorage.removeItem("naricraftPendingPayment");

          return;
        }

        // =======================================
        // CALLBACK MAY TAKE A MOMENT
        //
        // 15 checks × 2 sec ≈ 30 sec
        // =======================================

        if (attempt >= 14) {
          setStatus("pending");

          return;
        }

        timer = setTimeout(() => {
          verifyPayment(attempt + 1);
        }, 2000);
      } catch (error) {
        console.error("Payment Verification Error:", error.message);

        if (stopped) {
          return;
        }

        if (error.response?.status === 401) {
          setStatus("error");

          return;
        }

        if (attempt >= 14) {
          setStatus("error");

          return;
        }

        timer = setTimeout(() => {
          verifyPayment(attempt + 1);
        }, 2000);
      }
    }

    verifyPayment();

    return () => {
      stopped = true;

      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [paymentReference]);

  // =====================================================
  // MY ORDERS LINK
  // =====================================================

  const ordersLinkState = {
    tab: payment?.orderType === "custom" ? "custom" : "products",
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#faf7f2]
        flex
        items-center
        justify-center
        p-5
      "
    >
      <div
        className="
          w-full
          max-w-xl
          bg-white
          border
          border-[#e1d2c0]
          rounded-[30px]
          shadow-[0_18px_50px_rgba(91,26,43,0.12)]
          p-8
          md:p-10
          text-center
        "
      >
        {/* =========================================
            CHECKING
        ========================================= */}

        {status === "checking" && (
          <>
            <FaClock
              className="
                text-[#d4af37]
                text-5xl
                mx-auto
              "
            />

            <h1
              className="
                text-2xl
                font-black
                text-[#4a1624]
                mt-5
              "
            >
              Verifying Payment
            </h1>

            <p
              className="
                text-[#8b7567]
                mt-3
              "
            >
              Please wait while we securely confirm your payment.
            </p>
          </>
        )}

        {/* =========================================
            SUCCESS
        ========================================= */}

        {status === "success" && (
          <>
            <FaCheckCircle
              className="
                text-green-600
                text-6xl
                mx-auto
              "
            />

            <h1
              className="
                text-3xl
                font-black
                text-[#4a1624]
                mt-5
              "
            >
              {payment?.paymentStatus === "Partially Paid"
                ? "Advance Payment Successful"
                : "Payment Successful"}
            </h1>

            <p
              className="
                text-[#8b7567]
                mt-3
              "
            >
              Your NariCraft payment has been securely verified.
            </p>

            {payment && (
              <div
                className="
                  bg-[#f8f1e8]
                  rounded-2xl
                  p-5
                  mt-6
                  text-left
                  space-y-3
                "
              >
                <Row label="Order" value={payment.orderId} />

                <Row
                  label="Order Type"
                  value={
                    payment.orderType === "custom"
                      ? "Custom Order"
                      : "Product Order"
                  }
                />

                <Row label="Payment Plan" value={payment.paymentPlan} />

                <Row label="Payment Status" value={payment.paymentStatus} />

                <Row
                  label="Paid"
                  value={`LKR ${Number(
                    payment.paidAmount || 0,
                  ).toLocaleString()}`}
                />

                <Row
                  label="Remaining"
                  value={`LKR ${Number(
                    payment.remainingAmount || 0,
                  ).toLocaleString()}`}
                />

                <Row label="Balance Status" value={payment.balanceStatus} />
              </div>
            )}

            {/* HALF PAYMENT NOTICE */}

            {payment?.paymentStatus === "Partially Paid" && (
              <div
                className="
                  mt-5
                  bg-blue-50
                  border
                  border-blue-200
                  rounded-2xl
                  p-5
                  text-left
                "
              >
                <p className="font-black text-blue-800">50% Advance Paid ✅</p>

                <p className="text-sm text-blue-700 mt-2 leading-6">
                  Remaining balance:{" "}
                  <strong>
                    LKR {Number(payment.remainingAmount || 0).toLocaleString()}
                  </strong>
                  . This amount can be collected on delivery.
                </p>
              </div>
            )}

            <Link
              to="/orders"
              state={ordersLinkState}
              className="
                block
                mt-7
                py-4
                rounded-2xl
                bg-[#6b1d2f]
                text-[#f3d975]
                font-black
              "
            >
              View My Orders
            </Link>
          </>
        )}

        {/* =========================================
            PENDING
        ========================================= */}

        {status === "pending" && (
          <>
            <FaClock
              className="
                text-[#d4af37]
                text-5xl
                mx-auto
              "
            />

            <h1
              className="
                text-2xl
                font-black
                text-[#4a1624]
                mt-5
              "
            >
              Payment Verification Pending
            </h1>

            <p
              className="
                text-[#8b7567]
                mt-3
                leading-6
              "
            >
              The gateway response is taking longer than expected. Do not make
              another payment yet.
            </p>

            <Link
              to="/orders"
              state={ordersLinkState}
              className="
                block
                mt-7
                py-4
                rounded-2xl
                bg-[#6b1d2f]
                text-[#f3d975]
                font-black
              "
            >
              Check My Orders
            </Link>
          </>
        )}

        {/* =========================================
            FAILED / ERROR
        ========================================= */}

        {(status === "failed" || status === "error") && (
          <>
            <FaExclamationTriangle
              className="
                text-red-500
                text-5xl
                mx-auto
              "
            />

            <h1
              className="
                text-2xl
                font-black
                text-[#4a1624]
                mt-5
              "
            >
              Payment Not Verified
            </h1>

            <p
              className="
                text-[#8b7567]
                mt-3
                leading-6
              "
            >
              We could not confirm this payment. Please check your order before
              trying again.
            </p>

            <Link
              to="/orders"
              state={ordersLinkState}
              className="
                block
                mt-7
                py-4
                rounded-2xl
                bg-[#6b1d2f]
                text-[#f3d975]
                font-black
              "
            >
              View My Orders
            </Link>
          </>
        )}

        {/* =========================================
            SECURITY MESSAGE
        ========================================= */}

        <div
          className="
            flex
            justify-center
            items-center
            gap-2
            text-[11px]
            text-[#9a8273]
            mt-6
          "
        >
          <FaLock />
          Secure payment verification
        </div>
      </div>
    </div>
  );
}

// =====================================================
// ROW
// =====================================================

function Row({ label, value }) {
  return (
    <div
      className="
        flex
        justify-between
        gap-4
        text-sm
      "
    >
      <span
        className="
          text-[#8b7567]
        "
      >
        {label}
      </span>

      <span
        className="
          font-black
          text-[#4a1624]
          text-right
        "
      >
        {value || "-"}
      </span>
    </div>
  );
}
