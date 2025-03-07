// src/app/panel/components/Sidebar.tsx
"use client";
import { Dispatch, SetStateAction } from "react";

type PanelRoute = "PROFILE" | "PLAY" | "CART" | "BETS" | "Inicio";

interface SidebarProps {
  currentRoute: string;
  setCurrentRoute: Dispatch<SetStateAction<PanelRoute>>;
  isOpen: boolean;
  onClose: () => void; // new prop for the close button
}

export default function Sidebar({
  currentRoute,
  setCurrentRoute,
  isOpen,
  onClose,
}: SidebarProps) {
  // We hide or slide the sidebar based on isOpen
  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 p-4
        flex flex-col justify-center
        transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Botón para cerrar el Sidebar */}
      <div className="absolute top-4 right-4">
        <button
          onClick={onClose}
          className="text-[#042460] hover:text-blue-600 text-3xl font-bold"
        >
          &times;
        </button>
      </div>
      <nav className="space-y-2 mt-2">
        <button
          onClick={() => {
            setCurrentRoute("PROFILE");
            onClose(); // optional: close sidebar after navigating
          }}
          className={`block w-full text-left px-4 py-2 rounded 
            ${
              currentRoute === "PROFILE"
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700"
            }`}
        >
          Perfil
        </button>
        <button
          onClick={() => {
            setCurrentRoute("Inicio");
            onClose();
          }}
          className={`block w-full text-left px-4 py-2 rounded 
            ${
              currentRoute === "Inicio"
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700"
            }`}
        >
          Inicio
        </button>
        <button
          onClick={() => {
            setCurrentRoute("PLAY");
            onClose();
          }}
          className={`block w-full text-left px-4 py-2 rounded 
            ${
              currentRoute === "PLAY"
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700"
            }`}
        >
          Juega
        </button>
        <button
          onClick={() => {
            setCurrentRoute("CART");
            onClose();
          }}
          className={`block w-full text-left px-4 py-2 rounded 
            ${
              currentRoute === "CART"
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700"
            }`}
        >
          Carrito de Apuestas
        </button>
        <button
          onClick={() => {
            setCurrentRoute("BETS");
            onClose();
          }}
          className={`block w-full text-left px-4 py-2 rounded 
            ${
              currentRoute === "BETS"
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700"
            }`}
        >
          Historial de Apuestas
        </button>
      </nav>
    </aside>
  );
}
