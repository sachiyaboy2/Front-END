import React, { useEffect, useState } from "react";

import axios from "axios";

import { NavLink, Link, useNavigate } from "react-router-dom";

import { FaShoppingCart } from "react-icons/fa";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // =====================================================
  // TOKEN
  // =====================================================

  const token = localStorage.getItem("token");

  // =====================================================
  // GET LOGGED USER
  // =====================================================

  useEffect(() => {
    if (token == null) {
      setUser(null);

      return;
    }

    axios
      .get(
        import.meta.env.VITE_API_URL + "/api/users/me",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      .then((res) => {
        console.log("Logged User:", res.data);

        setUser(res.data);

        localStorage.setItem("user", JSON.stringify(res.data));
      })

      .catch((err) => {
        console.log("Get User Error:", err);

        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");

          localStorage.removeItem("user");

          setUser(null);
        }
      });
  }, [token]);

  // =====================================================
  // FIRST NAME
  // =====================================================

  const firstName = (user?.fullName || user?.name || user?.firstName || "User")
    .trim()
    .split(" ")[0];

  // =====================================================
  // ADMIN CHECK
  // =====================================================

  const isAdmin =
    user?.role?.toLowerCase() === "admin" || user?.isAdmin === true;

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setUser(null);

    setIsMenuOpen(false);

    navigate("/login");
  };

  // =====================================================
  // NAVIGATION ITEMS
  // =====================================================

  const navItems = [
    {
      name: "Home",
      path: "/",
    },

    {
      name: "Products",
      path: "/products",
    },

    ...(token
      ? [
          {
            name: "My Orders",
            path: "/orders",
          },
        ]
      : []),

    {
      name: "About",
      path: "/about",
    },
  ];

  return (
    <header
      className="
        relative
        z-50
        w-full
        py-4
      "
    >
      <div
        className="
          mx-auto
          max-w-7xl
          px-3
          sm:px-4
        "
      >
        {/* =================================================
            HEADER ROW
        ================================================= */}

        <div
          className="
            flex
            items-stretch
            gap-3
          "
        >
          {/* =================================================
              MAIN HEADER CONTAINER
          ================================================= */}

          <nav
            className="
              relative
              flex-1
              min-w-0
              flex
              items-center
              justify-between
              rounded-2xl
              bg-primary
              px-4
              sm:px-6
              py-4
              border-3
              border-accent
              shadow-[0_8px_0_0_var(--color-accent)]
              transition-all
              duration-300
            "
          >
            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              className="
                flex
                items-center
                gap-2
                sm:gap-3
                cursor-pointer
                shrink-0
              "
            >
              <div
                className="
                  flex
                  h-10
                  w-10
                  sm:h-11
                  sm:w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary
                  border-2
                  border-accent
                  shadow-[0_4px_0_0_var(--color-accent)]
                  active:translate-y-1
                  active:shadow-none
                  transition-all
                  overflow-hidden
                  p-1
                "
              >
                <img
                  src="/logo.png"
                  alt="NariCraft Logo"
                  className="
                    h-full
                    w-full
                    object-contain
                  "
                />
              </div>

              <span
                className="
                  text-xl
                  sm:text-2xl
                  xl:text-3xl
                  font-black
                  text-accent
                  tracking-wide
                  whitespace-nowrap
                  drop-shadow-[2px_2px_0_var(--color-secoundry)]
                "
              >
                නාරී
                <span
                  className="
                    text-secoundry
                    text-lg
                    sm:text-xl
                    xl:text-2xl
                  "
                >
                  {" "}
                  CRAFT
                </span>
              </span>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <ul
              className="
                hidden
                xl:flex
                items-center
                gap-7
                font-bold
                text-accent
              "
            >
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `
                        relative
                        py-1
                        transition-all
                        duration-200
                        block
                        whitespace-nowrap

                        ${
                          isActive
                            ? "text-secoundry border-b-2 border-secoundry font-black"
                            : "hover:text-secoundry hover:-translate-y-0.5"
                        }
                      `
                    }
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* =================================================
                DESKTOP ACCOUNT AREA
            ================================================= */}

            <div
              className="
                hidden
                xl:flex
                items-center
                gap-3
                shrink-0
              "
            >
              {token ? (
                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  {/* =================================================
                      USER NAME / PROFILE LINK
                  ================================================= */}

                  <Link
                    to="/profile"
                    className="
                      font-bold
                      text-accent
                      whitespace-nowrap

                      px-3
                      py-2

                      rounded-xl

                      hover:bg-[#f3e8dc]
                      hover:text-[#6b1d2f]

                      transition-all
                      duration-200
                    "
                  >
                    Hi, {firstName} 👋
                  </Link>

                  {/* =================================================
                      ADMIN ONLY
                  ================================================= */}

                  {isAdmin && (
                    <Link to="/admin">
                      <button
                        type="button"
                        className="
                          rounded-xl
                          bg-[#6b1d2f]
                          px-4
                          py-2.5
                          font-bold
                          text-[#f3d975]
                          border-2
                          border-[#d4af37]
                          shadow-[0_4px_0_0_#d4af37]
                          hover:-translate-y-0.5
                          hover:shadow-[0_6px_0_0_#d4af37]
                          active:translate-y-1
                          active:shadow-none
                          transition-all
                          duration-150
                          whitespace-nowrap
                        "
                      >
                        Admin Panel
                      </button>
                    </Link>
                  )}

                  {/* =================================================
                      LOG OUT
                  ================================================= */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      rounded-xl
                      bg-primary
                      px-5
                      py-2.5
                      font-bold
                      text-accent
                      border-2
                      border-accent
                      shadow-[0_4px_0_0_var(--color-accent)]
                      hover:-translate-y-0.5
                      hover:shadow-[0_6px_0_0_var(--color-accent)]
                      active:translate-y-1
                      active:shadow-none
                      transition-all
                      duration-150
                      whitespace-nowrap
                    "
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <>
                  {/* =================================================
                      LOGIN
                  ================================================= */}

                  <Link to="/login">
                    <button
                      type="button"
                      className="
                        rounded-xl
                        bg-primary
                        px-5
                        py-2.5
                        font-bold
                        text-accent
                        border-2
                        border-accent
                        shadow-[0_4px_0_0_var(--color-accent)]
                        hover:-translate-y-0.5
                        hover:shadow-[0_6px_0_0_var(--color-accent)]
                        active:translate-y-1
                        active:shadow-none
                        transition-all
                        duration-150
                      "
                    >
                      Log In
                    </button>
                  </Link>

                  {/* =================================================
                      SIGN UP
                  ================================================= */}

                  <Link to="/register">
                    <button
                      type="button"
                      className="
                        rounded-xl
                        bg-[#E4D19E]
                        px-5
                        py-2.5
                        font-bold
                        text-secoundry
                        border-2
                        border-accent
                        shadow-[0_4px_0_0_var(--color-accent)]
                        hover:-translate-y-0.5
                        hover:shadow-[0_6px_0_0_var(--color-accent)]
                        active:translate-y-1
                        active:shadow-none
                        transition-all
                        duration-150
                      "
                    >
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* =================================================
                MOBILE / TABLET HAMBURGER
            ================================================= */}

            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="
                xl:hidden
                flex
                flex-col
                gap-1.5
                p-2.5
                rounded-xl
                bg-primary
                border-2
                border-accent
                shadow-[0_3px_0_0_var(--color-accent)]
                active:translate-y-0.5
                active:shadow-none
                shrink-0
              "
            >
              <span
                className="
                  w-6
                  h-0.5
                  bg-accent
                  rounded-full
                "
              />

              <span
                className="
                  w-6
                  h-0.5
                  bg-accent
                  rounded-full
                "
              />

              <span
                className="
                  w-6
                  h-0.5
                  bg-accent
                  rounded-full
                "
              />
            </button>
          </nav>

          {/* =================================================
              CART BUTTON
              LOGIN USER ONLY
          ================================================= */}

          {token && (
            <NavLink
              to="/cart"
              title="Shopping Cart"
              className={({ isActive }) =>
                `
                  shrink-0
                  mt-4
                  h-[50px]
                  w-[50px]
                  rounded-xl
                  border-2
                  flex
                  items-center
                  justify-center
                  font-bold
                  shadow-[0_4px_0_0_var(--color-accent)]
                  hover:-translate-y-0.5
                  hover:shadow-[0_6px_0_0_var(--color-accent)]
                  active:translate-y-1
                  active:shadow-none
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? "bg-[#f3e8dc] border-[#d4af37] text-[#6b1d2f]"
                      : "bg-primary border-accent text-accent hover:bg-[#f3e8dc]"
                  }
                `
              }
            >
              <FaShoppingCart className="text-base" />
            </NavLink>
          )}
        </div>

        {/* =================================================
            MOBILE / TABLET MENU
        ================================================= */}

        {isMenuOpen && (
          <div
            className="
              xl:hidden
              mt-3
              rounded-2xl
              bg-primary
              p-5
              border-3
              border-accent
              shadow-[0_8px_0_0_var(--color-accent)]
              flex
              flex-col
              gap-4
              font-bold
              text-accent
            "
          >
            {/* =================================================
                MOBILE NAV LINKS
            ================================================= */}

            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `
                    py-2
                    px-3
                    rounded-xl
                    transition-all

                    ${
                      isActive
                        ? "bg-[#6b1d2f] text-[#f3d975] font-black"
                        : "hover:bg-[#6b1d2f]/10 hover:text-secoundry"
                    }
                  `
                }
              >
                {item.name}
              </NavLink>
            ))}

            <hr
              className="
                border-accent/20
              "
            />

            <div
              className="
                flex
                flex-col
                gap-3
              "
            >
              {token ? (
                <>
                  {/* =================================================
                      MOBILE USER / PROFILE LINK
                  ================================================= */}

                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="
                      px-3
                      py-3
                      rounded-xl

                      bg-[#f7eee4]

                      text-[#6b1d2f]
                      text-sm
                      font-bold

                      border
                      border-[#e1d2c0]

                      hover:border-[#d4af37]
                      hover:bg-[#f3e8dc]

                      transition-all
                    "
                  >
                    Hi, {firstName} 👋
                  </Link>

                  {/* =================================================
                      ADMIN ONLY
                  ================================================= */}

                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <button
                        type="button"
                        className="
                          w-full
                          rounded-xl
                          bg-[#6b1d2f]
                          py-3
                          text-[#f3d975]
                          font-bold
                          border-2
                          border-[#d4af37]
                          shadow-[0_4px_0_0_#d4af37]
                          active:translate-y-1
                          active:shadow-none
                          transition-all
                        "
                      >
                        Admin Panel
                      </button>
                    </Link>
                  )}

                  {/* =================================================
                      LOGOUT
                  ================================================= */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full
                      rounded-xl
                      bg-primary
                      py-3
                      text-accent
                      border-2
                      border-accent
                      shadow-[0_4px_0_0_var(--color-accent)]
                      active:translate-y-1
                      active:shadow-none
                    "
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  {/* =================================================
                      LOGIN
                  ================================================= */}

                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <button
                      type="button"
                      className="
                        w-full
                        rounded-xl
                        bg-primary
                        py-3
                        text-accent
                        border-2
                        border-accent
                        shadow-[0_4px_0_0_var(--color-accent)]
                        active:translate-y-1
                        active:shadow-none
                      "
                    >
                      Log In
                    </button>
                  </Link>

                  {/* =================================================
                      SIGN UP
                  ================================================= */}

                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <button
                      type="button"
                      className="
                        w-full
                        rounded-xl
                        bg-[#E4D19E]
                        py-3
                        text-secoundry
                        border-2
                        border-accent
                        shadow-[0_4px_0_0_var(--color-accent)]
                        active:translate-y-1
                        active:shadow-none
                      "
                    >
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
