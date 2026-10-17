import axios from "axios";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  FaCloudUploadAlt,
  FaImage,
  FaMagic,
  FaPhoneAlt,
  FaRulerCombined,
  FaSave,
  FaTshirt,
  FaTrash,
} from "react-icons/fa";

import { createClient } from "@supabase/supabase-js";

// =====================================================

// SUPABASE

// =====================================================

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,

  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

// =====================================================

// EMPTY MEASUREMENTS

// =====================================================

const emptyMeasurements = {
  bust: "",

  underBust: "",

  waist: "",

  shoulder: "",

  sleeveLength: "",

  sleeveCircumference: "",

  frontNeck: "",

  backNeck: "",

  jacketLength: "",
};

// =====================================================

// MEASUREMENT FIELDS

// =====================================================

const measurementFields = [
  {
    name: "bust",

    label: "Bust",

    sinhala: "පපුව වට",
  },

  {
    name: "underBust",

    label: "Under Bust",

    sinhala: "පපුව යට වට",
  },

  {
    name: "waist",

    label: "Waist",

    sinhala: "ඉණ",
  },

  {
    name: "shoulder",

    label: "Shoulder",

    sinhala: "උරහිස",
  },

  {
    name: "sleeveLength",

    label: "Sleeve Length",

    sinhala: "අත් දිග",
  },

  {
    name: "sleeveCircumference",

    label: "Sleeve Circumference",

    sinhala: "අත් වට",
  },

  {
    name: "frontNeck",

    label: "Front Neck",

    sinhala: "ඉදිරි කර",
  },

  {
    name: "backNeck",

    label: "Back Neck",

    sinhala: "පසුපස කර",
  },

  {
    name: "jacketLength",

    label: "Jacket Length",

    sinhala: "ජැකට් දිග",
  },
];

export default function CustomDesign() {
  const navigate = useNavigate();

  // =====================================================

  // STATES

  // =====================================================

  const [designFile, setDesignFile] = useState(null);

  const [preview, setPreview] = useState("");

  const [measurementType, setMeasurementType] = useState("standard");

  const [standardSize, setStandardSize] = useState("M");

  const [measurementUnit, setMeasurementUnit] = useState("in");

  const [measurements, setMeasurements] = useState(emptyMeasurements);

  const [customerProvidesFabric, setCustomerProvidesFabric] = useState(false);

  const [saveMeasurements, setSaveMeasurements] = useState(false);

  const [telephone, setTelephone] = useState("");

  const [notes, setNotes] = useState("");

  const [savedProfile, setSavedProfile] = useState(null);

  const [isLoadingSaved, setIsLoadingSaved] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // =====================================================

  // LOAD SAVED MEASUREMENTS

  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("Please login to create a custom design");

      navigate("/login");

      return;
    }

    axios

      .get(
        import.meta.env.VITE_API_URL + "/api/measurements/me",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      .then((res) => {
        if (res.data.hasSavedMeasurements && res.data.profile) {
          setSavedProfile(res.data.profile);
        }
      })

      .catch((err) => {
        console.log("Saved measurements error:", err);
      })

      .finally(() => {
        setIsLoadingSaved(false);
      });
  }, [navigate]);

  // =====================================================
  // LOAD USER PHONE NUMBER
  // =====================================================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token == null) {
      return;
    }

    axios
      .get(import.meta.env.VITE_API_URL + "/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data?.telephone) {
          setTelephone(res.data.telephone.toString());
        }
      })
      .catch((err) => {
        console.log("Load User Phone Error:", err);
      });
  }, []);

  // =====================================================

  // IMAGE SELECT

  // =====================================================

  function handleImageSelect(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");

      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10MB");

      return;
    }

    setDesignFile(file);

    const imagePreview = URL.createObjectURL(file);

    setPreview(imagePreview);
  }

  // =====================================================

  // REMOVE IMAGE

  // =====================================================

  function removeImage() {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setDesignFile(null);

    setPreview("");
  }

  // =====================================================

  // HANDLE MEASUREMENT

  // =====================================================

  function handleMeasurementChange(e) {
    const { name, value } = e.target;

    setMeasurements((previous) => ({
      ...previous,

      [name]: value,
    }));
  }

  // =====================================================

  // USE SAVED MEASUREMENTS

  // =====================================================

  function useSavedMeasurements() {
    if (!savedProfile) {
      toast.error("No saved measurements found");

      return;
    }

    setMeasurementType("custom");

    setMeasurementUnit(savedProfile.measurementUnit || "in");

    setMeasurements({
      ...emptyMeasurements,

      ...savedProfile.measurements,
    });

    toast.success("Saved measurements loaded");
  }

  // =====================================================

  // VALIDATE CUSTOM MEASUREMENTS

  // =====================================================

  function validateMeasurements() {
    for (let i = 0; i < measurementFields.length; i++) {
      const field = measurementFields[i];

      const value = Number(measurements[field.name]);

      if (!Number.isFinite(value) || value <= 0) {
        toast.error(`Please enter ${field.label}`);

        return false;
      }
    }

    return true;
  }

  // =====================================================

  // SUBMIT CUSTOM ORDER

  // =====================================================

  async function handleSubmit() {
    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("Please login first");

      navigate("/login");

      return;
    }

    // =========================================
    // PHONE NUMBER CHECK
    // =========================================

    if (telephone.trim() === "") {
      toast.error("Please enter your phone number");
      return;
    }

    // =========================================

    // IMAGE CHECK

    // =========================================

    if (!designFile) {
      toast.error("Please upload your design photo");

      return;
    }

    // =========================================

    // STANDARD SIZE CHECK

    // =========================================

    if (measurementType === "standard" && !standardSize) {
      toast.error("Please select a size");

      return;
    }

    // =========================================

    // CUSTOM MEASUREMENTS CHECK

    // =========================================

    if (measurementType === "custom") {
      const isValid = validateMeasurements();

      if (!isValid) {
        return;
      }
    }

    let uploadedFilePath = "";

    try {
      setIsSubmitting(true);

      // =========================================

      // CREATE FILE NAME

      // =========================================

      const fileExtension = designFile.name.split(".").pop();

      const fileName =
        "custom-designs/custom-" +
        Date.now() +
        "-" +
        Math.floor(Math.random() * 100000) +
        "." +
        fileExtension;

      uploadedFilePath = fileName;

      // =========================================

      // UPLOAD DESIGN TO SUPABASE

      // =========================================

      const { error: uploadError } = await supabase.storage

        .from("images")

        .upload(fileName, designFile);

      if (uploadError) {
        console.log("Upload Error:", uploadError);

        toast.error("Design image upload failed");

        return;
      }

      // =========================================

      // GET PUBLIC URL

      // =========================================

      const { data: publicUrlData } = supabase.storage

        .from("images")

        .getPublicUrl(fileName);

      const designImage = publicUrlData.publicUrl;

      // =========================================

      // ORDER DATA

      // =========================================

      const orderData = {
        telephone: telephone.trim(),

        designImage: designImage,

        measurementType: measurementType,

        standardSize: measurementType === "standard" ? standardSize : null,

        measurementUnit: measurementUnit,

        measurements:
          measurementType === "custom" ? measurements : emptyMeasurements,

        customerProvidesFabric: customerProvidesFabric,

        notes: notes.trim(),

        saveMeasurements:
          measurementType === "custom" ? saveMeasurements : false,
      };

      // =========================================

      // SEND TO BACKEND

      // =========================================

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/custom-orders",

        orderData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // =========================================

      // SUCCESS

      // =========================================

      toast.success(
        `Custom order submitted! ${response.data.order.customOrderId}`,
      );

      navigate("/orders", {
        state: {
          tab: "custom",
        },
      });
    } catch (err) {
      console.log("Custom Order Error:", err);

      // =========================================

      // IF ORDER FAILED AFTER IMAGE UPLOAD,

      // REMOVE UNUSED IMAGE

      // =========================================

      if (uploadedFilePath) {
        try {
          await supabase.storage

            .from("images")

            .remove([uploadedFilePath]);
        } catch (deleteError) {
          console.log("Unused image delete error:", deleteError);
        }
      }

      toast.error(
        err.response?.data?.message || "Failed to submit custom order",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="

        w-full

        min-h-screen

        bg-[#faf7f2]

        px-4

        py-10

      "
    >
      <div
        className="

          max-w-3xl

          mx-auto

        "
      >
        {/* =================================================

            MAIN CARD

        ================================================= */}

        <div
          className="

            bg-white

            rounded-[30px]

            border

            border-[#e4d5c5]

            shadow-[0_18px_50px_rgba(91,26,43,0.10)]

            p-5

            sm:p-7

            md:p-9

          "
        >
          {/* =================================================

              TITLE

          ================================================= */}

          <div
            className="

              text-center

              mb-8

            "
          >
            <div
              className="

                w-12

                h-12

                mx-auto

                rounded-2xl

                bg-[#fff8e7]

                border

                border-[#e6cf8c]

                text-[#c4951d]

                flex

                items-center

                justify-center

              "
            >
              <FaMagic />
            </div>

            <h1
              className="

                text-2xl

                md:text-3xl

                font-black

                text-[#4a1624]

                mt-4

              "
            >
              ඔබගේ Custom Design එකක් එවන්න
            </h1>

            <p
              className="

                text-sm

                text-[#8b7567]

                mt-2

              "
            >
              ඔබ කැමති design එක upload කරලා අවශ්‍ය විස්තර ලබාදෙන්න.
            </p>
          </div>

          {/* =================================================

              1. DESIGN PHOTO

          ================================================= */}

          <section>
            <SectionTitle number="1" title="Design Photo" />

            {!preview ? (
              <label
                htmlFor="designImage"
                className="

                  mt-3

                  w-full

                  min-h-[220px]

                  rounded-[22px]

                  border-2

                  border-dashed

                  border-[#d4af37]

                  bg-[#fcfaf7]

                  flex

                  flex-col

                  items-center

                  justify-center

                  cursor-pointer

                  hover:bg-[#fff8eb]

                  transition-all

                "
              >
                <div
                  className="

                    w-14

                    h-14

                    rounded-2xl

                    bg-[#f4ebe1]

                    text-[#6b1d2f]

                    flex

                    items-center

                    justify-center

                    text-xl

                  "
                >
                  <FaCloudUploadAlt />
                </div>

                <p
                  className="

                    mt-4

                    font-bold

                    text-[#4a1624]

                  "
                >
                  Design Photo Select කරන්න
                </p>

                <p
                  className="

                    text-xs

                    text-[#9a8273]

                    mt-2

                  "
                >
                  PNG, JPG, JPEG, WEBP (Max 10MB)
                </p>

                <input
                  id="designImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            ) : (
              <div
                className="

                  relative

                  mt-3

                  rounded-[22px]

                  overflow-hidden

                  border

                  border-[#e1d2c0]

                  bg-[#faf7f2]

                "
              >
                <img
                  src={preview}
                  alt="Design Preview"
                  className="

                    w-full

                    max-h-[450px]

                    object-contain

                  "
                />

                <button
                  type="button"
                  onClick={removeImage}
                  className="

                    absolute

                    top-4

                    right-4

                    w-11

                    h-11

                    rounded-full

                    bg-white

                    text-red-500

                    border

                    border-red-200

                    shadow-lg

                    flex

                    items-center

                    justify-center

                    hover:bg-red-500

                    hover:text-white

                    transition-all

                  "
                >
                  <FaTrash />
                </button>
              </div>
            )}
          </section>

          {/* =================================================

              2. MEASUREMENTS

          ================================================= */}

          <section className="mt-8">
            <SectionTitle number="2" title="Size / Measurements" />

            {/* ===============================================

                TYPE TABS

            =============================================== */}

            <div
              className="

                mt-3

                grid

                grid-cols-2

                gap-2

                bg-[#f4ecdf]

                rounded-2xl

                p-1.5

                border

                border-[#e3d1b9]

              "
            >
              <button
                type="button"
                onClick={() => setMeasurementType("standard")}
                className={`

                  py-3

                  rounded-xl

                  font-bold

                  text-sm

                  transition-all


                  ${
                    measurementType === "standard"
                      ? "bg-[#6b1d2f] text-[#f3d975] shadow-md"
                      : "text-[#6b1d2f] hover:bg-white"
                  }

                `}
              >
                <FaTshirt
                  className="

                    inline

                    mr-2

                  "
                />
                Standard Sizes
              </button>

              <button
                type="button"
                onClick={() => setMeasurementType("custom")}
                className={`

                  py-3

                  rounded-xl

                  font-bold

                  text-sm

                  transition-all


                  ${
                    measurementType === "custom"
                      ? "bg-[#6b1d2f] text-[#f3d975] shadow-md"
                      : "text-[#6b1d2f] hover:bg-white"
                  }

                `}
              >
                <FaRulerCombined
                  className="

                    inline

                    mr-2

                  "
                />
                Custom Measurements
              </button>
            </div>

            {/* ===============================================

                STANDARD SIZE

            =============================================== */}

            {measurementType === "standard" && (
              <div
                className="

                  mt-5

                  rounded-[20px]

                  bg-[#fbf8f4]

                  border

                  border-[#e4d5c5]

                  p-5

                "
              >
                <p
                  className="

                    text-xs

                    font-black

                    tracking-wide

                    uppercase

                    text-[#9a7652]

                  "
                >
                  Select Standard Size
                </p>

                <div
                  className="

                    flex

                    flex-wrap

                    gap-3

                    mt-4

                  "
                >
                  {["S", "M", "L", "XL", "2XL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setStandardSize(size)}
                      className={`

                          min-w-[52px]

                          h-[48px]

                          px-4

                          rounded-xl

                          border-2

                          font-black

                          transition-all


                          ${
                            standardSize === size
                              ? "bg-[#6b1d2f] border-[#d4af37] text-[#f3d975] shadow-md"
                              : "bg-white border-[#e3d2c1] text-[#6b1d2f] hover:border-[#d4af37]"
                          }

                        `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ===============================================

                CUSTOM MEASUREMENTS

            =============================================== */}

            {measurementType === "custom" && (
              <div
                className="

                  mt-5

                  rounded-[20px]

                  bg-[#fbf8f4]

                  border

                  border-[#e4d5c5]

                  p-5

                  md:p-6

                "
              >
                {/* UNIT + SAVED */}

                <div
                  className="

                    flex

                    flex-col

                    md:flex-row

                    md:items-center

                    md:justify-between

                    gap-4

                    pb-5

                    border-b

                    border-[#eadfd2]

                  "
                >
                  <div>
                    <p
                      className="

                        text-xs

                        font-black

                        uppercase

                        tracking-wide

                        text-[#9a7652]

                      "
                    >
                      Measurement Unit
                    </p>

                    <div
                      className="

                        flex

                        gap-2

                        mt-2

                      "
                    >
                      <UnitButton
                        title="Inches"
                        active={measurementUnit === "in"}
                        onClick={() => setMeasurementUnit("in")}
                      />

                      <UnitButton
                        title="cm"
                        active={measurementUnit === "cm"}
                        onClick={() => setMeasurementUnit("cm")}
                      />
                    </div>
                  </div>

                  {!isLoadingSaved && savedProfile && (
                    <button
                      type="button"
                      onClick={useSavedMeasurements}
                      className="

                        flex

                        items-center

                        justify-center

                        gap-2

                        px-4

                        py-3

                        rounded-xl

                        bg-[#fff8e7]

                        text-[#7a5c12]

                        border

                        border-[#d4af37]

                        font-bold

                        text-sm

                        hover:bg-[#d4af37]

                        hover:text-[#4a1624]

                        transition-all

                      "
                    >
                      <FaSave />
                      Use Saved Measurements
                    </button>
                  )}
                </div>

                {/* MEASUREMENT INPUTS */}

                <div
                  className="

                    grid

                    md:grid-cols-2

                    gap-5

                    mt-6

                  "
                >
                  {measurementFields.map((field) => (
                    <label key={field.name}>
                      <span
                        className="

                            text-xs

                            font-bold

                            text-[#5b1a2b]

                          "
                      >
                        {field.sinhala}{" "}
                        <span
                          className="

                              text-[#9a8273]

                              font-normal

                            "
                        >
                          ({field.label})
                        </span>
                      </span>

                      <div
                        className="

                            mt-2

                            flex

                            items-center

                            rounded-xl

                            bg-white

                            border

                            border-[#dfd0bf]

                            focus-within:border-[#d4af37]

                            overflow-hidden

                          "
                      >
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          name={field.name}
                          value={measurements[field.name]}
                          onChange={handleMeasurementChange}
                          placeholder={
                            measurementUnit === "in" ? "eg: 34" : "eg: 86"
                          }
                          className="

                              w-full

                              p-3.5

                              outline-none

                              text-[#4a1624]

                              bg-transparent

                            "
                        />

                        <span
                          className="

                              pr-4

                              text-xs

                              font-bold

                              text-[#b88f25]

                            "
                        >
                          {measurementUnit}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* SAVE MEASUREMENTS */}

                <label
                  className="

                    mt-6

                    flex

                    items-start

                    gap-3

                    rounded-xl

                    bg-white

                    border

                    border-[#e3d2c1]

                    p-4

                    cursor-pointer

                  "
                >
                  <input
                    type="checkbox"
                    checked={saveMeasurements}
                    onChange={(e) => setSaveMeasurements(e.target.checked)}
                    className="

                      mt-1

                      accent-[#6b1d2f]

                    "
                  />

                  <div>
                    <p
                      className="

                        text-sm

                        font-bold

                        text-[#4a1624]

                      "
                    >
                      Save these measurements
                    </p>

                    <p
                      className="

                        text-xs

                        text-[#9a8273]

                        mt-1

                      "
                    >
                      ඊළඟ custom order එකේ නැවත measurements type කරන්න අවශ්‍ය
                      නැහැ.
                    </p>
                  </div>
                </label>
              </div>
            )}
          </section>

          {/* =================================================
              3. CONTACT NUMBER
          ================================================= */}

          <section className="mt-7">
            <SectionTitle number="3" title="Contact Number" />

            <div
              className="
              mt-3
              flex
              items-center
              gap-3
              px-4
              rounded-2xl
              bg-[#fbf8f4]
              border
              border-[#dfd0bf]
              focus-within:border-[#d4af37]
            "
            >
              <FaPhoneAlt className="text-[#b88f25] shrink-0" />

              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="07X XXX XXXX"
                required
                className="
                  w-full
                  py-4
                  bg-transparent
                  outline-none
                  text-[#4a1624]
                  font-medium
                "
              />
            </div>

            <p className="text-xs text-[#9a8273] mt-2">
              Order එක සම්බන්ධයෙන් ඔබව contact කිරීමට මෙම phone number එක භාවිතා
              කරනු ඇත.
            </p>
          </section>

          {/* =================================================

              4. NOTES

          ================================================= */}

          <section className="mt-7">
            <SectionTitle number="4" title="Special Notes" />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="4"
              placeholder="Design එක ගැන විශේෂ විස්තර, වෙනස්කම්, කැමති style එක ආදිය මෙහි ලියන්න..."
              className="

                w-full

                mt-3

                p-4

                rounded-2xl

                bg-[#fbf8f4]

                border

                border-[#dfd0bf]

                outline-none

                resize-none

                text-[#4a1624]

                focus:border-[#d4af37]

              "
            />
          </section>

          {/* =================================================

              5. FABRIC

          ================================================= */}

          <section className="mt-5">
            <SectionTitle number="5" title="Fabric Details" />

            <label
              className="

                flex

                items-start

                gap-3

                rounded-2xl

                bg-[#fbf8f4]

                border

                border-[#e4d5c5]

                p-4

                cursor-pointer

              "
            >
              <input
                type="checkbox"
                checked={customerProvidesFabric}
                onChange={(e) => setCustomerProvidesFabric(e.target.checked)}
                className="

                  mt-1

                  accent-[#6b1d2f]

                "
              />

              <div>
                <p
                  className="

                    text-sm

                    font-bold

                    text-[#4a1624]

                  "
                >
                  මැසීමට අවශ්‍ය රෙදි මම ලබාදෙමි
                </p>

                <p
                  className="

                    text-xs

                    text-[#9a8273]

                    mt-1

                  "
                >
                  Customer will provide the required fabric.
                </p>
              </div>
            </label>
          </section>

          {/* =================================================

              PRICE INFORMATION

          ================================================= */}

          <div
            className="

              mt-6

              rounded-2xl

              bg-[#fff8e7]

              border

              border-[#e2c86d]

              p-4

            "
          >
            <p
              className="

                text-sm

                font-bold

                text-[#6b5418]

              "
            >
              Custom Design Price
            </p>

            <p
              className="

                text-xs

                leading-6

                text-[#806d3a]

                mt-1

              "
            >
              ඔබගේ design එක සහ measurements review කළ පසු NariCraft team එක
              price එක ලබාදෙනු ඇත. එය My Orders page එකෙන් බලන්න පුළුවන්.
            </p>
          </div>

          {/* =================================================

              SUBMIT

          ================================================= */}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="

              w-full

              mt-7

              py-4

              px-6

              rounded-2xl

              bg-[#6b1d2f]

              text-[#f3d975]

              font-black

              flex

              items-center

              justify-center

              gap-3

              shadow-[0_6px_0_#d4af37]

              hover:-translate-y-1

              hover:shadow-[0_8px_0_#d4af37]

              active:translate-y-1

              active:shadow-none

              transition-all

              disabled:opacity-60

              disabled:cursor-not-allowed

              disabled:translate-y-0

            "
          >
            {isSubmitting ? (
              <>
                <span
                  className="

                    w-5

                    h-5

                    rounded-full

                    border-2

                    border-[#f3d975]

                    border-t-transparent

                    animate-spin

                  "
                />
                Submitting Custom Order...
              </>
            ) : (
              <>
                <FaImage />
                Custom Design Order Submit කරන්න
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================

// SECTION TITLE

// =====================================================

function SectionTitle({ number, title }) {
  return (
    <div
      className="

        flex

        items-center

        gap-2

      "
    >
      <div
        className="

          w-7

          h-7

          rounded-full

          bg-[#6b1d2f]

          text-[#f3d975]

          text-xs

          font-black

          flex

          items-center

          justify-center

        "
      >
        {number}
      </div>

      <h2
        className="

          text-sm

          font-black

          text-[#4a1624]

        "
      >
        {title}
      </h2>
    </div>
  );
}

// =====================================================

// UNIT BUTTON

// =====================================================

function UnitButton({ title, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`

        px-4

        py-2

        rounded-lg

        text-sm

        font-bold

        border

        transition-all


        ${
          active
            ? "bg-[#6b1d2f] border-[#6b1d2f] text-[#f3d975]"
            : "bg-white border-[#dfd0bf] text-[#6b1d2f] hover:border-[#d4af37]"
        }

      `}
    >
      {title}
    </button>
  );
}
