import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className="min-h-screen bg-base-100 text-base-content">
        {children}
      </body>
    </html>
  );
}