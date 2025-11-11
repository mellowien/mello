"use client";

import { motion } from "framer-motion";

export default function ImpressumPage() {
  return (
    <main className="min-h-screen bg-black text-white px-6 pt-28 pb-24 flex flex-col items-center">
      
      {/* Überschrift */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-bold text-center mb-10"
      >
        Impressum
      </motion.h1>

      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="bg-black/60 border border-[#0d9488]/30 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-3xl w-full leading-relaxed shadow-[0_0_25px_rgba(13,148,136,0.15)] text-gray-300"
      >

        <h2 className="text-xl font-semibold text-[#0d9488] mb-2">Verein</h2>
        <p className="mb-6">
          <strong>FC Mello Wien</strong><br />
          Eingetragener gemeinnütziger Verein nach österreichischem Vereinsgesetz.
        </p>

        <h2 className="text-xl font-semibold text-[#0d9488] mb-2">ZVR-Nummer</h2>
        <p className="mb-6">
          <strong>1231202907</strong>
        </p>

        <h2 className="text-xl font-semibold text-[#0d9488] mb-2">Kontakt</h2>
        <p className="mb-6">
          Adresse: <em>Wird nachgetragen</em> <br />
          E-Mail:{" "}
          <a href="mailto:info@mello.at" className="text-[#0d9488] hover:underline">
            
          </a>
        </p>

        <h2 className="text-xl font-semibold text-[#0d9488] mb-2">Vertretungsbefugter Vorstand</h2>
        <p className="mb-6">
          <strong>Obmann:</strong> Daniel Rezai <br />
          <strong>Obmann-Stellvertretung:</strong> Wird ergänzt <br />
          <strong>Kassier:</strong> Wird ergänzt
        </p>

        <h2 className="text-xl font-semibold text-[#0d9488] mb-2">Vereinszweck</h2>
        <p className="mb-6">
          Förderung des Sports, insbesondere Fußball sowie weiterer Sportarten, 
          und der Aufbau einer modernen, offenen und gemeinnützigen Sportkultur.
        </p>

        <h2 className="text-xl font-semibold text-[#0d9488] mb-2">Haftungsausschluss</h2>
        <p className="mb-6">
          Trotz sorgfältiger Kontrolle übernimmt der Verein keine Haftung 
          für externe Links. Für die Inhalte verlinkter Seiten sind ausschließlich 
          deren Betreiber verantwortlich.
        </p>

        <h2 className="text-xl font-semibold text-[#0d9488] mb-2">Urheberrecht</h2>
        <p className="mb-6">
          Alle Inhalte, Grafiken, Logos und Texte auf dieser Website sind urheberrechtlich 
          geschützt. Eine Verwendung ist nur mit ausdrücklicher Zustimmung des Vereins zulässig.
        </p>

        <p className="text-center text-gray-400 mt-10 text-sm">
          Dieses Impressum gilt für: <br />
          <span className="text-[#0d9488]">www.mello.at</span> und alle damit verbundenen Online-Auftritte.
        </p>

      </motion.div>
    </main>
  );
}
