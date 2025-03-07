// src/app/context/CartContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface Bet {
  id: string;
  sorteo: string;
  numeroAJugar: string;
  monto: string;
  signo: string;
  tipoApuesta: string;
}

interface CartContextProps {
  cart: Bet[];
  addToCart: (bets: Bet[]) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Bet[]>([]);

  // ✅ Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // ✅ Guardar en localStorage cuando cambia el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (bets: Bet[]) => {
    setCart((prevCart) => {
      const updatedCart = [...prevCart, ...bets];
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Guardar cambios
      return updatedCart;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((bet) => bet.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart)); // Guardar cambios
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
