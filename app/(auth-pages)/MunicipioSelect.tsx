// components/MunicipiosSelect.tsx
"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";

interface Municipio {
  codigo: number;
  municipio: string;
}

interface MunicipiosSelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
}

export default function MunicipiosSelect({
  name,
  value,
  onChange,
  label,
}: MunicipiosSelectProps) {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  useEffect(() => {
    async function fetchMunicipios() {
      try {
        const res = await fetch("/data/municipios.json");
        if (!res.ok) {
          throw new Error("Error al cargar el archivo JSON de municipios");
        }
        const data = await res.json();
        setMunicipios(data);
      } catch (error) {
        console.error("Error al cargar municipios:", error);
      }
    }
    fetchMunicipios();
  }, []);

  return (
    <div>
      <Label htmlFor={name} className="block text-[#042460] font-medium">
        {label}
      </Label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="text-sm bg-[#e6eaff] w-full px-4 py-2 text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042460]"
        required
      >
        <option value="" disabled>
          Selecciona el municipio
        </option>
        {municipios.map((m) => (
          <option key={m.codigo} value={m.codigo.toString()}>
            {m.municipio}
          </option>
        ))}
      </select>
    </div>
  );
}
