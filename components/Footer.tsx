"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 flex flex-col items-center text-center text-gray-500 text-sm pb-10 border-t border-zinc-900 pt-10">
      
      {/* ✅ Logo + Glow */}
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute w-[130px] h-[130px] rounded-full blur-[60px] bg-[#0d9488]/40 animate-pulse"></div>

        <Image
          src="/logo_footer.png"
          alt="FC Mello Wien Logo"
          width={95}
          height={95}
          className="object-contain opacity-95 brightness-125 drop-shadow-[0_0_25px_rgba(13,148,136,0.7)] transition-all duration-700 hover:drop-shadow-[0_0_45px_rgba(13,148,136,0.9)] select-none pointer-events-none"
          priority
        />
      </div>

      {/* ✅ Footer Navigation */}
      <nav className="flex flex-wrap justify-center gap-8 mb-6 text-[15px] font-medium">
        {[
          { label: "Über uns", href: "/ueber-uns" },
          { label: "Team", href: "/team" },
          { label: "Mitgliedschaft", href: "/mitgliedschaft" },
          { label: "Minigames", href: "/minigames" },
          { label: "Kontakt", href: "/kontakt" },
          { label: "Impressum", href: "/impressum" },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="hover:text-[#0d9488] transition-colors duration-300"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* ✅ Copyright */}
      <p className="mb-4 text-gray-400">
        © {new Date().getFullYear()} FC Mello Wien — Alle Rechte vorbehalten.
      </p>

      {/* ✅ Social Icons */}
      <div className="flex gap-6">
        {[
          { icon: "instagram", link: "https://www.instagram.com/deinlink" },
          { icon: "twitch", link: "https://www.twitch.tv/mellowien" },
          { icon: "youtube", link: "https://www.youtube.com/@deinlink" },
          { icon: "tiktok", link: "https://www.tiktok.com/@deinlink" },
          { icon: "linkedin", link: "https://www.linkedin.com/company/deinlink" },
        ].map(({ icon, link }) => (
          <Link
            key={icon}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative transition-all duration-500 hover:scale-110"
          >
            {/* Glow beim Hover */}
            <span className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-70 group-hover:blur-xl bg-[rgba(13,148,136,0.6)] transition-all duration-500"></span>

            {/* Icon */}
            <i
              className={`fab fa-${icon} relative z-10 text-xl text-gray-400 group-hover:text-[#0d9488] transition-all duration-500`}
            ></i>
          </Link>
        ))}
      </div>
    </footer>
  );
}
