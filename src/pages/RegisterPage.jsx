import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import { Eye, EyeOff, Mail, LockKeyhole, UserRound, Phone, ArrowRight, Sparkles, Scissors, Ruler, CheckCircle2 } from "lucide-react";
import "./AuthPages.css";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!terms) return alert("කරුණාකර Terms & Privacy Policy එකට එකඟ වෙන්න.");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Register API එක backend එකට connect කළාම මෙතැනින් account එක create වෙනවා.");
    }, 800); 
  };

  return (
    <main className="auth-page register-page">
      <div className="auth-orb auth-orb-one" /><div className="auth-orb auth-orb-two" />
      <div className="auth-particle particle-one" /><div className="auth-particle particle-two" /><div className="auth-particle particle-three" />

      <section className="auth-shell register-shell">
        <div className="auth-brand-panel">
          <div className="brand-glow" />
          <Link to="/" className="auth-logo"><span className="auth-logo-mark">NC</span><span><strong>Nari<span>Craft</span></strong><small>TAILORED FOR YOU</small></span></Link>
          <div className="brand-copy">
            <div className="brand-badge"><Sparkles size={15}/> Welcome to NariCraft</div>
            <h1>Create Your.<br/><em>Perfect Fit.</em></h1>
            <p>Account එකක් හදාගෙන ඔබේ designs save කරන්න, orders track කරන්න සහ ඔබේ custom measurements පහසුවෙන් manage කරන්න.</p>
            <div className="brand-features">
              <Feature icon={<Scissors size={17}/>} title="Save Your Designs" sub="ඔබේ favourite designs"/>
              <Feature icon={<Ruler size={17}/>} title="Save Measurements" sub="නැවත නැවත enter කරන්න ඕන නෑ"/>
              <Feature icon={<CheckCircle2 size={17}/>} title="Track Orders" sub="ඔබේ orders එක තැනකින්"/>
            </div>
          </div>
          <div className="brand-bottom"><span>✦</span> Crafted with love in Sri Lanka</div>
        </div>

        <div className="auth-form-panel register-form-panel">
          <div className="mobile-brand"><Link to="/" className="auth-logo"><span className="auth-logo-mark">NC</span><span><strong>Nari<span>Craft</span></strong><small>TAILORED FOR YOU</small></span></Link></div>
          <div className="form-heading">
            <span className="eyebrow">JOIN NARICRAFT</span>
            <h2>Account එකක් හදමු ✨</h2>
            <p>විස්තර ටිකක් දීලා ඔබේ NariCraft journey එක පටන් ගන්න.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="two-fields">
              <Field icon={<UserRound size={18}/>} label="Full Name" placeholder="Your name" type="text" auto="name"/>
              <Field icon={<Phone size={18}/>} label="Phone Number" placeholder="07X XXX XXXX" type="tel" auto="tel"/>
            </div>
            <label className="field"><span>Email Address</span><div className="input-wrap"><Mail size={18}/><input type="email" placeholder="you@example.com" autoComplete="email" required/></div></label>
            <div className="two-fields">
              <PasswordField label="Password" show={showPassword} setShow={setShowPassword} placeholder="Create password"/>
              <PasswordField label="Confirm Password" show={showConfirm} setShow={setShowConfirm} placeholder="Repeat password"/>
            </div>
            <label className="terms-check"><input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)}/><span className="custom-check">✓</span><span>I agree to the <b>Terms & Conditions</b> and <b>Privacy Policy</b>.</span></label>
            <button className="auth-submit" type="submit" disabled={loading}><span>{loading ? "Creating account..." : "Create NariCraft Account"}</span>{!loading && <ArrowRight size={19}/>} {loading && <span className="spinner"/>}</button>
          </form>

          <div className="auth-divider"><span>OR</span></div>
          <p className="switch-text">දැනටමත් account එකක් තියෙනවද? <Link to="/login">Login කරන්න</Link></p>
          <p className="terms-note">Your information will be used only to provide NariCraft services.</p>
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, sub }) { return <div><span>{icon}</span><p><b>{title}</b><small>{sub}</small></p></div>; }

function Field({ icon, label, placeholder, type, auto }) {
  return <label className="field"><span>{label}</span><div className="input-wrap">{icon}<input type={type} placeholder={placeholder} autoComplete={auto} required/></div></label>;
}

function PasswordField({ label, show, setShow, placeholder }) {
  return <label className="field"><span>{label}</span><div className="input-wrap"><LockKeyhole size={18}/><input type={show ? "text" : "password"} placeholder={placeholder} minLength={6} required/><button type="button" className="password-toggle" onClick={() => setShow(v => !v)}>{show ? <EyeOff size={18}/> : <Eye size={18}/>}</button></div></label>;
}
