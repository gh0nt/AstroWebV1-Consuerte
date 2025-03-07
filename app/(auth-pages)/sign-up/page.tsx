import { Suspense } from "react";
import SignupForm from "./Form";

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SignupForm />
    </Suspense>
  );
}
