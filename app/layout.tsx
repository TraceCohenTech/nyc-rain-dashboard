import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NYC Summer Rain Report | Weekend vs Weekday",
  description: "Analyzing whether it rains more on weekends during NYC summers, 2020–2025.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
