"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ✅ Verbindung zu Supabase

// ---------------------------
// 🧩 Typdefinitionen
// ---------------------------
type Pipe = { x: number; gapY: number; passed: boolean };
type TrailDot = { x: number; y: number; alpha: number };
type Popup = { x: number; y: number; life: number };
type Entry = { id?: string; name: string; score: number; game?: string };

// ---------------------------
// 🎮 Hauptkomponente
// ---------------------------
export default function MelloTap() {
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

  // Spiellogik-Referenzen
  const scoreRef = useRef(0);
  const player = useRef({ x: 160, y: 250, r: 14, vy: 0 });
  const pipes = useRef<Pipe[]>([]);
  const trail = useRef<TrailDot[]>([]);
  const popups = useRef<Popup[]>([]);
  const spawnTimer = useRef(0);

  const gravity = 0.23;
  const jumpPower = -4.8;
  const gapBase = 150;

  // ---------------------------
  // 🗃️ Supabase Funktionen
  // ---------------------------

  // 🡒 Lade die Top 5 Scores von Supabase
  const loadHallOfFame = async () => {
    const { data, error } = await supabase
      .from("hall_of_fame")
      .select("*")
      .eq("game", "mellotap")
      .order("score", { ascending: false })
      .limit(5);

    if (error) console.error("Fehler beim Laden der Hall of Fame:", error);
    else setHallOfFame(data || []);
  };

  // 🡒 Speichere neuen Highscore in Supabase
  const saveScoreToSupabase = async (name: string, score: number) => {
    const { error } = await supabase.from("hall_of_fame").insert([
      {
        game: "mellotap",
        name: name || "Unbekannt",
        score,
      },
    ]);

    if (error)
      console.error("❌ Fehler beim Speichern in Supabase:", error);
    else {
      console.log("✅ Score erfolgreich in Supabase gespeichert!");
      loadHallOfFame(); // sofort aktualisieren
    }
  };

  // ---------------------------
  // 🕹️ Spiel Setup
  // ---------------------------

  useEffect(() => {
    loadHallOfFame(); // initial Hall of Fame laden
    if (typeof window !== "undefined") {
      localStorage.setItem("mellotap_best", "0"); // Reset Bestscore beim Start
      setBest(0);
    }
  }, []);

  const resize = () => {
    const c = canvasRef.current!;
    c.width = Math.min(window.innerWidth - 32, 800);
    c.height = 480;
  };

  const startGame = () => {
    pipes.current = [];
    trail.current = [];
    popups.current = [];
    player.current.y = 250;
    player.current.vy = 0;
    scoreRef.current = 0;
    setScore(0);
    setShowPopup(false);
    setGameOver(false);
    setRunning(true);
  };

  const jump = () => {
    if (!running || gameOver) return;
    player.current.vy = jumpPower;

    // ✨ Klick-Effekt (Trail)
    for (let i = 0; i < 8; i++) {
      trail.current.push({
        x: player.current.x - 10 - Math.random() * 10,
        y: player.current.y + (Math.random() - 0.5) * 10,
        alpha: 1,
      });
    }
  };

  const endGame = () => {
    setRunning(false);
    setGameOver(true);
    const finalScore = scoreRef.current;
    const storedBest = Number(localStorage.getItem("mellotap_best") || "0");

    if (finalScore > storedBest) {
      localStorage.setItem("mellotap_best", String(finalScore));
      setBest(finalScore);
      setShowPopup(true);
    }
  };

  // ---------------------------
  // 🔁 Haupt-Spielschleife
  // ---------------------------
  const loop = () => {
    const c = canvasRef.current!;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, c.width, c.height);

    // ✈️ Physik
    player.current.vy += gravity;
    player.current.y += player.current.vy;

    if (
      player.current.y + player.current.r > c.height ||
      player.current.y - player.current.r < 0
    ) {
      endGame();
    }

    // Röhren generieren
    spawnTimer.current--;
    if (spawnTimer.current <= 0) {
      const gapY = 120 + Math.random() * 240;
      pipes.current.push({ x: c.width + 40, gapY, passed: false });
      spawnTimer.current = 110;
    }

    ctx.fillStyle = "#14b8a6";
    for (const p of pipes.current) {
      p.x -= 3.6;
      const gap = gapBase - Math.min(scoreRef.current * 1.5, 60);
      ctx.fillRect(p.x, 0, 40, p.gapY - gap / 2);
      ctx.fillRect(p.x, p.gapY + gap / 2, 40, c.height - p.gapY - gap / 2);

      // Kollisionserkennung
      if (
        player.current.x + player.current.r > p.x &&
        player.current.x - player.current.r < p.x + 40 &&
        (player.current.y - player.current.r < p.gapY - gap / 2 ||
          player.current.y + player.current.r > p.gapY + gap / 2)
      ) {
        endGame();
      }

      // Punkte zählen
      if (!p.passed && p.x + 40 < player.current.x - player.current.r) {
        p.passed = true;
        scoreRef.current++;
        setScore(scoreRef.current);
        popups.current.push({
          x: player.current.x,
          y: player.current.y - 20,
          life: 30,
        });
      }
    }

    pipes.current = pipes.current.filter((p) => p.x + 40 > 0);

    // Trail-Bewegung
    for (const dot of trail.current) {
      dot.x -= 1.5;
      dot.alpha -= 0.03;
    }
    trail.current = trail.current.filter((d) => d.alpha > 0);

    // Popups-Bewegung
    for (const p of popups.current) {
      p.y -= 1;
      p.life -= 1;
    }
    popups.current = popups.current.filter((p) => p.life > 0);

    // Trail zeichnen
    for (const dot of trail.current) {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(20,184,166,${dot.alpha})`;
      ctx.fill();
    }

    // Spieler zeichnen
    ctx.beginPath();
    ctx.arc(player.current.x, player.current.y, player.current.r, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#14b8a6";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;

    // "+1" Popups zeichnen
    for (const p of popups.current) {
      ctx.font = "bold 18px Inter";
      ctx.fillStyle = `rgba(20,184,166,${p.life / 30})`;
      ctx.fillText("+1", p.x + 12, p.y);
    }

    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Inter, sans-serif";
    ctx.fillText(`Score: ${scoreRef.current}`, 16, 28);
    ctx.fillStyle = "#9ca3af";
    ctx.fillText(`Best: ${best}`, 16, 52);

    if (running) rafRef.current = requestAnimationFrame(loop);
  };

  // ---------------------------
  // 📏 Setup & Events
  // ---------------------------
  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (running) rafRef.current = requestAnimationFrame(loop);
    else if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, [running]);

  // ---------------------------
  // 🧱 UI
  // ---------------------------
  return (
    <main
      className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-12 relative"
      tabIndex={0}
      onKeyDown={(e) => {
        if (["Space", "ArrowUp"].includes(e.code)) {
          e.preventDefault();
          if (gameOver) startGame();
          else jump();
        }
      }}
    >
      <h1 className="text-4xl font-bold mb-4">Mello Tap</h1>
      <p className="text-gray-400 mb-6 text-center">
        Flieg durch die Lücken!{" "}
        <span className="text-teal-400">Klick / Leertaste = Flügelschlag</span>
      </p>

      <div className="w-full max-w-2xl border border-zinc-800 rounded-lg overflow-hidden shadow-[0_0_24px_rgba(20,184,166,0.15)]">
        <canvas
          ref={canvasRef}
          className="block w-full h-auto bg-black cursor-pointer"
          onClick={() => (gameOver ? startGame() : jump())}
        />
      </div>

      {/* 🔘 Startbutton – jetzt immer sichtbar */}
      <div className="mt-6 flex flex-col items-center">
        <button
          onClick={startGame}
          className="px-5 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-black font-semibold transition"
        >
          {running ? "Neustart" : gameOver ? "Nochmal!" : "Start"}
        </button>
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
              Neuer Highscore! 🎉
            </h3>
            <p className="text-gray-400 mb-4">
              Dein Score: <span className="text-white font-semibold">{score}</span>
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
              Deine Daten werden nicht gespeichert oder veröffentlicht –
              sie dienen nur dazu, dir deinen Preis zukommen zu lassen.
            </p>

            <button
              onClick={() => {
                saveScoreToSupabase(playerName, score);
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
