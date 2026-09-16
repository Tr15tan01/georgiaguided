"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LogIn } from "lucide-react";
import { login } from "@/actions/admin/auth";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="adm-btn adm-btn-primary mt-2 w-full !min-h-11">
      <LogIn className="size-4" />{pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState(login, {});
  return (
    <form action={action} className="mt-8 space-y-4">
      <div>
        <label htmlFor="email" className="adm-label">Email</label>
        <input key={state.email ?? ""} defaultValue={state.email} id="email" name="email" type="email" autoComplete="username" required className="adm-input !min-h-11" aria-invalid={state.error ? true : undefined} />
      </div>
      <div>
        <label htmlFor="password" className="adm-label">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="adm-input !min-h-11" aria-invalid={state.error ? true : undefined} />
      </div>
      {state.error && <p role="alert" className="adm-error">{state.error}</p>}
      <Submit />
    </form>
  );
}
