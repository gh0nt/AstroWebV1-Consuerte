//app/protected/panel/pages/Cart.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../../context/CartContext";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

interface Bet {
  id: string;
  sorteo: string;
  numeroAJugar: string;
  monto: string;
  signo: string;
  tipoApuesta: string;
}

// Example arrays for mapping values to names
const sorteos = [
  { value: "1", name: "Astro Sol" },
  { value: "2", name: "Astro Luna" },
];

const signos = [
  { value: "01", name: "Aries" },
  { value: "02", name: "Tauro" },
  { value: "03", name: "Géminis" },
  { value: "04", name: "Cáncer" },
  { value: "05", name: "Leo" },
  { value: "06", name: "Virgo" },
  { value: "07", name: "Libra" },
  { value: "08", name: "Escorpio" },
  { value: "09", name: "Sagitario" },
  { value: "10", name: "Capricornio" },
  { value: "11", name: "Acuario" },
  { value: "12", name: "Piscis" },
];

const tipoApuesta = [
  { value: "4200", name: "4 Cifras" },
  { value: "1000", name: "3 Cifras" },
  { value: "100", name: "2 Cifras" },
];

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();

  // UI states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Calculate total from cart items
  const totalMonto = cart.reduce(
    (total, bet) => total + parseInt(bet.monto, 10),
    0
  );

  // Helper to format numbers (e.g., amounts)
  const formatearNumero = (numero: number): string => {
    return new Intl.NumberFormat("es-CO").format(numero);
  };

  // Show the confirmation modal
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("El carrito está vacío.");
      return;
    }
    setShowConfirmModal(true);
  };

  // Called when user cancels in modal
  const handleCancelPurchase = () => {
    setShowConfirmModal(false);
  };

  //  ZonaPagos call
  const handleConfirmPurchase = async () => {
    setLoading(true);
    try {
      const paymentData = {
        total: totalMonto,
        idPago: `ORD-${Date.now()}`, // Unique ID for this payment
        descripcionPago: "Pago de apuestas en ConSuerte",
      };

      console.log("Sending payment data:", paymentData); // Log para depuración

      const response = await fetch("/api/zonapagos/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      console.log("Response status:", response.status); // Log para depuración

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data); // Log para depuración

      if (data.success && data.url) {
        window.open(data.url, "_blank");
        toast.success("Redirigiendo a ZonaPagos...");

        // 2) Start polling for payment verification
        const pollStatus = async () => {
          try {
            const verificationResponse = await fetch(
              `/api/zonapagos/verificacion?id_pago=${paymentData.idPago}&id_comercio=${process.env.ZONAPAGOS_COMMERCE_ID}`
            );
            const verificationData = await verificationResponse.json();

            // Suppose int_estado=1 means paid/verified
            if (verificationData.data?.int_estado === 1) {
              // Clear cart and redirect to some success page
              clearCart();
              router.push(`/payment/status?id_pago=${paymentData.idPago}`);
              clearInterval(interval); // stop polling
            }
          } catch (error) {
            console.error("Error verifying payment:", error); // Log para depuración
            toast.error("Error verificando el pago");
          }
        };

        // Poll every 5 seconds
        const interval = setInterval(pollStatus, 5000);
        // Stop polling after 5 minutes
        setTimeout(() => clearInterval(interval), 300000);
      } else {
        toast.error("Error al procesar el pago en ZonaPagos.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error); // Log para depuración
      toast.error("Error de conexión con el servidor de pagos.");
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
    }
  };

  // Remove a single bet
  const handleRemoveFromCart = (id: string) => {
    removeFromCart(id);
    toast.info("Apuesta eliminada del carrito.");
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header */}
      <div className="w-full bg-[#042460] rounded-lg p-2 shadow text-white">
        <h1 className="text-2xl font-extrabold text-white text-center col-span-2">
          CARRITO DE COMPRAS
        </h1>
      </div>

      {cart.length === 0 ? (
        <p className="text-[#042460] mt-4">No tienes apuestas en el carrito.</p>
      ) : (
        <div className="bg-white p-2 rounded mt-4 w-full mx-auto">
          <p className="text-me text-[#042460] bg-blue-100 p-2 font-semibold rounded text-center">
            Pendientes por confirmar
          </p>
          <ul className="mt-4 space-y-2 text-gray-600 text-sm">
            {cart.map((bet) => (
              <li
                key={bet.id}
                className="border-b border-[#7ba6f7] p-2 bg-white rounded-lg shadow-md"
              >
                <div className="flex flex-col w-full">
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#042460]">
                      Sorteo:
                    </span>
                    <span>
                      {sorteos.find((s) => s.value === bet.sorteo)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#042460]">Signo:</span>
                    <span>
                      {signos.find((s) => s.value === bet.signo)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#042460]">
                      Número Jugado:
                    </span>
                    <span>{bet.numeroAJugar}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-[#042460]">Monto:</span>
                    <span>${bet.monto}</span>
                  </div>
                </div>
                <div className="py-3 flex justify-end">
                  <button
                    onClick={() => handleRemoveFromCart(bet.id)}
                    className="text-red-700 hover:text-red-500 "
                    title="Eliminar Apuesta"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between font-light text-[#042460]">
            <span>Subtotal:</span>
            <span>${formatearNumero(totalMonto)}</span>
          </div>
          <div className="mt-1 flex justify-between font-semibold text-[#042460]">
            <span>Total:</span>
            <span>${formatearNumero(totalMonto)}</span>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleCheckout}
              className="mt-4 border border-[#042460] text-[#042460] px-4 py-2 rounded bg-transparent hover:bg-blue-100 transition-all"
            >
              Ir a PAGAR
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-80 p-6 rounded shadow-2xl flex flex-col">
            <h2 className="text-lg font-semibold text-[#042460] mb-4 text-center">
              ¿Confirmar compra?
            </h2>
            <div className="flex justify-around mt-4">
              <button
                onClick={handleConfirmPurchase}
                disabled={loading}
                className={`px-4 py-2 text-white rounded transition-colors ${
                  loading ? "bg-gray-400" : "bg-green-700 hover:bg-green-400"
                }`}
              >
                {loading ? "Procesando..." : "Sí"}
              </button>
              <button
                onClick={handleCancelPurchase}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
