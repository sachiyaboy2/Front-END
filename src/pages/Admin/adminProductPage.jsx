import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { FiPlusCircle } from "react-icons/fi";
import { IoCloseCircleSharp } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from "react-router-dom";
import { Loader } from "../../components/loader";

// =====================================================
// DELETE CONFIRM POPUP
// =====================================================

function ProductDeleteConform(props) {
  const close = props.close;

  const productId = props.productId;

  const refresh = props.refresh;

  function deleteProduct() {
    const token = localStorage.getItem("token");

    axios
      .delete(import.meta.env.VITE_API_URL + "/api/products/" + productId, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((res) => {
        console.log(res.data);

        close();

        toast.success("Product deleted successfully");

        refresh();
      })

      .catch((err) => {
        console.log(err);

        toast.error("Failed to delete product");
      });
  }

  return (
    <div
      className="
        fixed
        inset-0
        w-full
        h-screen
        bg-black/50
        backdrop-blur-[3px]
        z-[100]
        flex
        justify-center
        items-center
        p-4
      "
    >
      {/* ================= MODAL ================= */}

      <div
        className="
          relative
          w-full
          max-w-[460px]
          bg-[#fdf9f4]
          rounded-[28px]
          border
          border-[#d8c7ae]
          shadow-[0_25px_80px_rgba(55,14,27,0.35)]
          overflow-hidden
        "
      >
        {/* ================= TOP WINE BAR ================= */}

        <div
          className="
            h-[7px]
            w-full
            bg-gradient-to-r
            from-[#4b1020]
            via-[#d4af37]
            to-[#4b1020]
          "
        />

        {/* ================= CLOSE BUTTON ================= */}

        <button
          type="button"
          onClick={close}
          className="
            absolute
            top-4
            right-4
            w-9
            h-9
            rounded-full
            bg-[#f4e8dc]
            text-[#6b1d2f]
            flex
            justify-center
            items-center
            hover:bg-[#6b1d2f]
            hover:text-white
            hover:rotate-90
            transition-all
            duration-300
          "
        >
          <IoCloseCircleSharp size={24} />
        </button>

        {/* ================= CONTENT ================= */}

        <div
          className="
            px-7
            pt-9
            pb-7
            flex
            flex-col
            items-center
          "
        >
          {/* DELETE ICON */}

          <div
            className="
              relative
              w-[82px]
              h-[82px]
              rounded-full
              bg-red-50
              border
              border-red-200
              flex
              items-center
              justify-center
              mb-5
            "
          >
            {/* Glow */}

            <div
              className="
                absolute
                inset-2
                rounded-full
                bg-red-100
                animate-pulse
              "
            />

            <MdDeleteOutline
              size={38}
              className="
                relative
                z-10
                text-red-600
              "
            />
          </div>

          {/* TITLE */}

          <h2
            className="
              text-2xl
              font-black
              text-[#4a1624]
              text-center
            "
          >
            Delete Product?
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[#806f63]
              text-center
              max-w-[350px]
            "
          >
            Are you sure you want to delete this product from your NariCraft
            collection?
          </p>

          {/* PRODUCT ID BOX */}

          <div
            className="
              mt-5
              w-full
              bg-[#f7eee4]
              border
              border-[#dfcdb8]
              rounded-2xl
              px-5
              py-4
              flex
              items-center
              justify-between
              gap-3
            "
          >
            <div>
              <p
                className="
                  text-[10px]
                  uppercase
                  tracking-[0.18em]
                  text-[#a38a78]
                  font-bold
                "
              >
                Product ID
              </p>

              <p
                className="
                  mt-1
                  text-[#5b1a2b]
                  font-black
                  text-lg
                "
              >
                {productId}
              </p>
            </div>

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-[#6b1d2f]
                text-[#d4af37]
                flex
                items-center
                justify-center
              "
            >
              <MdDeleteOutline size={20} />
            </div>
          </div>

          {/* WARNING */}

          <div
            className="
              mt-4
              w-full
              bg-red-50
              border
              border-red-200
              rounded-xl
              px-4
              py-3
            "
          >
            <p
              className="
                text-xs
                text-red-600
                text-center
                font-medium
              "
            >
              ⚠️ This action cannot be undone.
            </p>
          </div>

          {/* ================= BUTTONS ================= */}

          <div
            className="
              w-full
              grid
              grid-cols-2
              gap-3
              mt-7
            "
          >
            {/* CANCEL */}

            <button
              type="button"
              onClick={close}
              className="
                h-[48px]
                rounded-xl
                bg-[#f3e8dc]
                border
                border-[#d8c7ae]
                text-[#6b1d2f]
                font-bold
                hover:bg-[#e8d8c8]
                hover:-translate-y-0.5
                transition-all
                duration-300
              "
            >
              Cancel
            </button>

            {/* DELETE */}

            <button
              type="button"
              onClick={deleteProduct}
              className="
                h-[48px]
                rounded-xl
                bg-gradient-to-r
                from-[#b91c1c]
                to-[#dc2626]
                text-white
                font-bold
                flex
                items-center
                justify-center
                gap-2
                shadow-lg
                shadow-red-900/20
                hover:-translate-y-0.5
                hover:shadow-xl
                hover:from-[#991b1b]
                hover:to-[#b91c1c]
                transition-all
                duration-300
              "
            >
              <MdDeleteOutline size={19} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// ADMIN PRODUCT PAGE
// =====================================================

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);

  const [isDeleteConformeVisible, setIsDeleteConformeVisible] = useState(false);

  const [productToDelete, setProductToDelete] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  useEffect(() => {
    if (isLoading) {
      axios
        .get(import.meta.env.VITE_API_URL + "/api/products")

        .then((res) => {
          console.log(res.data);

          setProducts(res.data);

          setIsLoading(false);
        })

        .catch((err) => {
          console.log(err);
        });
    }
  }, [isLoading]);

  return (
    <div className="w-full h-full p-4">
      {/* =================================================
          DELETE POPUP
      ================================================= */}

      {isDeleteConformeVisible && (
        <ProductDeleteConform
          refresh={() => {
            setIsLoading(true);
          }}
          productId={productToDelete}
          close={() => {
            setIsDeleteConformeVisible(false);
          }}
        />
      )}

      {/* =================================================
          ADD PRODUCT
      ================================================= */}

      <Link
        to="/admin/add-product"
        className="
          absolute
          right-[50px]
          bottom-[30px]
        "
      >
        <FiPlusCircle
          className="
            hover:text-accent
            rounded-full
            transition-all
            hover:scale-125
            text-[35px]
            text-red-900
            shadow-2xl
          "
        />
      </Link>

      <h1
        className="
          text-2xl
          font-bold
          text-accent
          mb-4
        "
      >
        Product Management
      </h1>

      {/* =================================================
          TABLE WRAPPER
      ================================================= */}

      <div
        className="
          w-full
          h-[80vh]
          overflow-auto
          rounded-xl
          border-2
          border-accent
          shadow-md
        "
      >
        {/* =================================================
            LOADER / TABLE
        ================================================= */}

        {isLoading ? (
          <Loader />
        ) : (
          <table
            className="
              w-full
              text-left
              border-collapse
              text-accent
            "
          >
            {/* ================= TABLE HEADER ================= */}

            <thead
              className="
                bg-orange-200
                border-b-2
                border-accent
                text-sm
                uppercase
                font-bold
              "
            >
              <tr>
                <th className="p-3 text-center">Image</th>

                <th className="p-3">Product ID</th>

                <th className="p-3">Name</th>

                <th className="p-3">Alt Name</th>

                <th className="p-3">Description</th>

                <th className="p-3">Price</th>

                <th className="p-3 text-center">Stocks</th>

                <th className="p-3">Category</th>

                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            {/* ================= TABLE BODY ================= */}

            <tbody
              className="
                divide-y
                divide-accent/20
                bg-[#FAF7F2]
                text-sm
              "
            >
              {products.map((product) => (
                <tr
                  key={product.productId}
                  className="
                      hover:bg-primary/20
                      transition-colors
                    "
                >
                  {/* IMAGE */}

                  <td
                    className="
                        p-3
                        text-center
                      "
                  >
                    <img
                      src={product.images?.[0] || "/placeholder.png"}
                      alt={product.name}
                      className="
                          w-14
                          h-14
                          object-cover
                          rounded-lg
                          border
                          border-accent
                          mx-auto
                        "
                    />
                  </td>

                  {/* PRODUCT ID */}

                  <td
                    className="
                        p-3
                        font-semibold
                      "
                  >
                    {product.productId}
                  </td>

                  {/* NAME */}

                  <td
                    className="
                        p-3
                        font-medium
                      "
                  >
                    {product.name}
                  </td>

                  {/* ALT NAMES */}

                  <td className="p-3">
                    {Array.isArray(product.altNames)
                      ? product.altNames.join(", ")
                      : product.altNames}
                  </td>

                  {/* DESCRIPTION */}

                  <td
                    className="
                        p-3
                        max-w-xs
                        truncate
                      "
                    title={product.description}
                  >
                    {product.description}
                  </td>

                  {/* PRICE */}

                  <td
                    className="
                        p-3
                        font-bold
                      "
                  >
                    LKR {product.price?.toLocaleString()}
                  </td>

                  {/* LABEL NO */}

                  <td
                    className="
                        p-3
                        text-center
                      "
                  >
                    {product.labelNo}
                  </td>

                  {/* CATEGORY */}

                  <td className="p-3">{product.category}</td>

                  {/* ================= ACTIONS ================= */}

                  <td className="p-3">
                    <div
                      className="
                          flex
                          items-center
                          justify-center
                          gap-2
                        "
                    >
                      {/* EDIT */}

                      <Link
                        to={`/admin/update-product/${product.productId}`}
                        state={product}
                        title="Edit"
                        className="
                            p-2
                            rounded-lg
                            bg-primary
                            text-accent
                            border
                            border-green-400
                            hover:bg-green-700
                            hover:text-white
                            transition-all
                          "
                      >
                        <FaRegEdit size={16} />
                      </Link>

                      {/* DELETE */}

                      <button
                        title="Delete"
                        className="
                            p-2
                            rounded-lg
                            bg-red-100
                            text-red-600
                            border
                            border-red-500
                            hover:bg-red-600
                            hover:text-white
                            transition-all
                          "
                        onClick={() => {
                          setProductToDelete(product.productId);

                          setIsDeleteConformeVisible(true);
                        }}
                      >
                        <MdDeleteOutline size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
