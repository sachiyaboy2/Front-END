import { Link, Route, Routes } from "react-router-dom";
import Header from "../components/header";
import AboutPage from "./AboutPage";

import {
  FaArrowRight,
  FaShoppingBag,
  FaStar,
} from "react-icons/fa";
import { GiLargeDress } from "react-icons/gi";
import { ProductPage } from "./productPage";


export default function HomePage() {

  return (
    <div className="w-full min-h-screen bg-primary">

      {/* HEADER */}
      <Header />


      {/* PAGES */}
      <Routes>

        {/* HOME */}
        <Route
          index
          element={<HomeContent />}
        />


        {/* PRODUCTS */}
        <Route
          path="products"
          element={<ProductPage/>
          }
        />


        {/* ORDERS */}
        <Route
          path="orders"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold text-[#5b1a2b]">
                Orders Page
              </h1>
            </div>
          }
        />


        {/* ABOUT */}
        <Route
          path="about"
          element={<AboutPage />}
        />


        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="p-10">
              <h1 className="text-3xl font-bold text-red-700">
                404 Page Not Found
              </h1>
            </div>
          }
        />

      </Routes>

    </div>
  );
}



function HomeContent() {

  return (
    <div className="w-full overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}

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

        {/* BACKGROUND DECORATION */}

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

            <span className="text-[#d99b21]">
              Your Story.
            </span>

          </h1>


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
            ඔබට කැමති NariCraft design එකක් තෝරාගන්න.
            නැත්නම් ඔබගේම design එක upload කරලා,
            measurements වලට ගැළපෙන custom outfit එකක්
            නිර්මාණය කරගන්න.
          </p>


          {/* BUTTONS */}

          <div className="flex flex-wrap gap-4 mt-8">

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
            RIGHT SIDE - MODERN 3D LOOK
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

          {/* BACK CARD */}

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


          {/* SECOND BACK CARD */}

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

            {/* LOGO */}

            <div className="flex justify-between items-center">

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
                "
              >

                <span className="font-black text-[#5b1a2b]">
                  <img src="./logo.png" className='h-[70%]' alt='Logo' />
                </span>

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


            {/* DRESS STYLE SHAPE */}

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
              bg-white/80
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

              <p className="text-xs font-bold text-[#5b1a2b]">
                Custom Fit
              </p>

              <p className="text-[10px] text-[#8a7568]">
                Made to measure
              </p>

            </div>

          </div>

        </div>

      </section>



      {/* =====================================================
          SMALL BOTTOM SECTION
      ===================================================== */}

      <section
        className="
          max-w-6xl
          mx-auto
          px-6
          pb-16
        "
      >

        <div
          className="
            bg-[#5b1a2b]
            rounded-[28px]
            p-6
            grid
            md:grid-cols-3
            gap-4
            shadow-xl
          "
        >

          <div
            className="
              p-5
              rounded-2xl
              hover:bg-white/10
              transition-all
            "
          >
            <p className="text-[#d99b21] font-black text-lg">
              01
            </p>

            <h3 className="text-white font-bold mt-2">
              Choose
            </h3>

            <p className="text-[#dcc9bf] text-xs mt-1">
              Select your favourite design.
            </p>
          </div>


          <div
            className="
              p-5
              rounded-2xl
              hover:bg-white/10
              transition-all
            "
          >
            <p className="text-[#d99b21] font-black text-lg">
              02
            </p>

            <h3 className="text-white font-bold mt-2">
              Customize
            </h3>

            <p className="text-[#dcc9bf] text-xs mt-1">
              Add your measurements and style.
            </p>
          </div>


          <div
            className="
              p-5
              rounded-2xl
              hover:bg-white/10
              transition-all
            "
          >
            <p className="text-[#d99b21] font-black text-lg">
              03
            </p>

            <h3 className="text-white font-bold mt-2">
              Wear
            </h3>

            <p className="text-[#dcc9bf] text-xs mt-1">
              Enjoy something made for you.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}