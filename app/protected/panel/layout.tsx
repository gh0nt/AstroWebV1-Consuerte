import { CartProvider } from "@/app/context/CartContext";

export default async function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CartProvider>{children}</CartProvider>;
}
