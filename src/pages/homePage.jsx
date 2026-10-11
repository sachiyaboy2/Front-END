import { Link, Route, Routes, Navigate } from "react-router-dom";

import Header from "../components/header";
import AboutPage from "./AboutPage";
import { ProductPage } from "./productPage";
import ProductOverView from "./productOverView";

import { FaArrowRight, FaShoppingBag, FaStar, FaTruck } from "react-icons/fa";

import { GiLargeDress } from "react-icons/gi";

import { FiUploadCloud, FiScissors, FiCheckCircle } from "react-icons/fi";

import { TbRulerMeasure } from "react-icons/tb";
import CartPage from "./cart";
import CheckOutPage from "./checkOut";
import UserData from "../components/userData";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token == null) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-primary">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header />

      {/* =====================================================
          PAGES
      ===================================================== */}

      <Routes>
        {/* HOME */}

        <Route index element={<HomeContent />} />

        {/* PRODUCTS */}

        <Route path="products" element={<ProductPage />} />

        {/* ABOUT */}

        <Route path="about" element={<AboutPage />} />

        {/* CART */}

        <Route
          path="cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        {/* ORDERS */}

        <Route
          path="orders"
          element={
            <ProtectedRoute>
              {" "}
              <div className="p-10">
                <h1 className="text-3xl font-bold text-[#5b1a2b]">Oder Page</h1>
              </div>
            </ProtectedRoute>
          }
        />

        {/* PRODUCT OVERVIEW */}

        <Route
          path="overview/:id"
          element={
            <ProtectedRoute>
              <ProductOverView />
            </ProtectedRoute>
          }
        />

        {/* CHECKOUT */}

        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckOutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <UserData />
            </ProtectedRoute>
          }
        />

        {/* 404 */}

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="p-10">
                <h1 className="text-3xl font-bold text-red-700">
                  404 Page Not Found
                </h1>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

// ============================================================================
// HOME CONTENT
// ============================================================================

function HomeContent() {
  return (
    <div
      className="
        w-full
        overflow-hidden
        bg-[#faf7f2]
      "
    >
      {/* =====================================================================
          HERO SECTION
      ===================================================================== */}

      <section
        className="
          relative
          max-w-7xl
          mx-auto
          min-h-[600px]
          px-6
          py-16
          grid
          lg:grid-cols-2
          gap-12
          items-center
        "
      >
        {/* =================================================
            BACKGROUND DECORATION
        ================================================= */}

        <div
          className="
            absolute
            -right-24
            top-10
            w-72
            h-72
            bg-[#d99b21]/20
            rounded-full
            blur-3xl
            animate-pulse
          "
        />

        <div
          className="
            absolute
            -left-20
            bottom-0
            w-64
            h-64
            bg-[#6b1d2f]/10
            rounded-full
            blur-3xl
            animate-pulse
          "
        />

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="relative z-10">
          {/* WELCOME BADGE */}

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-white/60
              border
              border-[#dfcdbb]
              shadow-sm
              mb-5
            "
          >
            <FaStar className="text-[#d99b21]" />

            <span
              className="
                text-xs
                font-bold
                tracking-[0.18em]
                uppercase
                text-[#6b1d2f]
              "
            >
              Welcome to NariCraft
            </span>
          </div>

          {/* MAIN TITLE */}

          <h1
            className="
              text-4xl
              sm:text-5xl
              lg:text-6xl
              font-black
              leading-[1.08]
              text-[#4b1020]
            "
          >
            Your Fashion.
            <br />
            Your Design.
            <br />
            <span className="text-[#d99b21]">Your Story.</span>
          </h1>

          {/* DESCRIPTION */}

          <p
            className="
              mt-6
              max-w-xl
              text-[#7e6658]
              text-base
              md:text-lg
              leading-8
            "
          >
            ඔබට කැමති NariCraft design එකක් තෝරාගන්න. නැත්නම් ඔබගේම design එක
            upload කරලා, measurements වලට ගැළපෙන custom outfit එකක් නිර්මාණය
            කරගන්න.
          </p>

          {/* BUTTONS */}

          <div
            className="
              flex
              flex-wrap
              gap-4
              mt-8
            "
          >
            {/* PRODUCTS */}

            <Link
              to="/products"
              className="
                group
                flex
                items-center
                gap-3
                px-7
                py-4
                rounded-2xl
                bg-[#5b1a2b]
                text-[#f6dfa0]
                font-bold
                shadow-xl
                hover:-translate-y-1
                hover:scale-[1.02]
                transition-all
                duration-300
              "
            >
              <FaShoppingBag />
              Explore Products
              <FaArrowRight
                className="
                  group-hover:translate-x-1
                  transition-transform
                "
              />
            </Link>

            {/* ABOUT */}

            <Link
              to="/about"
              className="
                px-7
                py-4
                rounded-2xl
                bg-white/50
                border-2
                border-[#5b1a2b]
                text-[#5b1a2b]
                font-bold
                hover:bg-[#5b1a2b]
                hover:text-white
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              About Us
            </Link>
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE - OUR PHOTO 3D CARD
        ================================================= */}

        <div
          className="
            relative
            h-[470px]
            flex
            items-center
            justify-center
          "
        >
          {/* GOLD BACK CARD */}

          <div
            className="
              absolute
              w-[270px]
              h-[350px]
              rounded-[35px]
              bg-[#d99b21]
              rotate-[12deg]
              translate-x-14
              opacity-40
              shadow-2xl
            "
          />

          {/* WINE BACK CARD */}

          <div
            className="
              absolute
              w-[270px]
              h-[350px]
              rounded-[35px]
              bg-[#8d4051]
              -rotate-[12deg]
              -translate-x-14
              opacity-35
              shadow-2xl
            "
          />

          {/* MAIN CARD */}

          <div
            className="
              relative
              z-20
              w-[290px]
              h-[390px]
              rounded-[36px]
              bg-gradient-to-br
              from-[#781f38]
              via-[#5b1a2b]
              to-[#350b18]
              border
              border-[#d99b21]/50
              shadow-[0_35px_60px_rgba(79,15,32,0.35)]
              p-7
              transition-all
              duration-700
              hover:-translate-y-3
              hover:rotate-2
              hover:scale-[1.03]
            "
          >
            {/* TOP */}

            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <div
                className="
                  w-12
                  h-12
                  rounded-xl
                  bg-[#f7ecdf]
                  border
                  border-[#d99b21]
                  flex
                  items-center
                  justify-center
                  overflow-hidden
                "
              >
                <img src="/logo.png" className="h-[70%]" alt="NariCraft Logo" />
              </div>

              <span
                className="
                  text-[#e9c76b]
                  text-[10px]
                  tracking-[0.25em]
                  font-bold
                "
              >
                NARICRAFT
              </span>
            </div>

            {/* PRODUCT PHOTO */}

            <div
              className="
                h-[235px]
                flex
                items-center
                justify-center
                overflow-hidden
                rounded-[28px]
                border-2
                border-[#d99b21]/50
                shadow-[0_18px_40px_rgba(91,26,43,0.28)]
                bg-[#f6ede2]
                group
              "
            >
              <img
                src="/sarii.png"
                alt="NariCraft Saree"
                className="
                  w-full
                  h-full
                  object-cover
                  transition-all
                  duration-700
                  group-hover:scale-110
                "
              />
            </div>

            <p
              className="
                text-[#e5c168]
                text-xs
                tracking-[0.18em]
                font-bold
                mt-3
              "
            >
              CUSTOM COLLECTION
            </p>

            <h2
              className="
                text-white
                text-xl
                font-black
                mt-1
              "
            >
              Made Just For You
            </h2>
          </div>

          {/* FLOATING CUSTOM CARD */}

          <div
            className="
              absolute
              z-30
              left-0
              lg:left-3
              top-16
              bg-white/85
              backdrop-blur-md
              border
              border-white
              rounded-2xl
              shadow-xl
              p-4
              flex
              items-center
              gap-3
              animate-[bounce_4s_infinite]
            "
          >
            <div
              className="
                w-10
                h-10
                bg-[#5b1a2b]
                text-[#d99b21]
                rounded-xl
                flex
                items-center
                justify-center
              "
            >
              <GiLargeDress />
            </div>

            <div>
              <p className="text-xs font-bold text-[#5b1a2b]">Custom Fit</p>

              <p className="text-[10px] text-[#8a7568]">Made to measure</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          SIMPLE STEPS
      ===================================================================== */}

      <section
        className="
          relative
          py-24
          bg-white
          overflow-hidden
        "
      >
        {/* BACKGROUND */}

        <div
          className="
            absolute
            -top-24
            -right-24
            w-72
            h-72
            rounded-full
            bg-[#d4af37]/10
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-32
            -left-24
            w-80
            h-80
            rounded-full
            bg-[#6b1d2f]/5
            blur-3xl
          "
        />

        <div
          className="
            relative
            z-10
            max-w-7xl
            mx-auto
            px-6
          "
        >
          {/* SECTION TITLE */}

          <div
            className="
              text-center
              max-w-2xl
              mx-auto
            "
          >
            <span
              className="
                inline-block
                px-4
                py-2
                rounded-full
                bg-[#f8f0e5]
                border
                border-[#d4af37]/30
                text-[10px]
                font-black
                tracking-[3px]
                text-[#6b1d2f]
              "
            >
              SIMPLE STEPS
            </span>

            <h2
              className="
                mt-5
                text-3xl
                sm:text-4xl
                font-black
                text-[#4b1020]
              "
            >
              NariCraft වෙතින්
              <span className="text-[#d4af37]"> මසා ගන්නේ කෙසේද?</span>
            </h2>

            <p
              className="
                mt-4
                text-sm
                md:text-base
                text-[#806b5e]
                leading-7
              "
            >
              ඔබේ design එක තෝරාගැනීමේ සිට නිමවූ ඇඳුම ඔබේ අතට ලැබෙන තෙක් සරල
              පියවර තුනක්.
            </p>
          </div>

          {/* STEP CARDS */}

          <div
            className="
              grid
              md:grid-cols-3
              gap-7
              mt-14
            "
          >
            {/* =================================================
                STEP 01
            ================================================= */}

            <div
              className="
                group
                relative
                bg-[#faf7f2]
                border
                border-[#eadfd2]
                rounded-[28px]
                p-7
                overflow-hidden
                hover:-translate-y-2
                hover:shadow-[0_20px_45px_rgba(91,26,43,0.12)]
                transition-all
                duration-300
              "
            >
              <span
                className="
                  absolute
                  -right-2
                  -top-6
                  text-[95px]
                  font-black
                  text-[#6b1d2f]/5
                "
              >
                01
              </span>

              <div
                className="
                  relative
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#6b1d2f]
                  text-[#d4af37]
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  group-hover:rotate-6
                  group-hover:scale-110
                  transition-all
                "
              >
                <FiUploadCloud size={26} />
              </div>

              <p
                className="
                  mt-7
                  text-[10px]
                  tracking-[3px]
                  font-black
                  text-[#d4af37]
                "
              >
                STEP 01
              </p>

              <h3
                className="
                  mt-2
                  text-xl
                  font-black
                  text-[#4b1020]
                "
              >
                Design එක තෝරන්න
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  text-[#806b5e]
                  leading-7
                "
              >
                අපගේ collection එකෙන් ඔබට කැමති design එකක් තෝරාගන්න, නැත්නම්
                ඔබගේම design photo එකක් ලබාදෙන්න.
              </p>
            </div>

            {/* =================================================
                STEP 02
            ================================================= */}

            <div
              className="
                group
                relative
                bg-[#faf7f2]
                border
                border-[#eadfd2]
                rounded-[28px]
                p-7
                overflow-hidden
                hover:-translate-y-2
                hover:shadow-[0_20px_45px_rgba(91,26,43,0.12)]
                transition-all
                duration-300
              "
            >
              <span
                className="
                  absolute
                  -right-2
                  -top-6
                  text-[95px]
                  font-black
                  text-[#6b1d2f]/5
                "
              >
                02
              </span>

              <div
                className="
                  relative
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#6b1d2f]
                  text-[#d4af37]
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  group-hover:rotate-6
                  group-hover:scale-110
                  transition-all
                "
              >
                <TbRulerMeasure size={28} />
              </div>

              <p
                className="
                  mt-7
                  text-[10px]
                  tracking-[3px]
                  font-black
                  text-[#d4af37]
                "
              >
                STEP 02
              </p>

              <h3
                className="
                  mt-2
                  text-xl
                  font-black
                  text-[#4b1020]
                "
              >
                මිනුම් ලබාදෙන්න
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  text-[#806b5e]
                  leading-7
                "
              >
                Standard size එකක් තෝරාගන්න හෝ ඔබගේම body measurements ලබාදී
                custom fitting එකක් සකස් කරගන්න.
              </p>
            </div>

            {/* =================================================
                STEP 03
            ================================================= */}

            <div
              className="
                group
                relative
                bg-[#faf7f2]
                border
                border-[#eadfd2]
                rounded-[28px]
                p-7
                overflow-hidden
                hover:-translate-y-2
                hover:shadow-[0_20px_45px_rgba(91,26,43,0.12)]
                transition-all
                duration-300
              "
            >
              <span
                className="
                  absolute
                  -right-2
                  -top-6
                  text-[95px]
                  font-black
                  text-[#6b1d2f]/5
                "
              >
                03
              </span>

              <div
                className="
                  relative
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#6b1d2f]
                  text-[#d4af37]
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  group-hover:rotate-6
                  group-hover:scale-110
                  transition-all
                "
              >
                <FiScissors size={26} />
              </div>

              <p
                className="
                  mt-7
                  text-[10px]
                  tracking-[3px]
                  font-black
                  text-[#d4af37]
                "
              >
                STEP 03
              </p>

              <h3
                className="
                  mt-2
                  text-xl
                  font-black
                  text-[#4b1020]
                "
              >
                අපි නිමකරමු
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  text-[#806b5e]
                  leading-7
                "
              >
                ඔබ තෝරාගත් design එක සහ measurements අනුව NariCraft ඔබේ outfit
                එක අලංකාරව නිමකරයි.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          WHY CHOOSE NARICRAFT
      ===================================================================== */}

      <section
        className="
          py-20
          bg-[#efe7db]
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-6
          "
        >
          {/* TITLE */}

          <div
            className="
              text-center
              mb-12
            "
          >
            <p
              className="
                text-[10px]
                font-black
                tracking-[3px]
                text-[#6b1d2f]
              "
            >
              WHY NARICRAFT
            </p>

            <h2
              className="
                mt-3
                text-3xl
                font-black
                text-[#4b1020]
              "
            >
              Crafted Around You
            </h2>
          </div>

          <div
            className="
              grid
              md:grid-cols-3
              gap-6
            "
          >
            {/* PERFECT FIT */}

            <div
              className="
                group
                bg-white/70
                backdrop-blur-md
                border
                border-white
                rounded-[26px]
                p-7
                hover:bg-white
                hover:-translate-y-2
                hover:shadow-xl
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#6b1d2f]
                  text-[#d4af37]
                  flex
                  items-center
                  justify-center
                "
              >
                <FiCheckCircle size={27} />
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-black
                  text-[#4b1020]
                "
              >
                Perfect Fitting
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-[#806b5e]
                "
              >
                ඔබගේ measurements අනුව ඔබට ගැළපෙන comfortable සහ beautiful
                fitting එකක්.
              </p>
            </div>

            {/* QUALITY */}

            <div
              className="
                group
                bg-white/70
                backdrop-blur-md
                border
                border-white
                rounded-[26px]
                p-7
                hover:bg-white
                hover:-translate-y-2
                hover:shadow-xl
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#6b1d2f]
                  text-[#d4af37]
                  flex
                  items-center
                  justify-center
                "
              >
                <FiScissors size={27} />
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-black
                  text-[#4b1020]
                "
              >
                Quality Craftsmanship
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-[#806b5e]
                "
              >
                සෑම design එකක්ම attention to detail සහ quality finish එකක් සමඟ
                නිමකරයි.
              </p>
            </div>

            {/* DELIVERY */}

            <div
              className="
                group
                bg-white/70
                backdrop-blur-md
                border
                border-white
                rounded-[26px]
                p-7
                hover:bg-white
                hover:-translate-y-2
                hover:shadow-xl
                transition-all
                duration-300
              "
            >
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-[#6b1d2f]
                  text-[#d4af37]
                  flex
                  items-center
                  justify-center
                "
              >
                <FaTruck size={24} />
              </div>

              <h3
                className="
                  mt-5
                  text-lg
                  font-black
                  text-[#4b1020]
                "
              >
                Islandwide Delivery
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-7
                  text-[#806b5e]
                "
              >
                ඔබගේ order එක ශ්‍රී ලංකාව පුරා ආරක්ෂිතව ඔබේ නිවසටම ලබාගන්න.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          CUSTOM DESIGN CTA
      ===================================================================== */}

      <section
        className="
          py-24
          bg-[#faf7f2]
        "
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-6
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-[36px]
              bg-gradient-to-r
              from-[#6b1d2f]
              via-[#511426]
              to-[#350b17]
              p-8
              sm:p-12
              lg:p-16
              shadow-[0_25px_70px_rgba(75,16,32,0.28)]
              border
              border-[#d4af37]/30
            "
          >
            {/* DECORATIONS */}

            <div
              className="
                absolute
                -right-24
                -top-24
                w-80
                h-80
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
                w-40
                h-40
                rounded-full
                border
                border-[#d4af37]/10
              "
            />

            <div
              className="
                absolute
                -left-24
                -bottom-32
                w-96
                h-96
                rounded-full
                border
                border-[#d4af37]/10
              "
            />

            <div
              className="
                relative
                z-10
                grid
                lg:grid-cols-2
                gap-10
                items-center
              "
            >
              {/* LEFT */}

              <div>
                <span
                  className="
                    text-[#d4af37]
                    text-[10px]
                    tracking-[3px]
                    font-bold
                  "
                >
                  HAVE YOUR OWN DESIGN?
                </span>

                <h2
                  className="
                    mt-4
                    text-4xl
                    sm:text-5xl
                    font-black
                    text-white
                    leading-tight
                  "
                >
                  Turn Your Idea
                  <br />
                  <span
                    className="
                      text-[#d4af37]
                    "
                  >
                    Into Reality.
                  </span>
                </h2>

                <p
                  className="
                    mt-5
                    text-[#e5d2c3]
                    text-sm
                    md:text-base
                    leading-7
                    max-w-lg
                  "
                >
                  ඔබගේ phone එකේ තියෙන design photo එක ලබාදී, measurements සහ
                  අවශ්‍ය විස්තර අපට ලබාදෙන්න. NariCraft එය ඔබ වෙනුවෙන් නිමකරයි.
                </p>
              </div>

              {/* RIGHT BUTTON */}

              <div
                className="
                  lg:flex
                  lg:justify-end
                "
              >
                {/*
                  Custom Design page එක හදපු පස්සේ
                  to="/products" වෙනුවට
                  to="/custom-design" දාන්න.
                */}

                <Link
                  to="/products"
                  className="
                    group
                    inline-flex
                    items-center
                    gap-3
                    px-8
                    py-4
                    rounded-2xl
                    bg-[#d4af37]
                    text-[#3b0d19]
                    font-black
                    text-sm
                    shadow-xl
                    hover:-translate-y-1
                    hover:shadow-2xl
                    hover:scale-[1.02]
                    transition-all
                    duration-300
                  "
                >
                  <FiUploadCloud size={20} />
                  Explore Designs
                  <FaArrowRight
                    className="
                      group-hover:translate-x-1
                      transition-transform
                    "
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
