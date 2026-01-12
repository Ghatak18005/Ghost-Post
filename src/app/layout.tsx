import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider"; // Import it
import Provider from "@/components/SessionProvider"; 

// ... imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          {/* Wrap everything in ThemeProvider */}
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}