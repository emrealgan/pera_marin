import type { Metadata } from "next";
import "@/style/global.css";

export const metadata: Metadata = {
  title: "Pera Marin Automation",
  description: "As Pera Marin Electric, which has adopted the principle of perfectionism since the day it was founded and continues its work on the basis of 'Absolute Customer Satisfaction', we offer organized, proactive, trouble-free and high-quality Ship Electricity service. As an experienced and well-equipped Ship Electricity Company, we not only prevent potential problems, but also provide a comfortable operation by facilitating transactions."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="w-full h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
        />
        <meta charSet="utf-8" name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="w-full h-full" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
