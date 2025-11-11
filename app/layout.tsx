import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // ✅ Wichtig

export const metadata = {
  title: "FC Mello Wien",
  description: "Wiens jüngster Verein",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="bg-black text-white font-sans flex flex-col min-h-screen">
        
        {/* Header */}
        <Header />

        {/* Hauptinhalt */}
        <main className="flex-grow pt-20">{children}</main>

        {/* ✅ Dein globaler Footer aus /components/Footer.tsx */}
        <Footer />

      </body>
    </html>
  );
}

