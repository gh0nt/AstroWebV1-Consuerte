//app/actions.ts
"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

//REGISTRO DE USUARIO
export const signUpAction = async (formData: FormData) => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  try {
    // Datos adicionales del usuario
    const userMetadata = {
      tipo_identificacion: formData.get("tipo_identificacion"),
      numero_identificacion: formData.get("numero_identificacion"),
      primer_nombre: formData.get("primer_nombre"),
      segundo_nombre: formData.get("segundo_nombre"),
      primer_apellido: formData.get("primer_apellido"),
      segundo_apellido: formData.get("segundo_apellido"),
      genero: formData.get("genero"),
      fecha_nacimiento: formData.get("fecha_nacimiento"),
      lugar_nacimiento: formData.get("lugar_nacimiento"),
      fecha_expedicion_documento: formData.get("fecha_expedicion_documento"),
      lugar_expedicion_documento: formData.get("lugar_expedicion_documento"),
      fch_vento_ident_extranjera: formData.get("fch_vento_ident_extranjera"),
      celular: formData.get("celular"),
      telefono_fijo: formData.get("telefono_fijo"),
      ciudad_domicilio: formData.get("ciudad_domicilio"),
      direccion_domicilio: formData.get("direccion_domicilio"),
      codigo_postal: formData.get("codigo_postal"),
    };

    // Registrar en auth.users con metadata
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: {
        emailRedirectTo: `${origin}/protected/panel`,
        data: userMetadata, // Añadir metadata aquí
      },
    });

    if (authError) throw authError;

    return {
      success: true,
      message: "¡Registro exitoso! Verifica tu correo electrónico.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error durante el registro",
    };
  }
};

//INICIO DE SESIÓN

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected/panel");
};

//RECUPERAR CONTRASEÑA
export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "No se puede enviar el correo electrónico de restablecimiento de contraseña"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "En tu correo electrónico, dale click al link."
  );
};

//RESETEAR CONTRASEÑA

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "La contraseña y la confirmación de contraseña es requerida"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Las contraseñas no coinciden"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "No se puede actualizar la contraseña"
    );
  }

  encodedRedirect(
    "success",
    "/protected/reset-password",
    "Contraseña actualizada"
  );
};

//CERRAR SESIÓN

export const signOutAction = async () => {
  const supabase = await createClient();

  // Await the cookies object before using it
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");

  // Cerrar sesión en Supabase
  await supabase.auth.signOut();

  // Redirigir al usuario a /sign-in
  return redirect("/sign-in");
};
