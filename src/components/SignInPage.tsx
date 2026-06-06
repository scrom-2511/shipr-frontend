import { Input } from "@/src/components/ui/input";
import { GitHubIcon } from "@/src/components/GitHubIcon";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signin } from "@/src/reqHandlers/auth/signin";

export function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signinMutation = useMutation({
    mutationFn: signin,
    onSuccess: () => {
      navigate("/dashboard");
    },
    onError: (err: { message: string }) => {
      setError(err.message || "Sign in failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    signinMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black flex flex-col">
      {/* Nav */}
      <nav className="border-b border-neutral-900">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="font-mono text-lg font-medium tracking-tight">shipr</Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <p className="font-mono text-sm text-neutral-500">// sign in</p>
            <h1 className="font-mono text-2xl font-medium tracking-tight">
              welcome back
            </h1>
            <p className="font-mono text-sm text-neutral-500">
              sign in to your account to continue
            </p>
          </div>

          {/* GitHub OAuth */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 border border-neutral-800 px-4 py-3 font-mono text-sm text-white hover:border-neutral-600 transition-colors"
          >
            <GitHubIcon className="size-4" />
            continue with github
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-900" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-black px-4 font-mono text-xs text-neutral-600">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="font-mono text-xs text-neutral-500" htmlFor="email">
                // email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs text-neutral-500" htmlFor="password">
                  // password
                </label>
                <a
                  href="#"
                  className="font-mono text-xs text-neutral-500 hover:text-white transition-colors"
                >
                  forgot?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={signinMutation.isPending}
              className="flex w-full items-center justify-center gap-2 bg-white px-4 py-3 font-mono text-sm text-black hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
              {signinMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  sign in
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            {error && (
              <p className="font-mono text-xs text-red-500 text-center">{error}</p>
            )}
          </form>

          {/* Footer */}
          <p className="font-mono text-sm text-neutral-500 text-center">
            no account?{" "}
            <Link to="/signup" className="text-white hover:underline transition-colors">
              create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
