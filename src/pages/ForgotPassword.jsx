import axios from "axios";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import {
  FaArrowLeft,
  FaEnvelope,
  FaKey,
  FaLock,
  FaPaperPlane,
  FaShieldAlt,
} from "react-icons/fa";

export default function ForgotPassword() {
  const navigate = useNavigate();

  // =====================================================
  // STEPS
  // =====================================================

  const [step, setStep] = useState(1);

  // =====================================================
  // FORM
  // =====================================================

  const [email, setEmail] = useState("");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================================
  // SEND OTP
  // =====================================================

  async function sendOTP(e) {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      toast.error("Please enter your email address");

      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/users/forgot-password/send-otp",

        {
          email: cleanEmail,
        },
      );

      toast.success(response.data.message);

      setStep(2);
    } catch (err) {
      console.log("Send OTP Error:", err);

      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // RESET PASSWORD
  // =====================================================

  async function resetPassword(e) {
    e.preventDefault();

    if (otp.trim().length !== 6) {
      toast.error("Please enter the 6 digit OTP");

      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");

      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/users/forgot-password/reset",

        {
          email: email.trim().toLowerCase(),

          otp: otp.trim(),

          newPassword: newPassword,
        },
      );

      toast.success(response.data.message);

      navigate("/login");
    } catch (err) {
      console.log("Password Reset Error:", err);

      toast.error(err.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#f6ede2]
        flex
        items-center
        justify-center
        px-4
        py-10
      "
    >
      <div
        className="
          w-full
          max-w-lg
          bg-white
          border
          border-[#ead8c2]
          rounded-[30px]
          shadow-[0_20px_60px_rgba(79,20,36,0.15)]
          overflow-hidden
        "
      >
        {/* HEADER */}

        <div
          className="
            bg-[#5b1a2b]
            text-center
            px-6
            py-8
          "
        >
          <div
            className="
              w-16
              h-16
              mx-auto
              rounded-full
              bg-[#d99b21]
              text-[#5b1a2b]
              flex
              items-center
              justify-center
              shadow-lg
            "
          >
            <FaShieldAlt size={25} />
          </div>

          <h1
            className="
              text-3xl
              font-black
              text-white
              mt-5
            "
          >
            Forgot Password?
          </h1>

          <p
            className="
              text-[#ead8cc]
              text-sm
              mt-2
            "
          >
            {step === 1
              ? "Enter your email address to receive a verification code."
              : "Enter the OTP we sent to your email and choose a new password."}
          </p>
        </div>

        {/* BODY */}

        <div
          className="
            p-6
            sm:p-8
          "
        >
          {/* ===============================================
              STEP 1
          =============================================== */}

          {step === 1 && (
            <form onSubmit={sendOTP}>
              <label
                className="
                  text-sm
                  font-black
                  text-[#4f1424]
                "
              >
                Email Address
              </label>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-3
                  px-4
                  rounded-xl
                  bg-[#faf7f2]
                  border
                  border-[#dfd0bf]
                  focus-within:border-[#d99b21]
                "
              >
                <FaEnvelope
                  className="
                    text-[#d99b21]
                  "
                />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  className="
                    w-full
                    py-4
                    bg-transparent
                    outline-none
                    text-[#4f1424]
                  "
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  mt-6
                  py-4
                  rounded-xl
                  bg-[#5b1a2b]
                  text-[#f3d975]
                  font-black
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-[0_5px_0_#d99b21]
                  active:translate-y-1
                  active:shadow-none
                  disabled:opacity-50
                "
              >
                {loading ? <LoadingSpinner /> : <FaPaperPlane />}

                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* ===============================================
              STEP 2
          =============================================== */}

          {step === 2 && (
            <form onSubmit={resetPassword}>
              {/* EMAIL INFO */}

              <div
                className="
                  rounded-xl
                  bg-[#fff7df]
                  border
                  border-[#ecd797]
                  p-4
                  mb-5
                "
              >
                <p
                  className="
                    text-xs
                    text-[#99721d]
                  "
                >
                  OTP sent to
                </p>

                <p
                  className="
                    font-black
                    text-[#5b1a2b]
                    mt-1
                    break-all
                  "
                >
                  {email}
                </p>
              </div>

              {/* OTP */}

              <label
                className="
                  text-sm
                  font-black
                  text-[#4f1424]
                "
              >
                Verification Code
              </label>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-3
                  px-4
                  rounded-xl
                  bg-[#faf7f2]
                  border
                  border-[#dfd0bf]
                  focus-within:border-[#d99b21]
                "
              >
                <FaKey
                  className="
                    text-[#d99b21]
                  "
                />

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");

                    setOtp(value);
                  }}
                  placeholder="Enter 6 digit OTP"
                  className="
                    w-full
                    py-4
                    bg-transparent
                    outline-none
                    text-[#4f1424]
                    tracking-[6px]
                    font-black
                  "
                />
              </div>

              {/* NEW PASSWORD */}

              <label
                className="
                  block
                  text-sm
                  font-black
                  text-[#4f1424]
                  mt-5
                "
              >
                New Password
              </label>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-3
                  px-4
                  rounded-xl
                  bg-[#faf7f2]
                  border
                  border-[#dfd0bf]
                  focus-within:border-[#d99b21]
                "
              >
                <FaLock
                  className="
                    text-[#d99b21]
                  "
                />

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete="new-password"
                  className="
                    w-full
                    py-4
                    bg-transparent
                    outline-none
                    text-[#4f1424]
                  "
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <label
                className="
                  block
                  text-sm
                  font-black
                  text-[#4f1424]
                  mt-5
                "
              >
                Confirm Password
              </label>

              <div
                className="
                  mt-2
                  flex
                  items-center
                  gap-3
                  px-4
                  rounded-xl
                  bg-[#faf7f2]
                  border
                  border-[#dfd0bf]
                  focus-within:border-[#d99b21]
                "
              >
                <FaLock
                  className="
                    text-[#d99b21]
                  "
                />

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter password again"
                  autoComplete="new-password"
                  className="
                    w-full
                    py-4
                    bg-transparent
                    outline-none
                    text-[#4f1424]
                  "
                />
              </div>

              {/* RESET */}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  mt-6
                  py-4
                  rounded-xl
                  bg-[#5b1a2b]
                  text-[#f3d975]
                  font-black
                  flex
                  items-center
                  justify-center
                  gap-2
                  shadow-[0_5px_0_#d99b21]
                  active:translate-y-1
                  active:shadow-none
                  disabled:opacity-50
                "
              >
                {loading ? <LoadingSpinner /> : <FaLock />}

                {loading ? "Resetting..." : "Reset Password"}
              </button>

              {/* RESEND */}

              <button
                type="button"
                disabled={loading}
                onClick={sendOTP}
                className="
                  w-full
                  mt-4
                  text-sm
                  font-bold
                  text-[#d99b21]
                  hover:text-[#5b1a2b]
                  disabled:opacity-50
                "
              >
                Didn't receive the code? Resend OTP
              </button>
            </form>
          )}

          {/* BACK LOGIN */}

          <Link
            to="/login"
            className="
              mt-7
              flex
              items-center
              justify-center
              gap-2
              text-sm
              font-bold
              text-[#765f52]
              hover:text-[#5b1a2b]
            "
          >
            <FaArrowLeft />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingSpinner() {
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
