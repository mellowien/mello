"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center bg-black text-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-2xl"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
          Wiens <span className="text-mello">jüngster</span> Verein.
        </h1>

        <p className="text-gray-400 mb-6 text-lg leading-relaxed">
          Bewegung. Gemeinschaft. Zukunft. <br />
          Mello steht für eine neue Generation von Sport und Kultur.
        </p>

        {/* Mello Button */}
        <Link
          href="/mitgliedschaft"
          className="inline-block bg-[#0d9488] text-black font-semibold rounded-full px-6 py-2 transition-all duration-300 hover:scale-105 hover:bg-[#0b7d71] hover:shadow-[0_0_25px_5px_rgba(13,148,136,0.6)]"
        >
          Mehr über uns
        </Link>
      </motion.section>

      {/* Logo mit Glow + Hover-Scaling */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="mt-16 flex justify-center"
      >
        <div className="relative group flex items-center justify-center transition-transform duration-500 hover:scale-105">
          {/* Dauer-Glow (mit vertikalem Lichtschimmer) */}
          <div
            className="absolute w-[190px] h-[190px] rounded-full opacity-85 blur-[85px] animate-[pulseGlow_5s_ease-in-out_infinite,lightSweep_8s_ease-in-out_infinite] group-hover:blur-[110px] transition-all duration-700 mobile-glow"
            style={{
              background: `
                radial-gradient(circle, rgba(13,148,136,0.35) 0%, rgba(13,148,136,0.15) 70%, transparent 100%),
                linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(255,255,255,0.05) 60%, transparent 100%)
              `,
              backgroundSize: "200% 200%",
            }}
          ></div>

          {/* Logo */}
          <Image
            src="/logo.png"
            alt="Mello Logo"
            width={160}
            height={160}
            className="relative z-10 rounded-full transition-all duration-500 group-hover:drop-shadow-[0_0_25px_rgba(13,148,136,0.8)] cursor-pointer"
            onClick={() => (window.location.href = "/")}
          />
        </div>
      </motion.div>
    </main>
  );
}
