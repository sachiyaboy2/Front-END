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

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MediaUploader from "../../utils/mediaUpload";
import { CiBoxes } from "react-icons/ci";

export default function AddProductPage() {
  const navigate = useNavigate();

  // =====================================================
  // IMAGE STATE
  // =====================================================

  const [image, setImage] = useState([]);
  const [preview, setPreview] = useState([]);

  const [loading, setLoading] = useState(false);

  // =====================================================
  // PRODUCT DATA
  // =====================================================

  const [formData, setFormData] = useState({
    productId: "",
    name: "",
    altName: "",
    description: "",
    price: "",
    labelNo: "",
    category: "",
  });

  // =====================================================
  // FORM INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // IMAGE SELECT
  // =====================================================

  const handleImageChange = (e) => {
    const selectedImages = Array.from(e.target.files || []);

    if (selectedImages.length === 0) {
      return;
    }

    // කලින් images අයින් නොකර
    // අලුත් images add කරනවා
    setImage((oldImages) => [...oldImages, ...selectedImages]);

    // Preview URLs
    const newPreview = selectedImages.map((file) => URL.createObjectURL(file));

    setPreview((oldPreview) => [...oldPreview, ...newPreview]);

    // same image එක ආයෙ select කරන්නත් පුළුවන්
    e.target.value = "";
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeImage = (index) => {
    URL.revokeObjectURL(preview[index]);

    const newImages = image.filter((item, i) => i !== index);

    const newPreview = preview.filter((item, i) => i !== index);

    setImage(newImages);
    setPreview(newPreview);
  };

  // =====================================================
  // ADD PRODUCT
  // =====================================================

  async function addProduct() {
    // -----------------------------------------
    // LOGIN CHECK
    // -----------------------------------------

    const token = localStorage.getItem("token");

    if (token == null) {
      navigate("/login");

      return;
    }

    // -----------------------------------------
    // VALIDATION
    // -----------------------------------------

    if (
      formData.productId.trim() === "" ||
      formData.name.trim() === "" ||
      formData.description.trim() === "" ||
      formData.price === "" ||
      formData.labelNo === "" ||
      formData.category === ""
    ) {
      toast.error("Please fill all required fields");

      return;
    }

    if (image.length === 0) {
      toast.error("Please select at least one image");

      return;
    }

    setLoading(true);

    // -----------------------------------------
    // SUPABASE IMAGE UPLOAD PROMISES
    // -----------------------------------------

    const promises = [];

    for (let i = 0; i < image.length; i++) {
      promises[i] = MediaUploader(image[i], token);
    }

    try {
      // ---------------------------------------
      // WAIT UNTIL ALL IMAGES UPLOAD
      // ---------------------------------------

      const urls = await Promise.all(promises);

      console.log("Uploaded Images:", urls);

      // ---------------------------------------
      // ALTERNATIVE NAMES
      // ---------------------------------------

      const alternativeNames = formData.altName
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name !== "");

      // ---------------------------------------
      // PRODUCT OBJECT
      // ---------------------------------------

      const product = {
        productId: formData.productId.trim(),

        name: formData.name.trim(),

        altNames: alternativeNames,

        description: formData.description.trim(),

        price: Number(formData.price),

        labelNo: Number(formData.labelNo),

        category: formData.category.trim(),

        images: urls,
      };

      console.log("Product:", product);

      // ---------------------------------------
      // SEND PRODUCT TO BACKEND
      // ---------------------------------------

      console.log("PRODUCT SENDING:", product);
      console.log("API URL:", import.meta.env.VITE_API_URL + "/api/products");

      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/api/products",
        product,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        },
      );

      console.log("Product Response:", res.data);

      toast.success("Product added successfully");

      navigate("/admin/products");
    } catch (err) {
      console.log("FULL ERROR:", err);
      console.log("STATUS:", err.response?.status);
      console.log("BACKEND RESPONSE:", err.response?.data);

      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to create product",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5eee4] p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="
                w-11 h-11
                rounded-xl
                bg-white
                border border-[#d8c7ae]
                text-[#6b1d2f]
                flex items-center justify-center
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
              <p className="text-[10px] tracking-[0.3em] font-bold text-[#a7832e] uppercase">
                NariCraft Admin
              </p>

              <h1 className="text-2xl sm:text-3xl font-black text-[#4a1624]">
                Add New Product
              </h1>

              <p className="text-sm text-[#8b7567] mt-1">
                ඔබගේ NariCraft collection එකට අලුත් product එකක් එකතු කරන්න.
              </p>
            </div>
          </div>

          <div
            className="
              inline-flex items-center gap-2
              px-4 py-2
              rounded-full
              bg-[#6b1d2f]/10
              border border-[#6b1d2f]/15
              text-[#6b1d2f]
              text-xs font-bold
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
            border border-[#decfb9]
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
              px-6 sm:px-8
              py-6
              text-white
            "
          >
            <div className="flex items-center gap-4">
              <div
                className="
                  w-12 h-12
                  rounded-2xl
                  bg-[#d4af37]/20
                  border border-[#d4af37]/40
                  flex items-center justify-center
                  text-[#f3d975]
                "
              >
                <PackagePlus size={24} />
              </div>

              <div>
                <h2 className="text-xl font-bold">Product Details</h2>

                <p className="text-sm text-[#ead7ca] mt-1">
                  Product එකට අදාල විස්තර නිවැරදිව ඇතුළත් කරන්න.
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              BODY
          ================================================= */}

          <div className="grid lg:grid-cols-[320px_1fr] gap-8 p-6 sm:p-8">
            {/* =================================================
                IMAGE SECTION
            ================================================= */}

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-bold text-[#4a1624]">
                  Product Image
                </label>

                {image.length > 0 && (
                  <span className="text-xs text-[#8b7567]">
                    {image.length} selected
                  </span>
                )}
              </div>

              {/* =================================================
                  NO IMAGES SELECTED
              ================================================= */}

              {preview.length === 0 ? (
                <label
                  className="
                    relative
                    h-[360px]
                    rounded-[24px]
                    border-2 border-dashed border-[#cdbb9f]
                    bg-[#faf7f2]
                    flex flex-col
                    items-center justify-center
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
                      w-16 h-16
                      rounded-2xl
                      bg-[#6b1d2f]
                      text-[#d4af37]
                      flex items-center justify-center
                      shadow-lg
                      group-hover:scale-110
                      transition-transform
                    "
                  >
                    <ImagePlus size={30} />
                  </div>

                  <h3 className="mt-5 font-bold text-[#4a1624]">
                    Upload Product Image
                  </h3>

                  <p className="mt-2 text-xs text-[#8b7567] max-w-[220px] leading-5">
                    JPG, PNG or WEBP image එකක් හෝ images කිහිපයක් select කරන්න.
                  </p>

                  <span
                    className="
                      mt-5
                      px-5 py-2.5
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
                      border border-[#d8c7ae]
                      bg-[#faf7f2]
                      shadow-sm
                    "
                  >
                    <img
                      src={preview[0]}
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
                      onClick={() => removeImage(0)}
                      className="
                        absolute
                        top-4 right-4
                        w-10 h-10
                        rounded-full
                        bg-[#6b1d2f]
                        text-white
                        flex items-center justify-center
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
                        top-4 left-4
                        px-4 py-2
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

                    {/* IMAGE NAME */}

                    <div
                      className="
                        absolute
                        bottom-0 inset-x-0
                        bg-gradient-to-t
                        from-black/70
                        to-transparent
                        p-5
                        pt-16
                      "
                    >
                      <p className="text-white text-xs font-semibold truncate">
                        {image[0]?.name}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      OTHER IMAGES
                  ================================================= */}

                  {preview.length > 1 && (
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      {preview.slice(1).map((url, index) => {
                        const actualIndex = index + 1;

                        return (
                          <div
                            key={actualIndex}
                            className="
                                  relative
                                  h-24
                                  rounded-xl
                                  overflow-hidden
                                  border border-[#d8c7ae]
                                  bg-[#faf7f2]
                                  shadow-sm
                                "
                          >
                            <img
                              src={url}
                              alt={`Product ${actualIndex + 1}`}
                              className="
                                    w-full
                                    h-full
                                    object-cover
                                  "
                            />

                            <button
                              type="button"
                              onClick={() => removeImage(actualIndex)}
                              className="
                                    absolute
                                    top-1.5
                                    right-1.5
                                    w-6 h-6
                                    rounded-full
                                    bg-[#6b1d2f]
                                    text-white
                                    flex items-center
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

              {/* INFO BOX */}

              <div
                className="
                  mt-4
                  p-4
                  rounded-2xl
                  bg-[#fff9ed]
                  border border-[#ead7a0]
                "
              >
                <p className="text-xs text-[#7c6436] leading-5">
                  ✦ Clear product image එකක් use කරන්න. Catalog එකේ product card
                  එකේ පළවෙනි image එක පෙන්වන්න පුළුවන්.
                </p>
              </div>
            </div>

            {/* =================================================
                PRODUCT FORM
            ================================================= */}

            <div className="space-y-6">
              {/* =================================================
                  PRODUCT ID + LABEL NUMBER
              ================================================= */}

              <div className="grid sm:grid-cols-2 gap-5">
                {/* PRODUCT ID */}

                <label className="block">
                  <span
                    className="
                      flex items-center
                      gap-2
                      mb-2
                      text-sm
                      font-bold
                      text-[#4a1624]
                    "
                  >
                    <span className="text-[#b88f25]">
                      <Hash size={18} />
                    </span>
                    Product ID
                  </span>

                  <input
                    type="text"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    placeholder="Product ID"
                    required
                    className="form-input"
                  />
                </label>

                {/* LABEL NUMBER */}

                <label className="block">
                  <span
                    className="
                      flex items-center
                      gap-2
                      mb-2
                      text-sm
                      font-bold
                      text-[#4a1624]
                    "
                  >
                    <span className="text-[#b88f25]">
                      <CiBoxes size={18} />
                    </span>
                    Stocks
                  </span>

                  <input
                    type="number"
                    name="labelNo"
                    value={formData.labelNo}
                    onChange={handleChange}
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
                    flex items-center
                    gap-2
                    mb-2
                    text-sm
                    font-bold
                    text-[#4a1624]
                  "
                >
                  <span className="text-[#b88f25]">
                    <PackagePlus size={18} />
                  </span>
                  Product Name
                </span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Royal Maroon Saree Jacket"
                  required
                  className="form-input"
                />
              </label>

              {/* =================================================
                  ALTERNATIVE NAME
              ================================================= */}

              <label className="block">
                <span
                  className="
                    flex items-center
                    gap-2
                    mb-2
                    text-sm
                    font-bold
                    text-[#4a1624]
                  "
                >
                  <span className="text-[#b88f25]">
                    <Tag size={18} />
                  </span>
                  Alternative Name
                </span>

                <input
                  type="text"
                  name="altName"
                  value={formData.altName}
                  onChange={handleChange}
                  placeholder="Maroon Blouse, Designer Jacket"
                  className="form-input"
                />
              </label>

              {/* =================================================
                  CATEGORY + PRICE
              ================================================= */}

              <div className="grid sm:grid-cols-2 gap-5">
                {/* CATEGORY */}

                <label className="block">
                  <span
                    className="
                      flex items-center
                      gap-2
                      mb-2
                      text-sm
                      font-bold
                      text-[#4a1624]
                    "
                  >
                    <span className="text-[#b88f25]">
                      <Layers3 size={18} />
                    </span>
                    Category
                  </span>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="form-input"
                  >
                    <option value="">Select Category</option>

                    <optgroup label="Fashion Collections">
                      <option value="Saree Jackets">Saree Jackets</option>

                      <option value="Blouses">Blouses</option>

                      <option value="Frocks">Frocks</option>

                      <option value="Crop Tops">Crop Tops</option>

                      <option value="Premium">Premium Collection</option>

                      <option value="Traditional">Traditional</option>
                    </optgroup>

                    <optgroup label="Uniform & Group Orders">
                      <option value="Preschool Uniforms">
                        Preschool Uniforms
                      </option>

                      <option value="Association T-Shirts">
                        Association T-Shirts
                      </option>
                    </optgroup>
                  </select>
                </label>

                {/* PRICE */}

                <label className="block">
                  <span
                    className="
                      flex items-center
                      gap-2
                      mb-2
                      text-sm
                      font-bold
                      text-[#4a1624]
                    "
                  >
                    <span className="text-[#b88f25]">
                      <DollarSign size={18} />
                    </span>
                    Price
                  </span>

                  <div className="relative">
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
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="5800"
                      required
                      className="form-input !pl-14"
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
                    flex items-center
                    gap-2
                    mb-2
                    text-sm
                    font-bold
                    text-[#4a1624]
                  "
                >
                  <span className="text-[#b88f25]">
                    <FileText size={18} />
                  </span>
                  Product Description
                </span>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product එකේ fabric, design, fitting සහ වෙනත් විස්තර..."
                  rows={6}
                  required
                  className="form-input resize-none"
                />
              </label>

              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div
                className="
                  flex flex-col-reverse
                  sm:flex-row
                  sm:justify-end
                  gap-3
                  pt-5
                  border-t border-[#eadfd1]
                "
              >
                {/* CANCEL */}

                <button
                  type="button"
                  onClick={() => navigate("/admin/products")}
                  className="
                    px-7 py-3.5
                    rounded-xl
                    bg-[#f6efe6]
                    text-[#6b1d2f]
                    border border-[#d8c7ae]
                    font-bold
                    hover:bg-[#eadfd1]
                    transition-all
                  "
                >
                  Cancel
                </button>

                {/* =================================================
                    ADD PRODUCT
                ================================================= */}

                <button
                  type="button"
                  onClick={addProduct}
                  disabled={loading}
                  className="
                    px-8 py-3.5
                    rounded-xl
                    bg-gradient-to-r
                    from-[#6b1d2f]
                    to-[#4b1020]
                    text-[#f3e5ab]
                    border border-[#d4af37]/30
                    shadow-lg
                    shadow-[#6b1d2f]/20
                    font-bold
                    flex items-center
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

                  {loading ? "Saving Product..." : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          ORIGINAL STYLE
      ================================================= */}

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
          box-shadow: 0 0 0 3px rgba(107,29,47,0.08);
        }

      `}</style>
    </div>
  );
}
