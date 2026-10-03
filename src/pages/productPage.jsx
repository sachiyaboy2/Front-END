import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
            space-y-14
          "
        >
          {/* =================================================
              CATEGORY SECTIONS
          ================================================= */}

          {categories.map((category) => (
            <div key={category}>
              {/* CATEGORY TITLE */}

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

              {/* PRODUCTS */}

              <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    lg:grid-cols-3
                    xl:grid-cols-4
                    gap-6
                  "
              >
                {products

                  .filter((product) => product.category === category)

                  .map((product) => (
                    <ProductCard key={product.productId} product={product} />
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
                min-h-[300px]
                flex
                items-center
                justify-center
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
        </div>
      )}
    </div>
  );
}
