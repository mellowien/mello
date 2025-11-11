import "./globals.css";

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
      <body className="bg-black text-white font-sans">
        {children}
      </body>
    </html>
  );
}
