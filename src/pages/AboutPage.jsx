import {
  FaHeart,
  FaCut,
  FaStar,
  FaUsers,
} from "react-icons/fa";

export default function AboutPage() {

  return (
    <div className="w-full bg-[#f6ede2]">

      {/* =====================================================
          ABOUT HERO
      ===================================================== */}

      <section
        className="
          px-6
          md:px-12
          lg:px-20
          py-20
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            grid
            lg:grid-cols-2
            gap-12
            items-center
          "
        >

          {/* LEFT */}

          <div>

            <p
              className="
                text-[#d99b21]
                font-bold
                text-sm
                uppercase
                tracking-[0.25em]
              "
            >
              About NariCraft
            </p>


            <h1
              className="
                text-4xl
                sm:text-5xl
                font-black
                text-[#4f1424]
                mt-3
                leading-tight
              "
            >
              Fashion Made
              <br />
              <span className="text-[#d99b21]">
                Personal.
              </span>
            </h1>


            <p
              className="
                mt-6
                text-[#765f52]
                leading-8
                text-base
              "
            >
              NariCraft කියන්නේ customer එකට තමන් කැමති විදිහට
              ඇඳුමක් තෝරාගන්න සහ නිර්මාණය කරගන්න පහසු කරන
              fashion platform එකක්.
            </p>


            <p
              className="
                mt-4
                text-[#765f52]
                leading-8
                text-base
              "
            >
              Ready-made designs මිලදී ගැනීමටත්,
              customerගේම design image එකක් upload කරලා
              measurements අනුව custom tailoring service එකක්
              ලබාගැනීමටත් NariCraft හරහා හැකියාව ලබාදීම
              අපේ ප්‍රධාන අරමුණයි.
            </p>

          </div>


          {/* RIGHT */}

          <div
            className="
              bg-[#5b1a2b]
              rounded-[35px]
              p-10
              min-h-[380px]
              flex
              items-center
              justify-center
              shadow-2xl
              relative
              overflow-hidden
            "
          >

            <div
              className="
                absolute
                w-[250px]
                h-[250px]
                rounded-full
                bg-[#d99b21]/20
                -top-16
                -right-16
              "
            />


            <div className="text-center relative z-10">

              <div
                className="
                  w-28
                  h-28
                  rounded-full
                  bg-[#f6ede2]
                  border-4
                  border-[#d99b21]
                  flex
                  items-center
                  justify-center
                  mx-auto
                "
              >

                <span
                  className="
                    text-4xl
                    font-black
                    text-[#5b1a2b]
                  "
                >
                <img src="logo.png"/>
                </span>

              </div>


              <h2
                className="
                  text-3xl
                  font-black
                  text-white
                  mt-6
                "
              >
                Nari
                <span className="text-[#d99b21]">
                  Craft
                </span>
              </h2>


              <p
                className="
                  text-[#ead8cc]
                  mt-3
                "
              >
                Tailored for you • Crafted with love
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR VALUES
      ===================================================== */}

      <section className="bg-white px-6 md:px-12 lg:px-20 py-20">

        <div className="max-w-7xl mx-auto">

          <div className="text-center">

            <p
              className="
                text-[#d99b21]
                uppercase
                tracking-[0.25em]
                font-bold
                text-xs
              "
            >
              What We Believe
            </p>

            <h2
              className="
                text-3xl
                sm:text-4xl
                font-black
                text-[#4f1424]
                mt-3
              "
            >
              Our Values
            </h2>

          </div>


          <div
            className="
              grid
              sm:grid-cols-2
              lg:grid-cols-4
              gap-5
              mt-12
            "
          >

            <div className="about-card">

              <FaHeart className="about-icon" />

              <h3 className="about-title">
                Customer First
              </h3>

              <p className="about-text">
                Customerගේ අවශ්‍යතාවයට ගැළපෙන experience එකක් ලබාදීම.
              </p>

            </div>


            <div className="about-card">

              <FaCut className="about-icon" />

              <h3 className="about-title">
                Custom Design
              </h3>

              <p className="about-text">
                ඔබගේම style එක measurements අනුව නිර්මාණය කිරීම.
              </p>

            </div>


            <div className="about-card">

              <FaStar className="about-icon" />

              <h3 className="about-title">
                Quality
              </h3>

              <p className="about-text">
                Products වල quality සහ finishing පිළිබඳ අවධානය.
              </p>

            </div>


            <div className="about-card">

              <FaUsers className="about-icon" />

              <h3 className="about-title">
                Trust
              </h3>

              <p className="about-text">
                Customers සහ NariCraft අතර විශ්වාසදායක service එකක්.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MISSION
      ===================================================== */}

      <section className="px-6 md:px-12 lg:px-20 py-20">

        <div
          className="
            max-w-5xl
            mx-auto
            text-center
            bg-[#5b1a2b]
            rounded-[32px]
            p-10
            sm:p-14
            shadow-xl
          "
        >

          <p
            className="
              text-[#d99b21]
              uppercase
              tracking-[0.25em]
              text-xs
              font-bold
            "
          >
            Our Mission
          </p>


          <h2
            className="
              text-3xl
              sm:text-4xl
              text-white
              font-black
              mt-3
            "
          >
            Making Every Design Feel Personal
          </h2>


          <p
            className="
              text-[#ead8cc]
              leading-8
              max-w-3xl
              mx-auto
              mt-5
            "
          >
            Modern technology සහ tailoring එක එකතු කරලා,
            customer කෙනෙකුට තමන්ගේ style එකට ගැළපෙන
            outfit එකක් පහසුවෙන් order කරන්න පුළුවන් platform එකක්
            නිර්මාණය කිරීම NariCraft හි අරමුණයි.
          </p>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        className="
          bg-[#40101e]
          text-center
          py-7
          px-4
        "
      >

        <p className="text-[#ead8cc] text-sm">

          © 2026 NariCraft • Tailored for you • Crafted with love

        </p>

      </footer>


      {/* =====================================================
          SMALL CSS
      ===================================================== */}

      <style>{`

        .about-card {
          background: #f8f1e8;
          border: 1px solid #ead8c2;
          border-radius: 24px;
          padding: 28px;
          transition: 0.3s ease;
        }

        .about-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 18px 35px rgba(80, 20, 35, 0.12);
        }

        .about-icon {
          font-size: 28px;
          color: #d99b21;
        }

        .about-title {
          color: #4f1424;
          font-size: 18px;
          font-weight: 800;
          margin-top: 18px;
        }

        .about-text {
          color: #806c5f;
          line-height: 1.7;
          margin-top: 10px;
          font-size: 14px;
        }

      `}</style>

    </div>
  );
}