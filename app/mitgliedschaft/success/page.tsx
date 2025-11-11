"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [name, setName] = useState<string>("");

  // Name aus URL holen (Stripe redirect → ?name=Max)
  useEffect(() => {
    const n = searchParams.get("name");
    if (n) setName(n);
  }, [searchParams]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6">

      {/* Dankes-Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-black/70 border border-[#0d9488]/40 rounded-3xl p-10 text-center max-w-lg shadow-[0_0_30px_rgba(13,148,136,0.3)]"
      >
        <h1 className="text-4xl font-bold mb-4">
          Danke{ name ? `, ${name}` : "" }! 🎉
        </h1>

        <p className="text-gray-300 text-lg mb-6 leading-relaxed">
          Deine Unterstützung bedeutet uns enorm viel.  
          Du bist jetzt offizielles Mitglied des  
          <span className="text-[#0d9488] font-semibold"> FC Mello Wien</span>.
          <br />
          Gemeinsam bauen wir etwas Neues auf.
        </p>

        <motion.a
          href="/"
          whileHover={{ scale: 1.05 }}
          className="mt-4 inline-block bg-[#0d9488] text-black font-semibold rounded-full px-8 py-3 text-lg transition-all shadow-[0_0_20px_rgba(13,148,136,0.5)] hover:bg-[#0b7d71]"
        >
          Zurück zur Startseite
        </motion.a>
      </motion.div>
    </main>
  );
}
