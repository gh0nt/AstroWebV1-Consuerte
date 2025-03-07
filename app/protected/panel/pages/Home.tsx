// src/app/panel/pages/Home.tsx

"use client";

import { Dispatch, SetStateAction } from "react";
type PanelRoute = "PROFILE" | "PLAY" | "CART" | "BETS" | "Inicio";

export default function Home({
  setCurrentRoute,
}: {
  setCurrentRoute: Dispatch<SetStateAction<PanelRoute>>;
}) {
  const games = [{ name: "Súper Astro", image: "/img/logoastro.webp" }];

  return (
    <div className="space-y-4 items-center mx-auto p-2 bg-transparent max-w-screen-md overflow-y-auto mt-3">
      <div className="bg-[#042460] rounded-lg p-2 shadow text-white">
        <h1 className="text-2xl font-extrabold text-white text-center col-span-2">
          BIENVENIDO/A AL PANEL DE APUESTAS
        </h1>
      </div>

      {/* Banner 2 */}

      <div className="bg-[#042460] rounded-lg p-2 shadow text-white">
        <h1 className="text-2xl font-extrabold text-white text-center   col-span-2">
          ELIGE TU JUEGO
        </h1>
      </div>

      <div className="items-center grid grid-cols-1 md:grid-cols-1 gap-6 content-center">
        {games.map((game, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-6 bg-[#e6eaff] rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-300"
          >
            <img
              src={game.image}
              alt={game.name}
              className="h-32 mb-4 object-contain rounded-xl"
            />
            <h3 className="text-lg font-semibold text-[#042460] mb-4">
              {game.name}
            </h3>
            <button
              className="bg-[#042460] text-white px-4 py-2 rounded-lg hover:bg-[#0948B3] transition-colors"
              onClick={() => setCurrentRoute("PLAY")}
            >
              Jugar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
