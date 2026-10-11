import axios from "axios";

import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaUserShield,
  FaShoppingBag,
  FaShoppingCart,
  FaSignOutAlt,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import { createClient } from "@supabase/supabase-js";

// =====================================================
// SUPABASE
// =====================================================

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,

  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export default function UserData() {
  const [user, setUser] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [isUploading, setIsUploading] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [editFullName, setEditFullName] = useState("");

  const [editTelephone, setEditTelephone] = useState("");

  const navigate = useNavigate();

  // =====================================================
  // LOAD USER
  // =====================================================

  useEffect(() => {
    loadUser();
  }, []);

  function loadUser() {
    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("Please login to view your profile");

      navigate("/login");

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
        setUser(res.data);

        setEditFullName(res.data.fullName || "");

        setEditTelephone(res.data.telephone || "");

        localStorage.setItem(
          "user",

          JSON.stringify(res.data),
        );

        setIsLoading(false);
      })

      .catch((err) => {
        console.log(err);

        toast.error("Unable to load profile");

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");
      });
  }

  // =====================================================
  // EDIT PROFILE
  // =====================================================

  function startEditing() {
    setEditFullName(user?.fullName || "");

    setEditTelephone(user?.telephone || "");

    setIsEditing(true);
  }

  // =====================================================
  // CANCEL EDIT
  // =====================================================

  function cancelEditing() {
    setEditFullName(user?.fullName || "");

    setEditTelephone(user?.telephone || "");

    setIsEditing(false);
  }

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  async function saveProfile() {
    const token = localStorage.getItem("token");

    if (editFullName.trim() === "") {
      toast.error("Full name is required");

      return;
    }

    try {
      setIsSaving(true);

      const response = await axios.put(
        import.meta.env.VITE_API_URL + "/api/users/profile",

        {
          fullName: editFullName.trim(),

          telephone: editTelephone.trim(),
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser(response.data.user);

      localStorage.setItem(
        "user",

        JSON.stringify(response.data.user),
      );

      setEditFullName(response.data.user.fullName || "");

      setEditTelephone(response.data.user.telephone || "");

      setIsEditing(false);

      toast.success("Profile updated successfully");
    } catch (err) {
      console.log("Update Profile Error:", err);

      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  // =====================================================
  // CHANGE PROFILE IMAGE
  // =====================================================

  async function handleImageChange(e) {
    const oldImageUrl = user?.Image;

    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // =========================================
    // IMAGE TYPE CHECK
    // =========================================

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");

      return;
    }

    // =========================================
    // MAX 5MB
    // =========================================

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");

      return;
    }

    const token = localStorage.getItem("token");

    try {
      setIsUploading(true);

      // =========================================
      // FILE NAME
      // =========================================

      const fileExtension = file.name.split(".").pop();

      const fileName = "profiles/profile-" + Date.now() + "." + fileExtension;

      // =========================================
      // UPLOAD TO SUPABASE
      // =========================================

      const { error: uploadError } = await supabase.storage

        .from("images")

        .upload(fileName, file);

      if (uploadError) {
        console.log(uploadError);

        toast.error("Image upload failed");

        return;
      }

      // =========================================
      // GET PUBLIC URL
      // =========================================

      const { data: publicUrlData } = supabase.storage

        .from("images")

        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // =========================================
      // SAVE IMAGE URL TO BACKEND
      // =========================================

      const response = await axios.put(
        import.meta.env.VITE_API_URL + "/api/users/profile-image",

        {
          Image: imageUrl,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // =========================================
      // DELETE OLD SUPABASE IMAGE
      // =========================================

      if (
        oldImageUrl &&
        oldImageUrl.includes(import.meta.env.VITE_SUPABASE_URL)
      ) {
        try {
          const oldFileName = oldImageUrl.split("/images/").pop();

          if (oldFileName) {
            const { error: deleteError } = await supabase.storage

              .from("images")

              .remove([oldFileName]);

            if (deleteError) {
              console.log("Old image delete error:", deleteError);
            }
          }
        } catch (error) {
          console.log("Old image delete error:", error);
        }
      }

      // =========================================
      // UPDATE PAGE
      // =========================================

      setUser(response.data.user);

      localStorage.setItem(
        "user",

        JSON.stringify(response.data.user),
      );

      toast.success("Profile picture updated successfully");
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message || "Failed to update profile picture",
      );
    } finally {
      setIsUploading(false);
    }
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  function handleLogout() {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login");
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return (
      <div
        className="
          w-full
          min-h-[500px]
          flex
          items-center
          justify-center
          bg-[#f6ede2]
        "
      >
        <p
          className="
            text-[#6b1d2f]
            font-bold
          "
        >
          Loading profile...
        </p>
      </div>
    );
  }

  const fullName = user?.fullName || "NariCraft User";

  return (
    <div
      className="
        w-full
        min-h-screen
        bg-[#f6ede2]
        px-4
        md:px-8
        py-8
      "
    >
      <div
        className="
          max-w-5xl
          mx-auto
        "
      >
        {/* =================================================
            TITLE
        ================================================= */}

        <div
          className="
            mb-8
            flex
            flex-col
            sm:flex-row
            sm:items-end
            sm:justify-between
            gap-4
          "
        >
          <div>
            <p
              className="
                text-[#b88f25]
                text-xs
                font-black
                tracking-[3px]
                uppercase
              "
            >
              NariCraft Account
            </p>

            <h1
              className="
                text-3xl
                md:text-4xl
                font-black
                text-[#4a1624]
                mt-2
              "
            >
              My Profile
            </h1>

            <p
              className="
                text-[#8b7567]
                mt-2
              "
            >
              View and manage your account information.
            </p>
          </div>

          {/* EDIT BUTTON */}

          {!isEditing && (
            <button
              type="button"
              onClick={startEditing}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-[#6b1d2f]
                text-[#f3d975]
                font-bold
                border-2
                border-[#d4af37]
                shadow-[0_4px_0_#d4af37]
                hover:-translate-y-0.5
                active:translate-y-1
                active:shadow-none
                transition-all
              "
            >
              <FaEdit />
              Edit Profile
            </button>
          )}
        </div>

        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <div
          className="
            relative
            overflow-hidden
            rounded-[30px]
            bg-gradient-to-r
            from-[#6b1d2f]
            via-[#551527]
            to-[#3d0e1b]
            border
            border-[#d4af37]/40
            shadow-[0_20px_50px_rgba(91,26,43,0.20)]
            p-6
            md:p-8
          "
        >
          <div
            className="
              absolute
              -right-20
              -top-20
              w-60
              h-60
              rounded-full
              border
              border-[#d4af37]/20
            "
          />

          <div
            className="
              relative
              z-10
              flex
              flex-col
              sm:flex-row
              sm:items-center
              gap-6
            "
          >
            {/* PROFILE IMAGE */}

            <div
              className="
                relative
                shrink-0
                w-fit
              "
            >
              <img
                src={user?.Image}
                alt="Profile"
                className="
                  w-28
                  h-28
                  rounded-full
                  object-cover
                  bg-[#f6ede2]
                  border-4
                  border-[#d4af37]
                  shadow-xl
                "
              />

              <label
                htmlFor="profileImage"
                className="
                  absolute
                  bottom-0
                  right-0
                  w-10
                  h-10
                  rounded-full
                  bg-[#d4af37]
                  text-[#4a1624]
                  border-4
                  border-[#6b1d2f]
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  hover:scale-110
                  transition-all
                "
              >
                <FaCamera />

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>

            {/* USER */}

            <div className="flex-1">
              <p
                className="
                  text-[#d4af37]
                  text-xs
                  font-black
                  uppercase
                  tracking-[2px]
                "
              >
                Welcome Back
              </p>

              <h2
                className="
                  text-2xl
                  md:text-3xl
                  font-black
                  text-white
                  mt-1
                "
              >
                {fullName}
              </h2>

              <p
                className="
                  text-[#e7d5ca]
                  mt-2
                "
              >
                {user?.email}
              </p>

              <span
                className="
                  inline-flex
                  mt-4
                  px-4
                  py-1.5
                  rounded-full
                  bg-[#d4af37]
                  text-[#4a1624]
                  text-xs
                  font-black
                  uppercase
                "
              >
                {user?.role || "user"}
              </span>

              {isUploading && (
                <p
                  className="
                    text-[#f3d975]
                    text-sm
                    mt-3
                    font-bold
                  "
                >
                  Uploading profile picture...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* =================================================
            MAIN DETAILS
        ================================================= */}

        <div
          className="
            grid
            lg:grid-cols-3
            gap-6
            mt-7
          "
        >
          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}

          <div
            className="
              lg:col-span-2
              bg-white
              rounded-[28px]
              border
              border-[#e3d2c1]
              shadow-[0_12px_35px_rgba(91,26,43,0.08)]
              p-6
              md:p-8
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                mb-6
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-[#6b1d2f]
                    text-[#d4af37]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <FaUser />
                </div>

                <div>
                  <h2
                    className="
                      text-xl
                      font-black
                      text-[#4a1624]
                    "
                  >
                    Personal Information
                  </h2>

                  <p
                    className="
                      text-xs
                      text-[#9a8273]
                      mt-1
                    "
                  >
                    Your account details
                  </p>
                </div>
              </div>
            </div>

            {/* ===============================================
                EDIT MODE
            =============================================== */}

            {isEditing ? (
              <div>
                <div
                  className="
                    grid
                    md:grid-cols-2
                    gap-4
                  "
                >
                  {/* NAME */}

                  <label>
                    <span
                      className="
                        text-xs
                        font-black
                        uppercase
                        text-[#b88f25]
                      "
                    >
                      Full Name
                    </span>

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        mt-2
                        px-4
                        py-3
                        rounded-xl
                        bg-[#faf7f2]
                        border-2
                        border-[#eadfd2]
                        focus-within:border-[#d4af37]
                      "
                    >
                      <FaUser
                        className="
                          text-[#6b1d2f]
                        "
                      />

                      <input
                        type="text"
                        value={editFullName}
                        onChange={(e) => setEditFullName(e.target.value)}
                        className="
                          w-full
                          bg-transparent
                          outline-none
                          text-[#4a1624]
                          font-bold
                        "
                      />
                    </div>
                  </label>

                  {/* TELEPHONE */}

                  <label>
                    <span
                      className="
                        text-xs
                        font-black
                        uppercase
                        text-[#b88f25]
                      "
                    >
                      Telephone
                    </span>

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        mt-2
                        px-4
                        py-3
                        rounded-xl
                        bg-[#faf7f2]
                        border-2
                        border-[#eadfd2]
                        focus-within:border-[#d4af37]
                      "
                    >
                      <FaPhoneAlt
                        className="
                          text-[#6b1d2f]
                        "
                      />

                      <input
                        type="tel"
                        value={editTelephone}
                        onChange={(e) => setEditTelephone(e.target.value)}
                        placeholder="07X XXX XXXX"
                        className="
                          w-full
                          bg-transparent
                          outline-none
                          text-[#4a1624]
                          font-bold
                        "
                      />
                    </div>
                  </label>
                </div>

                {/* EMAIL READ ONLY */}

                <div
                  className="
                    mt-4
                    rounded-2xl
                    bg-[#faf7f2]
                    border
                    border-[#eadfd2]
                    p-5
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                      text-[#b88f25]
                    "
                  >
                    <FaEnvelope />

                    <p
                      className="
                        text-xs
                        font-black
                        uppercase
                      "
                    >
                      Email Address
                    </p>
                  </div>

                  <p
                    className="
                      mt-3
                      text-[#4a1624]
                      font-bold
                    "
                  >
                    {user?.email}
                  </p>

                  <p
                    className="
                      text-xs
                      text-[#9a8273]
                      mt-1
                    "
                  >
                    Email address cannot be changed here.
                  </p>
                </div>

                {/* BUTTONS */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                    mt-6
                  "
                >
                  <button
                    type="button"
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="
                      flex-1
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-3
                      rounded-xl
                      bg-[#6b1d2f]
                      text-[#f3d975]
                      font-black
                      border-2
                      border-[#d4af37]
                      disabled:opacity-60
                    "
                  >
                    <FaSave />

                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="
                      flex-1
                      flex
                      items-center
                      justify-center
                      gap-2
                      py-3
                      rounded-xl
                      bg-[#f8f1e8]
                      text-[#6b1d2f]
                      font-black
                      border-2
                      border-[#e1d2c0]
                    "
                  >
                    <FaTimes />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* =============================================
                 VIEW MODE
              ============================================= */

              <div
                className="
                  grid
                  md:grid-cols-2
                  gap-4
                "
              >
                <ProfileInfo
                  icon={<FaUser />}
                  title="Full Name"
                  value={fullName}
                />

                <ProfileInfo
                  icon={<FaEnvelope />}
                  title="Email Address"
                  value={user?.email || "Not added"}
                />

                <ProfileInfo
                  icon={<FaPhoneAlt />}
                  title="Telephone"
                  value={user?.telephone || "Not added"}
                />

                <ProfileInfo
                  icon={<FaUserShield />}
                  title="Account Type"
                  value={user?.role || "user"}
                />
              </div>
            )}
          </div>

          {/* =================================================
              QUICK ACTIONS
          ================================================= */}

          <div
            className="
              bg-white
              rounded-[28px]
              border
              border-[#e3d2c1]
              shadow-[0_12px_35px_rgba(91,26,43,0.08)]
              p-6
            "
          >
            <h2
              className="
                text-xl
                font-black
                text-[#4a1624]
              "
            >
              Quick Actions
            </h2>

            <p
              className="
                text-xs
                text-[#9a8273]
                mt-1
                mb-5
              "
            >
              Manage your NariCraft account
            </p>

            {/* ORDERS */}

            <Link
              to="/orders"
              className="
                w-full
                flex
                items-center
                gap-3
                p-4
                rounded-2xl
                bg-[#f8f1e8]
                border
                border-[#e3d2c1]
                text-[#6b1d2f]
                font-bold
                hover:-translate-y-0.5
                hover:border-[#d4af37]
                transition-all
              "
            >
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
                <FaShoppingBag />
              </div>
              My Orders
            </Link>

            {/* CART */}

            <Link
              to="/cart"
              className="
                w-full
                flex
                items-center
                gap-3
                p-4
                rounded-2xl
                bg-[#f8f1e8]
                border
                border-[#e3d2c1]
                text-[#6b1d2f]
                font-bold
                hover:-translate-y-0.5
                hover:border-[#d4af37]
                transition-all
                mt-3
              "
            >
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
                <FaShoppingCart />
              </div>
              Shopping Cart
            </Link>

            {/* LOGOUT */}

            <button
              type="button"
              onClick={handleLogout}
              className="
                w-full
                flex
                items-center
                gap-3
                p-4
                rounded-2xl
                bg-[#fff4f4]
                border
                border-[#edcccc]
                text-[#a02a37]
                font-bold
                hover:bg-[#a02a37]
                hover:text-white
                transition-all
                mt-3
              "
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-xl
                  bg-[#a02a37]
                  text-white
                  flex
                  items-center
                  justify-center
                "
              >
                <FaSignOutAlt />
              </div>
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// INFO CARD
// =====================================================

function ProfileInfo({ icon, title, value }) {
  return (
    <div
      className="
        rounded-2xl
        bg-[#faf7f2]
        border
        border-[#eadfd2]
        p-5
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-[#b88f25]
        "
      >
        {icon}

        <p
          className="
            text-xs
            font-black
            uppercase
            tracking-wide
          "
        >
          {title}
        </p>
      </div>

      <p
        className="
          mt-3
          text-[#4a1624]
          font-bold
          break-words
        "
      >
        {value}
      </p>
    </div>
  );
}
