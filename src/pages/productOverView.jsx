import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import { FaCartPlus } from "react-icons/fa";

import { Loader } from "../components/loader";
import ImageSlider from "../components/imageSlider";

import { addToCart } from "../utils/cart";

export default function ProductOverView() {
  const params = useParams();

  const [status, setStatus] = useState("loading");

  const [product, setProduct] = useState(null);

  // =====================================================
  // LOAD PRODUCT
  // =====================================================

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/products/" + params.id)

      .then((res) => {
        setProduct(res.data);

        setStatus("success");
      })

      .catch((err) => {
        console.log(err);

        toast.error("Error loading product");

        setStatus("error");
      });
  }, [params.id]);

  return (
    <div
      className="
        w-full
        min-h-screen
        bg-[#FAF7F2]
      "
    >
      {/* =================================================
          LOADING
      ================================================= */}

      {status === "loading" && <Loader />}

      {/* =================================================
          SUCCESS
      ================================================= */}

      {status === "success" && product && (
        <div
          className="
              max-w-7xl
              mx-auto
              px-5
              py-10
              flex
              flex-col
              lg:flex-row
              gap-12
            "
        >
          {/* ================= LEFT SIDE ================= */}

          <div
            className="
                w-full
                lg:w-1/2
                flex
                justify-center
              "
          >
            <ImageSlider images={product.images} />
          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div
            className="
                w-full
                lg:w-1/2
              "
          >
            <ProductDetails product={product} />
          </div>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {status === "error" && (
        <div
          className="
            min-h-[400px]
            flex
            items-center
            justify-center
          "
        >
          <h1
            className="
              text-red-500
              text-2xl
              font-bold
            "
          >
            Error loading product
          </h1>
        </div>
      )}
    </div>
  );
}

// =====================================================
// RIGHT SIDE PRODUCT DETAILS
// =====================================================

function ProductDetails(props) {
  const product = props.product;

  const navigate = useNavigate();

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // =====================================================
  // ADD TO CART
  // =====================================================

  async function handleAddToCart() {
    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("Please login to add products to your cart");
      navigate("/login");
      return;
    }

    if (product.labelNo < 1) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      setIsAddingToCart(true);

      await addToCart(product, 1);

      toast.success("Product added to cart 🛒");
    } catch (error) {
      console.log("Add To Cart Error:", error);

      toast.error(error.response?.data?.message || "Unable to add product to cart");
    } finally {
      setIsAddingToCart(false);
    }
  }

  // =====================================================
  // ORDER NOW
  // =====================================================

  function handleOrderNow() {
    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (product.labelNo < 1) {
      toast.error("This product is out of stock");
      return;
    }

    navigate("/checkout", {
      state: {
        buyNow: true,
        product: {
          productId: product.productId,
          name: product.name,
          price: product.price,
          labelNo: product.labelNo,
          quantity: 1,
          image: product.images?.[0],
        },
      },
    });
  }

  return (
    <div
      className="
        w-full
        bg-white
        rounded-[30px]
        border
        border-[#e1d2c0]
        shadow-[0_18px_45px_rgba(91,26,43,0.12)]
        p-7
        md:p-9
      "
    >
      {/* =================================================
          CATEGORY + CART BUTTON
      ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-5
        "
      >
        {/* CATEGORY */}

        <div
          className="
            inline-block
            px-4
            py-2
            rounded-full
            bg-[#5b1a2b]
            text-[#f3d975]
            text-xs
            font-bold
            tracking-wider
          "
        >
          {product.category}
        </div>

        {/* =================================================
            ADD TO CART
        ================================================= */}

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart || product.labelNo < 1}
          title="Add to Cart"
          className="
            group
            w-12
            h-12
            rounded-full
            bg-[#f8f1e8]
            border-2
            border-[#e1d2c0]
            text-[#6b1d2f]
            flex
            items-center
            justify-center
            shadow-md
            hover:bg-[#6b1d2f]
            hover:border-[#d4af37]
            hover:text-[#f3d975]
            hover:scale-110
            transition-all
            duration-300
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
        >
          <FaCartPlus
            size={19}
            className="
              group-hover:scale-110
              transition-transform
            "
          />
        </button>
      </div>

      {/* =================================================
          PRODUCT NAME
      ================================================= */}

      <h1
        className="
          text-3xl
          md:text-4xl
          font-black
          text-[#4a1624]
          mt-5
        "
      >
        {product.name}
      </h1>

      {/* =================================================
          ALT NAMES
      ================================================= */}

      {product.altNames?.length > 0 && (
        <p
          className="
            text-sm
            text-[#9a8273]
            mt-2
          "
        >
          {product.altNames.join(", ")}
        </p>
      )}

      {/* =================================================
          PRODUCT ID
      ================================================= */}

      <p
        className="
          text-xs
          text-[#b88f25]
          font-bold
          tracking-[0.15em]
          mt-4
        "
      >
        PRODUCT ID : {product.productId}
      </p>

      {/* =================================================
          DIVIDER
      ================================================= */}

      <div
        className="
          w-full
          h-[1px]
          bg-[#eadfd2]
          my-6
        "
      />

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <div>
        <h3
          className="
            text-sm
            font-bold
            text-[#5b1a2b]
            mb-2
          "
        >
          Description
        </h3>

        <p
          className="
            text-[#806f63]
            leading-7
          "
        >
          {product.description}
        </p>
      </div>

      {/* =================================================
          PRODUCT INFO
      ================================================= */}

      <div
        className="
          grid
          grid-cols-2
          gap-4
          mt-7
        "
      >
        {/* STOCK */}

        <div
          className="
            bg-[#f8f1e8]
            rounded-2xl
            p-4
            border
            border-[#eadaca]
          "
        >
          <p
            className="
              text-xs
              text-[#9a8273]
              font-bold
            "
          >
            Stocks
          </p>

          <p
            className="
              text-[#5b1a2b]
              font-black
              mt-1
            "
          >
            {product.labelNo}
          </p>
        </div>

        {/* CATEGORY */}

        <div
          className="
            bg-[#f8f1e8]
            rounded-2xl
            p-4
            border
            border-[#eadaca]
          "
        >
          <p
            className="
              text-xs
              text-[#9a8273]
              font-bold
            "
          >
            Category
          </p>

          <p
            className="
              text-[#5b1a2b]
              font-black
              mt-1
            "
          >
            {product.category}
          </p>
        </div>
      </div>

      {/* =================================================
          PRICE + BUTTONS
      ================================================= */}

      <div
        className="
          mt-8
          flex
          flex-col
          sm:flex-row
          sm:items-end
          justify-between
          gap-5
        "
      >
        {/* PRICE */}

        <div>
          <p
            className="
              text-xs
              text-[#9a8273]
              font-bold
              uppercase
            "
          >
            Price
          </p>

          <p
            className="
              text-3xl
              font-black
              text-[#6b1d2f]
              mt-1
            "
          >
            <span
              className="
                text-sm
                mr-1
              "
            >
              LKR
            </span>

            {product.price?.toLocaleString()}
          </p>
        </div>

        {/* =================================================
            BUTTONS
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          {/* ================= CANCEL ================= */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              px-6
              py-4
              rounded-2xl
              bg-[#f7eee4]
              text-[#6b1d2f]
              border-2
              border-[#6b1d2f]
              font-bold
              hover:bg-[#6b1d2f]
              hover:text-[#f3d975]
              hover:-translate-y-1
              transition-all
            "
          >
            ← Cancel
          </button>

          {/* =================================================
              ORDER NOW
          ================================================= */}

          <button
  type="button"
  onClick={handleOrderNow}
  disabled={product.labelNo < 1}
  className="
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
    disabled:opacity-50
    disabled:cursor-not-allowed
    disabled:translate-y-0
  "
>
  Order Now
</button>
        </div>
      </div>
    </div>
  );
}
