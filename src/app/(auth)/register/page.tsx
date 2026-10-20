import { AuthShell, RegisterForm } from "@/components/marketing/auth";

export const metadata = { title: "Create an account" };

export default function Register() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="One account for ordering water, tracking deliveries and managing your saved addresses."
    >
      <RegisterForm />
    </AuthShell>
  );
}