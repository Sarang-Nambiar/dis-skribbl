import "./globals.css"

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="flex flex-col">{children}</body>
    </html>
  );
}
