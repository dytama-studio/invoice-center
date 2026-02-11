import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata = {
  title: 'Finance Apps Agrinas',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
