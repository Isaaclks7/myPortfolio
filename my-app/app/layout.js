import "./globals.css";
import VantaBackground from "./vantaBackground";
import Gtag from "./gtag"

export const metadata = {
  title: "Isaac's Portfolio",
  description: "",
};

export default function RootLayout({
  children,
}) {
  return (
    <html>
      <body className="w-full h-full relative overflow-x-hidden">    
        <div className="relative z-10">
          <Gtag/>
          {children}
        </div>
      </body>
    </html>
  );
}
