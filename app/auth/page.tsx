"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/";
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    setError("");
    if (!fullName.trim()) { setError("Please enter your full name."); setLoading(false); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); setLoading(false); return; }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            full_name: fullName,
            email,
          },
          { onConflict: 'id' }
        );

      if (profileError) {
        console.error("Profile insert/update error:", profileError.message);
      }

      setSuccess("Account created! Check your email to confirm, then sign in.");
      setTab("signin");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#0a0a0a",
      fontFamily: "'Segoe UI', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 16px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* Background hero image with overlay */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "url('/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "brightness(0.45)",
        zIndex: 0,
      }} />

      {/* Gold glow top */}
      <div style={{
        position: "fixed",
        top: -100,
        left: "50%",
        transform: "translateX(-50%)",
        width: 400,
        height: 300,
        background: "radial-gradient(ellipse, rgba(245,166,35,0.15) 0%, transparent 70%)",
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🛍️</div>
          <div>
            <span style={{ fontWeight: 900, fontSize: 30, color: "#fff", letterSpacing: -1 }}>Agri</span>
            <span style={{ fontWeight: 900, fontSize: 30, color: "#f5a623", letterSpacing: -1 }}>quex</span>
          </div>
          <p style={{ color: "#666", fontSize: 13, margin: "6px 0 0", letterSpacing: 1 }}>
            YOUR ONE-STOP ONLINE STORE
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(0,0,0,0.35)",
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.08)",
          overflow: "hidden",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {(["signin", "signup"] as const).map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); setSuccess(""); }}
                style={{
                  flex: 1,
                  padding: "16px 0",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 700,
                  color: tab === t ? "#f5a623" : "#444",
                  borderBottom: tab === t ? "2px solid #f5a623" : "2px solid transparent",
                  transition: "all 0.2s",
                  letterSpacing: 0.5,
                }}
              >
                {t === "signin" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          {/* Form */}
          <div style={{ padding: "28px 24px" }}>

            {/* Success message */}
            {success && (
              <div style={{ background: "rgba(39,174,96,0.15)", border: "1px solid #27ae60", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "#27ae60", fontSize: 13 }}>
                ✅ {success}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div style={{ background: "rgba(231,76,60,0.15)", border: "1px solid #e74c3c", borderRadius: 12, padding: "12px 16px", marginBottom: 20, color: "#e74c3c", fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            {/* Full name (signup only) */}
            {tab === "signup" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8, letterSpacing: 0.5 }}>FULL NAME</label>
                <input
                  type="text"
                  placeholder="John Mensah"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    padding: "13px 16px",
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#f5a623"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                />
              </div>
            )}

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#aaa", marginBottom: 8, letterSpacing: 0.5 }}>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 12,
                  padding: "13px 16px",
                  color: "#fff",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#f5a623"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#888", marginBottom: 8, letterSpacing: 0.5 }}>PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={tab === "signup" ? "Min. 6 characters" : "Enter your password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (tab === "signin" ? handleSignIn() : handleSignUp())}
                  style={{
                    width: "100%",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12,
                    padding: "13px 48px 13px 16px",
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "#f5a623"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 16 }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {tab === "signin" && (
                <div style={{ textAlign: "right", marginTop: 8 }}>
                  <a href="/auth/reset" style={{ color: "#f5a623", fontSize: 12, textDecoration: "none", fontWeight: 600 }}>Forgot password?</a>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              onClick={tab === "signin" ? handleSignIn : handleSignUp}
              disabled={loading}
              style={{
                width: "100%",
                background: loading ? "#333" : "linear-gradient(135deg, #f5a623, #e8941a)",
                color: loading ? "#666" : "#000",
                border: "none",
                borderRadius: 14,
                padding: "15px 0",
                fontSize: 15,
                fontWeight: 900,
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: 0.5,
                transition: "all 0.2s",
                boxShadow: loading ? "none" : "0 4px 20px rgba(245,166,35,0.3)",
              }}
            >
              {loading ? "Please wait..." : tab === "signin" ? "Sign In →" : "Create Account →"}
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
              <span style={{ color: "#888", fontSize: 12 }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            </div>

            {/* Switch tab */}
            <p style={{ textAlign: "center", color: "#555", fontSize: 13, margin: 0 }}>
              {tab === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => { setTab(tab === "signin" ? "signup" : "signin"); setError(""); setSuccess(""); }}
                style={{ background: "none", border: "none", color: "#f5a623", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
              >
                {tab === "signin" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", color: "#333", fontSize: 11, marginTop: 24, letterSpacing: 0.5 }}>
          By continuing you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
}
