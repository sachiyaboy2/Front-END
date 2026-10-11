import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { MdFavoriteBorder } from "react-icons/md";

export default function ProductCard(props) {
  const product = props.product;

  return (
    <div
      className="
        group
        w-full
        bg-white
        rounded-[24px]
        overflow-hidden
        border
        border-[#e3d4c3]
        shadow-[0_8px_25px_rgba(74,22,36,0.08)]
        hover:-translate-y-2
        hover:shadow-[0_18px_40px_rgba(74,22,36,0.18)]
        transition-all
        duration-300
      "
    >
      {/* =================================================
          PRODUCT IMAGE
      ================================================= */}

      <div
        className="
          relative
          w-full
          h-[270px]
          overflow-hidden
          bg-[#f5eee4]
        "
      >
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="
            w-full
            h-full
            object-cover
            group-hover:scale-110
            transition-transform
            duration-500
          "
        />

        {/* CATEGORY */}

        <div
          className="
            absolute
            top-4
            left-4
            px-3
            py-1.5
            rounded-full
            bg-[#5b1a2b]/90
            backdrop-blur-md
            text-[#f3d975]
            text-[10px]
            font-bold
            tracking-wide
          "
        >
          {product.category}
        </div>

        {/* HEART */}

        <button
          className="
            absolute
            top-4
            right-4
            w-9
            h-9
            rounded-full
            bg-white/90
            text-[#6b1d2f]
            flex
            items-center
            justify-center
            shadow-md
            hover:bg-[#6b1d2f]
            hover:text-white
            hover:scale-110
            transition-all
          "
        >
          <MdFavoriteBorder size={14} />
        </button>

        {/* IMAGE GRADIENT */}

        <div
          className="
            absolute
            bottom-0
            left-0
            w-full
            h-16
            bg-gradient-to-t
            from-black/20
            to-transparent
          "
        />
      </div>

      {/* =================================================
          PRODUCT DETAILS
      ================================================= */}

      <div
        className="
          p-5
        "
      >
        {/* PRODUCT ID */}

        <p
          className="
            text-[10px]
            font-bold
            text-[#b88f25]
            tracking-[0.18em]
            uppercase
          "
        >
          {product.productId}
        </p>

        {/* NAME */}

        <h2
          className="
            text-lg
            font-black
            text-[#4a1624]
            mt-2
            truncate
          "
        >
          {product.name}
        </h2>

        {/* ALT NAME */}

        {product.altNames?.length > 0 && (
          <p
            className="
              text-xs
              text-[#9a8273]
              mt-1
              truncate
            "
          >
            {product.altNames.join(", ")}
          </p>
        )}

        {/* PRICE + BUTTON */}

        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            mt-5
          "
        >
          <div>
            <p
              className="
                text-[10px]
                text-[#a18a7a]
                uppercase
                font-bold
              "
            >
              Price
            </p>

            <p
              className="
                text-xl
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

              {product.price?.toLocaleString()}
            </p>
          </div>

          {/* VIEW BUTTON */}

          <Link
            to={"/overview/" + product.productId}
            className="group/button w-11 h-11 rounded-xl bg-[#6b1d2f] text-[#f3d975] flex items-center justify-center shadow-md hover:bg-[#4b1020] hover:scale-110 transition-all"
          >
            <FaArrowRight className="group-hover/button:translate-x-1 transition-transform" />
          </Link>

          {/* <Link
            to="/overview"
            state={product}
            className="
      group/button
      w-11
      h-11
      rounded-xl
      bg-[#6b1d2f]
      text-[#f3d975]
      flex
      items-center
      justify-center
      shadow-md
      hover:bg-[#4b1020]
      hover:scale-110
      transition-all
    "
            title="View Details"
          >
            <FaArrowRight
              className="
        group-hover/button:translate-x-1
        transition-transform
      "
            />
          </Link> */}
        </div>
      </div>
    </div>
  );
}
