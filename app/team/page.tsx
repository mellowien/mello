"use client";

import { motion } from "framer-motion";

export default function TeamPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6 text-center">

      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="text-6xl md:text-7xl font-extrabold tracking-wide"
      >
        <span className="text-[#0d9488]">coming</span>{" "}
        <span className="text-white">soon</span>
      </motion.h1>

      {/* Glow Effekt unter dem Text */}
      <div
        className="absolute bottom-24 w-[300px] h-[300px] rounded-full blur-[140px] opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(13,148,136,0.6), transparent)",
        }}
      ></div>
    </main>
  );
}
