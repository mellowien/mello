"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Kontakt() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("messages").insert([
      {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      },
    ]);

    setIsSubmitting(false);

    if (!error) {
      setShowPopup(true);
      setFormData({ name: "", email: "", message: "" });
    } else {
      console.error(error);
      alert("❌ Es gab ein Problem beim Senden. Bitte versuch es nochmal.");
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-6 pt-28 pb-16"
    >
      {/* Überschrift */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold mb-4 text-center"
      >
        Kontaktiere <span className="text-[#0d9488]">Mello</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-gray-400 mb-10 text-center max-w-lg"
      >
        Egal ob Fragen, Kooperationen oder Feedback – wir freuen uns über jede
        Nachricht!
      </motion.p>

      {/* Formular */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-lg bg-black/70 border border-[#0d9488]/30 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-[0_0_20px_rgba(13,148,136,0.2)]"
      >
        <div className="mb-5">
          <label htmlFor="name" className="block text-gray-300 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-black border border-[#0d9488]/30 rounded-lg text-gray-200 focus:outline-none focus:border-[#0d9488] transition"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="email" className="block text-gray-300 mb-2">
            E-Mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-black border border-[#0d9488]/30 rounded-lg text-gray-200 focus:outline-none focus:border-[#0d9488] transition"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-300 mb-2">
            Nachricht
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-black border border-[#0d9488]/30 rounded-lg text-gray-200 focus:outline-none focus:border-[#0d9488] transition resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#0d9488] text-black font-semibold rounded-full py-2 text-lg transition-all duration-300 hover:scale-105 hover:bg-[#0b7d71] hover:shadow-[0_0_20px_4px_rgba(13,148,136,0.6)] disabled:opacity-50"
        >
          {isSubmitting ? "Senden..." : "Nachricht senden"}
        </button>
      </motion.form>

      {/* Pop-up (Framer Motion Overlay) */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-black border border-[#0d9488]/40 rounded-2xl p-8 text-center shadow-[0_0_25px_rgba(13,148,136,0.6)] max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-[#0d9488] mb-3">
                ✅ Nachricht verschickt!
              </h2>
              <p className="text-gray-300 mb-6">
                Wir haben deine Anfrage erhalten und melden uns
                frühestmöglich bei dir.
              </p>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-[#0d9488] text-black font-semibold rounded-full px-6 py-2 hover:scale-105 transition-all"
              >
                Schließen
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zusatzinfo */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-sm text-gray-500 mt-8"
      >
        Oder direkt via E-Mail:{" "}
        <a
          href="mailto:kontakt@mellowien.at"
          className="text-[#0d9488] hover:underline"
        >
          kontakt@mellowien.at
        </a>
      </motion.p>
    </motion.main>
  );
}
