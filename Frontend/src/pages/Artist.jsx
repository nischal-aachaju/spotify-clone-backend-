import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

// ── tiny helpers ──────────────────────────────────────────────────────────────
const api = (method, url, data, config = {}) =>
  axios({ method, url: `${API}${url}`, data, withCredentials: true, ...config });

// ── icons (inline SVG, no extra deps) ────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  music:  "M9 18V5l12-2v13",
  album:  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  list:   "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  note:   "M9 18V5l12-2v13M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 19a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  check:  "M20 6L9 17l-5-5",
  x:      "M18 6L6 18M6 6l12 12",
  plus:   "M12 5v14M5 12h14",
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 1000, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "error" ? "#ff4757" : "#2ed573",
          color: "#fff", padding: "12px 20px", borderRadius: 10,
          fontFamily: "'DM Mono', monospace", fontSize: 13,
          boxShadow: "0 4px 24px #0005",
          animation: "slideIn .25s ease",
          display: "flex", alignItems: "center", gap: 8
        }}>
          <Icon d={t.type === "error" ? Icons.x : Icons.check} size={16} />
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Sidebar Tab ───────────────────────────────────────────────────────────────
function Tab({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px", borderRadius: 10, border: "none",
      background: active ? "rgba(255,200,60,.13)" : "transparent",
      color: active ? "#ffc83c" : "#888",
      fontFamily: "'DM Mono', monospace", fontSize: 13,
      cursor: "pointer", width: "100%", textAlign: "left",
      borderLeft: active ? "3px solid #ffc83c" : "3px solid transparent",
      transition: "all .2s",
    }}>
      <Icon d={Icons[icon]} size={18} />
      {label}
    </button>
  );
}

// ── Upload Music Panel ────────────────────────────────────────────────────────
function UploadMusic({ toast }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const handleFile = (f) => { if (f) setFile(f); };

  const submit = async () => {
    if (!title || !file) return toast("Title and audio file are required", "error");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("music", file);
      await api("post", "/music/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast("Track uploaded successfully 🎵");
      setTitle(""); setFile(null);
    } catch (e) {
      toast(e.response?.data?.message || "Upload failed", "error");
    } finally { setLoading(false); }
  };

  return (
    <Section title="Upload New Track" icon="upload">
      <label style={label}>Track Title</label>
      <input style={input} placeholder="e.g. Midnight Drive" value={title}
        onChange={e => setTitle(e.target.value)} />

      <label style={label}>Audio File</label>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${drag ? "#ffc83c" : "#333"}`,
          borderRadius: 12, padding: "32px 20px", textAlign: "center",
          cursor: "pointer", transition: "all .2s",
          background: drag ? "rgba(255,200,60,.05)" : "#0d0d0d",
          color: file ? "#ffc83c" : "#555",
          fontFamily: "'DM Mono', monospace", fontSize: 13, marginBottom: 20,
        }}>
        <Icon d={Icons.note} size={28} />
        <p style={{ margin: "8px 0 0" }}>
          {file ? `✓ ${file.name}` : "Drop audio file here or click to browse"}
        </p>
        <input ref={inputRef} type="file" accept="audio/*" style={{ display: "none" }}
          onChange={e => handleFile(e.target.files[0])} />
      </div>

      <Btn onClick={submit} loading={loading} label="Upload Track" />
    </Section>
  );
}

// ── Create Album Panel ────────────────────────────────────────────────────────
function CreateAlbum({ toast }) {
  const [title, setTitle] = useState("");
  const [musicIds, setMusicIds] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!title) return toast("Album title is required", "error");
    const musics = musicIds.split(",").map(s => s.trim()).filter(Boolean);
    setLoading(true);
    try {
      await api("post", "/music/album", { title, musics });
      toast("Album created successfully 🎼");
      setTitle(""); setMusicIds("");
    } catch (e) {
      toast(e.response?.data?.message || "Failed to create album", "error");
    } finally { setLoading(false); }
  };

  return (
    <Section title="Create Album" icon="album">
      <label style={label}>Album Title</label>
      <input style={input} placeholder="e.g. Neon Nights Vol.1" value={title}
        onChange={e => setTitle(e.target.value)} />

      <label style={label}>Music IDs <span style={{ color: "#555" }}>(comma-separated)</span></label>
      <textarea style={{ ...input, height: 90, resize: "vertical" }}
        placeholder="64abc..., 64def..., 64ghi..."
        value={musicIds} onChange={e => setMusicIds(e.target.value)} />
      <p style={{ color: "#555", fontSize: 12, fontFamily: "'DM Mono',monospace", marginBottom: 20 }}>
        Copy Music IDs from "My Tracks" tab below.
      </p>

      <Btn onClick={submit} loading={loading} label="Create Album" />
    </Section>
  );
}

// ── My Tracks Panel ───────────────────────────────────────────────────────────
function MyTracks({ toast }) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    api("get", "/music/")
      .then(r => setTracks(r.data.music))
      .catch(() => toast("Failed to load tracks", "error"))
      .finally(() => setLoading(false));
  }, []);

  const copy = (id) => {
    navigator.clipboard.writeText(id);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  if (loading) return <Loader />;

  return (
    <Section title="All Tracks" icon="list">
      {tracks.length === 0
        ? <Empty msg="No tracks yet. Upload your first one!" />
        : tracks.map(t => (
          <TrackCard key={t._id} track={t} copied={copied === t._id}
            onCopy={() => copy(t._id)} />
        ))}
    </Section>
  );
}

function TrackCard({ track, onCopy, copied }) {
  const [playing, setPlaying] = useState(false);
  const audio = useRef(null);

  const togglePlay = () => {
    if (!audio.current) return;
    playing ? audio.current.pause() : audio.current.play();
    setPlaying(!playing);
  };

  return (
    <div style={{
      background: "#0d0d0d", border: "1px solid #1e1e1e",
      borderRadius: 12, padding: "16px 20px", marginBottom: 12,
      display: "flex", alignItems: "center", gap: 16,
    }}>
      <button onClick={togglePlay} style={{
        width: 42, height: 42, borderRadius: "50%",
        background: playing ? "#ffc83c22" : "#ffc83c",
        border: "none", cursor: "pointer", color: playing ? "#ffc83c" : "#111",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, fontSize: 18, transition: "all .2s",
      }}>
        {playing ? "⏸" : "▶"}
      </button>
      <audio ref={audio} src={track.uri} onEnded={() => setPlaying(false)} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, color: "#f0f0f0", fontFamily: "'DM Serif Display', serif", fontSize: 16 }}>
          {track.title}
        </p>
        <p style={{ margin: "2px 0 0", color: "#555", fontSize: 12, fontFamily: "'DM Mono',monospace" }}>
          {track.artist?.username || "You"}
        </p>
      </div>

      <button onClick={onCopy} title="Copy ID" style={{
        background: "none", border: "1px solid #2a2a2a", borderRadius: 8,
        color: copied ? "#2ed573" : "#555", cursor: "pointer",
        padding: "6px 12px", fontSize: 11, fontFamily: "'DM Mono',monospace",
        transition: "all .2s",
      }}>
        {copied ? "Copied!" : "Copy ID"}
      </button>
    </div>
  );
}

// ── My Albums Panel ───────────────────────────────────────────────────────────
function MyAlbums({ toast }) {
  const [albums, setAlbums] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [detail, setDetail] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("get", "/music/album")
      .then(r => setAlbums(r.data.album))
      .catch(() => toast("Failed to load albums", "error"))
      .finally(() => setLoading(false));
  }, []);

  const loadDetail = async (id) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (detail[id]) return;
    try {
      const r = await api("get", `/music/album/${id}`);
      setDetail(d => ({ ...d, [id]: r.data.music }));
    } catch { toast("Failed to load album", "error"); }
  };

  if (loading) return <Loader />;

  return (
    <Section title="My Albums" icon="album">
      {albums.length === 0
        ? <Empty msg="No albums yet. Create your first one!" />
        : albums.map(a => (
          <div key={a._id} style={{
            background: "#0d0d0d", border: "1px solid #1e1e1e",
            borderRadius: 12, marginBottom: 12, overflow: "hidden",
          }}>
            <div onClick={() => loadDetail(a._id)} style={{
              padding: "16px 20px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: "linear-gradient(135deg,#ffc83c,#ff6b35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, flexShrink: 0,
              }}>🎵</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: "#f0f0f0", fontFamily: "'DM Serif Display',serif", fontSize: 16 }}>
                  {a.title}
                </p>
                <p style={{ margin: "2px 0 0", color: "#555", fontSize: 12, fontFamily: "'DM Mono',monospace" }}>
                  by {a.artist?.username || "You"}
                </p>
              </div>
              <span style={{ color: "#444", fontSize: 18 }}>{expanded === a._id ? "▲" : "▼"}</span>
            </div>

            {expanded === a._id && detail[a._id] && (
              <div style={{ borderTop: "1px solid #1e1e1e", padding: "12px 20px 16px" }}>
                {detail[a._id].musics?.length
                  ? detail[a._id].musics.map((m, i) => (
                    <div key={i} style={{
                      padding: "8px 0", borderBottom: "1px solid #151515",
                      color: "#888", fontSize: 13, fontFamily: "'DM Mono',monospace",
                      display: "flex", gap: 10, alignItems: "center",
                    }}>
                      <span style={{ color: "#ffc83c" }}>{i + 1}.</span>
                      {m.title || m}
                    </div>
                  ))
                  : <p style={{ color: "#444", fontFamily: "'DM Mono',monospace", fontSize: 13 }}>No tracks linked yet.</p>
                }
              </div>
            )}
          </div>
        ))}
    </Section>
  );
}

// ── Shared primitives ─────────────────────────────────────────────────────────
const label = {
  display: "block", color: "#777", fontSize: 11,
  fontFamily: "'DM Mono', monospace", marginBottom: 6,
  textTransform: "uppercase", letterSpacing: 1,
};

const input = {
  width: "100%", background: "#0d0d0d", border: "1px solid #1e1e1e",
  borderRadius: 10, padding: "12px 14px", color: "#f0f0f0",
  fontFamily: "'DM Mono', monospace", fontSize: 14,
  outline: "none", marginBottom: 18, boxSizing: "border-box",
};

function Section({ title, icon, children }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <span style={{ color: "#ffc83c" }}><Icon d={Icons[icon]} size={20} /></span>
        <h2 style={{ margin: 0, fontFamily: "'DM Serif Display', serif", color: "#f0f0f0", fontSize: 22 }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function Btn({ onClick, loading, label }) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      background: loading ? "#2a2a2a" : "linear-gradient(90deg,#ffc83c,#ff8c00)",
      border: "none", borderRadius: 10, padding: "14px 28px",
      color: loading ? "#555" : "#111", fontFamily: "'DM Mono', monospace",
      fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
      transition: "all .2s", letterSpacing: .5,
    }}>
      {loading ? "Working…" : label}
    </button>
  );
}

function Loader() {
  return (
    <div style={{ textAlign: "center", padding: 40, color: "#444",
      fontFamily: "'DM Mono',monospace", fontSize: 13 }}>
      Loading…
    </div>
  );
}

function Empty({ msg }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", color: "#333",
      fontFamily: "'DM Mono',monospace", fontSize: 13 }}>
      <div style={{ fontSize: 32, marginBottom: 12 }}>🎵</div>
      {msg}
    </div>
  );
}

// ── Main Artist Dashboard ─────────────────────────────────────────────────────
export default function Artist() {
  const [tab, setTab] = useState("upload");
  const [toasts, setToasts] = useState([]);

  const toast = (message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };

  const tabs = [
    { id: "upload", icon: "upload", label: "Upload Track" },
    { id: "album",  icon: "album",  label: "Create Album" },
    { id: "tracks", icon: "list",   label: "My Tracks"    },
    { id: "albums", icon: "note",   label: "My Albums"    },
  ];

  const panels = { upload: UploadMusic, album: CreateAlbum, tracks: MyTracks, albums: MyAlbums };
  const Panel = panels[tab];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #080808; }
        @keyframes slideIn { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
        input:focus, textarea:focus { border-color: #ffc83c !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0d0d0d; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 4px; }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Mono', monospace" }}>

        {/* Sidebar */}
        <aside style={{
          width: 230, background: "#0a0a0a", borderRight: "1px solid #141414",
          padding: "32px 16px", display: "flex", flexDirection: "column",
          position: "sticky", top: 0, height: "100vh",
        }}>
          <div style={{ marginBottom: 36, paddingLeft: 8 }}>
            <div style={{ fontSize: 22, marginBottom: 2 }}>🎛</div>
            <h1 style={{ margin: 0, fontFamily: "'DM Serif Display',serif", color: "#f0f0f0", fontSize: 20 }}>
              Artist Studio
            </h1>
            <p style={{ margin: "4px 0 0", color: "#444", fontSize: 11 }}>Dashboard</p>
          </div>

          <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {tabs.map(t => (
              <Tab key={t.id} {...t} active={tab === t.id} onClick={() => setTab(t.id)} />
            ))}
          </nav>

          <div style={{ marginTop: "auto", paddingLeft: 8 }}>
            <div style={{ width: "100%", height: 1, background: "#141414", marginBottom: 16 }} />
            <p style={{ margin: 0, color: "#333", fontSize: 11 }}>Powered by your beats 🎶</p>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "48px 56px", overflowY: "auto" }}>
          <Panel toast={toast} />
        </main>
      </div>

      <Toast toasts={toasts} />
    </>
  );
}