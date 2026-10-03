import React, { useState } from "react";
import axios from "axios";

import {
  ArrowLeft,
  ImagePlus,
  PackagePlus,
  Tag,
  DollarSign,
  Hash,
  Layers3,
  FileText,
  X,
  Save,
  Sparkles,
} from "lucide-react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import MediaUploader from "../../utils/mediaUpload";

export default function AdminUpdateProduct() {
  // =====================================================
  // ROUTER
  // =====================================================

  const location = useLocation();

  const navigate = useNavigate();

  const { productId: routeProductId } = useParams();

  // =====================================================
  // PRODUCT FROM ADMIN PRODUCT PAGE
  // =====================================================

  const product = location.state;

  // =====================================================
  // PRODUCT DATA
  // Sir ගේ style එකට වෙන වෙනම useState
  // =====================================================

  const [productId, setProductId] = useState(
    product?.productId || routeProductId || "",
  );

  const [name, setName] = useState(product?.name || "");

  const [altNames, setAltNames] = useState(
    Array.isArray(product?.altNames) ? product.altNames.join(", ") : "",
  );

  const [description, setDescription] = useState(product?.description || "");

  const [price, setPrice] = useState(product?.price ?? "");

  const [labelNo, setLabelNo] = useState(product?.labelNo ?? "");

  const [category, setCategory] = useState(product?.category || "");

  // =====================================================
  // EXISTING IMAGES
  // Database එකේ දැනට තියෙන images
  // =====================================================

  const [oldImages, setOldImages] = useState(
    Array.isArray(product?.images) ? product.images : [],
  );

  // =====================================================
  // NEW IMAGES
  // User අලුතින් select කරන images
  // =====================================================

  const [images, setImages] = useState([]);

  const [preview, setPreview] = useState([]);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // SELECT NEW IMAGES
  // =====================================================

  function handleImageChange(e) {
    const selectedImages = Array.from(e.target.files || []);

    if (selectedImages.length === 0) {
      return;
    }

    // New files add කරනවා

    setImages((oldImages) => [...oldImages, ...selectedImages]);

    // Preview URLs හදනවා

    const newPreview = selectedImages.map((file) => URL.createObjectURL(file));

    setPreview((oldPreview) => [...oldPreview, ...newPreview]);

    // Same image එක නැවත select කරන්න පුළුවන්

    e.target.value = "";
  }

  // =====================================================
  // REMOVE OLD IMAGE
  // =====================================================

  function removeOldImage(index) {
    const newOldImages = oldImages.filter((item, i) => i !== index);

    setOldImages(newOldImages);
  }

  // =====================================================
  // REMOVE NEW IMAGE
  // =====================================================

  function removeNewImage(index) {
    if (preview[index]) {
      URL.revokeObjectURL(preview[index]);
    }

    const newImages = images.filter((item, i) => i !== index);

    const newPreview = preview.filter((item, i) => i !== index);

    setImages(newImages);

    setPreview(newPreview);
  }

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  async function updateProduct() {
    // =================================================
    // TOKEN CHECK
    // =================================================

    const token = localStorage.getItem("token");

    if (token == null) {
      navigate("/login");

      return;
    }

    // =================================================
    // VALIDATION
    // =================================================

    if (
      productId.trim() === "" ||
      name.trim() === "" ||
      description.trim() === "" ||
      price === "" ||
      labelNo === "" ||
      category === ""
    ) {
      toast.error("Please fill all required fields");

      return;
    }

    // Image එකක්වත් නැත්නම්

    if (oldImages.length === 0 && images.length === 0) {
      toast.error("Please select at least one image");

      return;
    }

    setLoading(true);

    try {
      // =================================================
      // NEW IMAGES UPLOAD TO SUPABASE
      // =================================================

      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises[i] = MediaUploader(images[i], token);
      }

      // New images upload වෙලා URLs එනවා

      const newImageUrls = await Promise.all(promises);

      console.log("New Uploaded Images:", newImageUrls);

      // =================================================
      // OLD IMAGES + NEW IMAGES
      // =================================================

      const finalImages = [...oldImages, ...newImageUrls];

      console.log("Final Images:", finalImages);

      // =================================================
      // ALTERNATIVE NAMES
      // =================================================

      const alternativeNames = altNames

        .split(",")

        .map((name) => name.trim())

        .filter((name) => name !== "");

      // =================================================
      // UPDATED PRODUCT OBJECT
      // =================================================

      const updatedProduct = {
        productId: productId.trim(),

        name: name.trim(),

        altNames: alternativeNames,

        description: description.trim(),

        price: Number(price),

        labelNo: Number(labelNo),

        category: category.trim(),

        images: finalImages,
      };

      console.log("UPDATED PRODUCT:", updatedProduct);

      // =================================================
      // SEND UPDATE TO BACKEND
      // =================================================

      const response = await axios.put(
        import.meta.env.VITE_API_URL +
          "/api/products/" +
          (routeProductId || productId),

        updatedProduct,

        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      console.log("UPDATE RESPONSE:", response.data);

      toast.success("Product updated successfully ❤️");

      navigate("/admin/products");
    } catch (err) {
      console.log("UPDATE ERROR:", err);

      console.log("STATUS:", err.response?.status);

      console.log("BACKEND RESPONSE:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update product",
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // ALL IMAGES FOR DISPLAY
  // Old images + New images
  // =====================================================

  const allPreviewImages = [
    ...oldImages.map((url) => ({
      type: "old",

      url: url,
    })),

    ...preview.map((url, index) => ({
      type: "new",

      url: url,

      newIndex: index,
    })),
  ];

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#f5eee4]
        p-4
        sm:p-6
        lg:p-8
      "
    >
      <div
        className="
          max-w-6xl
          mx-auto
        "
      >
        {/* =================================================
            TOP BAR
        ================================================= */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            mb-7
          "
        >
          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            {/* BACK BUTTON */}

            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="
                w-11
                h-11
                rounded-xl
                bg-white
                border
                border-[#d8c7ae]
                text-[#6b1d2f]
                flex
                items-center
                justify-center
                shadow-sm
                hover:bg-[#6b1d2f]
                hover:text-white
                hover:-translate-x-1
                transition-all
              "
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <p
                className="
                  text-[10px]
                  tracking-[0.3em]
                  font-bold
                  text-[#a7832e]
                  uppercase
                "
              >
                NariCraft Admin
              </p>

              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  font-black
                  text-[#4a1624]
                "
              >
                Update Product
              </h1>

              <p
                className="
                  text-sm
                  text-[#8b7567]
                  mt-1
                "
              >
                Product එකේ අවශ්‍ය details වෙනස් කරන්න.
              </p>
            </div>
          </div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-[#6b1d2f]/10
              border
              border-[#6b1d2f]/15
              text-[#6b1d2f]
              text-xs
              font-bold
              w-fit
            "
          >
            <Sparkles size={15} />
            Product Management
          </div>
        </div>

        {/* =================================================
            MAIN CARD
        ================================================= */}

        <div
          className="
            bg-white
            rounded-[28px]
            border
            border-[#decfb9]
            shadow-[0_18px_60px_rgba(72,35,25,0.10)]
            overflow-hidden
          "
        >
          {/* =================================================
              FORM HEADER
          ================================================= */}

          <div
            className="
              bg-gradient-to-r
              from-[#5a1628]
              via-[#6b1d2f]
              to-[#42101d]
              px-6
              sm:px-8
              py-6
              text-white
            "
          >
            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <div
                className="
                  w-12
                  h-12
                  rounded-2xl
                  bg-[#d4af37]/20
                  border
                  border-[#d4af37]/40
                  flex
                  items-center
                  justify-center
                  text-[#f3d975]
                "
              >
                <PackagePlus size={24} />
              </div>

              <div>
                <h2
                  className="
                    text-xl
                    font-bold
                  "
                >
                  Update Product Details
                </h2>

                <p
                  className="
                    text-sm
                    text-[#ead7ca]
                    mt-1
                  "
                >
                  Details වෙනස් කර Update Product button එක click කරන්න.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              BODY
          ================================================= */}

          <div
            className="
              grid
              lg:grid-cols-[320px_1fr]
              gap-8
              p-6
              sm:p-8
            "
          >
            {/* =================================================
                IMAGE SECTION
            ================================================= */}

            <div>
              <div
                className="
                  flex
                  items-center
                  justify-between
                  mb-3
                "
              >
                <label
                  className="
                    block
                    text-sm
                    font-bold
                    text-[#4a1624]
                  "
                >
                  Product Images
                </label>

                {allPreviewImages.length > 0 && (
                  <span
                    className="
                      text-xs
                      text-[#8b7567]
                    "
                  >
                    {allPreviewImages.length} selected
                  </span>
                )}
              </div>

              {/* =================================================
                  NO IMAGE
              ================================================= */}

              {allPreviewImages.length === 0 ? (
                <label
                  className="
                    relative
                    h-[360px]
                    rounded-[24px]
                    border-2
                    border-dashed
                    border-[#cdbb9f]
                    bg-[#faf7f2]
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    cursor-pointer
                    hover:border-[#6b1d2f]
                    hover:bg-[#f7f0e7]
                    transition-all
                    group
                  "
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  <div
                    className="
                      w-16
                      h-16
                      rounded-2xl
                      bg-[#6b1d2f]
                      text-[#d4af37]
                      flex
                      items-center
                      justify-center
                      shadow-lg
                      group-hover:scale-110
                      transition-transform
                    "
                  >
                    <ImagePlus size={30} />
                  </div>

                  <h3
                    className="
                      mt-5
                      font-bold
                      text-[#4a1624]
                    "
                  >
                    Upload Product Image
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      text-[#8b7567]
                      max-w-[220px]
                      leading-5
                    "
                  >
                    JPG, PNG or WEBP image එකක් හෝ images කිහිපයක් select කරන්න.
                  </p>

                  <span
                    className="
                      mt-5
                      px-5
                      py-2.5
                      rounded-xl
                      bg-[#efe5d7]
                      text-[#6b1d2f]
                      text-xs
                      font-bold
                    "
                  >
                    Choose Image
                  </span>
                </label>
              ) : (
                <>
                  {/* =================================================
                      MAIN IMAGE
                  ================================================= */}

                  <div
                    className="
                      relative
                      h-[360px]
                      rounded-[24px]
                      overflow-hidden
                      border
                      border-[#d8c7ae]
                      bg-[#faf7f2]
                      shadow-sm
                    "
                  >
                    <img
                      src={allPreviewImages[0].url}
                      alt="Product Preview"
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                    {/* REMOVE MAIN IMAGE */}

                    <button
                      type="button"
                      onClick={() => {
                        const item = allPreviewImages[0];

                        if (item.type === "old") {
                          const oldIndex = oldImages.indexOf(item.url);

                          removeOldImage(oldIndex);
                        } else {
                          removeNewImage(item.newIndex);
                        }
                      }}
                      className="
                        absolute
                        top-4
                        right-4
                        w-10
                        h-10
                        rounded-full
                        bg-[#6b1d2f]
                        text-white
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        hover:scale-110
                        transition
                      "
                    >
                      <X size={18} />
                    </button>

                    {/* ADD MORE IMAGES */}

                    <label
                      className="
                        absolute
                        top-4
                        left-4
                        px-4
                        py-2
                        rounded-xl
                        bg-white/90
                        text-[#6b1d2f]
                        text-xs
                        font-bold
                        shadow-lg
                        cursor-pointer
                        hover:bg-white
                        transition
                      "
                    >
                      + Add More
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* =================================================
                      OTHER IMAGES
                  ================================================= */}

                  {allPreviewImages.length > 1 && (
                    <div
                      className="
                        grid
                        grid-cols-3
                        gap-2
                        mt-3
                      "
                    >
                      {allPreviewImages

                        .slice(1)

                        .map((item, index) => {
                          const actualIndex = index + 1;

                          return (
                            <div
                              key={item.url + actualIndex}
                              className="
                                  relative
                                  h-24
                                  rounded-xl
                                  overflow-hidden
                                  border
                                  border-[#d8c7ae]
                                  bg-[#faf7f2]
                                  shadow-sm
                                "
                            >
                              <img
                                src={item.url}
                                alt={`Product ${actualIndex + 1}`}
                                className="
                                    w-full
                                    h-full
                                    object-cover
                                  "
                              />

                              <button
                                type="button"
                                onClick={() => {
                                  if (item.type === "old") {
                                    const oldIndex = oldImages.indexOf(
                                      item.url,
                                    );

                                    removeOldImage(oldIndex);
                                  } else {
                                    removeNewImage(item.newIndex);
                                  }
                                }}
                                className="
                                    absolute
                                    top-1.5
                                    right-1.5
                                    w-6
                                    h-6
                                    rounded-full
                                    bg-[#6b1d2f]
                                    text-white
                                    flex
                                    items-center
                                    justify-center
                                    shadow
                                    hover:scale-110
                                    transition
                                  "
                              >
                                <X size={12} />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </>
              )}

              {/* =================================================
                  IMAGE INFO
              ================================================= */}

              <div
                className="
                  mt-4
                  p-4
                  rounded-2xl
                  bg-[#fff9ed]
                  border
                  border-[#ead7a0]
                "
              >
                <p
                  className="
                    text-xs
                    text-[#7c6436]
                    leading-5
                  "
                >
                  ✦ Existing images තියාගන්නත්, remove කරන්නත්, අලුත් images add
                  කරන්නත් පුළුවන්.
                </p>
              </div>
            </div>

            {/* =================================================
                PRODUCT FORM
            ================================================= */}

            <div
              className="
                space-y-6
              "
            >
              {/* =================================================
                  PRODUCT ID + LABEL NUMBER
              ================================================= */}

              <div
                className="
                  grid
                  sm:grid-cols-2
                  gap-5
                "
              >
                {/* PRODUCT ID */}

                <label className="block">
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      mb-2
                      text-sm
                      font-bold
                      text-[#4a1624]
                    "
                  >
                    <span
                      className="
                        text-[#b88f25]
                      "
                    >
                      <Hash size={18} />
                    </span>
                    Product ID
                  </span>

                  <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    readOnly
                    className="
                      form-input
                      !bg-[#eee8df]
                      cursor-not-allowed
                    "
                  />
                </label>

                {/* LABEL NUMBER */}

                <label className="block">
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      mb-2
                      text-sm
                      font-bold
                      text-[#4a1624]
                    "
                  >
                    <span
                      className="
                        text-[#b88f25]
                      "
                    >
                      <Tag size={18} />
                    </span>
                    Label Number
                  </span>

                  <input
                    type="number"
                    value={labelNo}
                    onChange={(e) => setLabelNo(e.target.value)}
                    placeholder="001"
                    required
                    className="form-input"
                  />
                </label>
              </div>

              {/* =================================================
                  PRODUCT NAME
              ================================================= */}

              <label className="block">
                <span
                  className="
                    flex
                    items-center
                    gap-2
                    mb-2
                    text-sm
                    font-bold
                    text-[#4a1624]
                  "
                >
                  <span
                    className="
                      text-[#b88f25]
                    "
                  >
                    <PackagePlus size={18} />
                  </span>
                  Product Name
                </span>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Royal Maroon Saree Jacket"
                  required
                  className="form-input"
                />
              </label>

              {/* =================================================
                  ALTERNATIVE NAMES
              ================================================= */}

              <label className="block">
                <span
                  className="
                    flex
                    items-center
                    gap-2
                    mb-2
                    text-sm
                    font-bold
                    text-[#4a1624]
                  "
                >
                  <span
                    className="
                      text-[#b88f25]
                    "
                  >
                    <Tag size={18} />
                  </span>
                  Alternative Name
                </span>

                <input
                  type="text"
                  value={altNames}
                  onChange={(e) => setAltNames(e.target.value)}
                  placeholder="Maroon Blouse, Designer Jacket"
                  className="form-input"
                />
              </label>

              {/* =================================================
                  CATEGORY + PRICE
              ================================================= */}

              <div
                className="
                  grid
                  sm:grid-cols-2
                  gap-5
                "
              >
                {/* CATEGORY */}

                <label className="block">
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      mb-2
                      text-sm
                      font-bold
                      text-[#4a1624]
                    "
                  >
                    <span
                      className="
                        text-[#b88f25]
                      "
                    >
                      <Layers3 size={18} />
                    </span>
                    Category
                  </span>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="form-input"
                  >
                    <option value="">Select Category</option>

                    <option value="Saree Jackets">Saree Jackets</option>

                    <option value="Blouses">Blouses</option>

                    <option value="Custom Designs">Custom Designs</option>

                    <option value="Premium">Premium Collection</option>

                    <option value="Traditional">Traditional</option>
                  </select>
                </label>

                {/* PRICE */}

                <label className="block">
                  <span
                    className="
                      flex
                      items-center
                      gap-2
                      mb-2
                      text-sm
                      font-bold
                      text-[#4a1624]
                    "
                  >
                    <span
                      className="
                        text-[#b88f25]
                      "
                    >
                      <DollarSign size={18} />
                    </span>
                    Price
                  </span>

                  <div
                    className="
                      relative
                    "
                  >
                    <span
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-xs
                        font-black
                        text-[#6b1d2f]
                      "
                    >
                      LKR
                    </span>

                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="5800"
                      required
                      className="
                        form-input
                        !pl-14
                      "
                    />
                  </div>
                </label>
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <label className="block">
                <span
                  className="
                    flex
                    items-center
                    gap-2
                    mb-2
                    text-sm
                    font-bold
                    text-[#4a1624]
                  "
                >
                  <span
                    className="
                      text-[#b88f25]
                    "
                  >
                    <FileText size={18} />
                  </span>
                  Product Description
                </span>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product එකේ fabric, design, fitting සහ වෙනත් විස්තර..."
                  rows={6}
                  required
                  className="
                    form-input
                    resize-none
                  "
                />
              </label>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div
                className="
                  flex
                  flex-col-reverse
                  sm:flex-row
                  sm:justify-end
                  gap-3
                  pt-5
                  border-t
                  border-[#eadfd1]
                "
              >
                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="
                    px-7
                    py-3.5
                    rounded-xl
                    bg-[#f6efe6]
                    text-[#6b1d2f]
                    border
                    border-[#d8c7ae]
                    font-bold
                    hover:bg-[#eadfd1]
                    transition-all
                  "
                >
                  Cancel
                </button>

                {/* =================================================
                    UPDATE PRODUCT BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={updateProduct}
                  disabled={loading}
                  className="
                    px-8
                    py-3.5
                    rounded-xl
                    bg-gradient-to-r
                    from-[#6b1d2f]
                    to-[#4b1020]
                    text-[#f3e5ab]
                    border
                    border-[#d4af37]/30
                    shadow-lg
                    shadow-[#6b1d2f]/20
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                    hover:-translate-y-0.5
                    hover:shadow-xl
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    transition-all
                  "
                >
                  <Save size={18} />

                  {loading ? "Updating Product..." : "Update Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          STYLE
      ===================================================== */}

      <style>{`

        .form-input {

          width: 100%;

          border: 1px solid #ddcfbd;

          background: #fcfaf7;

          color: #3e2b22;

          border-radius: 14px;

          padding: 13px 15px;

          outline: none;

          transition: 0.2s ease;

        }


        .form-input::placeholder {

          color: #b2a092;

        }


        .form-input:focus {

          border-color: #6b1d2f;

          background: white;

          box-shadow:
            0 0 0 3px
            rgba(107,29,47,0.08);

        }

      `}</style>
    </div>
  );
}
