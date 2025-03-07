// src/app/panel/pages/Play.tsx

"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaTrash, FaCopy } from "react-icons/fa";
import { useCart } from "../../../context/CartContext";
import { v4 as uuidv4 } from "uuid"; // Importar UUID

interface Bet {
  id: string;
  sorteo: string; // "1" o "2" (el value)
  numeroAJugar: string;
  monto: string;
  signo: string; // e.g. "01" o "10" (el value)
  tipoApuesta: string; // e.g. "4200" o "1000" (el value)
}

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
  { value: "ALL", name: "Todos los Signos" }, // Opción de todos los signos
];

const tipoApuesta = [{ value: "42000", name: "4" }];

export default function Play() {
  const { addToCart } = useCart();

  const [bets, setBets] = useState<Bet[]>([
    {
      id: uuidv4(),
      sorteo: "",
      numeroAJugar: "",
      monto: "",
      signo: "",
      tipoApuesta: "",
    },
  ]);

  // Cargar las apuestas desde localStorage
  useEffect(() => {
    const storedBets = localStorage.getItem("currentBets");
    if (storedBets) {
      setBets(JSON.parse(storedBets));
    }
  }, []);

  // Guardar las apuestas en localStorage
  useEffect(() => {
    localStorage.setItem("currentBets", JSON.stringify(bets));
  }, [bets]);

  // Agregar una apuesta en blanco
  const handleAddBet = () => {
    setBets((prev) => [
      ...prev,
      {
        id: uuidv4(),
        sorteo: "",
        numeroAJugar: "",
        monto: "",
        signo: "",
        tipoApuesta: "",
      },
    ]);
  };

  // Duplicar apuesta
  const handleDuplicateBet = (index: number) => {
    const betToDuplicate = bets[index];
    setBets([...bets, { ...betToDuplicate, id: uuidv4() }]);
    toast.info(`Apuesta #${index + 1} duplicada exitosamente.`);
  };

  // Eliminar apuesta
  const handleRemoveBet = (id: string) => {
    setBets((prev) => prev.filter((bet) => bet.id !== id));
    toast.info(`Apuesta eliminada exitosamente.`);
  };

  // Manejar cambios en los campos de cada apuesta
  const handleBetChange = (index: number, field: keyof Bet, value: string) => {
    const updatedBets = bets.map((bet, i) =>
      i === index ? { ...bet, [field]: value } : bet
    );
    setBets(updatedBets);
  };

  // Función para calcular el premio
  const calcularPremio = (monto: number, tipoApuestaFactor: number) => {
    // Ejem: Si 'tipoApuestaFactor' = 4200 => multiplica
    const montoSinIVA = monto / 1.19;
    let premio = montoSinIVA * tipoApuestaFactor;

    // Impuesto si premio > 2390000
    if (premio > 2390000) {
      const impuesto = premio * 0.2;
      premio -= impuesto;
    }

    return Math.round(premio);
  };

  // Formatear números con separadores de miles
  const formatearNumero = (num: number): string =>
    new Intl.NumberFormat("es-CO").format(num);

  // Enviar apuestas al carrito de apuestas
  const handleSubmit = () => {
    let hasError = false;
    const errors: string[] = [];

    bets.forEach((bet, idx) => {
      if (!bet.sorteo) {
        hasError = true;
        errors.push(`Debes seleccionar un sorteo en la apuesta #${idx + 1}.`);
      }
      if (!bet.signo) {
        hasError = true;
        errors.push(`Debes seleccionar un signo en la apuesta #${idx + 1}.`);
      }
      if (!bet.tipoApuesta) {
        hasError = true;
        errors.push(
          `Debes seleccionar un tipo de apuesta en la apuesta #${idx + 1}.`
        );
      }
      if (!/^\d{4}$/.test(bet.numeroAJugar)) {
        hasError = true;
        errors.push(
          `El número a jugar en la apuesta #${
            idx + 1
          } debe tener exactamente 4 dígitos.`
        );
      }
      const montoNum = parseInt(bet.monto, 10);
      if (isNaN(montoNum) || montoNum < 500 || montoNum > 10000) {
        hasError = true;
        errors.push(
          `El monto en la apuesta #${idx + 1} debe estar entre 500 y 10000.`
        );
      }
    });

    if (hasError) {
      errors.forEach((err) => toast.error(err));
      return;
    }

    //Expandir apuestas si es "TODOS LOS SIGNOS"

    let finalBets: Bet[] = [];
    bets.forEach((bet) => {
      if (bet.signo === "ALL") {
        signos.forEach((s) => {
          if (s.value !== "ALL") {
            finalBets.push({
              ...bet,
              id: uuidv4(),
              signo: s.value,
              monto: (parseInt(bet.monto, 10) / 12).toString(), // Divide el monto entre 12
            });
          }
        });
      } else {
        finalBets.push(bet);
      }
    });

    console.log("📌 Apuestas enviadas al carrito:", finalBets); // Cambia `bets` por `finalBets`
    addToCart(finalBets);

    // Limpiar apuestas
    setBets([
      {
        id: uuidv4(),
        sorteo: "",
        numeroAJugar: "",
        monto: "",
        signo: "",
        tipoApuesta: "",
      },
    ]);
    toast.success("Apuestas enviadas exitosamente y agregadas al carrito.");
    localStorage.removeItem("currentBets");
  };

  return (
    <div>
      <div className=" p-6 bg-white rounded-lg overflow-y-auto max-w-full">
        <div className="bg-[#042460] rounded-lg p-2  text-white mb-4">
          <h1 className="text-2xl font-extrabold text-white text-center col-span-2">
            REALIZA TU APUESTA
          </h1>
        </div>

        <div className="mb-6">
          {bets.map((bet, index) => (
            <div
              key={bet.id}
              className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50 relative"
            >
              {/* ENUMERADOR DE APUESTAS*/}

              <h2 className="font-extrabold text-xl text-gray-100 shadow-md border-gray-200 bg-[#042460] mb-2 text-center p-2 rounded-lg uppercase">
                Apuesta # {index + 1}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* SELECT Sorteo */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`sorteo-${index}`}
                    className="mb-1 text-[#042460] text-sm font-semibold"
                  >
                    Sorteo:
                  </label>
                  <select
                    id={`sorteo-${index}`}
                    value={bet.sorteo}
                    onChange={(e) =>
                      handleBetChange(index, "sorteo", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded text-[#042460] bg-[#e6eaff]"
                  >
                    <option value="">Seleccione Sorteo</option>
                    {sorteos.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Número Apuesta */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`numero-${index}`}
                    className="mb-1 text-[#042460] text-sm font-semibold"
                  >
                    Número Apuesta:
                  </label>
                  <input
                    id={`numero-${index}`}
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    value={bet.numeroAJugar}
                    onChange={(e) =>
                      handleBetChange(index, "numeroAJugar", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded text-gray-600 bg-[#e6eaff]"
                  />
                </div>

                {/* SELECT Signo */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`signo-${index}`}
                    className="mb-1 text-[#042460] text-sm font-semibold"
                  >
                    Signo:
                  </label>
                  <select
                    value={bet.signo}
                    onChange={(e) =>
                      handleBetChange(index, "signo", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded text-[#042460] bg-[#e6eaff] "
                  >
                    <option value="">Seleccione Signo</option>
                    {signos.map((sg) => (
                      <option key={sg.value} value={sg.value}>
                        {sg.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* SELECT Tipo de Apuesta */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`tipoApuesta-${index}`}
                    className="mb-1 text-[#042460] text-sm font-semibold"
                  >
                    Tipo de Apuesta:
                  </label>
                  <select
                    id={`tipoApuesta-${index}`}
                    value={bet.tipoApuesta}
                    onChange={(e) =>
                      handleBetChange(index, "tipoApuesta", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded text-[#042460] bg-[#e6eaff]"
                  >
                    <option value="">Seleccione Tipo de Apuesta</option>
                    {tipoApuesta.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Monto */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`monto-${index}`}
                    className="mb-1 text-[#042460] text-sm font-semibold"
                  >
                    Monto a Apostar:
                  </label>
                  <input
                    id={`monto-${index}`}
                    type="number"
                    placeholder="$$"
                    value={bet.monto}
                    onChange={(e) =>
                      handleBetChange(index, "monto", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded text-[#042460] bg-[#e6eaff]"
                  />
                </div>

                {/* Previsualización */}
                <div className="flex flex-col justify-center">
                  {bet.sorteo && bet.signo && bet.numeroAJugar && bet.monto ? (
                    <div className="w-full p-2 border border-blue-500 rounded bg-[#e6eaff]">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-blue-600">
                          Previsualización
                        </span>
                        <span className="font-medium text-sm text-blue-600">
                          Sorteo:{" "}
                          {sorteos.find((s) => s.value === bet.sorteo)?.name}{" "}
                          Signo:{" "}
                          {signos.find((s) => s.value === bet.signo)?.name}
                        </span>
                        <span className="font-medium text-sm text-blue-600">
                          Tipo de Apuesta:{" "}
                          {
                            tipoApuesta.find(
                              (tipo) => tipo.value === bet.tipoApuesta
                            )?.name
                          }
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          Número: {bet.numeroAJugar}
                        </span>

                        {/* Monto y Premio */}
                        <span className="text-sm font-medium text-blue-600">
                          Monto: $
                          {bet.signo === "ALL"
                            ? // Si es "TODOS LOS SIGNOS", multiplica por 12
                              parseInt(bet.monto, 10) / 12
                            : bet.monto}
                        </span>

                        <span className="font-bold text-sm text-blue-600">
                          Premio: $
                          {formatearNumero(
                            // Llamamos la función calcularPremio con el monto multiplicado x12 si es "ALL"
                            calcularPremio(
                              bet.signo === "ALL"
                                ? parseFloat(bet.monto) / 12
                                : parseFloat(bet.monto),
                              parseFloat(bet.tipoApuesta)
                            )
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full p-2 border border-gray-300 rounded bg-gray-100">
                      <span className="text-gray-500 text-sm">
                        Previsualización
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones duplicar y eliminar */}
              <div className="flex justify-end w-full mt-2">
                <button
                  onClick={() => handleDuplicateBet(index)}
                  className="bg-[#042460] text-white p-2 py-2 rounded hover:bg-[#0948B3] transition-colors items-center justify-center mr-2"
                  title="Duplicar Apuesta"
                >
                  <FaCopy size={16} />
                </button>

                <button
                  onClick={() => handleRemoveBet(bet.id)}
                  className="px-2 py-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Eliminar Apuesta"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            {" "}
            <button
              onClick={handleAddBet}
              className=" bg-[#042460] text-white w-10 h-10 rounded-full hover:bg-[#0948B3] transition-colors flex items-center justify-center mr-3 "
            >
              <span className="text-2xl">+</span>
            </button>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#b96233] to-[#042460] via-[#1260a1] 
             animate-gradient-x text-white px-6 py-3 rounded-lg  text-shadow-md
             hover:scale-105 transform transition-transform duration-200 
             shadow-lg relative overflow-hidden"
          >
            <span className="relative font-bold z-10 uppercase">
              Añadir al Carrito
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
