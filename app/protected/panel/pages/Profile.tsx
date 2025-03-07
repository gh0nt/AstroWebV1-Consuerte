//src/app/panel/pages/Profile/tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Profile() {
  // Estado para guardar los datos del formulario
  const supabase = createClient();
  const [formData, setFormData] = useState({
    tipoIdentificacion: "1",
    numeroIdentificacion: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    genero: "1",
    fechaNacimiento: "",
    lugarNacimiento: "",
    fechaExpedicionDocumento: "",
    lugarExpedicionDocumento: "",
    fchVentoIdentExtranjera: "",
    correo: "",
    celular: "",
    telefonoFijo: "",
    ciudadDomicilio: "",
    direccionDomicilio: "",
    codigoPostal: "",
  });

  //useEffect para traer los datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        // Extraer datos del metadata
        const userMetadata = user.user_metadata || {};

        setFormData({
          tipoIdentificacion: userMetadata.tipo_identificacion || "1",
          numeroIdentificacion: userMetadata.numero_identificacion || "",
          primerNombre: userMetadata.primer_nombre || "",
          segundoNombre: userMetadata.segundo_nombre || "",
          primerApellido: userMetadata.primer_apellido || "",
          segundoApellido: userMetadata.segundo_apellido || "",
          genero: userMetadata.genero || "1",
          fechaNacimiento: userMetadata.fecha_nacimiento || "",
          lugarNacimiento: userMetadata.lugar_nacimiento || "",
          fechaExpedicionDocumento:
            userMetadata.fecha_expedicion_documento || "",
          lugarExpedicionDocumento:
            userMetadata.lugar_expedicion_documento || "",
          fchVentoIdentExtranjera:
            userMetadata.fch_vento_ident_extranjera || "",
          correo: user.email || "",
          celular: userMetadata.celular || "",
          telefonoFijo: userMetadata.telefono_fijo || "",
          ciudadDomicilio: userMetadata.ciudad_domicilio || "",
          direccionDomicilio: userMetadata.direccion_domicilio || "",
          codigoPostal: userMetadata.codigo_postal || "",
        });
      }
    };

    loadUserData();
  }, []);

  // Estado para la imagen de perfil
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado para foto de perfil
  const [profilePic, setProfilePic] = useState("/img/avatar.png");

  // Estado para controlar la visibilidad de la fecha de vencimiento de ID extranjera
  const [isExtranjero, setIsExtranjero] = useState(false);

  // useEffect para determinar si el usuario es extranjero
  useEffect(() => {
    setIsExtranjero(formData.tipoIdentificacion === "2"); // "2" = Cédula de Extranjería
  }, [formData.tipoIdentificacion]);

  // Función para manejar cambios en los inputs editables
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Función para abrir el diálogo de selección de archivos
  const handleOpenFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Función para manejar el cambio de la imagen de perfil
  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    const objectUrl = URL.createObjectURL(selectedFile);
    setProfilePic(objectUrl);

    // Aquí podrías agregar lógica para subir la imagen al servidor si es necesario
  };

  // Función para guardar los cambios
  const handleSave = () => {
    // Aquí puedes manejar la lógica para enviar los datos al backend
    console.log("Perfil guardado:", formData);
    alert(`Perfil guardado: ${formData.correo} - ${formData.celular}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full mx-auto">
      <div className="space-x-72 p-3 ">
        <div className="mx-auto p-8 bg-white rounded-lg   ">
          {/* Sección de Imagen y Datos Constantes */}
          <div className="flex items-center mb-8">
            {/* Marco con Portada */}
            <div className="relative">
              <div className="w-36 h-36 bg-[#bbd0f6] rounded-full flex items-center justify-center">
                <img
                  src={profilePic}
                  alt="Avatar del usuario"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/avatar.png"; // Fallback por si hay error
                  }}
                />
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="ml-8 space-y-1 w-full">
              <div>
                <h2 className="text-2xl font-semibold text-white text-center rounded bg-[#042460] p-2 shadow">
                  Hola, {formData.primerNombre} {formData.primerApellido}
                </h2>
              </div>
              <p className="text-[#042460] text-sm">
                {formData.tipoIdentificacion === "1" ? "CC" : "CE"}:{" "}
                {formData.numeroIdentificacion}
              </p>
              <p className="text-[#042460] text-sm">
                {formData.genero === "1" ? "Masculino" : "Femenino"}
              </p>
              <p className="text-[#042460] text-sm">
                Fecha de Nacimiento: {formData.fechaNacimiento}
              </p>
              <p className="text-[#042460] text-sm">
                Fecha de Expedición Documento:{" "}
                {formData.fechaExpedicionDocumento}
              </p>
            </div>
          </div>

          {/* Formulario de Perfil */}
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-6">
              {/* Campos Editables */}

              {/* Correo Electrónico */}
              <div>
                <label
                  htmlFor="correo"
                  className="block text-me text-[#042460] font-medium"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="text-sm bg-[#e6eaff] w-full px-4 py-2 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042460] pr-10 text-[#042460]"
                  required
                />
              </div>

              {/* Celular */}
              <div>
                <label
                  htmlFor="celular"
                  className="block text-me text-[#042460] font-medium"
                >
                  Celular
                </label>
                <input
                  type="text"
                  id="celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="text-sm bg-[#e6eaff] w-full px-4 py-2  placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042460] pr-10 text-[#042460]"
                  required
                />
              </div>

              {/* Teléfono Fijo */}
              <div>
                <label
                  htmlFor="telefonoFijo"
                  className="block text-me text-[#042460] font-medium"
                >
                  Teléfono Fijo
                </label>
                <input
                  type="text"
                  id="telefonoFijo"
                  name="telefonoFijo"
                  value={formData.telefonoFijo}
                  onChange={handleChange}
                  className="text-sm bg-[#e6eaff] w-full px-4 py-2  placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042460] pr-10 text-[#042460]"
                />
              </div>

              {/* Ciudad de Domicilio */}
              <div>
                <label
                  htmlFor="ciudadDomicilio"
                  className="block text-me text-[#042460] font-medium"
                >
                  Ciudad de Domicilio (Código DANE)
                </label>
                <input
                  type="text"
                  id="ciudadDomicilio"
                  name="ciudadDomicilio"
                  value={formData.ciudadDomicilio}
                  onChange={handleChange}
                  className="text-sm bg-[#e6eaff] w-full px-4 py-2  placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042460] pr-10 text-[#042460]"
                  required
                />
              </div>

              {/* Dirección de Domicilio */}
              <div className="col-span-2">
                <label
                  htmlFor="direccionDomicilio"
                  className="block text-me text-[#042460] font-medium"
                >
                  Dirección de Domicilio
                </label>
                <input
                  type="text"
                  id="direccionDomicilio"
                  name="direccionDomicilio"
                  value={formData.direccionDomicilio}
                  onChange={handleChange}
                  className="text-sm bg-[#e6eaff] w-full px-4 py-2  placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042460] pr-10 text-[#042460]"
                  required
                />
              </div>

              {/* Código Postal */}
              <div>
                <label
                  htmlFor="codigoPostal"
                  className="block text-me text-[#042460] font-medium"
                >
                  Código Postal
                </label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  className="text-sm bg-[#e6eaff] w-full px-4 py-2  placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042460] pr-10 text-[#042460]"
                  required
                />
              </div>
            </div>

            {/* Fecha de Vencimiento Identificación Extranjera (Solo Extranjeros) */}
            {isExtranjero && (
              <div className="mt-6">
                <label
                  htmlFor="fchVentoIdentExtranjera"
                  className="block text-me text-[#042460] font-medium"
                >
                  Fecha de Vencimiento Identificación Extranjera
                </label>
                <input
                  type="date"
                  id="fchVentoIdentExtranjera"
                  name="fchVentoIdentExtranjera"
                  value={formData.fchVentoIdentExtranjera}
                  onChange={handleChange}
                  className="text-sm bg-[#e6eaff] w-full px-4 py-2 text-gray-800 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042460] pr-10"
                />
              </div>
            )}

            {/* Botón para Guardar Cambios */}
            <div className="mt-8 text-center"></div>
          </form>
        </div>
      </div>
    </div>
  );
}
