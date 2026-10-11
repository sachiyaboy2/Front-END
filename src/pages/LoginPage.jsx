import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  Sparkles,
  Scissors,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import "./AuthPages.css";

import axios from "axios";

import toast from "react-hot-toast";

import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // NORMAL LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/users/login",

        {
          email: e.target.email.value,

          password: e.target.password.value,
        },
      );

      console.log("Backend Response:", response.data);

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Login successful!");

      const user = response.data.user;

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login Error:", error);

      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  async function handleGoogleLogin(credentialResponse) {
    if (!credentialResponse.credential) {
      toast.error("Google login failed");

      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/api/users/google-login",

        {
          credential: credentialResponse.credential,
        },
      );

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Google login successful!");

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Google Login Error:", error);

      toast.error(error.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-orb auth-orb-one" />

      <div className="auth-orb auth-orb-two" />

      <div className="auth-particle particle-one" />

      <div className="auth-particle particle-two" />

      <div className="auth-particle particle-three" />

      <section className="auth-shell">
        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="auth-brand-panel">
          <div className="brand-glow" />

          <Link to="/" className="auth-logo">
            <span className="auth-logo-mark">
              <img
                src="/logo.png"
                alt="NariCraft Logo"
                className="brightness-100 sepia"
              />
            </span>

            <span>
              <strong>
                Nari
                <span>Craft</span>
              </strong>

              <small>TAILORED FOR YOU</small>
            </span>
          </Link>

          <div className="brand-copy">
            <div className="brand-badge">
              <Sparkles size={15} />
              Custom Tailoring Studio
            </div>

            <h1>
              Your Design.
              <br />
              <em>Our Craft.</em>
            </h1>

            <p>
              ඔබේම style එකට ගැළපෙන, ඔබේම මිනුම්වලට නිමවන NariCraft experience
              එකට නැවතත් සාදරයෙන් පිළිගනිමු.
            </p>

            <div className="brand-features">
              <Feature
                icon={<Scissors size={17} />}
                title="Personalized Designs"
                sub="ඔබේ style එකටම"
              />

              <Feature
                icon={<ShieldCheck size={17} />}
                title="Secure Account"
                sub="ඔබේ details ආරක්ෂිතයි"
              />

              <Feature
                icon={<CheckCircle2 size={17} />}
                title="Perfect Fit"
                sub="ඔබේ මිනුම් අනුව"
              />
            </div>
          </div>

          <div className="brand-bottom">
            <span>✦</span>
            Crafted with love in Sri Lanka
          </div>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="auth-form-panel">
          <div className="mobile-brand">
            <Link to="/" className="auth-logo">
              <span className="auth-logo-mark">
                <img
                  src="/logo.png"
                  alt="NariCraft Logo"
                  className="brightness-100 sepia"
                />
              </span>

              <span>
                <strong>
                  Nari
                  <span>Craft</span>
                </strong>

                <small>TAILORED FOR YOU</small>
              </span>
            </Link>
          </div>

          <div className="form-heading">
            <span className="eyebrow">WELCOME BACK</span>

            <h2>Login කරන්න 👋</h2>

            <p>ඔබගේ NariCraft account එකට sign in වෙන්න.</p>
          </div>

          {/* =================================================
              NORMAL LOGIN FORM
          ================================================= */}

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field">
              <span>Email Address</span>

              <div className="input-wrap">
                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="field">
              <span>Password</span>

              <div className="input-wrap">
                <LockKeyhole size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="form-options">
              <label className="remember">
                <input type="checkbox" />
                <span className="custom-check">✓</span>
                Remember me
              </label>

              <button
                type="button"
                className="forgot-link"
                onClick={() =>
                  alert("Password reset API එක මෙතැනට connect කරන්න.")
                }
              >
                Forgot Password?
              </button>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              <span>{loading ? "Signing in..." : "Login to NariCraft"}</span>

              {!loading && <ArrowRight size={19} />}

              {loading && <span className="spinner" />}
            </button>
          </form>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* =================================================
              GOOGLE LOGIN
          ================================================= */}

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                toast.error("Google login failed");
              }}
              theme="outline"
              size="large"
              shape="pill"
              text="signin_with"
              logo_alignment="left"
              width="350"
            />
          </div>

          <p className="switch-text pt-3">
            Account එකක් නැද්ද? <Link to="/register">Create an account</Link>
          </p>

          <p className="terms-note">
            Login කිරීමෙන් NariCraft හි Terms & Privacy Policy වලට එකඟ වේ.
          </p>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, sub }) {
  return (
    <div>
      <span>{icon}</span>

      <p>
        <b>{title}</b>

        <small>{sub}</small>
      </p>
    </div>
  );
}
