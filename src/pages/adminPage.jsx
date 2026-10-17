import { BsBox2HeartFill, BsCartCheckFill } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import AdminProductPage from "./Admin/adminProductPage";
import AddProductPage from "./Admin/AdminAddNewProduct";
import { IoIosHome } from "react-icons/io";
import AdminUpdateProduct from "./Admin/AdminUpdateProduct";
import AdminOrdersPage from "./Admin/AddminOrdersPage";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "../components/loader";
import AdminCustomOrdersPage from "./Admin/AdminCustomOrdersPage";
import AdminUsersPage from "./Admin/AdminUsersPage";
import { GrManual } from "react-icons/gr";
import { SiEbox } from "react-icons/si";
import AdminDashboard from "./Admin/AdminDashboard";

export default function AdminPage() {
  const navigate = useNavigate();
  const [userLoaderd, setUserLoaderd] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("Please Login to access admin pannel");
      navigate("/login");
      return;
    }
    axios
      .get(import.meta.env.VITE_API_URL + "/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data.role !== "admin") {
          toast.error("You are not authorized to access admin pannel");
          navigate("/");
          return;
        }
        setUserLoaderd(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Please Login to access admin pannel");
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  return (
    <div
      className="
        w-full
        h-screen
        bg-primary
        flex
        flex-col
        md:flex-row
        p-2
        gap-3
      "
    >
      {/* =====================================================
          LEFT SIDEBAR
      ===================================================== */}

      <div
        className="
          w-full
          md:w-[25%]
          md:max-w-[250px]
          h-auto
          md:h-full
          bg-primary
          flex
          flex-col
          shrink-0
        "
      >
        {/* =================================================
            ADMIN LOGO
        ================================================= */}

        <Link
          to="/admin/"
          className="
            w-full
            flex
            justify-center
            md:justify-start
          "
        >
          <div
            className="
              border-3
              rounded-2xl
              border-accent
              bg-orange-200 
              text-accent
              w-full
              md:w-[95%]
              h-[60px]
              md:h-[70px]
              flex
              items-center
              justify-center
              md:justify-start
              gap-4
              px-4
            "
          >
            <img
              src="/logo.png"
              className="
                h-[70%]
                object-contain
              "
              alt="Logo"
            />

            <span
              className="
                text-lg
                md:text-xl
                font-bold
              "
            >
              Admin Panel
            </span>
          </div>
        </Link>

        {/* =================================================
            NAVIGATION AREA

            md:flex-1 කියන එකෙන් sidebar එකේ ඉතිරි
            height එක මේ div එකට ලැබෙනවා.
        ================================================= */}

        <div
          className="
            flex
            flex-row
            md:flex-col
            flex-wrap
            md:flex-nowrap
            justify-center
            md:justify-start
            gap-5

            mt-4
            md:mt-[10%]

            md:ml-[5%]
            md:mr-[5%]

            pb-2
            md:pb-4

            border-b-2
            md:border-b-0
            border-accent/20

            md:flex-1
          "
        >
          {/* =============================================
              TOP NAVIGATION LINKS
          ============================================= */}

          <div
            className="
              flex
              flex-row
              md:flex-col
              flex-wrap
              gap-5
              md:gap-[30px]
              items-center
              md:items-start
            "
          >
            {/* DASHBOARD */}

            <Link
              to="/admin/"
              className="
                flex
                items-center
                gap-2
                text-sm
                md:text-base
                hover:text-secoundry
                hover:font-bold
                whitespace-nowrap
                transition-all
              "
            >
              <MdDashboard />
              Dashboard
            </Link>

            {/* ORDERS */}

            <Link
              to="/admin/orders"
              className="
                flex
                items-center
                gap-2
                text-sm
                md:text-base
                hover:text-secoundry
                hover:font-bold
                whitespace-nowrap
                transition-all
              "
            >
              <BsBox2HeartFill />
              Web Orders
            </Link>

            {/* CUSTOM ORDERS */}

            <Link
              to="/admin/cutomer-orders"
              className="
                flex
                items-center
                gap-2
                text-sm
                md:text-base
                hover:text-secoundry
                hover:font-bold
                whitespace-nowrap
                transition-all
              "
            >
              <SiEbox />
              Custom Orders
            </Link>

            {/* PRODUCTS */}

            <Link
              to="/admin/products"
              className="
                flex
                items-center
                gap-2
                text-sm
                md:text-base
                hover:text-secoundry
                hover:font-bold
                whitespace-nowrap
                transition-all
              "
            >
              <BsCartCheckFill />
              Products
            </Link>

            {/* USERS */}

            <Link
              to="/admin/users"
              className="
                flex
                items-center
                gap-2
                text-sm
                md:text-base
                hover:text-secoundry
                hover:font-bold
                whitespace-nowrap
                transition-all
              "
            >
              <FaUsers />
              Users
            </Link>
          </div>

          {/* =================================================
              HOME PAGE BUTTON

              md:mt-auto -> desktop sidebar එකේ
              යටම ගෙනියනවා
          ================================================= */}

          <Link
            to="/"
            className="
              md:mt-auto

              flex
              items-center
              justify-center
              md:justify-start
              gap-3

              w-full

              px-5
              py-3.5

              rounded-2xl

              bg-gradient-to-r
              from-[#6b1d2f]
              to-[#4b1020]

              text-[#f3d975]

              font-bold
              text-sm
              md:text-base

              border
              border-[#d4af37]/40

              shadow-[0_8px_20px_rgba(107,29,47,0.25)]

              hover:-translate-y-1
              hover:shadow-[0_12px_28px_rgba(107,29,47,0.35)]

              transition-all
              duration-300

              group
            "
          >
            <div
              className="
                w-8
                h-8
                rounded-lg

                bg-[#d4af37]/15

                flex
                items-center
                justify-center

                group-hover:bg-[#d4af37]
                group-hover:text-[#5b1a2b]

                transition-all
                duration-300
              "
            >
              <IoIosHome
                className="
                  text-lg
                "
              />
            </div>

            <span>Home Page</span>
          </Link>
        </div>
      </div>

      {/* =====================================================
          RIGHT SIDE MAIN CONTENT
      ===================================================== */}

      <div
        className="
          flex-1
          w-full
          h-full
          bg-primary
          border-3
          border-accent
          rounded-[20px]
          overflow-hidden
        "
      >
        <div
          className="
            bg-primary
            w-full
            h-full
            overflow-y-auto
          "
        >
          {userLoaderd ? (
            <Routes>
              {/* DASHBOARD */}

              <Route
                path="/"
                element={
                  <div className="p-4">
                    <h1
                      className="
                      text-2xl
                      font-bold
                      text-accent
                    "
                    >
                      Admin Board
                    </h1>
                  </div>
                }
              />

              {/* PRODUCTS */}

              <Route path="/products" element={<AdminProductPage />} />

              {/* ORDERS */}

              <Route
                path="/orders"
                element={
                  <div
                    className="
                    p-4
                    text-accent
                    font-bold
                  "
                  >
                    <AdminOrdersPage />
                  </div>
                }
              />

              {/* USERS */}

              <Route path="/users" element={<AdminUsersPage />} />

              {/* CUTOMER ORDERS */}

              <Route
                path="/cutomer-orders"
                element={<AdminCustomOrdersPage />}
              />

              {/* ADD PRODUCT */}

              <Route path="/add-product" element={<AddProductPage />} />

              {/* UPDATE PRODUCT */}

              <Route
                path="update-product/:productId"
                element={<AdminUpdateProduct />}
              />
              <Route index element={<AdminDashboard />} />
            </Routes>
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </div>
  );
}
