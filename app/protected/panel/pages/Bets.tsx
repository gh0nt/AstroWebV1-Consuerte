// src/app/panel/pages/Bets.tsx
"use client";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

interface PurchasedBet {
  userName: string;
  date: string; // fecha de la compra
  bets: Bet[];
}

interface Bet {
  id: string;
  sorteo: string;
  numeroAJugar: string;
  monto: string;
  signo: string;
  tipoApuesta: string;
}

const Bets = () => {
  const [purchasedData, setPurchasedData] = useState<PurchasedBet[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [buyerName, setBuyerName] = useState<string>("");

  // Cargar la data de "purchasedBets" desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("purchasedBets");
    if (stored) {
      const parsed = JSON.parse(stored);
      setPurchasedData(parsed); // array de "purchaseData"
    }
  }, []);

  // Función para abrir el modal con detalles de la apuesta
  const handleOpenDetails = (bet: Bet, user: string) => {
    setSelectedBet(bet);
    setBuyerName(user);
    setShowDetailsModal(true);
  };

  // Función para cerrar el modal
  const handleCloseDetails = () => {
    setShowDetailsModal(false);
    setSelectedBet(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-[#042460] rounded-lg p-2 shadow text-white">
        <h1 className="text-2xl font-extrabold text-white text-center   col-span-2">
          HISTORIAL DE COMPRAS
        </h1>
      </div>

      {purchasedData.length === 0 ? (
        <p className="text-gray-600">
          No hay apuestas confirmadas o compradas.
        </p>
      ) : (
        purchasedData.map((purchase, index) => (
          <div key={index} className="mb-8 bg-white shadow p-4 rounded">
            <div className="flex flex-col md:flex-row md:justify-between mb-2">
              <span className="font-semibold text-sm text-[#042460]">
                Comprado por: {purchase.userName}
              </span>
              <span className="text-sm text-gray-600">
                Fecha de Compra: {purchase.date}
              </span>
            </div>

            <table className="min-w-full bg-white text-sm text-gray-600">
              <thead>
                <tr className="bg-blue-50 text-[#042460]">
                  <th className="px-4 py-2 border-b">#Apuesta</th>
                  <th className="px-4 py-2 border-b">Nro. Jugado</th>
                  <th className="px-4 py-2 border-b">Monto</th>
                  <th className="px-4 py-2 border-b">Ver Detalles</th>
                </tr>
              </thead>
              <tbody>
                {purchase.bets.map((bet, i) => (
                  <tr key={bet.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{bet.id}</td>
                    <td className="px-4 py-2 border-b">{bet.numeroAJugar}</td>
                    <td className="px-4 py-2 border-b">{bet.monto}</td>
                    <td className="px-4 py-2 border-b">
                      <button
                        onClick={() =>
                          handleOpenDetails(bet, purchase.userName)
                        }
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        title="Ver detalles"
                      >
                        <FaEye />
                        <span>Ver</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}

      {/* Modal de detalles */}
      {showDetailsModal && selectedBet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-96 p-6 rounded shadow-xl">
            <h2 className="text-lg font-semibold text-[#042460] mb-4">
              Detalles de la Apuesta
            </h2>
            <p className="text-sm mb-2 text-[#042460]">
              <span className="font-semibold">Comprado por:</span> {buyerName}
            </p>
            <p className="text-sm mb-2 text-[#042460]">
              <span className="font-semibold">ID Apuesta:</span>{" "}
              {selectedBet.id}
            </p>
            <p className="text-sm mb-2 text-[#042460]">
              <span className="font-semibold">Número Jugado:</span>{" "}
              {selectedBet.numeroAJugar}
            </p>
            <p className="text-sm mb-2 text-[#042460]">
              <span className="font-semibold">Monto:</span> ${selectedBet.monto}
            </p>
            <p className="text-sm mb-2 text-[#042460]">
              <span className="font-semibold">Signo:</span> {selectedBet.signo}
            </p>
            <p className="text-sm mb-2 text-[#042460]">
              <span className="font-semibold">Tipo Apuesta:</span>{" "}
              {selectedBet.tipoApuesta}
            </p>

            {/* Cerrar modal */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleCloseDetails}
                className="px-4 py-2 border border-[#042460] text-[#042460] rounded bg-transparent hover:bg-blue-100 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bets;
