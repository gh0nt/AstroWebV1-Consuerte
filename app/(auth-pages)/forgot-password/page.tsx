import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <form className="flex flex-col w-[600px] mx-auto  bg-white p-6 rounded-md shadow-sm mt-32">
        <div>
          <h1 className="text-4xl font-extrabold text-center text-[#29a5dc] mb-6">
            REESTABLECER CONTRASEÑA
          </h1>
          <p className="text-sm text-secondary-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link className="text-primary underline" href="/sign-in">
              Iniciar Sesión
            </Link>
          </p>
        </div>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label
            htmlFor="email"
            className="block text-me text-[#042460] font-medium"
          >
            Correo Electrónico
          </Label>
          <Input name="email" placeholder="ejemplo@consuerte.com.co" required />
          <SubmitButton
            formAction={forgotPasswordAction}
            className="bg-[#042460] text-white py-2 px-4 rounded-lg hover:bg-[#0948B3] transition-colors"
          >
            Reestablecer Contraseña
          </SubmitButton>
          <FormMessage message={searchParams} />
        </div>
      </form>
    </>
  );
}
