export const metadata = {
  title: "MedQueue+",
  description: "Smart Hospital Management System",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}