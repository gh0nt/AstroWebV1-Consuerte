// src/app/api/zonapagos/verificacion/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const idPago = searchParams.get("id_pago");

    if (!idPago) {
      return NextResponse.json(
        { success: false, message: "Missing parameters" },
        { status: 400 }
      );
    }

    // Verify payment with ZonaPagos
    const verificationData = {
      int_id_comercio: process.env.ZONAPAGOS_COMMERCE_ID,
      str_usr_comercio: process.env.ZONAPAGOS_USER,
      str_pwd_comercio: process.env.ZONAPAGOS_PASSWORD,
      str_id_pago: idPago,
      int_no_pago: -1,
    };

    const response = await fetch(
      "https://www.zonapagos.com/Apis_CicloPago/api/VerificacionPago",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verificationData),
      }
    );

    const result = await response.json();

    // Save notification to Supabase
    const { error } = await supabase.from("zonapagos_notificaciones").insert({
      id_comercio: Number(process.env.ZONAPAGOS_COMMERCE_ID),
      id_pago: idPago,
      verificado: result.int_estado === 1,
      estado: mapStatus(result.int_estado),
      mensaje: result.str_res_pago,
      str_codigo_transaccion: result.str_codigo_transaccion,
    });

    if (error) throw error;

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

function mapStatus(statusCode: number): string {
  const statusMap: { [key: number]: string } = {
    1: "Aprobado",
    777: "Rechazado",
    888: "Pendiente",
    999: "Pendiente",
    4001: "Pendiente",
    4000: "Rechazado",
    4003: "Error",
    1000: "Rechazado",
    1001: "Error",
    1002: "Rechazado",
    1003: "Error",
  };
  return statusMap[statusCode] || "Estado desconocido";
}
