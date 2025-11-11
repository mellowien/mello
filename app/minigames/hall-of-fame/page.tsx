"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

type Entry = {
  id: string;
  game: string;
  name: string;
  score: number | null;
  date: string;
  contact?: string | null;
};

export default function HallOfFamePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from("hall_of_fame")
        .select("*")
        .order("score", { ascending: false })
        .limit(50);

      if (error) console.error("Fehler beim Laden:", error);
      else setEntries(data || []);
      setLoading(false);
    };

    fetchEntries();
  }, []);

  const categories = ["MelloTap", "MelloRush", "TicTacToe"];

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24">
      <h1 className="text-4xl font-bold mb-8 text-[#0d9488]">Hall of Fame</h1>
      <p className="text-gray-400 text-center mb-12 max-w-xl leading-relaxed">
        Die besten Spieler aus allen Mello Minigames.<br />
        Nur wer wirklich alles gibt, schafft es in diese Listen.
      </p>

      {loading ? (
        <p className="text-gray-500">Lade Daten...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {categories.map((game) => {
            const filtered = entries.filter(
              (entry) => entry.game.toLowerCase() === game.toLowerCase()
            );

            return (
              <div
                key={game}
                className="bg-neutral-900/50 border border-[#0d9488]/40 rounded-2xl p-6 text-center shadow-[0_0_25px_rgba(13,148,136,0.1)] hover:shadow-[0_0_30px_rgba(13,148,136,0.25)] transition-all duration-300"
              >
                <h2 className="text-2xl font-semibold text-[#0d9488] mb-5 hover:underline">
                  <Link href={`/minigames/${game.toLowerCase()}`}>{game}</Link>
                </h2>

                {filtered.length === 0 ? (
                  <p className="text-gray-500 italic">
                    Keine Einträge vorhanden.
                  </p>
                ) : (
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr className="text-[#0d9488] border-b border-[#0d9488]/40">
                        <th className="pb-2 w-14">#</th>
                        <th className="pb-2">Name</th>
                        <th className="pb-2 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.slice(0, 5).map((entry, i) => {
                        const rowStyles = [
                          // 🏆 Gold
                          "bg-gradient-to-r from-yellow-700/40 to-yellow-600/30 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]",
                          // 🥈 Silber
                          "bg-gradient-to-r from-gray-600/40 to-gray-500/30 border-gray-400/30 shadow-[0_0_15px_rgba(148,163,184,0.2)]",
                          // 🥉 Bronze
                          "bg-gradient-to-r from-amber-800/40 to-amber-700/30 border-amber-600/30 shadow-[0_0_15px_rgba(217,119,6,0.2)]",
                          // Rest
                          "hover:bg-zinc-900/50 border-zinc-800",
                        ];
                        const style = rowStyles[i] || rowStyles[3];

                        const medal =
                          i === 0 ? "🏆" : i === 1 ? "🥈" : i === 2 ? "🥉" : "";

                        return (
                          <tr
                            key={entry.id}
                            className={`${style} transition-all border-b last:border-none`}
                          >
                            <td className="py-2 px-2 text-white font-semibold flex items-center gap-2">
                              <span>{i + 1}</span>
                              {medal && <span>{medal}</span>}
                            </td>
                            <td className="py-2 px-2 text-white font-medium">
                              {entry.name}
                            </td>
                            <td className="py-2 px-2 text-right text-white font-semibold">
                              {entry.score ?? "-"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Link
        href="/minigames"
        className="mt-16 inline-block border border-[#0d9488]/40 text-[#0d9488] font-semibold rounded-full px-8 py-2 text-lg transition-all duration-300 hover:bg-[#0d9488]/10 hover:shadow-[0_0_25px_rgba(13,148,136,0.4)]"
      >
        Zurück zu den Minigames
      </Link>
    </main>
  );
}
