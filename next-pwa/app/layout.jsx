import "normalize.css/normalize.css";
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "./global.css";

import { MantineProvider, ColorSchemeScript, Container } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Inter } from "next/font/google";

import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./hooks/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "The Attendance App",
  description: "The Attendance App",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body className={inter.className}>
        <MantineProvider defaultColorScheme="dark">
          <AuthProvider>
            <Container size="65rem" px="s" h="calc(100% - 60px)">
              <Navbar />
              {children}
            </Container>
            <Notifications />
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
