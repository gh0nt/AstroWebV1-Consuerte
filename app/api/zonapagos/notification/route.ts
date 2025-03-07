// src/app/api/zonapagos/notificacion/route.ts
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

    // Get payment status from Supabase
    const { data: payment, error } = await supabase
      .from("pagos")
      .select("*")
      .eq("id_pago", idPago)
      .single();

    if (error || !payment) {
      return NextResponse.json(
        { success: false, message: "Payment not found" },
        { status: 404 }
      );
    }

    // Return appropriate user message
    let message;
    switch (payment.estado) {
      case "Aprobado":
        message = "Su pago ha sido aprobado exitosamente.";
        break;
      case "Rechazado":
        message = "Su pago ha sido rechazado. Por favor intente nuevamente.";
        break;
      case "Pendiente":
        message = `En este momento su Número de Referencia (${idPago}) está pendiente de confirmación. Por favor espere unos minutos y vuelva a consultar.`;
        break;
      default:
        message = "Hubo un error al procesar su pago. Contacte al soporte.";
    }

    return NextResponse.json({
      success: true,
      message,
      status: payment.estado,
    });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
