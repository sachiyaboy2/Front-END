import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";

export function ProductPage() {
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    if (isLoading) {
      axios
        .get(import.meta.env.VITE_API_URL + "/api/products")

        .then((response) => {
          setProducts(response.data);

          setIsLoading(false);
        })

        .catch((error) => {
          console.log(error);

          setIsLoading(false);

          toast.error("Failed to load products");
        });
    }
  }, [isLoading]);

  // =====================================================
  // GET ALL CATEGORIES
  // duplicate categories අයින් කරනවා
  // =====================================================

  const categories = [...new Set(products.map((product) => product.category))];

  return (
    <div
      className="
        w-full
        min-h-screen
        bg-primary
        px-4
        md:px-8
        py-8
      "
    >
      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div
        className="
          max-w-7xl
          mx-auto
          mb-10
        "
      >
        <p
          className="
            text-[#b88f25]
            text-xs
            font-bold
            tracking-[0.25em]
            uppercase
          "
        >
          NariCraft Collection
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
          Discover Your Style
        </h1>

        <p
          className="
            mt-3
            text-[#8b7567]
            max-w-2xl
          "
        >
          ඔබට ගැළපෙන NariCraft designs category එක අනුව පහසුවෙන් තෝරාගන්න.
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
          LOADING
      ================================================= */}

      {isLoading ? (
        <Loader />
      ) : (
        <div
          className="
            max-w-7xl
            mx-auto
          "
        >
          {/* =================================================
              CATEGORY SECTIONS
          ================================================= */}

          {categories.map((category) => (
            <div key={category} className="mb-14">
              {/* ================= CATEGORY TITLE ================= */}

              <div
                className="
                  flex
                  items-center
                  gap-4
                  mb-6
                "
              >
                <div
                  className="
                    w-2
                    h-9
                    rounded-full
                    bg-[#6b1d2f]
                  "
                />

                <div>
                  <h2
                    className="
                      text-2xl
                      font-black
                      text-[#5b1a2b]
                    "
                  >
                    {category}
                  </h2>

                  <p
                    className="
                      text-xs
                      text-[#a18a7a]
                      mt-1
                    "
                  >
                    Explore our {category} collection
                  </p>
                </div>
              </div>

              {/* ================= PRODUCTS ================= */}

              {/* ================= PRODUCTS ================= */}

              <div
                className="
    flex
    gap-4
    overflow-x-auto
    pb-5

    scroll-smooth
    snap-x
    snap-proximity

    hide-scrollbar

    md:grid
    md:grid-cols-2
    md:gap-6
    md:overflow-visible
    md:pb-0

    lg:grid-cols-3
    xl:grid-cols-4
  "
              >
                {products
                  .filter((product) => product.category === category)
                  .map((product) => (
                    <div
                      key={product.productId}
                      className="
          min-w-[255px]
          w-[255px]

          sm:min-w-[285px]
          sm:w-[285px]

          md:min-w-0
          md:w-auto

          snap-start
        "
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* =================================================
              NO PRODUCTS
          ================================================= */}

          {products.length === 0 && (
            <div
              className="
                min-h-[280px]
                flex
                items-center
                justify-center
                mb-12
              "
            >
              <div
                className="
                  text-center
                  bg-white
                  border
                  border-[#decfb9]
                  rounded-3xl
                  px-10
                  py-12
                  shadow-sm
                "
              >
                <h2
                  className="
                    text-xl
                    font-bold
                    text-[#5b1a2b]
                  "
                >
                  No Products Yet
                </h2>

                <p
                  className="
                    text-[#8b7567]
                    text-sm
                    mt-2
                  "
                >
                  New products will appear here.
                </p>
              </div>
            </div>
          )}

          {/* =================================================
              CUSTOM DESIGN SECTION
          ================================================= */}

          <div
            className="
              relative
              overflow-hidden
              mt-16
              mb-10
              rounded-[32px]
              bg-gradient-to-r
              from-[#6b1d2f]
              via-[#521425]
              to-[#350b17]
              px-7
              py-12
              md:px-12
              md:py-14
              border
              border-[#d4af37]/30
              shadow-[0_20px_50px_rgba(91,26,43,0.22)]
            "
          >
            {/* ================= DECORATION ================= */}

            <div
              className="
                absolute
                -right-20
                -top-20
                w-64
                h-64
                rounded-full
                border
                border-[#d4af37]/20
              "
            />

            <div
              className="
                absolute
                -right-5
                -top-5
                w-36
                h-36
                rounded-full
                border
                border-[#d4af37]/10
              "
            />

            <div
              className="
                absolute
                -left-24
                -bottom-28
                w-72
                h-72
                rounded-full
                border
                border-[#d4af37]/10
              "
            />

            {/* ================= CONTENT ================= */}

            <div
              className="
                relative
                z-10
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-8
              "
            >
              {/* ================= TEXT ================= */}

              <div className="max-w-2xl">
                <p
                  className="
                    text-[#d4af37]
                    text-[10px]
                    font-black
                    tracking-[3px]
                    uppercase
                  "
                >
                  Can't Find Your Perfect Design?
                </p>

                <h2
                  className="
                    mt-3
                    text-3xl
                    md:text-4xl
                    font-black
                    text-white
                    leading-tight
                  "
                >
                  ඔබට හරියන design එකක්
                  <span
                    className="
                      text-[#d4af37]
                    "
                  >
                    {" "}
                    හම්බුණේ නැද්ද?
                  </span>
                </h2>

                <p
                  className="
                    mt-4
                    text-[#e4d4c8]
                    text-sm
                    md:text-base
                    leading-7
                  "
                >
                  ප්‍රශ්නයක් නෑ. ඔබට කැමති design photo එක අපට ලබාදී, ඔබගේ
                  measurements අනුව ඔබටම ගැළපෙන custom outfit එකක් NariCraft
                  වෙතින් නිර්මාණය කරගන්න.
                </p>
              </div>

              {/* ================= BUTTON ================= */}

              <div
                className="
                  shrink-0
                "
              >
                <Link
                  to="/custom-design"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-3
                    px-8
                    py-4
                    rounded-2xl
                    bg-[#d4af37]
                    text-[#3b0d19]
                    font-black
                    shadow-[0_6px_0_#f3dfa0]
                    hover:-translate-y-1
                    hover:shadow-[0_8px_0_#f3dfa0]
                    hover:scale-[1.02]
                    active:translate-y-1
                    active:shadow-none
                    transition-all
                    duration-300
                  "
                >
                  Create Custom Design
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`

  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

`}</style>
    </div>
  );
}
