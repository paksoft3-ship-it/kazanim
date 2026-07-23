"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { loginAction, type LoginState } from "@/app/admin/actions";
import { Icon } from "@/components/public/Icon";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 bg-forest-emerald px-6 py-3.5 font-button-text uppercase tracking-[0.12em] text-white transition-colors hover:bg-midnight-navy disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Icon name="refresh" className="h-4 w-4 animate-spin" />
          Giriş yapılıyor…
        </>
      ) : (
        "Giriş Yap"
      )}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state.error ? (
        <div
          role="alert"
          className="flex items-start gap-3 border border-error-red/40 bg-error-red/10 p-4 text-body-sm text-error-red"
        >
          <Icon name="alert-triangle" className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="font-medium">{state.error}</p>
        </div>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="email" className="block font-label-caps uppercase tracking-wider text-slate">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          placeholder="admin@ornek.com"
          aria-invalid={state.fieldErrors?.email ? true : undefined}
          aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
          className="w-full border border-warm-border bg-admin-bg p-3.5 outline-none transition-all focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald"
        />
        {state.fieldErrors?.email ? (
          <p id="email-error" role="alert" className="text-[12px] font-medium text-error-red">
            {state.fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block font-label-caps uppercase tracking-wider text-slate">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={state.fieldErrors?.password ? true : undefined}
          aria-describedby={state.fieldErrors?.password ? "password-error" : undefined}
          className="w-full border border-warm-border bg-admin-bg p-3.5 outline-none transition-all focus:border-forest-emerald focus:ring-1 focus:ring-forest-emerald"
        />
        {state.fieldErrors?.password ? (
          <p id="password-error" role="alert" className="text-[12px] font-medium text-error-red">
            {state.fieldErrors.password}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="remember"
          name="remember"
          type="checkbox"
          className="h-4 w-4 accent-forest-emerald"
        />
        <label htmlFor="remember" className="cursor-pointer text-body-sm text-slate">
          Beni hatırla
        </label>
      </div>

      <SubmitButton />
    </form>
  );
}
