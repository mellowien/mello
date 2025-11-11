"use client";

import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 pt-28 pb-20 flex flex-col items-center">
      
      {/* Überschrift */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-bold text-center mb-10"
      >
        Über <span className="text-[#0d9488]">uns</span>
      </motion.h1>

      {/* Glow Effekt */}
      <div
        className="absolute top-40 w-[260px] h-[260px] rounded-full blur-[150px] opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(13,148,136,0.6), transparent)"
        }}
      ></div>

      {/* Textcontainer */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative bg-black/70 border border-[#0d9488]/30 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-3xl leading-relaxed shadow-[0_0_25px_rgba(13,148,136,0.15)]"
      >
        <p className="text-gray-300 mb-6">
          Der <strong>FC Mello Wien</strong> ist Wiens jüngster Verein – entstanden aus dem
          Wunsch, etwas Neues aufzubauen. Etwas, das Bewegung, Gemeinschaft und eine moderne,
          offene Sportkultur vereint.
        </p>

        <p className="text-gray-300 mb-6">
          Gegründet wurde der Verein von ein paar Freunden, die nach Wien gezogen sind
          und hier nicht nur Fußball spielen wollten, sondern eine Vision hatten: Einen Verein zu
          schaffen, der jung, urban und zugänglich ist – für alle, die etwas bewegen möchten.
        </p>

        <p className="text-gray-300 mb-6">
          Mello steht für ein Lebensgefühl. Für Menschen, die gemeinsam etwas schaffen wollen.
          In den ersten Jahren übernehmen wir vieles selbst – Organisation, Trainings, Social
          Media, Vereinsaufbau. Ein kleines Team von Freunden legt die Basis. </p>

        <p className="text-gray-300 mb-6">
          Langfristig möchten wir nicht nur Fußball fördern, sondern ein echter
          <strong> Multisportverein</strong> werden – mit Angeboten für Kinder, Jugendliche
          und Erwachsene. Sportarten wie Basketball oder Tennis sollen ebenfalls Teil der
          Mello-Familie werden.
        </p>

        <p className="text-gray-300 mb-6">
          Der <strong>FC Mello Wien</strong> ist ein eingetragener gemeinnütziger Verein.
          Jeder Cent, den wir erhalten, fließt zurück in den Sport und in den Aufbau unserer
          Strukturen. Kein Profit – nur Leidenschaft und Entwicklung.
        </p>

        <p className="text-gray-300 font-medium text-lg mt-8 text-center">
          Mello ist mehr als ein Name.  
          <span className="block text-[#0d9488] text-xl font-semibold mt-2">
            Es ist eine Bewegung. Und du kannst Teil davon sein.
          </span>
        </p>
      </motion.div>
    </main>
  );
}
