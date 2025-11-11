"use client";
import Link from "next/link";

export default function MinigamesPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-24">
      <h1 className="text-4xl font-bold mb-6 text-[#0d9488]">Minigames</h1>

      <p className="text-gray-400 mb-6 text-center max-w-xl leading-relaxed">
        Beim Programmieren der Seite wurde uns etwas langweilig –
        also haben wir ein paar Minispiele entwickelt.
        <br />
        Gewinne kleine Preise als Top-Performer in den jeweiligen{" "}
        <span className="text-[#0d9488] font-semibold">Hall of Fames</span>.
      </p>

      <p className="text-gray-500 mb-10 text-center max-w-md">
        Wähle ein Spiel und stell deinen Highscore auf.
      </p>

      {/* Spiele-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
        {[
          {
            name: "MelloTap",
            desc: "Mal sehen, wie schnell du wirklich bist.",
            link: "/minigames/mellotap",
          },
          {
            name: "MelloRush",
            desc: "Weich aus – oder verlier alles.",
            link: "/minigames/mellorush",
          },
          {
            name: "TicTacToe",
            desc: "Du hast keine Chance.",
            link: "/minigames/tictactoe",
          },
        ].map((game) => (
          <Link
            key={game.name}
            href={game.link}
            className="group border border-[#0d9488]/40 rounded-xl px-8 py-8 text-center hover:bg-[#0d9488]/10 hover:shadow-[0_0_25px_rgba(13,148,136,0.4)] transition-all duration-300"
          >
            <h2 className="text-2xl font-semibold text-white mb-2 group-hover:text-[#0d9488] transition">
              {game.name}
            </h2>
            <p className="text-gray-500 text-sm italic group-hover:text-gray-400">
              {game.desc}
            </p>
          </Link>
        ))}
      </div>

      {/* Hall of Fame Button */}
      <Link
        href="/minigames/hall-of-fame"
        className="mt-4 inline-block bg-[#0d9488] text-black font-semibold rounded-full px-8 py-3 text-lg transition-all duration-300 hover:scale-105 hover:bg-[#0b7d71] hover:shadow-[0_0_25px_4px_rgba(13,148,136,0.5)]"
      >
        Hall of Fames ansehen
      </Link>
    </main>
  );
}
