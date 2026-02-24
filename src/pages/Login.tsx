import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type Resolver, type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { z } from "zod";

import { LanguageSelector } from "@components/LanguageSelector";
import Input from "@components/ui/Input";
import { useAuth } from "@providers/useAuth";

const loginSchema = z.object({
  username: z.string().trim().min(3, "auth.errors.usernameMin"),
  password: z.string().min(6, "auth.errors.passwordMin"),
});

const signupSchema = loginSchema.extend({
  confirmPassword: z.string().min(1, "auth.errors.confirmPasswordRequired"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "auth.errors.passwordsMismatch",
  path: ["confirmPassword"],
});

type SignupInputs = z.infer<typeof signupSchema>;

const renderError = (message: string) => (
  <p className="text-sm text-(--bg-interactive-danger) pl-1 mt-1">{message}</p>
);

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [serverError, setServerError] = useState("");

  const isSignup = tab === "signup";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupInputs>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema) as unknown as Resolver<SignupInputs>,
  });

  const onSubmit: SubmitHandler<SignupInputs> = async (data) => {
    setServerError("");
    try {
      if (isSignup) {
        await signup(data.username, data.password);
      } else {
        await login(data.username, data.password);
      }
      navigate("/");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : t("auth.errors.generic"));
    }
  };

  const switchTab = (next: "login" | "signup") => {
    setTab(next);
    setServerError("");
    reset();
  };

  return (
    <div className="min-h-screen bg-background court-texture flex flex-col items-center justify-center px-4 py-16">
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-display tracking-wider text-foreground glow-text">
          Tennis Lab
        </h1>
        <p className="mt-2 text-muted-foreground text-sm tracking-widest uppercase">
          Experimental Stats Viewer
        </p>
      </div>

      <div className="bg-white max-w-sm w-full mx-4 rounded-xl border border-gray-400 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => switchTab("login")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "login"
                ? "text-foreground border-b-2 border-(--bg-interactive-primary)"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("auth.login")}
          </button>
          <button
            type="button"
            onClick={() => switchTab("signup")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "signup"
                ? "text-foreground border-b-2 border-(--bg-interactive-primary)"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("auth.signup")}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4">
          <div>
            <Input
              id="username"
              label={t("auth.username")}
              placeholder="admin"
              autoComplete="username"
              variant={errors.username ? "error" : undefined}
              {...register("username")}
            />
            {errors.username?.message && renderError(t(errors.username.message))}
          </div>

          <div>
            <Input
              id="password"
              label={t("auth.password")}
              type="password"
              placeholder="••••••••"
              autoComplete={isSignup ? "new-password" : "current-password"}
              variant={errors.password ? "error" : undefined}
              {...register("password")}
            />
            {errors.password?.message && renderError(t(errors.password.message))}
          </div>

          {isSignup && (
            <div>
              <Input
                id="confirmPassword"
                label={t("auth.confirmPassword")}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                variant={errors.confirmPassword ? "error" : undefined}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword?.message && renderError(t(errors.confirmPassword.message))}
            </div>
          )}

          {serverError && (
            <p className="text-sm text-(--bg-interactive-danger) text-center">{serverError}</p>
          )}

          <Input
            id="submit"
            label=""
            type="submit"
            variant="submit"
            value={isSubmitting ? t("common.loading") : isSignup ? t("auth.signup") : t("auth.login")}
            disabled={isSubmitting}
            className="w-full cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </form>
      </div>

      {tab === "login" && (
        <p className="mt-4 text-xs text-muted-foreground text-center">
          {t("auth.defaultCredentials")}
        </p>
      )}
    </div>
  );
};

export default Login;
