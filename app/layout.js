import "./globals.css";

export const metadata = {
  title: "Madrasah Sore Madani",
  description: "Sistem Manajemen Madrasah Sore Madani",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
