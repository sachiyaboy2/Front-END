import { Link, useSearchParams } from "react-router-dom";

import { FaTimesCircle, FaShoppingBag, FaArrowLeft } from "react-icons/fa";

export default function PaymentCancelledPage() {
  const [searchParams] = useSearchParams();

  // =====================================================
  // PAYMENT REFERENCE
  // =====================================================

  const paymentReference = searchParams.get("payment_ref");

  // =====================================================
  // PAYMENT CONTEXT
  // =====================================================

  let paymentContext = null;

  try {
    const pendingString = sessionStorage.getItem("naricraftPendingPayment");

    if (pendingString) {
      paymentContext = JSON.parse(pendingString);
    }
  } catch {
    paymentContext = null;
  }

  // =====================================================
  // ORDER TAB
  // =====================================================

  const ordersLinkState = {
    tab: paymentContext?.orderType === "custom" ? "custom" : "products",
  };

  // =====================================================
  // IMPORTANT
  //
  // Do NOT clear the database cart here.
  //
  // Payment has NOT been verified as successful.
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
          max-w-lg
          bg-white
          rounded-[30px]
          border
          border-[#e1d2c0]
          shadow-[0_18px_50px_rgba(91,26,43,0.12)]
          p-9
          text-center
        "
      >
        <FaTimesCircle
          className="
            text-red-500
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
          Payment Cancelled
        </h1>

        <p
          className="
            text-[#8b7567]
            mt-3
            leading-6
          "
        >
          Your payment was not completed. No successful payment has been
          recorded.
        </p>

        {/* =========================================
            INFO
        ========================================= */}

        <div
          className="
            mt-6
            bg-[#fff4d9]
            border
            border-[#e8cc83]
            rounded-2xl
            p-5
            text-left
          "
        >
          <p
            className="
              text-sm
              font-black
              text-[#8a6500]
            "
          >
            Your order is still safe.
          </p>

          <p
            className="
              text-sm
              text-[#6f5828]
              mt-2
              leading-6
            "
          >
            You can return to My Orders and try the payment again. Your shopping
            cart has not been cleared.
          </p>
        </div>

        {/* =========================================
            PAYMENT REFERENCE
        ========================================= */}

        {paymentReference && (
          <div
            className="
              mt-5
              bg-[#faf7f2]
              border
              border-[#eadaca]
              rounded-xl
              p-4
              text-left
            "
          >
            <p
              className="
                text-[10px]
                uppercase
                font-black
                text-[#9a8273]
              "
            >
              Payment Reference
            </p>

            <p
              className="
                text-xs
                font-bold
                text-[#6b1d2f]
                mt-2
                break-all
              "
            >
              {paymentReference}
            </p>
          </div>
        )}

        {/* =========================================
            BUTTON
        ========================================= */}

        <Link
          to="/orders"
          state={ordersLinkState}
          onClick={() => {
            sessionStorage.removeItem("naricraftPendingPayment");
          }}
          className="
            mt-7
            w-full
            py-4
            rounded-2xl
            bg-[#6b1d2f]
            text-[#f3d975]
            font-black
            flex
            justify-center
            items-center
            gap-2
          "
        >
          <FaShoppingBag />
          View My Orders
        </Link>

        <Link
          to="/"
          className="
            mt-3
            w-full
            py-4
            rounded-2xl
            border-2
            border-[#6b1d2f]
            text-[#6b1d2f]
            font-black
            flex
            justify-center
            items-center
            gap-2
          "
        >
          <FaArrowLeft />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
