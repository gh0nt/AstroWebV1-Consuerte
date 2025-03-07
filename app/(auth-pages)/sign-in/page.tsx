import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 md:p-8">
        <form className="w-full">
          <h1 className="text-2xl md:text-4xl font-extrabold text-center text-[#29a5dc]">
            INICIA SESIÓN
          </h1>

          <div className="flex flex-col gap-2 [&>input]:mb-3 mt-6 md:mt-8 text-me text-[#042460] font-medium">
            <Label htmlFor="email" className="text-sm md:text-base">
              Correo Electrónico
            </Label>
            <Input
              name="email"
              className="text-sm bg-[#e6eaff] w-full px-4 py-2 md:py-3 text-gray-800 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042460]"
              placeholder="ejemplo@consuerte.com.co"
              required
            />

            <div className="flex justify-between items-center mt-4">
              <Label htmlFor="password" className="text-sm md:text-base">
                Contraseña
              </Label>
            </div>
            <Input
              type="password"
              name="password"
              className="text-sm bg-[#e6eaff] w-full px-4 py-2 md:py-3 text-gray-800 placeholder-gray-500 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#042460]"
              placeholder="Tu contraseña"
              required
            />
            <Link
              className="text-xs md:text-sm text-gray-600 underline text-center"
              href="/forgot-password"
            >
              ¿Olvidaste tu contraseña?
            </Link>
            <p className="text-sm text-gray-600 md:mt-6 text-center">
              ¿No tienes una cuenta?{" "}
              <Link
                className="text-[#042460] font-medium underline"
                href="/sign-up"
              >
                Regístrate
              </Link>
            </p>

            <SubmitButton
              pendingText="Iniciando Sesión..."
              formAction={signInAction}
              className="w-full mx-auto bg-[#042460] text-white py-2 md:py-3 px-8 rounded-lg hover:bg-[#0948B3] transition-colors font-extrabold text-sm md:text-base"
            >
              INICIAR SESIÓN
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
  );
}
