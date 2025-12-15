import "./globals.css";
import VantaBackground from "./vantaBackground";

export const metadata = {
  title: "Isaac's Portfolio",
  description: "",
};

export default function RootLayout({
  children,
}) {
  return (
    <html>
      <body className="w-full h-full relative">
        <VantaBackground/>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
