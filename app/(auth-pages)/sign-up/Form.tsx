"use client";

import { signUpAction } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import MunicipiosSelect from "../MunicipioSelect";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function SignupForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    tipo_identificacion: "",
    numero_identificacion: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    genero: "",
    fecha_nacimiento: "",
    lugar_nacimiento: "",
    fecha_expedicion_documento: "",
    lugar_expedicion_documento: "",
    fch_vento_ident_extranjera: "",
    celular: "",
    telefono_fijo: "",
    ciudad_domicilio: "",
    direccion_domicilio: "",
    codigo_postal: "",
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [isExtranjero, setIsExtranjero] = useState(false);
  const [municipios, setMunicipios] = useState<
    { codigo: number; municipio: string }[]
  >([]);

  // Obtener municipios
  useEffect(() => {
    const fetchMunicipios = async () => {
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
    };
    fetchMunicipios();
  }, []);

  // Mostrar mensajes de éxito o error en la URL
  useEffect(() => {
    const type = searchParams.get("type");
    const message = searchParams.get("message");

    if (type && message) {
      if (type === "success") {
        toast.success(decodeURIComponent(message));
      } else if (type === "error") {
        toast.error(decodeURIComponent(message));
      }
    }
  }, [searchParams]);

  // Manejar cambios en cualquier campo
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Actualizar isExtranjero si el campo es "tipo_identificacion"
    if (name === "tipo_identificacion") {
      setIsExtranjero(value === "CE"); // "CE" => Cédula de Extranjería
    }
  };

  // En el primer paso se valida que las contraseñas coincidan
  const handleSubmit = async () => {
    if (currentStep === 2) {
      try {
        const formDataInstance = new FormData();

        // Recorrer todos los campos del formulario
        Object.entries(formData).forEach(([key, value]) => {
          // Si el valor es un objeto (ej: municipio), tomar solo el código
          if (typeof value === "object" && value !== null) {
            formDataInstance.append(
              key,
              (value as { codigo: number }).codigo.toString()
            );
          } else {
            formDataInstance.append(key, value);
          }
        });

        // Llamar a la acción de registro
        const result = await signUpAction(formDataInstance);

        // Manejar el resultado
        if (result.success) {
          toast.success(result.message); // Mostrar toast de éxito
          router.push("/sign-in"); // Redirigir después del toast
        } else {
          toast.error(result.error); // Mostrar toast de error
        }
      } catch (error) {
        toast.error("Error durante el registro"); // Manejar errores inesperados
      }
    }
  };
  // Antes de pasar a la segunda parte del formulario, se valida que las contraseñas coincidan
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Las contraseñas no coinciden");
        return;
      }
      setCurrentStep(2);
    }
  };

  return (
    <form className="flex flex-col w-full max-w-md mx-auto bg-white p-4 md:p-6 rounded-md shadow-sm mt-8 md:mt-16">
      <h1 className="text-2xl md:text-4xl font-extrabold text-center text-[#29a5dc] mb-4 md:mb-6">
        REGÍSTRATE
      </h1>
      <p className="block text-[#042460] text-sm font-semibold mb-4 text-center">
        Completa la siguiente información para crear tu cuenta, confirma tu
        correo electrónico e inicia sesión.
      </p>

      {currentStep === 1 && (
        <div className="flex flex-col gap-4">
          {/* Correo */}
          <div>
            <Label htmlFor="email" className="block text-[#042460] font-medium">
              Correo electrónico
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="ejemplo@consuerte.com.co"
              className="bg-[#e6eaff]"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Contraseña */}
          <div>
            <Label
              htmlFor="password"
              className="block text-[#042460] font-medium"
            >
              Contraseña
            </Label>
            <Input
              name="password"
              type="password"
              placeholder="Tu contraseña"
              minLength={8}
              className="bg-[#e6eaff]"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-[#042460] font-medium"
            >
              Confirmar Contraseña
            </Label>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="Repite tu contraseña"
              minLength={8}
              className={`bg-[#e6eaff] ${
                formData.confirmPassword &&
                formData.password !== formData.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-[#042460]"
              }`}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <SubmitButton
            className="bg-[#042460] text-white mt-4"
            onClick={handleNextStep}
          >
            Siguiente
          </SubmitButton>
        </div>
      )}

      {currentStep === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Datos personales adicionales */}
          <div>
            <Label className="block text-[#042460] font-medium">
              Tipo de Identificación
            </Label>
            <select
              name="tipo_identificacion"
              className="w-full p-2 border-gray-300 rounded bg-[#e6eaff] text-gray-500 text-sm  "
              required
              value={formData.tipo_identificacion}
              onChange={handleChange}
            >
              <option value="">Seleccione...</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
            </select>
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">
              Número de Identificación
            </Label>
            <Input
              name="numero_identificacion"
              className="bg-[#e6eaff]"
              required
              value={formData.numero_identificacion}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">
              Primer Nombre
            </Label>
            <Input
              name="primer_nombre"
              className="bg-[#e6eaff]"
              required
              value={formData.primer_nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">
              Segundo Nombre (opcional)
            </Label>
            <Input
              name="segundo_nombre"
              className="bg-[#e6eaff]"
              value={formData.segundo_nombre}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">
              Primer Apellido
            </Label>
            <Input
              name="primer_apellido"
              className="bg-[#e6eaff]"
              required
              value={formData.primer_apellido}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">
              Segundo Apellido (opcional)
            </Label>
            <Input
              name="segundo_apellido"
              className="bg-[#e6eaff]"
              value={formData.segundo_apellido}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">Género</Label>
            <select
              name="genero"
              className="w-full p-2 border-gray-300 text-gray-500 text-sm rounded bg-[#e6eaff]"
              required
              value={formData.genero}
              onChange={handleChange}
            >
              <option value="">Seleccione...</option>
              <option value="1">Masculino</option>
              <option value="2">Femenino</option>
            </select>
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">
              Fecha de Nacimiento
            </Label>
            <Input
              type="date"
              name="fecha_nacimiento"
              className="bg-[#e6eaff]"
              required
              value={formData.fecha_nacimiento}
              onChange={handleChange}
            />
          </div>

          {/* Lugar de Nacimiento*/}
          <div>
            <MunicipiosSelect
              name="lugar_nacimiento"
              value={formData.lugar_nacimiento}
              onChange={handleChange}
              label="Lugar de Nacimiento"
            />
          </div>

          {/* Fecha expedición de Documento*/}
          <div>
            <Label className="block text-[#042460] font-medium">
              Fecha de Expedición del Documento
            </Label>
            <Input
              type="date"
              name="fecha_expedicion_documento"
              className="bg-[#e6eaff]"
              required
              value={formData.fecha_expedicion_documento}
              onChange={handleChange}
            />
          </div>

          {/* Lugar de Expedición de Documento*/}
          <div>
            <MunicipiosSelect
              name="lugar_expedicion_documento"
              value={formData.lugar_expedicion_documento}
              onChange={handleChange}
              label="Lugar de Expedición del Documento"
            />
          </div>

          {/* Fecha de Vencimiento ID Extranjera (condicional) */}
          {isExtranjero && (
            <div>
              <Label className="block text-[#042460] font-medium">
                Fecha de Vencimiento ID Extranjera
              </Label>
              <Input
                type="date"
                name="fch_vento_ident_extranjera"
                className="bg-[#e6eaff]"
                value={formData.fch_vento_ident_extranjera}
                onChange={handleChange}
              />
            </div>
          )}

          <div>
            <Label className="block text-[#042460] font-medium">Celular</Label>
            <Input
              name="celular"
              className="bg-[#e6eaff]"
              required
              value={formData.celular}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">
              Teléfono Fijo
            </Label>
            <Input
              name="telefono_fijo"
              className="bg-[#e6eaff]"
              value={formData.telefono_fijo}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">
              Ciudad de Domicilio
            </Label>
            <Input
              name="ciudad_domicilio"
              className="bg-[#e6eaff]"
              required
              value={formData.ciudad_domicilio}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">
              Dirección de Domicilio
            </Label>
            <Input
              name="direccion_domicilio"
              className="bg-[#e6eaff]"
              required
              value={formData.direccion_domicilio}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label className="block text-[#042460] font-medium">
              Código Postal
            </Label>
            <Input
              name="codigo_postal"
              className="bg-[#e6eaff]"
              required
              value={formData.codigo_postal}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-between gap-2 mt-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="bg-gray-200 text-[#042460] py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Atrás
            </button>
            <SubmitButton
              onClick={handleSubmit}
              pendingText="Registrando..."
              className="bg-[#042460] text-white"
            >
              Completar Registro
            </SubmitButton>
          </div>
        </div>
      )}

      <p className="text-sm text-center text-gray-600 mt-4">
        ¿Ya tienes cuenta?{" "}
        <Link href="/sign-in" className="text-[#042460] underline font-medium">
          Iniciar Sesión
        </Link>
      </p>
    </form>
  );
}
