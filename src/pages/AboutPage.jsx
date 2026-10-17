import { FaHeart, FaCut, FaStar, FaUsers, FaWhatsapp } from "react-icons/fa";

export default function AboutPage() {
  return (
    <div className="w-full bg-[#f6ede2] relative">
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
          {/* =================================================
              LEFT SIDE
          ================================================= */}

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
              <span className="text-[#d99b21]">Personal.</span>
            </h1>

            <p
              className="
                mt-6
                text-[#765f52]
                leading-8
                text-base
              "
            >
              NariCraft කියන්නේ customer එකට තමන් කැමති විදිහට ඇඳුමක් තෝරාගන්න
              සහ නිර්මාණය කරගන්න පහසු කරන fashion platform එකක්.
            </p>

            <p
              className="
                mt-4
                text-[#765f52]
                leading-8
                text-base
              "
            >
              Ready-made designs මිලදී ගැනීමටත්, customerගේම design image එකක්
              upload කරලා measurements අනුව custom tailoring service එකක්
              ලබාගැනීමටත් NariCraft හරහා හැකියාව ලබාදීම අපේ ප්‍රධාන අරමුණයි.
            </p>
          </div>

          {/* =================================================
              RIGHT SIDE IMAGE
          ================================================= */}

          <div
            className="
              relative
              w-full
              min-h-[380px]
              sm:min-h-[420px]
              lg:min-h-[430px]
              rounded-[35px]
              overflow-hidden
              border
              border-[#d99b21]/30
              shadow-[0_25px_60px_rgba(79,20,36,0.22)]
              group
            "
          >
            <img
              src="/ab2.png"
              alt="NariCraft Tailoring"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                object-center
                transition-transform
                duration-700
                group-hover:scale-105
              "
            />

            {/* SMALL DARK OVERLAY */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-[#40101e]/20
                via-transparent
                to-transparent
                pointer-events-none
              "
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          OUR VALUES
      ===================================================== */}

      <section
        className="
          bg-white
          px-6
          md:px-12
          lg:px-20
          py-20
        "
      >
        <div className="max-w-7xl mx-auto">
          {/* TITLE */}

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

          {/* VALUES CARDS */}

          <div
            className="
              grid
              sm:grid-cols-2
              lg:grid-cols-4
              gap-5
              mt-12
            "
          >
            {/* CUSTOMER FIRST */}

            <div className="about-card">
              <FaHeart className="about-icon" />

              <h3 className="about-title">Customer First</h3>

              <p className="about-text">
                Customerගේ අවශ්‍යතාවයට ගැළපෙන experience එකක් ලබාදීම.
              </p>
            </div>

            {/* CUSTOM DESIGN */}

            <div className="about-card">
              <FaCut className="about-icon" />

              <h3 className="about-title">Custom Design</h3>

              <p className="about-text">
                ඔබගේම style එක measurements අනුව නිර්මාණය කිරීම.
              </p>
            </div>

            {/* QUALITY */}

            <div className="about-card">
              <FaStar className="about-icon" />

              <h3 className="about-title">Quality</h3>

              <p className="about-text">
                Products වල quality සහ finishing පිළිබඳ අවධානය.
              </p>
            </div>

            {/* TRUST */}

            <div className="about-card">
              <FaUsers className="about-icon" />

              <h3 className="about-title">Trust</h3>

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
            Modern technology සහ tailoring එක එකතු කරලා, customer කෙනෙකුට තමන්ගේ
            style එකට ගැළපෙන outfit එකක් පහසුවෙන් order කරන්න පුළුවන් platform
            එකක් නිර්මාණය කිරීම NariCraft හි අරමුණයි.
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
          WHATSAPP FIXED FLOATING BUTTON
      ===================================================== */}
      <a
        href="https://wa.me/94725521272"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float group"
        title="Contact us on WhatsApp"
      >
        {/* PULSE RINGS */}

        <span className="whatsapp-pulse whatsapp-pulse-one" />
        <span className="whatsapp-pulse whatsapp-pulse-two" />

        {/* MAIN BUTTON */}

        <span className="whatsapp-main">
          <FaWhatsapp className="whatsapp-icon" />

          {/* TEXT - DESKTOP */}

          <span className="whatsapp-text">
            <span className="whatsapp-small">Need Help?</span>

            <span className="whatsapp-title">Chat with us</span>
          </span>
        </span>

        {/* ONLINE DOT */}

        <span className="whatsapp-online" />
      </a>

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
          border-color: #d99b21;
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

        /* =====================================================
   WHATSAPP FLOATING BUTTON
===================================================== */

.whatsapp-float {
  position: fixed;

  right: 24px;
  bottom: 24px;

  z-index: 999;

  text-decoration: none;

  display: flex;
  align-items: center;

  animation: whatsappFloat 3s ease-in-out infinite;
}


/* MAIN BUTTON */

.whatsapp-main {
  position: relative;

  display: flex;
  align-items: center;
  gap: 12px;

  min-height: 58px;

  padding: 11px 18px 11px 14px;

  border-radius: 999px;

  background:
    linear-gradient(
      135deg,
      #25d366,
      #18a94d
    );

  color: white;

  border: 2px solid
    rgba(255, 255, 255, 0.85);

  box-shadow:
    0 10px 30px
      rgba(37, 211, 102, 0.35),
    0 5px 12px
      rgba(0, 0, 0, 0.12);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}


/* HOVER */

.whatsapp-float:hover
.whatsapp-main {
  transform:
    translateY(-5px)
    scale(1.04);

  box-shadow:
    0 18px 40px
      rgba(37, 211, 102, 0.48),
    0 7px 18px
      rgba(0, 0, 0, 0.14);
}


/* ICON */

.whatsapp-icon {
  position: relative;

  z-index: 2;

  font-size: 31px;

  flex-shrink: 0;

  transition:
    transform 0.35s ease;
}


.whatsapp-float:hover
.whatsapp-icon {
  transform:
    rotate(-12deg)
    scale(1.12);
}


/* TEXT */

.whatsapp-text {
  display: flex;

  flex-direction: column;

  line-height: 1.1;
}


.whatsapp-small {
  font-size: 9px;

  font-weight: 600;

  opacity: 0.85;

  text-transform: uppercase;

  letter-spacing: 1px;
}


.whatsapp-title {
  margin-top: 3px;

  font-size: 13px;

  font-weight: 900;

  white-space: nowrap;
}


/* ONLINE DOT */

.whatsapp-online {
  position: absolute;

  top: 3px;
  right: 5px;

  width: 12px;
  height: 12px;

  border-radius: 50%;

  background: #ffffff;

  border: 3px solid #25d366;

  z-index: 5;

  animation:
    onlineBlink 1.5s ease-in-out infinite;
}


/* PULSE */

.whatsapp-pulse {
  position: absolute;

  left: 7px;

  width: 48px;
  height: 48px;

  border-radius: 50%;

  background:
    rgba(37, 211, 102, 0.3);

  pointer-events: none;

  animation:
    whatsappPulse 2.2s
    ease-out infinite;
}


.whatsapp-pulse-two {
  animation-delay: 1.1s;
}


/* FLOAT ANIMATION */

@keyframes whatsappFloat {

  0%,
  100% {
    transform:
      translateY(0);
  }

  50% {
    transform:
      translateY(-6px);
  }

}


/* PULSE ANIMATION */

@keyframes whatsappPulse {

  0% {
    transform:
      scale(0.8);

    opacity: 0.8;
  }

  100% {
    transform:
      scale(2);

    opacity: 0;
  }

}


/* ONLINE DOT */

@keyframes onlineBlink {

  0%,
  100% {
    transform:
      scale(1);
  }

  50% {
    transform:
      scale(0.75);
  }

}


/* =====================================================
   MOBILE
===================================================== */

@media (max-width: 640px) {

  .whatsapp-float {
    right: 18px;
    bottom: 18px;
  }


  .whatsapp-main {
    width: 58px;
    height: 58px;

    min-height: 58px;

    padding: 0;

    justify-content: center;

    border-radius: 50%;
  }


  .whatsapp-text {
    display: none;
  }


  .whatsapp-icon {
    font-size: 31px;
  }


  .whatsapp-pulse {
    left: 5px;

    width: 48px;
    height: 48px;
  }

}

      `}</style>
    </div>
  );
}
