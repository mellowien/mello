"use client";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Cell = "X" | "O" | null;
type Board = Cell[];
type Player = "human" | "ai";
type Entry = { name: string; date: string; contact?: string };

// --- Gewinnlinien ---
const LINES: ReadonlyArray<[number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// --- Gewinner prüfen ---
function getWinner(board: Board): { winner: Cell; line: number[] | null } {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

function hasEmpty(board: Board) {
  return board.some((c) => c === null);
}

// --- Minimax (unbesiegbarer Bot) ---
function evaluateBoard(board: Board): number {
  const { winner } = getWinner(board);
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  return 0;
}

function minimax(
  board: Board,
  depth: number,
  isBotTurn: boolean
): { score: number; move: number | null } {
  const { winner } = getWinner(board);

  if (winner === "O") return { score: 10 - depth, move: null };
  if (winner === "X") return { score: depth - 10, move: null };
  if (!hasEmpty(board)) return { score: 0, move: null };

  if (isBotTurn) {
    let bestScore = -Infinity;
    let bestMove: number | null = null;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const next = [...board];
        next[i] = "O";
        const { score } = minimax(next, depth + 1, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    let bestMove: number | null = null;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        const next = [...board];
        next[i] = "X";
        const { score } = minimax(next, depth + 1, true);
        if (score < bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return { score: bestScore, move: bestMove };
  }
}

// --- Hauptkomponente ---
export default function MelloTicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState<Player>("human");
  const [locked, setLocked] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [hallOfFame, setHallOfFame] = useState<Entry[]>([]);

  const { winner, line } = useMemo(() => getWinner(board), [board]);
  const emptyLeft = useMemo(() => hasEmpty(board), [board]);
  const gameOver = winner !== null || !emptyLeft;

  // Bot Move
  useEffect(() => {
    if (turn === "ai" && !gameOver) {
      setLocked(true);
      const t = setTimeout(() => {
        setBoard((prev) => {
          const next = [...prev];
          const { move } = minimax(next, 0, true);
          if (move !== null && next[move] === null) {
            next[move] = "O";
          }
          return next;
        });
        setTurn("human");
        setLocked(false);
      }, 450);
      return () => clearTimeout(t);
    }
  }, [turn, gameOver]);

  // Popup öffnen, wenn Mensch gewinnt
  useEffect(() => {
    if (winner === "X") {
      setTimeout(() => setShowPopup(true), 600);
    }
  }, [winner]);

  // --- Supabase: Gewinner speichern ---
  async function saveWinnerToSupabase(entry: {
    name: string;
    date: string;
    contact?: string;
  }) {
    const { error } = await supabase.from("hall_of_fame").insert([
      {
        game: "TicTacToe",
        name: entry.name,
        score: 1,
        date: new Date().toISOString(),
        contact: entry.contact || null,
      },
    ]);
    if (error) console.error("❌ Fehler beim Speichern:", error);
  }

  // Klick auf Feld
  function handleClick(i: number) {
    if (locked || winner || turn !== "human" || board[i] !== null) return;
    setBoard((prev) => {
      const next = [...prev];
      next[i] = "X";
      return next;
    });
    setTurn("ai");
  }

  function resetBoardOnly() {
    setBoard(Array(9).fill(null));
    setLocked(false);
    setTurn("human");
  }

  function resetAndClosePopup() {
    setShowPopup(false);
    setName("");
    setContact("");
    resetBoardOnly();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const newEntry: Entry = {
      name: name.trim(),
      date: new Date().toLocaleDateString(),
      contact: contact.trim() || undefined,
    };
    await saveWinnerToSupabase(newEntry);
    resetAndClosePopup();
  }

  // --- Anzeige ---
  const status = winner
    ? winner === "X"
      ? "Du hast gewonnen!"
      : "Mello-Bot gewinnt. Wie immer."
    : !emptyLeft
    ? "Unentschieden."
    : turn === "human"
    ? "Dein Zug (X)"
    : "Mello ist dran (O)…";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-md relative">
        {/* Titel */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-teal-500 drop-shadow">
            Tic Tac Toe – Mello Edition
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            Du bist X. Mello ist O. Mello verliert nie.
          </p>
        </div>

        {/* Spielfeld */}
        <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-2 rounded-2xl shadow-inner shadow-black">
          {board.map((cell, i) => {
            const isWinning = line?.includes(i) ?? false;
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                className={`aspect-square rounded-xl flex items-center justify-center text-4xl font-bold transition select-none ${
                  isWinning
                    ? "bg-teal-600/30 border border-teal-500"
                    : "bg-neutral-900 hover:bg-neutral-800 border border-zinc-800"
                }`}
              >
                <span
                  className={`drop-shadow ${
                    cell === "X"
                      ? "text-teal-400"
                      : cell === "O"
                      ? "text-zinc-200"
                      : ""
                  }`}
                >
                  {cell}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status + Reset */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <span>{status}</span>
          <button
            onClick={resetBoardOnly}
            className="px-3 py-1.5 rounded-xl border border-zinc-700 hover:bg-neutral-900 text-white transition"
          >
            Reset
          </button>
        </div>

        {/* 💬 Popup */}
        {showPopup && (
          <div className="absolute inset-0 bg-black/70 flex justify-center items-center backdrop-blur-sm">
            <div className="bg-zinc-900 border border-teal-500/40 rounded-2xl p-6 text-center shadow-[0_0_20px_rgba(13,148,136,0.4)] w-80 animate-fadeIn">
              <h3 className="text-2xl font-bold text-teal-400 mb-3">
                Unglaublich! Du hast gewonnen!
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                Trag dich ein, um in die Hall of Fame zu kommen
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mb-3 px-3 py-2 rounded bg-zinc-800 text-white text-center"
                />

                <input
                  type="text"
                  placeholder="Kontakt (optional)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="w-full mb-2 px-3 py-2 rounded bg-zinc-800 text-white text-center text-sm"
                />

                <p className="text-gray-500 text-xs leading-relaxed mb-4 px-1">
                  Deine Daten werden nicht veröffentlicht – nur für Preise.
                </p>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-teal-500 hover:bg-teal-400 text-black font-semibold transition"
                >
                  Eintragen & Neustart
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
