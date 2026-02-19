import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const API = "http://localhost:3000/api";

// ── Audio Player ──────────────────────────────────────────────────────────────
function AudioPlayer({ src, title, artist }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const toggle = () => {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
    setPlaying(!playing);
  };

  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a) return;
    setCurrentTime(a.currentTime);
    setProgress((a.currentTime / a.duration) * 100 || 0);
  };

  const onLoadedMetadata = () => setDuration(audioRef.current?.duration || 0);
  const onEnded = () => setPlaying(false);

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = pct * audioRef.current.duration;
    }
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div style={{
      background: "#0d0d0d", border: "1px solid #1e1e1e",
      borderRadius: 16, padding: "18px 20px",
      transition: "border-color .2s, box-shadow .2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#ffc83c44"; e.currentTarget.style.boxShadow = "0 8px 32px #ffc83c11"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <audio ref={audioRef} src={src}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded} />

      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
        {/* Play button */}
        <button onClick={toggle} style={{
          width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
          background: playing ? "rgba(255,200,60,.15)" : "linear-gradient(135deg,#ffc83c,#ff8c00)",
          border: playing ? "1px solid #ffc83c" : "none",
          color: playing ? "#ffc83c" : "#111",
          cursor: "pointer", fontSize: 16,
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all .2s", boxShadow: playing ? "none" : "0 4px 14px #ffc83c33",
        }}>
          {playing ? "⏸" : "▶"}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0, color: "#f0f0f0", fontFamily: "'DM Serif Display', serif",
            fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{title}</p>
          {artist && (
            <p style={{ margin: "2px 0 0", color: "#555", fontSize: 11, fontFamily: "'DM Mono',monospace" }}>
              {artist}
            </p>
          )}
        </div>

        <span style={{ color: "#444", fontSize: 11, fontFamily: "'DM Mono',monospace", flexShrink: 0 }}>
          {fmt(currentTime)} / {fmt(duration)}
        </span>
      </div>

      {/* Progress bar */}
      <div onClick={seek} style={{
        height: 4, background: "#1e1e1e", borderRadius: 4, cursor: "pointer", position: "relative",
      }}>
        <div style={{
          height: "100%", borderRadius: 4, width: `${progress}%`,
          background: "linear-gradient(90deg,#ffc83c,#ff8c00)",
          transition: "width .1s linear",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: `${progress}%`,
          transform: "translate(-50%,-50%)",
          width: 10, height: 10, borderRadius: "50%",
          background: "#ffc83c", boxShadow: "0 0 8px #ffc83c88",
          opacity: progress > 0 ? 1 : 0,
        }} />
      </div>
    </div>
  );
}

// ── Album Card ────────────────────────────────────────────────────────────────
const GRADIENTS = [
  "linear-gradient(135deg,#ffc83c,#ff6b35)",
  "linear-gradient(135deg,#a855f7,#ec4899)",
  "linear-gradient(135deg,#06b6d4,#3b82f6)",
  "linear-gradient(135deg,#10b981,#059669)",
  "linear-gradient(135deg,#f97316,#ef4444)",
  "linear-gradient(135deg,#8b5cf6,#6366f1)",
];

function AlbumCard({ album, active, onClick, index }) {
  return (
    <div onClick={onClick} style={{
      background: active ? "rgba(255,200,60,.07)" : "#0d0d0d",
      border: `1px solid ${active ? "#ffc83c55" : "#1a1a1a"}`,
      borderRadius: 16, padding: 20, cursor: "pointer",
      transition: "all .25s",
      boxShadow: active ? "0 8px 32px #ffc83c18" : "none",
    }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = "#1a1a1a"; e.currentTarget.style.transform = "none"; } }}
    >
      <div style={{
        width: "100%", aspectRatio: "1", borderRadius: 12, marginBottom: 14,
        background: GRADIENTS[index % GRADIENTS.length],
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 36,
      }}>🎵</div>
      <p style={{
        margin: 0, color: "#f0f0f0", fontFamily: "'DM Serif Display',serif",
        fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{album.title}</p>
      <p style={{ margin: "4px 0 0", color: "#555", fontSize: 11, fontFamily: "'DM Mono',monospace" }}>
        {album.artist?.username || "Unknown Artist"}
      </p>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
function SectionHeader({ emoji, title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 22 }}>{emoji}</span>
        <h2 style={{
          margin: 0, fontFamily: "'DM Serif Display',serif",
          color: "#f0f0f0", fontSize: 24,
        }}>{title}</h2>
      </div>
      {sub && <p style={{ margin: "0 0 0 32px", color: "#444", fontSize: 12, fontFamily: "'DM Mono',monospace" }}>{sub}</p>}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const HomePage = () => {
  const fallback = { uri: "https://ik.imagekit.io/fy96t9gbf/spotify/music/music1771253503026_wUu0t1QvZ", title: "Feri Jaalma" };

  const [musics, setMusics] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [loading, setLoading] = useState(true);
  const albumRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [musicRes, albumRes] = await Promise.all([
          axios.get(`${API}/music/`, { withCredentials: true }),
          axios.get(`${API}/music/album`, { withCredentials: true }),
        ]);
        setMusics(musicRes.data.music?.length ? musicRes.data.music : [fallback]);
        setAlbums(albumRes.data.album || []);
      } catch (e) {
        console.log(e);
        setMusics([fallback]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handleAlbumClick = async (id) => {
    if (selectedAlbumId === id) {
      setSelectedAlbum(null);
      setSelectedAlbumId(null);
      return;
    }
    try {
      const res = await axios.get(`${API}/music/album/${id}`, { withCredentials: true });
      setSelectedAlbum(res.data.music);
      setSelectedAlbumId(id);
      setTimeout(() => albumRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (e) { console.log(e); }
  };

  if (loading) return (
    <div style={{
      minHeight: "100vh", background: "#080808", display: "flex",
      alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: "50%",
        border: "3px solid #1e1e1e", borderTopColor: "#ffc83c",
        animation: "spin .8s linear infinite",
      }} />
      <p style={{ color: "#444", fontFamily: "'DM Mono',monospace", fontSize: 13 }}>Loading your music…</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Serif+Display&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080808; }
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #222; border-radius: 4px; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'DM Mono',monospace" }}>

        {/* Top nav */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(8,8,8,.85)", backdropFilter: "blur(16px)",
          borderBottom: "1px solid #111", padding: "16px 48px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span style={{ fontSize: 22 }}>🎛</span>
          <span style={{ fontFamily: "'DM Serif Display',serif", color: "#f0f0f0", fontSize: 20 }}>
            Studio
          </span>
          <div style={{ flex: 1 }} />
          <div style={{
            background: "linear-gradient(90deg,#ffc83c22,#ff6b3522)",
            border: "1px solid #ffc83c33", borderRadius: 20, padding: "6px 16px",
            color: "#ffc83c", fontSize: 11, letterSpacing: .5,
          }}>
            🟢 Live
          </div>
        </nav>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 32px" }}>

          {/* ── Tracks ── */}
          <section style={{ marginBottom: 64, animation: "fadeUp .5s ease both" }}>
            <SectionHeader emoji="🎵" title="Tracks" sub={`${musics.length} track${musics.length !== 1 ? "s" : ""} available`} />
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 14,
            }}>
              {musics.map((m, i) => (
                <AudioPlayer key={m._id || i} src={m.uri} title={m.title} artist={m.artist?.username} />
              ))}
            </div>
          </section>

          {/* ── Albums ── */}
          <section style={{ marginBottom: 48, animation: "fadeUp .5s .1s ease both" }}>
            <SectionHeader emoji="💿" title="Albums" sub="Click an album to explore its tracks" />
            {albums.length === 0
              ? <div style={{
                textAlign: "center", padding: "48px 0", color: "#2a2a2a",
                fontSize: 13, borderRadius: 16, border: "1px dashed #1a1a1a",
              }}>No albums yet</div>
              : <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 14,
              }}>
                {albums.map((a, i) => (
                  <AlbumCard key={a._id} album={a} index={i}
                    active={selectedAlbumId === a._id}
                    onClick={() => handleAlbumClick(a._id)} />
                ))}
              </div>
            }
          </section>

          {/* ── Selected Album ── */}
          {selectedAlbum && (
            <section ref={albumRef} style={{ animation: "fadeUp .4s ease both" }}>
              <div style={{
                background: "#0a0a0a", border: "1px solid #1e1e1e",
                borderRadius: 20, padding: "36px 32px",
              }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 16, flexShrink: 0,
                    background: GRADIENTS[albums.findIndex(a => a._id === selectedAlbumId) % GRADIENTS.length],
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                  }}>🎵</div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{
                      fontFamily: "'DM Serif Display',serif", color: "#f0f0f0",
                      fontSize: 26, margin: "0 0 4px",
                    }}>{selectedAlbum.title}</h2>
                    <p style={{ color: "#555", fontSize: 12 }}>by {selectedAlbum.artist?.username || "Unknown"}</p>
                    <p style={{ color: "#333", fontSize: 11, marginTop: 4 }}>
                      {selectedAlbum.musics?.length || 0} track{selectedAlbum.musics?.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button onClick={() => { setSelectedAlbum(null); setSelectedAlbumId(null); }} style={{
                    background: "none", border: "1px solid #1e1e1e", borderRadius: 10,
                    color: "#444", cursor: "pointer", padding: "8px 14px",
                    fontFamily: "'DM Mono',monospace", fontSize: 12,
                    transition: "all .2s",
                  }}
                    onMouseEnter={e => { e.target.style.borderColor = "#ff4757"; e.target.style.color = "#ff4757"; }}
                    onMouseLeave={e => { e.target.style.borderColor = "#1e1e1e"; e.target.style.color = "#444"; }}
                  >✕ Close</button>
                </div>

                {/* Tracks */}
                {!selectedAlbum.musics?.length
                  ? <p style={{ color: "#333", fontSize: 13, textAlign: "center", padding: "24px 0" }}>No tracks in this album</p>
                  : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
                    {selectedAlbum.musics.map((m, i) => (
                      <div key={m._id || i} style={{ position: "relative" }}>
                        <div style={{
                          position: "absolute", top: -8, left: -8, zIndex: 1,
                          width: 22, height: 22, borderRadius: "50%",
                          background: "linear-gradient(135deg,#ffc83c,#ff8c00)",
                          color: "#111", fontSize: 10, fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>{i + 1}</div>
                        <AudioPlayer src={m.uri} title={m.title} artist={selectedAlbum.artist?.username} />
                      </div>
                    ))}
                  </div>
                }
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;