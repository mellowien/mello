"use client";

import { motion } from "framer-motion";

export default function MelloTVPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-black text-gray-100 flex flex-col items-center pt-28 pb-16 px-4"
    >
      {/* Titel */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#0d9488] mb-6 drop-shadow-[0_0_10px_rgba(13,148,136,0.6)]">
        Mello TV – Livestream
      </h1>

      {/* Twitch Livestream */}
      <div className="w-full max-w-5xl aspect-video rounded-xl overflow-hidden border border-[#0d9488]/40 shadow-[0_0_25px_rgba(13,148,136,0.3)] mb-12">
        <iframe
          src="https://player.twitch.tv/?channel=mellowien&parent=localhost&parent=yourdomain.com"
          // ❗️Wichtig: "parent" muss deine Domain sein, sonst funktioniert der Twitch-Player nicht
          height="100%"
          width="100%"
          allowFullScreen
        ></iframe>
      </div>

      {/* Highlights */}
      <h2 className="text-2xl font-semibold mb-4 text-[#0d9488]">
         Highlights
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {/* Beispielvideos – du kannst hier Twitch Clips oder YouTube-Videos einfügen */}
        <div className="aspect-video rounded-xl overflow-hidden border border-[#0d9488]/30">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID_1"
            title="Highlight 1"
            allowFullScreen
          ></iframe>
        </div>
        <div className="aspect-video rounded-xl overflow-hidden border border-[#0d9488]/30">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID_2"
            title="Highlight 2"
            allowFullScreen
          ></iframe>
        </div>
        <div className="aspect-video rounded-xl overflow-hidden border border-[#0d9488]/30">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID_3"
            title="Highlight 3"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </motion.main>
  );
}
