import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", role: "user", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await axios.post("http://localhost:3000/api/auth/login", formData, { withCredentials: true });
      setMessage({ text: "Welcome back 🎵", type: "success" });
      setTimeout(() => navigate(formData.role === "artist" ? "/artist" : "/"), 1000);
    } catch (error) {
      setMessage({ text: error.response?.data?.message || "Invalid credentials", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    background: focused === name ? "#111" : "#0a0a0a",
    border: `1px solid ${focused === name ? "#ffc83c" : "#1e1e1e"}`,
    borderRadius: 10,
    padding: "13px 16px",
    color: "#f0f0f0",
    fontFamily: "'DM Mono', monospace",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "all .2s",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; }
        ::placeholder { color: #333; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: .4; transform: scale(1); }
          50%       { opacity: .7; transform: scale(1.05); }
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#080808",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Mono', monospace", padding: 20, position: "relative", overflow: "hidden",
      }}>

        {/* Background blobs */}
        {[
          { size: 400, top: "-10%", left: "-10%", color: "#ffc83c" },
          { size: 300, bottom: "-5%", right: "-5%", color: "#ff6b35" },
          { size: 200, top: "40%", right: "15%", color: "#ffc83c" },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute", width: b.size, height: b.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.color}18 0%, transparent 70%)`,
            top: b.top, left: b.left, right: b.right, bottom: b.bottom,
            animation: `pulse ${3 + i}s ease-in-out infinite`,
            pointerEvents: "none",
          }} />
        ))}

        {/* Card */}
        <div style={{
          width: "100%", maxWidth: 420,
          background: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(20px)",
          border: "1px solid #1a1a1a",
          borderRadius: 20, padding: "44px 40px",
          animation: "fadeUp .5s ease both",
          position: "relative", zIndex: 1,
          boxShadow: "0 30px 80px #0009",
        }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 16, margin: "0 auto 16px",
              background: "linear-gradient(135deg, #ffc83c, #ff6b35)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, boxShadow: "0 8px 24px #ffc83c33",
            }}>🎛</div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              color: "#f0f0f0", fontSize: 26, marginBottom: 6,
            }}>Welcome back</h1>
            <p style={{ color: "#444", fontSize: 12, letterSpacing: .5 }}>
              Sign in to your studio
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Role toggle */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>I am a</label>
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr",
                gap: 8, background: "#0d0d0d",
                border: "1px solid #1e1e1e", borderRadius: 12, padding: 6,
              }}>
                {["user", "artist"].map((r) => (
                  <button key={r} type="button"
                    onClick={() => setFormData({ ...formData, role: r })}
                    style={{
                      padding: "10px 0", borderRadius: 8, border: "none",
                      fontFamily: "'DM Mono', monospace", fontSize: 13,
                      cursor: "pointer", transition: "all .2s",
                      background: formData.role === r
                        ? "linear-gradient(90deg,#ffc83c,#ff8c00)"
                        : "transparent",
                      color: formData.role === r ? "#111" : "#444",
                      fontWeight: formData.role === r ? 700 : 400,
                    }}>
                    {r === "user" ? "🎧 Listener" : "🎤 Artist"}
                  </button>
                ))}
              </div>
            </div>

            {/* Username */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Username</label>
              <input
                type="text" name="username" placeholder="your_username"
                value={formData.username} onChange={handleChange}
                onFocus={() => setFocused("username")}
                onBlur={() => setFocused("")}
                style={inputStyle("username")}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                style={inputStyle("email")}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"}
                  name="password" placeholder="••••••••"
                  value={formData.password} onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  required
                  style={{ ...inputStyle("password"), paddingRight: 48 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    color: "#444", cursor: "pointer", fontSize: 16, lineHeight: 1,
                  }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
              background: loading ? "#1a1a1a" : "linear-gradient(90deg, #ffc83c, #ff8c00)",
              color: loading ? "#444" : "#111",
              fontFamily: "'DM Mono', monospace", fontSize: 14, fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all .2s", letterSpacing: .5,
              boxShadow: loading ? "none" : "0 4px 20px #ffc83c44",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}>
              {loading && (
                <span style={{
                  width: 16, height: 16, borderRadius: "50%",
                  border: "2px solid #333", borderTopColor: "#ffc83c",
                  animation: "spin .7s linear infinite", display: "inline-block",
                }} />
              )}
              {loading ? "Signing in…" : "Sign In"}
            </button>

            {/* Message */}
            {message.text && (
              <div style={{
                marginTop: 18, padding: "12px 16px", borderRadius: 10,
                background: message.type === "error" ? "#ff475722" : "#2ed57322",
                border: `1px solid ${message.type === "error" ? "#ff475744" : "#2ed57344"}`,
                color: message.type === "error" ? "#ff6b6b" : "#2ed573",
                fontSize: 13, textAlign: "center",
                animation: "fadeUp .3s ease",
              }}>
                {message.text}
              </div>
            )}

          </form>

          {/* Footer */}
          <p style={{ textAlign: "center", color: "#2a2a2a", fontSize: 11, marginTop: 32 }}>
            Your studio. Your sound. 🎵
          </p>
        </div>
      </div>
    </>
  );
};

const labelStyle = {
  display: "block", color: "#555", fontSize: 11,
  textTransform: "uppercase", letterSpacing: 1, marginBottom: 8,
};

export default Login;