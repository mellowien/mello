"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Obstacle = { x: number; y: number; w: number; h: number; passed: boolean };
type TrailDot = { x: number; y: number; alpha: number };
type Popup = { x: number; y: number; life: number };
type Entry = { name: string; score: number };

export default function MelloRush() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [hallOfFame, setHallOfFame] = useState<Entry[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const player = useRef({ x: 80, y: 0, r: 18, vy: 0, onGround: false });
  const groundY = useRef(0);
  const gravityBase = 0.85;
  const jumpStrength = -16.5;
  const baseSpeed = 6;
  const speed = useRef(baseSpeed);
  const obstacles = useRef<Obstacle[]>([]);
  const trail = useRef<TrailDot[]>([]);
  const popups = useRef<Popup[]>([]);
  const spawnCooldown = useRef(0);
  const scoreRef = useRef(0);

  // 🔹 Setup & Speicher
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mellorush_best", "0");
      setBest(0);

      const savedHOF = localStorage.getItem("mellorush_hof");
      if (savedHOF) setHallOfFame(JSON.parse(savedHOF));
    }
  }, []);

  // 🔹 Lokale Hall of Fame
  const saveHallOfFameLocal = (entries: Entry[]) => {
    localStorage.setItem("mellorush_hof", JSON.stringify(entries));
  };

  const addToHallOfFameLocal = (name: string, score: number) => {
    const updated = [...hallOfFame, { name: name || "Unbekannt", score }]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    setHallOfFame(updated);
    saveHallOfFameLocal(updated);
  };

  // 🔄 Supabase: Score hochladen
  async function saveScoreToSupabase(
    name: string,
    score: number,
    contact?: string
  ) {
    const { error } = await supabase.from("hall_of_fame").insert([
      {
        game: "MelloRush",
        name: name || "Unbekannt",
        score,
        contact: contact || null,
      },
    ]);

    if (error) console.error("Fehler beim Speichern in Supabase:", error);
    else console.log("✅ Score erfolgreich in Supabase gespeichert!");
  }

  const resize = () => {
    const c = canvasRef.current!;
    const width = Math.min(window.innerWidth - 32, 1000);
    const height = Math.max(320, Math.round(width * 0.42));
    c.width = width;
    c.height = height;
    groundY.current = c.height - 60;
    player.current.y = groundY.current - player.current.r;
  };

  const startGame = () => {
    obstacles.current = [];
    trail.current = [];
    popups.current = [];
    speed.current = baseSpeed;
    player.current.y = groundY.current - player.current.r;
    player.current.vy = 0;
    player.current.onGround = true;
    scoreRef.current = 0;
    setScore(0);
    setShowPopup(false);
    setGameOver(false);
    setRunning(true);
  };

  const jump = () => {
    if (!running || gameOver) return;
    if (player.current.onGround) {
      player.current.vy = jumpStrength;
      player.current.onGround = false;

      // ✨ Trail-Effekt beim Sprung
      for (let i = 0; i < 10; i++) {
        trail.current.push({
          x: player.current.x - 10 - Math.random() * 10,
          y: player.current.y + (Math.random() - 0.5) * 10,
          alpha: 1,
        });
      }
    }
  };

  const circleRect = (
    cx: number,
    cy: number,
    r: number,
    rx: number,
    ry: number,
    rw: number,
    rh: number
  ) => {
    const nx = Math.max(rx, Math.min(cx, rx + rw));
    const ny = Math.max(ry, Math.min(cy, ry + rh));
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy <= r * r;
  };

  const endGame = () => {
    setRunning(false);
    setGameOver(true);
    const finalScore = scoreRef.current;

    const storedBest = Number(localStorage.getItem("mellorush_best") || "0");
    if (finalScore > storedBest) {
      localStorage.setItem("mellorush_best", String(finalScore));
      setBest(finalScore);
      setShowPopup(true);
    }
  };

  // 🎮 Game Loop
  const loop = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, c.width, c.height);

    // 🧠 Organische Schwierigkeit
    // Geschwindigkeit, Gravitation und Spawnrate skalieren weich mit Score
    // 🧠 Härtere, aber fließende Schwierigkeit
let currentSpeed = baseSpeed + scoreRef.current * 0.08; // steilere Steigerung
let currentGravity = gravityBase + scoreRef.current * 0.0045; // schnelleres Fallen
let spawnRate = Math.max(115 - scoreRef.current * 0.9, 45); // Hindernisse dichter & schneller


    // Bodenlinie
    ctx.strokeStyle = "#14b8a6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY.current);
    ctx.lineTo(c.width, groundY.current);
    ctx.stroke();

    // Gravitation
    player.current.vy += currentGravity;
    player.current.y += player.current.vy;
    if (player.current.y >= groundY.current - player.current.r) {
      player.current.y = groundY.current - player.current.r;
      player.current.vy = 0;
      player.current.onGround = true;
    }

    // Hindernisse generieren
    spawnCooldown.current--;
    if (spawnCooldown.current <= 0) {
      let h = 30 + Math.random() * 50 + scoreRef.current * 0.05;
      const w = 22 + Math.random() * 36;
      obstacles.current.push({
        x: c.width + 20,
        y: groundY.current - h,
        w,
        h,
        passed: false,
      });
      spawnCooldown.current = spawnRate;
    }

    // Hindernisse bewegen + Punkte zählen
    ctx.fillStyle = "#14b8a6";
    for (const ob of obstacles.current) {
      ob.x -= currentSpeed;
      ctx.fillRect(ob.x, ob.y, ob.w, ob.h);

      // Punkte
      if (!ob.passed && ob.x + ob.w < player.current.x - player.current.r) {
        ob.passed = true;
        scoreRef.current += 1;
        setScore(scoreRef.current);

        popups.current.push({
          x: player.current.x + 10,
          y: player.current.y - 30,
          life: 30,
        });
      }

      // Collision
      if (
        circleRect(
          player.current.x,
          player.current.y,
          player.current.r,
          ob.x,
          ob.y,
          ob.w,
          ob.h
        )
      ) {
        endGame();
        return;
      }
    }

    obstacles.current = obstacles.current.filter((o) => o.x + o.w > -50);

    // Trail-Animation
    for (const dot of trail.current) {
      dot.x -= currentSpeed * 0.6;
      dot.alpha -= 0.03;
    }
    trail.current = trail.current.filter((d) => d.alpha > 0);
    for (const dot of trail.current) {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20,184,166,${dot.alpha})`;
      ctx.fill();
    }

    // "+1" Popups
    for (const p of popups.current) {
      p.y -= 1;
      p.life -= 1;
      ctx.font = "bold 18px Inter";
      ctx.fillStyle = `rgba(20,184,166,${p.life / 30})`;
      ctx.fillText("+1", p.x, p.y);
    }
    popups.current = popups.current.filter((p) => p.life > 0);

    // Spieler
    ctx.beginPath();
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#14b8a6";
    ctx.shadowBlur = 12;
    ctx.arc(player.current.x, player.current.y, player.current.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Inter, system-ui";
    ctx.fillText(`Score: ${scoreRef.current}`, 16, 28);
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(`Best: ${best}`, 16, 52);

    if (running) rafRef.current = requestAnimationFrame(loop);
  };

  // Setup
  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (running) rafRef.current = requestAnimationFrame(loop);
    else if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [running]);

  // -------------------------------
  // 🧱 UI
  // -------------------------------
  return (
    <main
      className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-12 relative"
      tabIndex={0}
      onKeyDown={(e) => {
        if (["Space", "ArrowUp", "KeyW"].includes(e.code)) {
          e.preventDefault();
          if (gameOver) startGame();
          else jump();
        }
      }}
    >
      <h1 className="text-4xl font-bold mb-4">Mello Rush</h1>
      <p className="text-gray-400 mb-6 text-center">
        Springe über Hindernisse!{" "}
        <span className="text-teal-400">Leertaste / Klick = Sprung</span>
      </p>

      <div className="w-full max-w-4xl border border-zinc-800 rounded-lg overflow-hidden shadow-[0_0_24px_rgba(20,184,166,0.15)]">
        <canvas
          ref={canvasRef}
          className="block w-full h-auto bg-black cursor-pointer"
          onClick={() => (gameOver ? startGame() : jump())}
        />
      </div>

      <div className="mt-6 flex flex-col items-center">
        {(!running || gameOver) && (
          <button
            onClick={startGame}
            className="px-5 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-black font-semibold transition"
          >
            Start
          </button>
        )}
      </div>

      {/* 🏆 Hall of Fame */}
      <section className="mt-16 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6 text-teal-400">🏆 Hall of Fame</h2>
        {hallOfFame.length === 0 ? (
          <p className="text-gray-500">Noch keine Einträge</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-800 shadow-[0_0_16px_rgba(20,184,166,0.1)]">
            <table className="w-full border-collapse text-sm md:text-base">
              <thead className="bg-zinc-900/50 text-teal-400 border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4 text-left font-semibold">Platz</th>
                  <th className="py-3 px-4 text-left font-semibold">Name</th>
                  <th className="py-3 px-4 text-right font-semibold">Score</th>
                </tr>
              </thead>
              <tbody>
                {hallOfFame.map((entry, i) => (
                  <tr
                    key={i}
                    className="hover:bg-zinc-900/70 transition-colors border-b border-zinc-800 last:border-none"
                  >
                    <td className="py-3 px-4 text-gray-400">{i + 1}</td>
                    <td className="py-3 px-4 text-white font-medium text-left">
                      {entry.name}
                    </td>
                    <td className="py-3 px-4 text-teal-400 font-semibold text-right">
                      {entry.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 💬 Popup bei Highscore */}
      {showPopup && (
        <div className="absolute inset-0 bg-black/70 flex justify-center items-center backdrop-blur-sm">
          <div className="bg-zinc-900 border border-teal-500/40 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(13,148,136,0.4)] w-80 animate-fadeIn">
            <h3 className="text-2xl font-bold text-teal-400 mb-3">
              Neuer Highscore!
            </h3>
            <p className="text-gray-400 mb-4">
              Dein Score:{" "}
              <span className="text-white font-semibold">{score}</span>
            </p>

            <input
              type="text"
              placeholder="Dein Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded bg-zinc-800 text-white text-center"
            />

            <input
              type="text"
              placeholder="Kontakt (E-Mail, Instagram, etc.)"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full mb-2 px-3 py-2 rounded bg-zinc-800 text-white text-center text-sm"
            />

            <p className="text-gray-500 text-xs leading-relaxed mb-4 px-1">
              Deine Daten werden nicht gespeichert oder veröffentlicht – sie
              dienen nur dazu, dir deinen Preis zu schicken.
            </p>

            <button
              onClick={async () => {
                addToHallOfFameLocal(playerName, scoreRef.current);
                await saveScoreToSupabase(playerName, scoreRef.current, contactInfo);
                setShowPopup(false);
                setPlayerName("");
                setContactInfo("");
                startGame();
              }}
              className="px-5 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-black font-semibold transition"
            >
              Speichern & Neustart
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
