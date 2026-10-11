import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  UserRound,
  Phone,
  ArrowRight,
  Sparkles,
  Scissors,
  Ruler,
  CheckCircle2,
} from "lucide-react";

import "./AuthPages.css";

import axios from "axios";

import toast from "react-hot-toast";

import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [terms, setTerms] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // NORMAL REGISTER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!terms) {
      toast.error("Please agree to the Terms & Privacy Policy");

      return;
    }

    const form = e.target;

    const password = form.password.value;

    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");

      return;
    }

    try {
      setLoading(true);

      await axios.post(
        import.meta.env.VITE_API_URL + "/api/users",

        {
          fullName: form.fullName.value,

          telephone: form.telephone.value,

          email: form.email.value,

          password: password,
        },
      );

      toast.success("Account created successfully!");

      navigate("/login");
    } catch (error) {
      console.log("Register Error:", error);

      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE REGISTER / LOGIN
  // =====================================================

  async function handleGoogleRegister(credentialResponse) {
    if (!credentialResponse.credential) {
      toast.error("Google sign up failed");

      return;
    }

    if (!terms) {
      toast.error("Please agree to the Terms & Privacy Policy first");

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

      toast.success("Google account connected successfully!");

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("Google Register Error:", error);

      toast.error(error.response?.data?.message || "Google sign up failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page register-page">
      <div className="auth-orb auth-orb-one" />

      <div className="auth-orb auth-orb-two" />

      <div className="auth-particle particle-one" />

      <div className="auth-particle particle-two" />

      <div className="auth-particle particle-three" />

      <section className="auth-shell register-shell">
        {/* =================================================
            LEFT PANEL
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
              Welcome to NariCraft
            </div>

            <h1>
              Create Your.
              <br />
              <em>Perfect Fit.</em>
            </h1>

            <p>
              Account එකක් හදාගෙන ඔබේ designs save කරන්න, orders track කරන්න සහ
              ඔබේ custom measurements පහසුවෙන් manage කරන්න.
            </p>

            <div className="brand-features">
              <Feature
                icon={<Scissors size={17} />}
                title="Save Your Designs"
                sub="ඔබේ favourite designs"
              />

              <Feature
                icon={<Ruler size={17} />}
                title="Save Measurements"
                sub="නැවත නැවත enter කරන්න ඕන නෑ"
              />

              <Feature
                icon={<CheckCircle2 size={17} />}
                title="Track Orders"
                sub="ඔබේ orders එක තැනකින්"
              />
            </div>
          </div>

          <div className="brand-bottom">
            <span>✦</span>
            Crafted with love in Sri Lanka
          </div>
        </div>

        {/* =================================================
            REGISTER PANEL
        ================================================= */}

        <div className="auth-form-panel register-form-panel">
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
            <span className="eyebrow">JOIN NARICRAFT</span>

            <h2>Account එකක් හදමු ✨</h2>

            <p>විස්තර ටිකක් දීලා ඔබේ NariCraft journey එක පටන් ගන්න.</p>
          </div>

          {/* =================================================
              NORMAL REGISTER FORM
          ================================================= */}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="two-fields">
              {/* NAME */}

              <label className="field">
                <span>Full Name</span>

                <div className="input-wrap">
                  <UserRound size={18} />

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your name"
                    autoComplete="name"
                    required
                  />
                </div>
              </label>

              {/* PHONE */}

              <label className="field">
                <span>Phone Number</span>

                <div className="input-wrap">
                  <Phone size={18} />

                  <input
                    type="tel"
                    name="telephone"
                    placeholder="07X XXX XXXX"
                    autoComplete="tel"
                    required
                  />
                </div>
              </label>
            </div>

            {/* EMAIL */}

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

            <div className="two-fields">
              {/* PASSWORD */}

              <PasswordField
                name="password"
                label="Password"
                show={showPassword}
                setShow={setShowPassword}
                placeholder="Create password"
              />

              {/* CONFIRM PASSWORD */}

              <PasswordField
                name="confirmPassword"
                label="Confirm Password"
                show={showConfirm}
                setShow={setShowConfirm}
                placeholder="Repeat password"
              />
            </div>

            {/* TERMS */}

            <label className="terms-check">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
              />

              <span className="custom-check">✓</span>

              <span>
                I agree to the <b>Terms & Conditions</b> and{" "}
                <b>Privacy Policy</b>.
              </span>
            </label>

            {/* SUBMIT */}

            <button className="auth-submit" type="submit" disabled={loading}>
              <span>
                {loading ? "Creating account..." : "Create NariCraft Account"}
              </span>

              {!loading && <ArrowRight size={19} />}

              {loading && <span className="spinner" />}
            </button>
          </form>

          {/* DIVIDER */}

          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* =================================================
              GOOGLE
          ================================================= */}

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleRegister}
              onError={() => {
                toast.error("Google sign up failed");
              }}
              theme="outline"
              size="large"
              shape="pill"
              text="signup_with"
              logo_alignment="left"
              width="350"
            />
          </div>

          <p className="switch-text pt-3">
            දැනටමත් account එකක් තියෙනවද? <Link to="/login">Login කරන්න</Link>
          </p>

          <p className="terms-note">
            Your information will be used only to provide NariCraft services.
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

function PasswordField({ name, label, show, setShow, placeholder }) {
  return (
    <label className="field">
      <span>{label}</span>

      <div className="input-wrap">
        <LockKeyhole size={18} />

        <input
          type={show ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          minLength={6}
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShow((v) => !v)}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}
