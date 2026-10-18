import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Search, X } from "lucide-react";

import { Loader } from "../components/loader";
import ProductCard from "../components/productCard";

export function ProductPage() {
  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

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

  // =====================================================
  // CATEGORY DISPLAY ORDER
  // Saree Jackets always at the top.
  // Preschool Uniforms + Association T-Shirts always at the bottom.
  // =====================================================

  const categoryOrder = [
    "Saree Jackets",
    "Blouses",
    "Frocks",
    "Crop Tops",
    "Premium",
    "Traditional",
    "Preschool Uniforms",
    "Association T-Shirts",
  ];

  const availableCategories = [
    ...new Set(products.map((product) => product.category).filter(Boolean)),
  ];

  const knownCategories = categoryOrder.filter((category) =>
    availableCategories.includes(category),
  );

  const otherCategories = availableCategories.filter(
    (category) => !categoryOrder.includes(category),
  );

  const categories = [
    ...knownCategories.filter(
      (category) =>
        category !== "Preschool Uniforms" &&
        category !== "Association T-Shirts",
    ),
    ...otherCategories,
    ...knownCategories.filter(
      (category) =>
        category === "Preschool Uniforms" ||
        category === "Association T-Shirts",
    ),
  ];

  // =====================================================
  // CATEGORY DISPLAY LABEL
  // =====================================================

  function getCategoryLabel(category) {
    if (category === "Premium") {
      return "Premium Collection";
    }

    return category;
  }

  // =====================================================
  // SEARCH + CATEGORY FILTER
  // =====================================================

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    const searchableText = [
      product.productId,
      product.name,
      Array.isArray(product.altNames)
        ? product.altNames.join(" ")
        : product.altNames,
      product.description,
      product.category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      normalizedSearch === "" || searchableText.includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  const visibleCategories = categories.filter((category) =>
    filteredProducts.some((product) => product.category === category),
  );

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("All");
  }

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
              SEARCH + CATEGORY FILTER
          ================================================= */}

          <div
            className="
              mb-12
              rounded-[28px]
              border
              border-[#decfb9]
              bg-white
              p-4
              sm:p-5
              shadow-[0_14px_40px_rgba(72,35,25,0.08)]
            "
          >
            {/* SEARCH BAR */}

            <div
              className="
                flex
                flex-col
                lg:flex-row
                lg:items-center
                gap-4
              "
            >
              <div
                className="
                  relative
                  flex-1
                "
              >
                <Search
                  size={20}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#9b7f6c]
                    pointer-events-none
                  "
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search designs, product name or category..."
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-[#ddcfbd]
                    bg-[#fcfaf7]
                    py-3.5
                    pl-12
                    pr-12
                    text-sm
                    text-[#3e2b22]
                    outline-none
                    transition
                    placeholder:text-[#b2a092]
                    focus:border-[#6b1d2f]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-[#6b1d2f]/5
                  "
                />

                {searchTerm !== "" && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      w-8
                      h-8
                      rounded-full
                      bg-[#f1e8dc]
                      text-[#6b1d2f]
                      flex
                      items-center
                      justify-center
                      hover:bg-[#6b1d2f]
                      hover:text-white
                      transition
                    "
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <div
                className="
                  shrink-0
                  flex
                  items-center
                  justify-between
                  lg:justify-end
                  gap-3
                "
              >
                <span
                  className="
                    text-xs
                    font-bold
                    text-[#8b7567]
                    whitespace-nowrap
                  "
                >
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "design" : "designs"} found
                </span>

                {(searchTerm !== "" || selectedCategory !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      text-xs
                      font-black
                      text-[#6b1d2f]
                      hover:text-[#b88f25]
                      transition
                      whitespace-nowrap
                    "
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* CATEGORY FILTERS */}

            <div
              className="
                mt-5
                flex
                gap-2.5
                overflow-x-auto
                pb-2
                hide-scrollbar
              "
            >
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`
                  shrink-0
                  px-4
                  py-2.5
                  rounded-full
                  border
                  text-sm
                  font-bold
                  transition-all
                  ${
                    selectedCategory === "All"
                      ? "bg-[#6b1d2f] border-[#6b1d2f] text-[#f3e5ab] shadow-md"
                      : "bg-[#faf7f2] border-[#ddcfbd] text-[#6f594b] hover:border-[#6b1d2f] hover:text-[#6b1d2f]"
                  }
                `}
              >
                All Designs
              </button>

              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`
                    shrink-0
                    px-4
                    py-2.5
                    rounded-full
                    border
                    text-sm
                    font-bold
                    transition-all
                    ${
                      selectedCategory === category
                        ? "bg-[#6b1d2f] border-[#6b1d2f] text-[#f3e5ab] shadow-md"
                        : "bg-[#faf7f2] border-[#ddcfbd] text-[#6f594b] hover:border-[#6b1d2f] hover:text-[#6b1d2f]"
                    }
                  `}
                >
                  {getCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>

          {/* =================================================
              CATEGORY SECTIONS
          ================================================= */}

          {visibleCategories.map((category) => (
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
                    {getCategoryLabel(category)}
                  </h2>

                  <p
                    className="
                      text-xs
                      text-[#a18a7a]
                      mt-1
                    "
                  >
                    Explore our {getCategoryLabel(category)} collection
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
                {filteredProducts
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

          {products.length > 0 && filteredProducts.length === 0 && (
            <div
              className="
                min-h-[260px]
                flex
                items-center
                justify-center
                mb-12
              "
            >
              <div
                className="
                  w-full
                  max-w-xl
                  text-center
                  bg-white
                  border
                  border-[#decfb9]
                  rounded-3xl
                  px-6
                  sm:px-10
                  py-10
                  shadow-sm
                "
              >
                <div
                  className="
                    w-14
                    h-14
                    mx-auto
                    rounded-2xl
                    bg-[#6b1d2f]/10
                    text-[#6b1d2f]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Search size={25} />
                </div>

                <h2
                  className="
                    mt-5
                    text-xl
                    font-black
                    text-[#5b1a2b]
                  "
                >
                  No matching designs found
                </h2>

                <p
                  className="
                    text-[#8b7567]
                    text-sm
                    mt-2
                    leading-6
                  "
                >
                  වෙනත් product name එකක් search කරන්න හෝ category filter එක
                  වෙනස් කර බලන්න.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="
                    mt-6
                    px-6
                    py-3
                    rounded-xl
                    bg-[#6b1d2f]
                    text-[#f3e5ab]
                    font-bold
                    text-sm
                    hover:bg-[#521624]
                    transition
                  "
                >
                  Show All Designs
                </button>
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
