//app\api\zonapagos\payment\route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    // Obtener el usuario autenticado
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: "Usuario no autenticado" },
        { status: 401 }
      );
    }

    // Extraer la metadata del usuario
    const userMetadata = user.user_metadata || {};

    // Obtener los datos del cuerpo de la solicitud (por ejemplo, total, idPago y descripción)
    const { total, idPago, descripcionPago } = await req.json();

    // Construir el objeto con la información de pago usando los datos del usuario
    const datos = {
      InformacionPago: {
        flt_total_con_iva: total,
        str_id_pago: idPago,
        str_descripcion_pago: descripcionPago,
        str_email: user.email,
        str_id_cliente: user.id,
        str_tipo_id: userMetadata.tipo_identificacion || "1",
        str_nombre_cliente: userMetadata.primer_nombre || "",
        str_apellido_cliente: userMetadata.primer_apellido || "",
        str_telefono_cliente: userMetadata.celular || "",
        str_opcional1: "opcion 11",
        str_opcional2: "opcion 12",
        str_opcional3: "opcion 13",
        str_opcional4: "opcion 14",
        str_opcional5: "opcion 15",
      },
      InformacionSeguridad: {
        int_id_comercio: 33930,
        str_usuario: "consuert33930",
        str_clave: "consuert33930*",
        int_modalidad: -1,
      },
      AdicionalesPago: [{ int_codigo: 111, str_valor: "0" }],
      AdicionalesConfiguracion: [{ int_codigo: 50, str_valor: "1001" }],
      InformacionComercio: {
        id_comercio: process.env.ZONAPAGOS_COMMERCE_ID,
      },
    };

    // Enviar la petición a ZonaPagos
    const response = await fetch(
      "https://www.zonapagos.com/Apis_CicloPago/api/InicioPago",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      }
    );

    if (!response.ok) {
      throw new Error(`ZonaPagos API error! status: ${response.status}`);
    }

    const result = await response.json();

    if (result.str_url) {
      return NextResponse.json({ success: true, url: result.str_url });
    } else {
      return NextResponse.json(
        { success: false, message: "Failed to get payment URL" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
