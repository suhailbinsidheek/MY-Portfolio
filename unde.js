import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const STARS = Array.from({ length: 14 }, (_, i) => ({
  x: Math.random() * 88 + 2,
  y: Math.random() * 88 + 2,
  d: (Math.random() * 3 + 1.5).toFixed(1),
  s: (Math.random() * 0.5 + 0.25).toFixed(2),
  drift: i % 2 === 0,
}));

const CODE_FLOATS = [
  { text: "<Building/>", top: "9%", left: "3%", delay: "0s", dur: "7s" },
  { text: "npm install", top: "21%", right: "4%", delay: "1.2s", dur: "5.5s" },
  { text: 'git commit -m "✨"', bottom: "26%", left: "2%", delay: ".6s", dur: "8s" },
  { text: "const dreams = true;", bottom: "14%", right: "2%", delay: "2s", dur: "6.5s" },
];

const MATRIX_COLS = Array.from({ length: 8 }, (_, i) => ({
  left: `${8 + i * 11}%`,
  delay: `${(i * 0.4).toFixed(1)}s`,
  dur: `${(2 + Math.random() * 2).toFixed(1)}s`,
  chars: Array.from({ length: 6 }, () =>
    String.fromCharCode(0x30a0 + Math.floor(Math.random() * 96))
  ),
}));

// ─── keyframes injected once ───────────────────────────────────────────────
const CSS = `
@keyframes aurora{0%,100%{opacity:.6;transform:scale(1) rotate(0deg)}50%{opacity:1;transform:scale(1.06) rotate(1deg)}}
@keyframes twinkle{0%{opacity:.08;transform:scale(.7)}100%{opacity:.9;transform:scale(1.5)}}
@keyframes starDrift{0%{transform:translate(0,0)}100%{transform:translate(8px,-14px)}}
@keyframes cfGlow{0%{box-shadow:none;opacity:.5;color:#22d3ee}100%{box-shadow:0 0 14px rgba(34,211,238,.4);opacity:.95;color:#67e8f9}}
@keyframes spinCw{to{transform:rotate(360deg)}}
@keyframes spinCcw{to{transform:rotate(-360deg)}}
@keyframes gearPulse{0%{opacity:.2;filter:drop-shadow(0 0 0px #6366f1)}100%{opacity:.65;filter:drop-shadow(0 0 10px #6366f1)}}
@keyframes shadowBreathe{0%,100%{transform:translateX(-50%) scaleX(1);opacity:.6}50%{transform:translateX(-50%) scaleX(.82);opacity:.25}}
@keyframes steamLeft{0%{transform:translateY(0) translateX(0) scaleX(1);opacity:.7}50%{transform:translateY(-9px) translateX(-3px) scaleX(1.4);opacity:.35}100%{transform:translateY(-20px) translateX(-2px) scaleX(.7);opacity:0}}
@keyframes steamMid{0%{transform:translateY(0) scaleX(1);opacity:.7}50%{transform:translateY(-10px) scaleX(1.5);opacity:.3}100%{transform:translateY(-22px) scaleX(.6);opacity:0}}
@keyframes steamRight{0%{transform:translateY(0) translateX(0) scaleX(1);opacity:.7}50%{transform:translateY(-8px) translateX(3px) scaleX(1.3);opacity:.35}100%{transform:translateY(-18px) translateX(2px) scaleX(.8);opacity:0}}
@keyframes mugBob{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-5px) rotate(-2deg)}75%{transform:translateY(-8px) rotate(2deg)}}
@keyframes laptopFloat{0%,100%{transform:translateY(0) rotate(0deg)}25%{transform:translateY(-3px) rotate(.3deg)}50%{transform:translateY(-7px) rotate(0deg)}75%{transform:translateY(-3px) rotate(-.3deg)}}
@keyframes screenPulse{0%{box-shadow:0 0 30px 4px rgba(99,102,241,.12)}100%{box-shadow:0 0 60px 14px rgba(99,102,241,.3),0 0 22px 4px rgba(34,211,238,.18)}}
@keyframes laptopGlowFlicker{0%{filter:drop-shadow(0 0 12px rgba(99,102,241,.25))}40%{filter:drop-shadow(0 0 28px rgba(99,102,241,.6))}70%{filter:drop-shadow(0 0 18px rgba(34,211,238,.35))}100%{filter:drop-shadow(0 0 32px rgba(99,102,241,.55))}}
@keyframes codePulse{0%{opacity:.15;transform:scaleX(.97)}60%{opacity:.95;transform:scaleX(1.01)}100%{opacity:.5;transform:scaleX(1)}}
@keyframes blinkCursor{0%,100%{opacity:1}50%{opacity:0}}
@keyframes charBreathe{0%,100%{transform:translateY(0) scaleX(1)}30%{transform:translateY(-4px) scaleX(1.01)}50%{transform:translateY(-6px) scaleX(1)}70%{transform:translateY(-4px) scaleX(.99)}}
@keyframes typeLeft{from{transform:translateY(0) rotate(0deg)}to{transform:translateY(5px) rotate(-1.2deg)}}
@keyframes typeRight{from{transform:translateY(5px) rotate(1.2deg)}to{transform:translateY(0) rotate(0deg)}}
@keyframes eyeLook{0%,100%{transform:translateX(0)}20%{transform:translateX(2px)}40%{transform:translateX(-2px)}60%{transform:translateX(1px)}80%{transform:translateX(-1px)}}
@keyframes signSwing{0%,100%{transform:rotate(-1.8deg)}50%{transform:rotate(1.8deg)}}
@keyframes signBorderPulse{from{box-shadow:0 0 20px rgba(99,102,241,.15),inset 0 0 20px rgba(99,102,241,.04)}to{box-shadow:0 0 60px rgba(99,102,241,.38),0 0 22px rgba(34,211,238,.12),inset 0 0 38px rgba(99,102,241,.09)}}
@keyframes emojiBounce{0%,100%{transform:translateY(0) rotate(-5deg) scale(1)}30%{transform:translateY(-10px) rotate(4deg) scale(1.12)}60%{transform:translateY(-5px) rotate(-3deg) scale(1.06)}}
@keyframes titleShimmer{from{background-position:0% center}to{background-position:100% center}}
@keyframes progressShimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}
@keyframes tipPulse{from{box-shadow:0 0 4px 2px rgba(34,211,238,.4);opacity:.8}to{box-shadow:0 0 12px 6px rgba(34,211,238,.9);opacity:1}}
@keyframes tagAppear{from{opacity:0;transform:translateY(10px) scale(.88)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes pctGlow{from{text-shadow:none}to{text-shadow:0 0 10px #22d3ee}}
@keyframes entranceLeft{from{opacity:0;transform:translateX(-50px) scale(.88)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes entranceRight{from{opacity:0;transform:translateX(50px) scale(.88)}to{opacity:1;transform:translateX(0) scale(1)}}
@keyframes particleFly{0%{opacity:0;transform:translate(0,0) scale(0)}20%{opacity:1}80%{opacity:.7}100%{opacity:0;transform:translate(var(--px),var(--py)) scale(1.5)}}
@keyframes orbitRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes dotPop{0%,100%{transform:scale(1)}50%{transform:scale(1.6)}}
@keyframes floatUpFade{0%{opacity:0;transform:translateY(0) scale(.8)}20%{opacity:1}80%{opacity:.8}100%{opacity:0;transform:translateY(-40px) scale(1.1)}}
@keyframes matrixFall{0%{transform:translateY(-100%);opacity:0}10%{opacity:.8}90%{opacity:.4}100%{transform:translateY(400%);opacity:0}}
@keyframes waveRipple{0%{transform:scale(1);opacity:.7}100%{transform:scale(2.5);opacity:0}}
@keyframes headphoneVibing{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
`;

// ─── Sub-components ─────────────────────────────────────────────────────────

function StarField() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {STARS.map((s, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.s * 7}px`,
            height: `${s.s * 7}px`,
            borderRadius: "50%",
            background: "#a78bfa",
            animation: `twinkle ${s.d}s ease-in-out infinite alternate${
              s.drift ? `, starDrift ${15 + i}s ease-in-out infinite alternate` : ""
            }`,
          }}
        />
      ))}
    </div>
  );
}

function MatrixRain() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden", opacity: 0.18 }}>
      {MATRIX_COLS.map((col, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: col.left,
            top: 0,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontFamily: "monospace",
            fontSize: "11px",
            color: "#22d3ee",
            animation: `matrixFall ${col.dur} ${col.delay} linear infinite`,
          }}
        >
          {col.chars.map((c, j) => (
            <span key={j}>{c}</span>
          ))}
        </div>
      ))}
    </div>
  );
}

function Particles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        x: `${(Math.cos((i * Math.PI * 2) / 12) * 80).toFixed(0)}px`,
        y: `${(Math.sin((i * Math.PI * 2) / 12) * 80).toFixed(0)}px`,
        delay: `${(i * 0.25).toFixed(2)}s`,
        size: Math.random() * 4 + 2,
        color: i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#a78bfa" : "#6366f1",
      })),
    []
  );
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1 }}>
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "45%",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: p.color,
            "--px": p.x,
            "--py": p.y,
            animation: `particleFly ${3 + i * 0.2}s ${p.delay} ease-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

function CodeFloats() {
  return (
    <>
      {CODE_FLOATS.map((cf, i) => {
        const { text, dur, delay, ...pos } = cf;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              ...pos,
              zIndex: 1,
              pointerEvents: "none",
              fontFamily: "'Courier New', monospace",
              fontSize: "13px",
              color: "#22d3ee",
              background: "rgba(99,102,241,.12)",
              border: "1px solid rgba(99,102,241,.25)",
              padding: "5px 13px",
              borderRadius: "7px",
              whiteSpace: "nowrap",
              animationName: `cfGlow,cfFloat${i}`,
              animationDuration: `3s,${dur}`,
              animationDelay: `0s,${delay}`,
              animationTimingFunction: "ease-in-out,ease-in-out",
              animationIterationCount: "infinite,infinite",
              animationDirection: "alternate,alternate",
            }}
          >
            {text}
          </div>
        );
      })}
    </>
  );
}

function Gears() {
  return (
    <div style={{ position: "absolute", top: 20, right: 28, zIndex: 1, pointerEvents: "none" }}>
      <span
        style={{
          display: "block",
          fontSize: "68px",
          color: "#6366f1",
          lineHeight: 1,
          animation: "spinCw 8s linear infinite, gearPulse 4s ease-in-out infinite alternate",
        }}
      >
        ⚙
      </span>
      <span
        style={{
          display: "block",
          fontSize: "38px",
          color: "#6366f1",
          lineHeight: 1,
          marginTop: "-12px",
          marginLeft: "46px",
          animation: "spinCcw 5s linear infinite, gearPulse 4s ease-in-out infinite alternate 2s",
        }}
      >
        ⚙
      </span>
    </div>
  );
}

function OrbitRings() {
  return (
    <div
      style={{
        position: "absolute",
        top: "12%",
        left: "6%",
        zIndex: 1,
        pointerEvents: "none",
        width: "80px",
        height: "80px",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: `${i * 10}px`,
            borderRadius: "50%",
            border: `1px solid rgba(99,102,241,${0.15 + i * 0.1})`,
            animation: `orbitRing ${5 + i * 3}s linear infinite${i % 2 ? " reverse" : ""}`,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-3px",
              left: "50%",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: i === 0 ? "#22d3ee" : i === 1 ? "#a78bfa" : "#6366f1",
              animation: `dotPop ${1.5 + i * 0.5}s ease-in-out infinite`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function WaveRipples() {
  return (
    <div style={{ position: "absolute", bottom: "15%", right: "8%", zIndex: 1, pointerEvents: "none" }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            border: "1.5px solid rgba(34,211,238,.5)",
            animation: `waveRipple 2.5s ${i * 0.8}s ease-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Steam() {
  return (
    <div style={{ display: "flex", gap: "5px", justifyContent: "center", marginBottom: "3px" }}>
      {["steamLeft", "steamMid", "steamRight"].map((anim, i) => (
        <span
          key={i}
          style={{
            display: "block",
            width: "3px",
            height: "15px",
            background: "rgba(255,255,255,.3)",
            borderRadius: "2px",
            animation: `${anim} 2s ${i * 0.35}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

function FloatUpParticles() {
  const items = useMemo(
    () =>
      ["⚡", "🔥", "✨", "💡", "⚙", "🚀"].map((e, i) => ({
        e,
        left: `${10 + i * 15}%`,
        delay: `${i * 0.6}s`,
        dur: `${3 + i * 0.3}s`,
      })),
    []
  );
  return (
    <div style={{ position: "absolute", bottom: "10px", left: 0, right: 0, pointerEvents: "none", zIndex: 3 }}>
      {items.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: p.left,
            fontSize: "14px",
            animation: `floatUpFade ${p.dur} ${p.delay} ease-out infinite`,
          }}
        >
          {p.e}
        </span>
      ))}
    </div>
  );
}

const CODE_LINES = [
  { x: 42, w: 90,  c: "#6366f1", op: 0.82 },
  { x: 138, w: 50, c: "#22d3ee", op: 0.65 },
  { x: 52, w: 60,  c: "#10ffb4", op: 0.72 },
  { x: 118, w: 80, c: "#a78bfa", op: 0.55 },
  { x: 52, w: 110, c: "#34d399", op: 0.65 },
  { x: 42, w: 70,  c: "#f43f5e", op: 0.72 },
  { x: 118, w: 40, c: "#fbbf24", op: 0.65 },
  { x: 52, w: 130, c: "#6366f1", op: 0.55 },
  { x: 52, w: 55,  c: "#22d3ee", op: 0.72 },
  { x: 42, w: 40,  c: "#a78bfa", op: 0.65 },
  { x: 88, w: 90,  c: "#6366f1", op: 0.45 },
  { x: 52, w: 80,  c: "#10ffb4", op: 0.55 },
];

function LaptopScreen() {
  return (
    <svg
      viewBox="0 0 300 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: "300px",
        display: "block",
        animation: "laptopFloat 4s ease-in-out infinite, laptopGlowFlicker 6s ease-in-out infinite alternate",
      }}
    >
      <defs>
        <linearGradient id="sg" x1="30" y1="20" x2="270" y2="165" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" stopOpacity=".15" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity=".08" />
        </linearGradient>
      </defs>
      <rect x={20} y={10} width={260} height={165} rx={14} fill="#0f172a" stroke="#6366f1" strokeWidth={3} />
      <rect x={30} y={20} width={240} height={145} rx={8} fill="#060a18" />
      <rect x={30} y={20} width={240} height={145} rx={8} fill="url(#sg)" opacity={0.9} />
      <g>
        {CODE_LINES.map(({ x, w, c, op }, i) => (
          <rect
            key={i}
            x={x}
            y={35 + i * 9}
            width={w}
            height={6}
            rx={3}
            fill={c}
            opacity={op}
            style={{ animation: `codePulse 2.8s ${(i * 0.13).toFixed(2)}s ease-in-out infinite alternate` }}
          />
        ))}
        <rect
          x={110}
          y={35 + 8 * 9}
          width={10}
          height={6}
          rx={2}
          fill="#10ffb4"
          style={{ animation: "blinkCursor .85s step-end infinite" }}
        />
      </g>
      <circle cx={150} cy={16} r={3} fill="#6366f1" opacity={0.65} />
      <rect x={5} y={175} width={290} height={22} rx={6} fill="#1e293b" stroke="#334155" strokeWidth={2} />
      <rect x={30} y={180} width={240} height={5} rx={2.5} fill="#0f172a" opacity={0.5} />
      <rect x={115} y={188} width={70} height={5} rx={2.5} fill="#0f172a" opacity={0.4} />
    </svg>
  );
}

function Character() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "18px",
        right: "-38px",
        zIndex: 4,
        animation: "charBreathe 4s ease-in-out infinite",
      }}
    >
      <svg viewBox="0 0 180 320" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "175px", height: "auto" }}>
        {/* Chair */}
        <rect x={72} y={215} width={36} height={80} rx={8} fill="#1e293b" stroke="#334155" strokeWidth={2} />
        <rect x={55} y={275} width={70} height={18} rx={9} fill="#1e293b" stroke="#334155" strokeWidth={2} />
        <rect x={65} y={290} width={8} height={28} rx={4} fill="#334155" />
        <rect x={107} y={290} width={8} height={28} rx={4} fill="#334155" />
        {/* Torso / hoodie */}
        <rect x={52} y={148} width={76} height={75} rx={22} fill="#6366f1" />
        <rect x={72} y={185} width={36} height={22} rx={8} fill="#4f46e5" />
        <line x1={85} y1={170} x2={80} y2={188} stroke="#a78bfa" strokeWidth={2.5} strokeLinecap="round" />
        <line x1={95} y1={170} x2={100} y2={188} stroke="#a78bfa" strokeWidth={2.5} strokeLinecap="round" />
        {/* Left arm */}
        <g style={{ animation: "typeLeft .22s ease-in-out infinite alternate", transformOrigin: "57px 165px" }}>
          <rect x={25} y={158} width={32} height={14} rx={7} fill="#6366f1" />
          <rect x={18} y={168} width={28} height={12} rx={6} fill="#fbbf24" opacity={0.9} />
          <ellipse cx={20} cy={177} rx={10} ry={8} fill="#fde68a" />
          <rect x={11} y={170} width={5} height={10} rx={2.5} fill="#fde68a" />
          <rect x={17} y={168} width={5} height={12} rx={2.5} fill="#fde68a" />
          <rect x={23} y={168} width={5} height={11} rx={2.5} fill="#fde68a" />
          <rect x={29} y={170} width={4} height={9} rx={2} fill="#fde68a" />
        </g>
        {/* Right arm */}
        <g style={{ animation: "typeRight .22s ease-in-out infinite alternate", transformOrigin: "123px 165px" }}>
          <rect x={123} y={158} width={32} height={14} rx={7} fill="#6366f1" />
          <rect x={134} y={168} width={28} height={12} rx={6} fill="#fbbf24" opacity={0.9} />
          <ellipse cx={150} cy={177} rx={10} ry={8} fill="#fde68a" />
          <rect x={144} y={170} width={4} height={9} rx={2} fill="#fde68a" />
          <rect x={150} y={168} width={5} height={11} rx={2.5} fill="#fde68a" />
          <rect x={156} y={168} width={5} height={12} rx={2.5} fill="#fde68a" />
          <rect x={162} y={168} width={5} height={10} rx={2.5} fill="#fde68a" />
        </g>
        {/* Neck & Head */}
        <rect x={79} y={128} width={22} height={24} rx={8} fill="#fde68a" />
        <ellipse cx={90} cy={108} rx={40} ry={38} fill="#fde68a" />
        <ellipse cx={60} cy={118} rx={9} ry={6} fill="#fca5a5" opacity={0.5} />
        <ellipse cx={120} cy={118} rx={9} ry={6} fill="#fca5a5" opacity={0.5} />
        {/* Hair */}
        <ellipse cx={90} cy={76} rx={40} ry={20} fill="#1e293b" />
        <rect x={50} y={72} width={80} height={20} fill="#1e293b" />
        <ellipse cx={90} cy={68} rx={14} ry={10} fill="#334155" />
        <ellipse cx={54} cy={94} rx={8} ry={18} fill="#1e293b" />
        <ellipse cx={126} cy={94} rx={8} ry={18} fill="#1e293b" />
        {/* Left eye */}
        <g style={{ animation: "eyeLook 9s ease-in-out infinite" }}>
          <ellipse cx={74} cy={110} rx={11} ry={12} fill="white" />
          <ellipse cx={74} cy={112} rx={7} ry={8} fill="#1e293b" />
          <ellipse cx={74} cy={112} rx={4} ry={5} fill="#6366f1" />
          <ellipse cx={74} cy={112} rx={2} ry={2.5} fill="#111" />
          <circle cx={78} cy={109} r={2} fill="white" />
        </g>
        {/* Right eye */}
        <g style={{ animation: "eyeLook 9s ease-in-out infinite", animationDelay: ".1s" }}>
          <ellipse cx={106} cy={110} rx={11} ry={12} fill="white" />
          <ellipse cx={106} cy={112} rx={7} ry={8} fill="#1e293b" />
          <ellipse cx={106} cy={112} rx={4} ry={5} fill="#6366f1" />
          <ellipse cx={106} cy={112} rx={2} ry={2.5} fill="#111" />
          <circle cx={110} cy={109} r={2} fill="white" />
        </g>
        {/* Eyebrows & smile */}
        <path d="M63 97 Q74 91 85 97" stroke="#1e293b" strokeWidth={3.5} strokeLinecap="round" fill="none" />
        <path d="M95 97 Q106 91 117 97" stroke="#1e293b" strokeWidth={3.5} strokeLinecap="round" fill="none" />
        <path d="M76 126 Q90 138 104 126" stroke="#f97316" strokeWidth={3} strokeLinecap="round" fill="none" />
        {/* Headphones */}
        <ellipse cx={52} cy={106} rx={10} ry={14} fill="#4f46e5" opacity={0.9} style={{ animation: "headphoneVibing 2.5s ease-in-out infinite alternate" }} />
        <ellipse cx={52} cy={106} rx={6} ry={9} fill="#6366f1" style={{ animation: "headphoneVibing 2.5s ease-in-out infinite alternate" }} />
        <ellipse cx={128} cy={106} rx={10} ry={14} fill="#4f46e5" opacity={0.9} style={{ animation: "headphoneVibing 2.5s ease-in-out infinite alternate .5s" }} />
        <ellipse cx={128} cy={106} rx={6} ry={9} fill="#6366f1" style={{ animation: "headphoneVibing 2.5s ease-in-out infinite alternate .5s" }} />
        <path d="M52 93 Q90 65 128 93" stroke="#334155" strokeWidth={6} fill="none" strokeLinecap="round" />
        {/* Legs & shoes */}
        <rect x={62} y={223} width={24} height={55} rx={12} fill="#1e293b" />
        <rect x={94} y={223} width={24} height={55} rx={12} fill="#1e293b" />
        <ellipse cx={74} cy={280} rx={18} ry={9} fill="#0f172a" />
        <ellipse cx={106} cy={280} rx={18} ry={9} fill="#0f172a" />
      </svg>
    </div>
  );
}

function ProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      if (n >= 68) { clearInterval(t); return; }
      setPct(++n);
    }, 55);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ width: "100%", marginTop: "4px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
        <span>Building...</span>
        <span style={{ color: "#22d3ee", fontWeight: 600, fontFamily: "monospace", animation: "pctGlow 1s ease-in-out infinite alternate" }}>
          {pct}%
        </span>
      </div>
      <div style={{ width: "100%", height: "8px", background: "#1e293b", borderRadius: "999px", border: "1px solid #334155", overflow: "hidden", position: "relative" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: "999px",
            background: "linear-gradient(90deg,#6366f1 0%,#818cf8 40%,#22d3ee 80%,#6366f1 100%)",
            backgroundSize: "300% 100%",
            transition: "width .4s ease",
            animation: "progressShimmer 1.8s linear infinite",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: "-3px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#67e8f9",
              animation: "tipPulse .8s ease-in-out infinite alternate",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function Sign() {
  const tags = ["MERN Apps", "AI Tools", "Real-Time Apps"];
  return (
    <div
      style={{
        position: "relative",
        zIndex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        animation: "signSwing 6s ease-in-out .8s infinite",
        transformOrigin: "center top",
        animationFillMode: "both",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "#0f172a",
          border: "2px solid #6366f1",
          borderRadius: "16px",
          padding: "32px 36px 28px",
          maxWidth: "340px",
          width: "100%",
          animation: "signBorderPulse 4s ease-in-out infinite alternate",
        }}
      >
        {/* Tape */}
        <div style={{ position: "absolute", top: "-10px", left: "16px", width: "48px", height: "20px", background: "rgba(251,191,36,.75)", borderRadius: "3px", transform: "rotate(-6deg)" }} />
        <div style={{ position: "absolute", top: "-10px", right: "16px", width: "48px", height: "20px", background: "rgba(251,191,36,.75)", borderRadius: "3px", transform: "rotate(6deg)" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "12px" }}>
          <div style={{ fontSize: "48px", display: "inline-block", animation: "emojiBounce 1.5s ease-in-out infinite", filter: "drop-shadow(0 4px 8px rgba(0,0,0,.4))" }}>
            🚧
          </div>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: 700,
              margin: 0,
              letterSpacing: "-.3px",
              background: "linear-gradient(90deg,#f1f5f9 20%,#a78bfa 55%,#22d3ee 80%,#f1f5f9 100%)",
              backgroundSize: "200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "titleShimmer 4s ease-in-out infinite alternate",
            }}
          >
            Under Construction
          </h3>
          <p style={{ fontSize: "13.5px", color: "#94a3b8", margin: 0, lineHeight: 1.65 }}>
            Amazing projects are being crafted.<br />Check back very soon!
          </p>
          <ProgressBar />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "4px" }}>
            {tags.map((t, i) => (
              <span
                key={i}
                style={{
                  fontSize: "11.5px",
                  fontWeight: 600,
                  color: "#a78bfa",
                  background: "rgba(99,102,241,.12)",
                  border: "1px solid rgba(99,102,241,.25)",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  letterSpacing: ".3px",
                  animation: `tagAppear .5s ${0.2 + i * 0.2}s cubic-bezier(.34,1.56,.64,1) both`,
                  transition: "all .25s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(99,102,241,.28)";
                  e.target.style.transform = "translateY(-3px) scale(1.07)";
                  e.target.style.boxShadow = "0 5px 14px rgba(99,102,241,.35)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(99,102,241,.12)";
                  e.target.style.transform = "";
                  e.target.style.boxShadow = "";
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: "6px", height: "50px", background: "linear-gradient(180deg,#334155,#1e293b)", borderRadius: "3px" }} />
    </div>
  );
}

// ─── Root Component ──────────────────────────────────────────────────────────

export default function UnderConstruction() {
  // Inject keyframes once on mount
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#060a18",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "60px",
        flexWrap: "wrap",
        padding: "60px 24px",
        overflow: "hidden",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Aurora background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 20% 50%,rgba(99,102,241,.09) 0%,transparent 70%),radial-gradient(ellipse 50% 35% at 80% 30%,rgba(34,211,238,.06) 0%,transparent 70%),radial-gradient(ellipse 40% 50% at 60% 80%,rgba(167,139,250,.07) 0%,transparent 70%)",
          animation: "aurora 10s ease-in-out infinite alternate",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <StarField />
      <MatrixRain />
      <Gears />
      <OrbitRings />
      <WaveRipples />
      <CodeFloats />

      {/* Character + Desk */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "entranceLeft .9s cubic-bezier(.34,1.56,.64,1) both",
        }}
      >
        {/* Shadow */}
        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            left: "50%",
            width: "260px",
            height: "18px",
            background: "rgba(99,102,241,.18)",
            borderRadius: "50%",
            filter: "blur(6px)",
            animation: "shadowBreathe 4s ease-in-out infinite",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
          {/* Coffee mug */}
          <div style={{ position: "absolute", left: "-75px", bottom: "38px", zIndex: 3, animation: "mugBob 3.5s ease-in-out infinite" }}>
            <Steam />
            <svg viewBox="0 0 60 70" fill="none" style={{ width: "52px", display: "block" }}>
              <rect x={5} y={20} width={40} height={38} rx={6} fill="#1e293b" stroke="#6366f1" strokeWidth={2.5} />
              <path d="M45 28 Q62 28 62 39 Q62 50 45 50" stroke="#6366f1" strokeWidth={3} fill="none" strokeLinecap="round" />
              <ellipse cx={25} cy={22} rx={17} ry={5} fill="#7c3aed" opacity={0.6} />
              <text x={11} y={44} fill="#22d3ee" fontSize={9} fontFamily="monospace" fontWeight="bold">{"</>"}</text>
              <rect x={2} y={57} width={46} height={6} rx={3} fill="#334155" />
            </svg>
          </div>

          {/* Laptop */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <LaptopScreen />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "14px",
                pointerEvents: "none",
                animation: "screenPulse 3s ease-in-out infinite alternate",
              }}
            />
          </div>

          {/* Desk */}
          <div
            style={{
              width: "340px",
              height: "18px",
              background: "linear-gradient(180deg,#1e293b 0%,#0f172a 100%)",
              borderRadius: "4px",
              position: "relative",
              zIndex: 3,
              border: "1.5px solid #334155",
            }}
          />

          <Character />
          <FloatUpParticles />
          <Particles />
        </div>
      </div>

      {/* Sign */}
      <div style={{ animation: "entranceRight .9s cubic-bezier(.34,1.56,.64,1) .15s both" }}>
        <Sign />
      </div>
    </div>
  );
}
