import axios from "axios";

import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import {
  FaBan,
  FaCalendarAlt,
  FaCheckCircle,
  FaEdit,
  FaEnvelope,
  FaEye,
  FaIdBadge,
  FaKey,
  FaPhoneAlt,
  FaPlus,
  FaSave,
  FaSearch,
  FaShieldAlt,
  FaSyncAlt,
  FaTimes,
  FaUser,
  FaUsers,
  FaUserShield,
} from "react-icons/fa";

import { Loader } from "../../components/loader";

export default function AdminUsersPage() {
  // =====================================================
  // USERS
  // =====================================================

  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // =====================================================
  // FILTERS
  // =====================================================

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  // =====================================================
  // VIEW USER
  // =====================================================

  const [selectedUser, setSelectedUser] = useState(null);

  // =====================================================
  // EDIT USER
  // =====================================================

  const [editUser, setEditUser] = useState(null);

  const [editForm, setEditForm] = useState({
    fullName: "",

    telephone: "",

    role: "user",

    isBlocked: false,

    isEmailVerified: false,
  });

  const [isSaving, setIsSaving] = useState(false);

  // =====================================================
  // ADD USER
  // =====================================================

  const [showAddUser, setShowAddUser] = useState(false);

  const [isAdding, setIsAdding] = useState(false);

  const [addForm, setAddForm] = useState({
    fullName: "",

    email: "",

    telephone: "",

    password: "",

    role: "user",

    isEmailVerified: false,
  });

  // =====================================================
  // LOAD USERS
  // =====================================================

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const token = localStorage.getItem("token");

    if (token == null) {
      toast.error("Admin login required");

      setIsLoading(false);

      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/api/admin/users",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.log("Load Users Error:", err);

      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }

  // =====================================================
  // VIEW USER
  // =====================================================

  function openDetails(user) {
    setSelectedUser(user);
  }

  // =====================================================
  // OPEN EDIT USER
  // =====================================================

  function openEdit(user) {
    setEditUser(user);

    setEditForm({
      fullName: user.fullName || "",

      telephone: user.telephone || "",

      role: user.role || "user",

      isBlocked: user.isBlocked === true,

      isEmailVerified: user.isEmailVerified === true,
    });
  }

  // =====================================================
  // CLOSE EDIT USER
  // =====================================================

  function closeEdit() {
    if (isSaving) {
      return;
    }

    setEditUser(null);
  }

  // =====================================================
  // EDIT FORM INPUT
  // =====================================================

  function handleEditChange(e) {
    const { name, value, type, checked } = e.target;

    setEditForm((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // =====================================================
  // SAVE EDITED USER
  // =====================================================

  async function saveUser() {
    if (!editUser) {
      return;
    }

    if (editForm.fullName.trim() === "") {
      toast.error("Full name is required");

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin login required");

      return;
    }

    try {
      setIsSaving(true);

      const response = await axios.put(
        import.meta.env.VITE_API_URL + "/api/admin/users/" + editUser._id,

        {
          fullName: editForm.fullName.trim(),

          telephone: editForm.telephone.trim(),

          role: editForm.role,

          isBlocked: editForm.isBlocked,

          isEmailVerified: editForm.isEmailVerified,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedUser = response.data.user;

      // =========================================
      // UPDATE TABLE
      // =========================================

      setUsers((oldUsers) =>
        oldUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
        ),
      );

      // =========================================
      // UPDATE DETAILS MODAL
      // =========================================

      setSelectedUser((oldSelected) => {
        if (oldSelected?._id === updatedUser._id) {
          return updatedUser;
        }

        return oldSelected;
      });

      toast.success("User updated successfully");

      setEditUser(null);
    } catch (err) {
      console.log("Update User Error:", err);

      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setIsSaving(false);
    }
  }

  // =====================================================
  // ADD USER INPUT
  // =====================================================

  function handleAddChange(e) {
    const { name, value, type, checked } = e.target;

    setAddForm((previous) => ({
      ...previous,

      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // =====================================================
  // OPEN ADD USER
  // =====================================================

  function openAddUser() {
    setAddForm({
      fullName: "",

      email: "",

      telephone: "",

      password: "",

      role: "user",

      isEmailVerified: false,
    });

    setShowAddUser(true);
  }

  // =====================================================
  // CLOSE ADD USER
  // =====================================================

  function closeAddUser() {
    if (isAdding) {
      return;
    }

    setShowAddUser(false);

    setAddForm({
      fullName: "",

      email: "",

      telephone: "",

      password: "",

      role: "user",

      isEmailVerified: false,
    });
  }

  // =====================================================
  // CREATE USER
  // =====================================================

  async function createUser(e) {
    if (e) {
      e.preventDefault();
    }

    // =========================================
    // NAME
    // =========================================

    if (addForm.fullName.trim() === "") {
      toast.error("Full name is required");

      return;
    }

    // =========================================
    // EMAIL
    // =========================================

    if (addForm.email.trim() === "") {
      toast.error("Email is required");

      return;
    }

    const email = addForm.email.trim().toLowerCase();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");

      return;
    }

    // =========================================
    // PASSWORD
    // =========================================

    if (addForm.password.length < 6) {
      toast.error("Password must be at least 6 characters");

      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin login required");

      return;
    }

    try {
      setIsAdding(true);

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/admin/users",

        {
          fullName: addForm.fullName.trim(),

          email: email,

          telephone: addForm.telephone.trim(),

          password: addForm.password,

          role: addForm.role,

          isEmailVerified: addForm.isEmailVerified,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const createdUser = response.data.user;

      // =========================================
      // ADD NEW USER TO TOP
      // =========================================

      setUsers((oldUsers) => [createdUser, ...oldUsers]);

      toast.success("User created successfully");

      // =========================================
      // CLOSE
      // =========================================

      setShowAddUser(false);

      setAddForm({
        fullName: "",

        email: "",

        telephone: "",

        password: "",

        role: "user",

        isEmailVerified: false,
      });
    } catch (err) {
      console.log("Create User Error:", err);

      toast.error(err.response?.data?.message || "Failed to create user");
    } finally {
      setIsAdding(false);
    }
  }

  // =====================================================
  // FORMAT DATE
  // =====================================================

  function formatDate(date) {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleString();
  }

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const text = search.trim().toLowerCase();

    return users.filter((user) => {
      // =====================================
      // ROLE
      // =====================================

      const matchesRole = roleFilter === "All" || user.role === roleFilter;

      // =====================================
      // STATUS
      // =====================================

      let matchesStatus = true;

      if (statusFilter === "Active") {
        matchesStatus = user.isBlocked !== true;
      }

      if (statusFilter === "Blocked") {
        matchesStatus = user.isBlocked === true;
      }

      if (statusFilter === "Verified") {
        matchesStatus = user.isEmailVerified === true;
      }

      if (statusFilter === "Unverified") {
        matchesStatus = user.isEmailVerified !== true;
      }

      // =====================================
      // SEARCH
      // =====================================

      const matchesSearch =
        text === "" ||
        user.fullName?.toLowerCase().includes(text) ||
        user.email?.toLowerCase().includes(text) ||
        user.telephone?.toLowerCase().includes(text);

      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [users, search, roleFilter, statusFilter]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const customerCount = users.filter((user) => user.role === "user").length;

  const adminCount = users.filter((user) => user.role === "admin").length;

  const blockedCount = users.filter((user) => user.isBlocked === true).length;

  // =====================================================
  // LOADING
  // =====================================================

  if (isLoading) {
    return <Loader />;
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div
      className="
        w-full
        min-h-full
        bg-[#f6ede2]
        p-4
        md:p-7
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div
        className="
          flex
          flex-col
          lg:flex-row
          lg:items-end
          lg:justify-between
          gap-5
          mb-7
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
            NariCraft Admin
          </p>

          <h1
            className="
              text-3xl
              font-black
              text-[#4a1624]
              mt-2
            "
          >
            User Management
          </h1>

          <p
            className="
              text-sm
              text-[#8b7567]
              mt-2
            "
          >
            Registered customers සහ administrators view, create සහ manage කරන්න.
          </p>
        </div>

        {/* HEADER BUTTONS */}

        <div
          className="
            flex
            flex-col
            sm:flex-row
            gap-3
          "
        >
          {/* ADD USER */}

          <button
            type="button"
            onClick={openAddUser}
            className="
              px-5
              py-3
              rounded-xl
              bg-[#d4af37]
              text-[#4a1624]
              font-black
              border-2
              border-[#6b1d2f]
              shadow-[0_4px_0_#6b1d2f]
              flex
              items-center
              justify-center
              gap-2
              hover:-translate-y-0.5
              active:translate-y-1
              active:shadow-none
              transition-all
            "
          >
            <FaPlus />
            Add User
          </button>

          {/* REFRESH */}

          <button
            type="button"
            onClick={loadUsers}
            className="
              px-5
              py-3
              rounded-xl
              bg-[#6b1d2f]
              text-[#f3d975]
              font-bold
              border-2
              border-[#d4af37]
              shadow-[0_4px_0_#d4af37]
              flex
              items-center
              justify-center
              gap-2
              hover:-translate-y-0.5
              active:translate-y-1
              active:shadow-none
              transition-all
            "
          >
            <FaSyncAlt />
            Refresh Users
          </button>
        </div>
      </div>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div
        className="
          grid
          sm:grid-cols-2
          xl:grid-cols-4
          gap-4
          mb-7
        "
      >
        <StatCard icon={<FaUsers />} title="Total Users" value={users.length} />

        <StatCard icon={<FaUser />} title="Customers" value={customerCount} />

        <StatCard icon={<FaUserShield />} title="Admins" value={adminCount} />

        <StatCard icon={<FaBan />} title="Blocked" value={blockedCount} />
      </div>

      {/* =================================================
          SEARCH + FILTERS
      ================================================= */}

      <div
        className="
          bg-white
          rounded-[22px]
          border
          border-[#e1d2c0]
          shadow-[0_8px_25px_rgba(91,26,43,0.06)]
          p-4
          mb-6

          grid
          lg:grid-cols-[1fr_180px_190px]
          gap-3
        "
      >
        {/* SEARCH */}

        <div
          className="
            flex
            items-center
            gap-3
            px-4
            rounded-xl
            bg-[#faf7f2]
            border
            border-[#dfd0bf]
            focus-within:border-[#d4af37]
          "
        >
          <FaSearch
            className="
              text-[#b88f25]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or phone..."
            className="
              w-full
              py-3
              bg-transparent
              outline-none
              text-[#4a1624]
            "
          />
        </div>

        {/* ROLE FILTER */}

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="
            p-3
            rounded-xl
            bg-[#faf7f2]
            border
            border-[#dfd0bf]
            text-[#4a1624]
            font-bold
            outline-none
          "
        >
          <option value="All">All Roles</option>

          <option value="user">Customers</option>

          <option value="admin">Admins</option>
        </select>

        {/* STATUS FILTER */}

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="
            p-3
            rounded-xl
            bg-[#faf7f2]
            border
            border-[#dfd0bf]
            text-[#4a1624]
            font-bold
            outline-none
          "
        >
          <option value="All">All Status</option>

          <option value="Active">Active</option>

          <option value="Blocked">Blocked</option>

          <option value="Verified">Email Verified</option>

          <option value="Unverified">Email Unverified</option>
        </select>
      </div>

      {/* =================================================
          USERS TABLE
      ================================================= */}

      <div
        className="
          bg-white
          rounded-[26px]
          border
          border-[#e1d2c0]
          shadow-[0_12px_35px_rgba(91,26,43,0.07)]
          overflow-hidden
        "
      >
        {filteredUsers.length === 0 ? (
          <div
            className="
              min-h-[350px]
              flex
              items-center
              justify-center
              text-center
              p-8
            "
          >
            <div>
              <div
                className="
                  w-20
                  h-20
                  mx-auto
                  rounded-full
                  bg-[#f8f1e8]
                  text-[#6b1d2f]
                  flex
                  items-center
                  justify-center
                "
              >
                <FaUsers size={30} />
              </div>

              <h2
                className="
                  mt-5
                  text-xl
                  font-black
                  text-[#4a1624]
                "
              >
                No Users Found
              </h2>

              <p
                className="
                  text-sm
                  text-[#8b7567]
                  mt-2
                "
              >
                Search හෝ filters වෙනස් කරලා බලන්න.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="
              overflow-x-auto
            "
          >
            <table
              className="
                w-full
                min-w-[950px]
              "
            >
              <thead
                className="
                  bg-[#6b1d2f]
                  text-[#f3d975]
                "
              >
                <tr>
                  <TableHead>User</TableHead>

                  <TableHead>Contact</TableHead>

                  <TableHead>Role</TableHead>

                  <TableHead>Email</TableHead>

                  <TableHead>Account</TableHead>

                  <TableHead>Actions</TableHead>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="
                        border-b
                        border-[#eee2d5]
                        last:border-0
                        hover:bg-[#fffaf4]
                        transition-colors
                      "
                  >
                    {/* USER */}

                    <td className="p-4">
                      <div
                        className="
                            flex
                            items-center
                            gap-3
                          "
                      >
                        <UserAvatar user={user} />

                        <div>
                          <p
                            className="
                                font-black
                                text-[#4a1624]
                              "
                          >
                            {user.fullName || "Unnamed User"}
                          </p>

                          <p
                            className="
                                text-[10px]
                                text-[#a38d7d]
                                mt-1
                                max-w-[160px]
                                truncate
                              "
                          >
                            ID: {user._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* CONTACT */}

                    <td className="p-4">
                      <p
                        className="
                            text-sm
                            font-bold
                            text-[#5b1a2b]
                          "
                      >
                        {user.telephone || "No phone"}
                      </p>

                      <p
                        className="
                            text-xs
                            text-[#9a8273]
                            mt-1
                          "
                      >
                        {user.email}
                      </p>
                    </td>

                    {/* ROLE */}

                    <td className="p-4">
                      <RoleBadge role={user.role} />
                    </td>

                    {/* EMAIL VERIFIED */}

                    <td className="p-4">
                      {user.isEmailVerified ? (
                        <span
                          className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1
                              rounded-full
                              bg-green-100
                              text-green-700
                              border
                              border-green-200
                              text-xs
                              font-black
                            "
                        >
                          <FaCheckCircle />
                          Verified
                        </span>
                      ) : (
                        <span
                          className="
                              inline-flex
                              px-3
                              py-1
                              rounded-full
                              bg-yellow-100
                              text-yellow-700
                              border
                              border-yellow-200
                              text-xs
                              font-black
                            "
                        >
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* ACCOUNT STATUS */}

                    <td className="p-4">
                      {user.isBlocked ? (
                        <span
                          className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1
                              rounded-full
                              bg-red-100
                              text-red-700
                              border
                              border-red-200
                              text-xs
                              font-black
                            "
                        >
                          <FaBan />
                          Blocked
                        </span>
                      ) : (
                        <span
                          className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-3
                              py-1
                              rounded-full
                              bg-green-100
                              text-green-700
                              border
                              border-green-200
                              text-xs
                              font-black
                            "
                        >
                          <FaCheckCircle />
                          Active
                        </span>
                      )}
                    </td>

                    {/* ACTIONS */}

                    <td className="p-4">
                      <div
                        className="
                            flex
                            items-center
                            gap-2
                          "
                      >
                        <button
                          type="button"
                          onClick={() => openDetails(user)}
                          title="View Details"
                          className="
                              w-10
                              h-10
                              rounded-xl
                              bg-[#f8f1e8]
                              text-[#6b1d2f]
                              border
                              border-[#dfd0bf]
                              flex
                              items-center
                              justify-center
                              hover:bg-[#6b1d2f]
                              hover:text-[#f3d975]
                              transition-all
                            "
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(user)}
                          className="
                              px-4
                              h-10
                              rounded-xl
                              bg-[#6b1d2f]
                              text-[#f3d975]
                              font-bold
                              flex
                              items-center
                              justify-center
                              gap-2
                              shadow-[0_3px_0_#d4af37]
                              active:translate-y-1
                              active:shadow-none
                              transition-all
                            "
                        >
                          <FaEdit />
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =================================================
          ADD USER MODAL
      ================================================= */}

      {showAddUser && (
        <div
          className="
            fixed
            inset-0
            z-[200]
            bg-black/60
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-2xl
              max-h-[92vh]
              overflow-y-auto
              bg-[#faf7f2]
              rounded-[30px]
              border-2
              border-[#d4af37]
              shadow-2xl
            "
          >
            {/* HEADER */}

            <div
              className="
                bg-[#6b1d2f]
                text-white
                rounded-t-[27px]
                p-6
                flex
                items-start
                justify-between
                gap-5
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    text-[#d4af37]
                    font-black
                    tracking-[2px]
                  "
                >
                  NARICRAFT ADMIN
                </p>

                <h2
                  className="
                    text-2xl
                    font-black
                    mt-1
                  "
                >
                  Add New User
                </h2>

                <p
                  className="
                    text-xs
                    text-[#e9d6ca]
                    mt-2
                  "
                >
                  Create a customer or administrator account.
                </p>
              </div>

              <button
                type="button"
                disabled={isAdding}
                onClick={closeAddUser}
                className="
                  w-10
                  h-10
                  rounded-full
                  bg-white/10
                  flex
                  items-center
                  justify-center
                  hover:bg-white
                  hover:text-[#6b1d2f]
                  transition-all
                  disabled:opacity-50
                "
              >
                <FaTimes />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={createUser}
              className="
                p-6
                md:p-8
              "
            >
              {/* FULL NAME */}

              <FormLabel title="Full Name" required>
                <div
                  className="
                    input-shell
                  "
                >
                  <FaUser
                    className="
                      input-icon
                    "
                  />

                  <input
                    type="text"
                    name="fullName"
                    value={addForm.fullName}
                    onChange={handleAddChange}
                    placeholder="Enter user's full name"
                    className="
                      input-field
                    "
                  />
                </div>
              </FormLabel>

              {/* EMAIL */}

              <div className="mt-5">
                <FormLabel title="Email Address" required>
                  <div className="input-shell">
                    <FaEnvelope className="input-icon" />

                    <input
                      type="email"
                      name="email"
                      value={addForm.email}
                      onChange={handleAddChange}
                      placeholder="example@email.com"
                      className="
                        input-field
                      "
                    />
                  </div>
                </FormLabel>
              </div>

              {/* PHONE + ROLE */}

              <div
                className="
                  grid
                  md:grid-cols-2
                  gap-5
                  mt-5
                "
              >
                {/* PHONE */}

                <FormLabel title="Telephone">
                  <div className="input-shell">
                    <FaPhoneAlt className="input-icon" />

                    <input
                      type="tel"
                      name="telephone"
                      value={addForm.telephone}
                      onChange={handleAddChange}
                      placeholder="07X XXX XXXX"
                      className="
                        input-field
                      "
                    />
                  </div>
                </FormLabel>

                {/* ROLE */}

                <FormLabel title="Account Role">
                  <select
                    name="role"
                    value={addForm.role}
                    onChange={handleAddChange}
                    className="
                      w-full
                      mt-2
                      p-3.5
                      rounded-xl
                      bg-white
                      border
                      border-[#dfd0bf]
                      outline-none
                      text-[#4a1624]
                      font-bold
                      focus:border-[#d4af37]
                    "
                  >
                    <option value="user">Customer</option>

                    <option value="admin">Administrator</option>
                  </select>
                </FormLabel>
              </div>

              {/* PASSWORD */}

              <div className="mt-5">
                <FormLabel title="Temporary Password" required>
                  <div className="input-shell">
                    <FaKey className="input-icon" />

                    <input
                      type="password"
                      name="password"
                      value={addForm.password}
                      onChange={handleAddChange}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      className="
                        input-field
                      "
                    />
                  </div>
                </FormLabel>

                <p
                  className="
                    text-[11px]
                    text-[#9a8273]
                    mt-2
                    leading-5
                  "
                >
                  මෙම temporary password එක userට ලබා දෙන්න. Backend එක password
                  එක hash කරලා save කරන්න ඕන.
                </p>
              </div>

              {/* VERIFIED */}

              <label
                className={`
                  mt-6
                  flex
                  items-center
                  justify-between
                  gap-5
                  rounded-2xl
                  border
                  p-4
                  cursor-pointer
                  transition-all

                  ${
                    addForm.isEmailVerified
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-[#e1d2c0]"
                  }
                `}
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <FaShieldAlt
                      className="
                        text-[#b88f25]
                      "
                    />

                    <p
                      className="
                        font-black
                        text-[#4a1624]
                      "
                    >
                      Email Verified
                    </p>
                  </div>

                  <p
                    className="
                      text-xs
                      text-[#9a8273]
                      mt-1
                    "
                  >
                    Email ownership එක admin විසින් verify කරලා තියෙනවා නම් tick
                    කරන්න.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isEmailVerified"
                  checked={addForm.isEmailVerified}
                  onChange={handleAddChange}
                  className="
                    w-5
                    h-5
                    accent-[#6b1d2f]
                  "
                />
              </label>

              {/* BUTTONS */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  mt-7
                "
              >
                <button
                  type="button"
                  disabled={isAdding}
                  onClick={closeAddUser}
                  className="
                    py-3.5
                    rounded-xl
                    border-2
                    border-[#6b1d2f]
                    text-[#6b1d2f]
                    font-black
                    hover:bg-[#f8eee8]
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isAdding}
                  className="
                    py-3.5
                    rounded-xl
                    bg-[#6b1d2f]
                    text-[#f3d975]
                    font-black
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-[0_4px_0_#d4af37]
                    active:translate-y-1
                    active:shadow-none
                    disabled:opacity-50
                  "
                >
                  {isAdding ? (
                    <>
                      <LoadingCircle />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FaPlus />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================
          VIEW DETAILS MODAL
      ================================================= */}

      {selectedUser && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/55
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-3xl
              max-h-[92vh]
              overflow-y-auto
              bg-[#faf7f2]
              rounded-[30px]
              border-2
              border-[#d4af37]
              shadow-2xl
            "
          >
            {/* HEADER */}

            <ModalHeader
              smallTitle="USER DETAILS"
              title={selectedUser.fullName || "User"}
              onClose={() => setSelectedUser(null)}
            />

            <div
              className="
                p-6
                md:p-8
              "
            >
              {/* PROFILE */}

              <div
                className="
                  flex
                  flex-col
                  sm:flex-row
                  items-center
                  gap-5
                  bg-white
                  border
                  border-[#eadaca]
                  rounded-[24px]
                  p-5
                "
              >
                <UserAvatar user={selectedUser} large />

                <div
                  className="
                    text-center
                    sm:text-left
                  "
                >
                  <h3
                    className="
                      text-2xl
                      font-black
                      text-[#4a1624]
                    "
                  >
                    {selectedUser.fullName}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-[#8b7567]
                      mt-1
                    "
                  >
                    {selectedUser.email}
                  </p>

                  <div
                    className="
                      mt-3
                      flex
                      flex-wrap
                      justify-center
                      sm:justify-start
                      gap-2
                    "
                  >
                    <RoleBadge role={selectedUser.role} />

                    {selectedUser.isBlocked ? (
                      <StatusBadge type="blocked" text="Blocked" />
                    ) : (
                      <StatusBadge type="active" text="Active" />
                    )}
                  </div>
                </div>
              </div>

              {/* DETAILS */}

              <div
                className="
                  grid
                  sm:grid-cols-2
                  gap-4
                  mt-5
                "
              >
                <DetailCard
                  icon={<FaEnvelope />}
                  title="Email Address"
                  value={selectedUser.email}
                />

                <DetailCard
                  icon={<FaPhoneAlt />}
                  title="Telephone"
                  value={selectedUser.telephone || "Not provided"}
                />

                <DetailCard
                  icon={<FaUserShield />}
                  title="Role"
                  value={
                    selectedUser.role === "admin" ? "Administrator" : "Customer"
                  }
                />

                <DetailCard
                  icon={<FaShieldAlt />}
                  title="Email Verification"
                  value={
                    selectedUser.isEmailVerified ? "Verified" : "Not Verified"
                  }
                />

                <DetailCard
                  icon={<FaCalendarAlt />}
                  title="Joined"
                  value={formatDate(selectedUser.createdAt)}
                />

                <DetailCard
                  icon={<FaCalendarAlt />}
                  title="Last Updated"
                  value={formatDate(selectedUser.updatedAt)}
                />
              </div>

              {/* DATABASE ID */}

              <div
                className="
                  mt-4
                  bg-white
                  rounded-2xl
                  border
                  border-[#eadaca]
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
                  <FaIdBadge />

                  <p
                    className="
                      text-xs
                      uppercase
                      font-black
                    "
                  >
                    Database User ID
                  </p>
                </div>

                <p
                  className="
                    text-sm
                    font-mono
                    text-[#4a1624]
                    mt-3
                    break-all
                  "
                >
                  {selectedUser._id}
                </p>
              </div>

              {/* EDIT BUTTON */}

              <button
                type="button"
                onClick={() => {
                  const user = selectedUser;

                  setSelectedUser(null);

                  openEdit(user);
                }}
                className="
                  w-full
                  mt-6
                  py-4
                  rounded-2xl
                  bg-[#6b1d2f]
                  text-[#f3d975]
                  font-black
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-[0_5px_0_#d4af37]
                  active:translate-y-1
                  active:shadow-none
                "
              >
                <FaEdit />
                Edit User Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          EDIT USER MODAL
      ================================================= */}

      {editUser && (
        <div
          className="
            fixed
            inset-0
            z-[150]
            bg-black/60
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-2xl
              max-h-[92vh]
              overflow-y-auto
              bg-[#faf7f2]
              rounded-[30px]
              border-2
              border-[#d4af37]
              shadow-2xl
            "
          >
            <ModalHeader
              smallTitle="ADMIN USER EDITOR"
              title="Edit User"
              onClose={closeEdit}
            />

            <div
              className="
                p-6
                md:p-8
              "
            >
              {/* EMAIL */}

              <FormLabel title="Email Address">
                <div
                  className="
                    mt-2
                    flex
                    items-center
                    gap-3
                    px-4
                    rounded-xl
                    bg-[#eee8e2]
                    border
                    border-[#dfd0bf]
                  "
                >
                  <FaEnvelope
                    className="
                      text-[#b88f25]
                    "
                  />

                  <input
                    type="email"
                    value={editUser.email}
                    readOnly
                    className="
                      w-full
                      py-3.5
                      bg-transparent
                      outline-none
                      text-[#806f63]
                      cursor-not-allowed
                    "
                  />
                </div>
              </FormLabel>

              <p
                className="
                  text-[11px]
                  text-[#9a8273]
                  mt-2
                "
              >
                Email address එක orders සමඟ linked නිසා මෙතනින් වෙනස් කරන්න
                බැහැ.
              </p>

              {/* NAME + PHONE */}

              <div
                className="
                  grid
                  md:grid-cols-2
                  gap-5
                  mt-5
                "
              >
                <FormLabel title="Full Name" required>
                  <input
                    type="text"
                    name="fullName"
                    value={editForm.fullName}
                    onChange={handleEditChange}
                    className="
                      standard-input
                    "
                  />
                </FormLabel>

                <FormLabel title="Telephone">
                  <input
                    type="tel"
                    name="telephone"
                    value={editForm.telephone}
                    onChange={handleEditChange}
                    placeholder="07X XXX XXXX"
                    className="
                      standard-input
                    "
                  />
                </FormLabel>
              </div>

              {/* ROLE */}

              <div className="mt-5">
                <FormLabel title="Account Role">
                  <select
                    name="role"
                    value={editForm.role}
                    onChange={handleEditChange}
                    className="
                      standard-input
                      font-bold
                    "
                  >
                    <option value="user">Customer</option>

                    <option value="admin">Administrator</option>
                  </select>
                </FormLabel>
              </div>

              {/* EMAIL VERIFIED */}

              <label
                className="
                  mt-6
                  flex
                  items-center
                  justify-between
                  gap-5
                  bg-white
                  rounded-2xl
                  border
                  border-[#e1d2c0]
                  p-4
                  cursor-pointer
                "
              >
                <div>
                  <p
                    className="
                      font-black
                      text-[#4a1624]
                    "
                  >
                    Email Verified
                  </p>

                  <p
                    className="
                      text-xs
                      text-[#9a8273]
                      mt-1
                    "
                  >
                    Mark this user's email as verified.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isEmailVerified"
                  checked={editForm.isEmailVerified}
                  onChange={handleEditChange}
                  className="
                    w-5
                    h-5
                    accent-[#6b1d2f]
                  "
                />
              </label>

              {/* BLOCK */}

              <label
                className={`
                  mt-3
                  flex
                  items-center
                  justify-between
                  gap-5
                  rounded-2xl
                  border
                  p-4
                  cursor-pointer

                  ${
                    editForm.isBlocked
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-[#e1d2c0]"
                  }
                `}
              >
                <div>
                  <p
                    className={`
                      font-black

                      ${editForm.isBlocked ? "text-red-700" : "text-[#4a1624]"}
                    `}
                  >
                    Block User
                  </p>

                  <p
                    className="
                      text-xs
                      text-[#9a8273]
                      mt-1
                    "
                  >
                    Blocked users cannot login to their account.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isBlocked"
                  checked={editForm.isBlocked}
                  onChange={handleEditChange}
                  className="
                    w-5
                    h-5
                    accent-red-600
                  "
                />
              </label>

              {/* BUTTONS */}

              <div
                className="
                  grid
                  grid-cols-2
                  gap-3
                  mt-7
                "
              >
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={closeEdit}
                  className="
                    py-3.5
                    rounded-xl
                    border-2
                    border-[#6b1d2f]
                    text-[#6b1d2f]
                    font-black
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={saveUser}
                  className="
                    py-3.5
                    rounded-xl
                    bg-[#6b1d2f]
                    text-[#f3d975]
                    font-black
                    flex
                    items-center
                    justify-center
                    gap-2
                    shadow-[0_4px_0_#d4af37]
                    active:translate-y-1
                    active:shadow-none
                    disabled:opacity-50
                  "
                >
                  {isSaving ? (
                    <>
                      <LoadingCircle />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          SMALL STYLES
      ================================================= */}

      <style>{`

        .input-shell {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 16px;
          padding-right: 16px;
          background: white;
          border: 1px solid #dfd0bf;
          border-radius: 12px;
          transition: 0.2s ease;
        }

        .input-shell:focus-within {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
        }

        .input-icon {
          color: #b88f25;
          flex-shrink: 0;
        }

        .input-field {
          width: 100%;
          padding-top: 14px;
          padding-bottom: 14px;
          background: transparent;
          outline: none;
          color: #4a1624;
        }

        .standard-input {
          width: 100%;
          margin-top: 8px;
          padding: 14px;
          border-radius: 12px;
          background: white;
          border: 1px solid #dfd0bf;
          outline: none;
          color: #4a1624;
          transition: 0.2s ease;
        }

        .standard-input:focus {
          border-color: #d4af37;
          box-shadow: 0 0 0 3px rgba(212,175,55,0.08);
        }

      `}</style>
    </div>
  );
}

// =====================================================
// TABLE HEAD
// =====================================================

function TableHead({ children }) {
  return (
    <th
      className="
        p-4
        text-left
        text-xs
        uppercase
        tracking-wide
        font-black
      "
    >
      {children}
    </th>
  );
}

// =====================================================
// USER AVATAR
// =====================================================

function UserAvatar({ user, large = false }) {
  const initial = (user.fullName || user.email || "U").charAt(0).toUpperCase();

  const size = large ? "w-24 h-24 text-3xl" : "w-12 h-12 text-lg";

  if (user.Image) {
    return (
      <img
        src={user.Image}
        alt={user.fullName || "User"}
        className={`
          ${size}
          rounded-full
          object-cover
          border-2
          border-[#d4af37]
          bg-[#f8f1e8]
          shrink-0
        `}
      />
    );
  }

  return (
    <div
      className={`
        ${size}
        rounded-full
        bg-[#6b1d2f]
        text-[#f3d975]
        border-2
        border-[#d4af37]
        flex
        items-center
        justify-center
        font-black
        shrink-0
      `}
    >
      {initial}
    </div>
  );
}

// =====================================================
// ROLE BADGE
// =====================================================

function RoleBadge({ role }) {
  if (role === "admin") {
    return (
      <span
        className="
          inline-flex
          items-center
          gap-1.5
          px-3
          py-1
          rounded-full
          bg-purple-100
          text-purple-700
          border
          border-purple-200
          text-xs
          font-black
        "
      >
        <FaUserShield />
        Admin
      </span>
    );
  }

  return (
    <span
      className="
        inline-flex
        items-center
        gap-1.5
        px-3
        py-1
        rounded-full
        bg-blue-100
        text-blue-700
        border
        border-blue-200
        text-xs
        font-black
      "
    >
      <FaUser />
      Customer
    </span>
  );
}

// =====================================================
// STATUS BADGE
// =====================================================

function StatusBadge({ type, text }) {
  const classes =
    type === "blocked"
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-green-100 text-green-700 border-green-200";

  return (
    <span
      className={`
        inline-flex
        items-center
        px-3
        py-1
        rounded-full
        border
        text-xs
        font-black
        ${classes}
      `}
    >
      {text}
    </span>
  );
}

// =====================================================
// STAT CARD
// =====================================================

function StatCard({ icon, title, value }) {
  return (
    <div
      className="
        bg-white
        border
        border-[#e1d2c0]
        rounded-2xl
        p-5
        shadow-[0_8px_25px_rgba(91,26,43,0.06)]
        transition-all
        hover:-translate-y-1
        hover:border-[#d4af37]
      "
    >
      <div
        className="
          w-11
          h-11
          rounded-xl
          bg-[#f8f1e8]
          text-[#6b1d2f]
          flex
          items-center
          justify-center
        "
      >
        {icon}
      </div>

      <p
        className="
          text-xs
          text-[#9a8273]
          mt-4
        "
      >
        {title}
      </p>

      <p
        className="
          text-3xl
          font-black
          text-[#4a1624]
          mt-1
        "
      >
        {value}
      </p>
    </div>
  );
}

// =====================================================
// DETAIL CARD
// =====================================================

function DetailCard({ icon, title, value }) {
  return (
    <div
      className="
        bg-white
        border
        border-[#eadaca]
        rounded-2xl
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
            uppercase
            font-black
          "
        >
          {title}
        </p>
      </div>

      <p
        className="
          text-sm
          font-bold
          text-[#4a1624]
          mt-3
          break-words
        "
      >
        {value || "-"}
      </p>
    </div>
  );
}

// =====================================================
// MODAL HEADER
// =====================================================

function ModalHeader({ smallTitle, title, onClose }) {
  return (
    <div
      className="
        bg-[#6b1d2f]
        text-white
        rounded-t-[27px]
        p-6
        flex
        items-start
        justify-between
        gap-5
      "
    >
      <div>
        <p
          className="
            text-xs
            text-[#d4af37]
            font-black
            tracking-[2px]
          "
        >
          {smallTitle}
        </p>

        <h2
          className="
            text-2xl
            font-black
            mt-1
          "
        >
          {title}
        </h2>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="
          w-10
          h-10
          rounded-full
          bg-white/10
          flex
          items-center
          justify-center
          hover:bg-white
          hover:text-[#6b1d2f]
          transition-all
        "
      >
        <FaTimes />
      </button>
    </div>
  );
}

// =====================================================
// FORM LABEL
// =====================================================

function FormLabel({ title, required = false, children }) {
  return (
    <label
      className="
        block
      "
    >
      <span
        className="
          text-sm
          font-black
          text-[#5b1a2b]
        "
      >
        {title}

        {required && (
          <span
            className="
              text-red-500
              ml-1
            "
          >
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

// =====================================================
// LOADING CIRCLE
// =====================================================

function LoadingCircle() {
  return (
    <span
      className="
        w-4
        h-4
        rounded-full
        border-2
        border-[#f3d975]
        border-t-transparent
        animate-spin
      "
    />
  );
}
