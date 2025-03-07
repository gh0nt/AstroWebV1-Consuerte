import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div>
      {" "}
      {/* Centering container */}
      <form
        className="
          bg-white
          rounded-xl
          shadow-xl
          p-8
          mt-16
          w-full
          max-w-md
          space-y-4 
        "
      >
        <h1 className="text-4xl text-center uppercase text-[#29a5dc] uppercasetext-4xl font-extrabold">
          {" "}
          {/* Refined header styling */}
          Reestablecer Contraseña
        </h1>
        <p className="text-sm text-center text-gray-500">
          {" "}
          {/* Refined paragraph styling */}
          Ingresa tu nueva contraseña
        </p>
        <div>
          {" "}
          {/* Group label and input for better spacing */}
          <Label htmlFor="password" className="block font-medium text-gray-700">
            {" "}
            {/* Label styling */}
            Nueva contraseña
          </Label>
          <Input
            type="password"
            name="password"
            placeholder="Nueva contraseña"
            required
            className="
              mt-1
              w-full
              bg-[#e6eaff]
              hover:bg-gray-200
              rounded-md
              border-gray-200
              focus:border-blue-500
              focus:ring-blue-500
              shadow-sm
            " /* Refined input styling - more neutral and accessible */
          />
        </div>
        <div>
          {" "}
          {/* Group label and input for better spacing */}
          <Label
            htmlFor="confirmPassword"
            className="block font-medium text-gray-700"
          >
            {" "}
            {/* Label styling */}
            Confirma la contraseña
          </Label>
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirma la contraseña"
            required
            className="
              mt-1
              w-full
              bg-[#e6eaff]
              hover:bg-gray-200
              rounded-md
              border-gray-200
              focus:border-blue-500
              focus:ring-blue-500
              shadow-sm
            " /* Refined input styling - more neutral and accessible */
          />
        </div>
        <SubmitButton
          formAction={resetPasswordAction}
          className="
            w-full
            py-2.5
            bg-[#042460]
            hover:bg-blue-800
            rounded-md
            font-bold
            text-white
            uppercase
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:ring-opacity-50
          " /* Refined button styling - more accessible and consistent */
        >
          Reestablecer contraseña
        </SubmitButton>
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}
