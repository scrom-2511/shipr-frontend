import { Input } from "@/src/components/ui/input";
import { GitHubIcon } from "@/src/components/GitHubIcon";
import { ArrowRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/src/reqHandlers/auth/signup";

export function SignUpPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate("/signin");
    },
    onError: (err) => {
      setError(err.message || "Sign up failed");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    signupMutation.mutate({ username, email, password });
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
            <p className="font-mono text-sm text-neutral-500">// create account</p>
            <h1 className="font-mono text-2xl font-medium tracking-tight">
              start shipping
            </h1>
            <p className="font-mono text-sm text-neutral-500">
              free to start. no credit card required.
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
                or sign up with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="font-mono text-xs text-neutral-500" htmlFor="name">
                // name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

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
              <label className="font-mono text-xs text-neutral-500" htmlFor="password">
                // password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className="flex w-full items-center justify-center gap-2 bg-white px-4 py-3 font-mono text-sm text-black hover:bg-neutral-200 disabled:opacity-50 transition-colors"
            >
              {signupMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  create account
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            {error && (
              <p className="font-mono text-xs text-red-500 text-center">{error}</p>
            )}

            <p className="font-mono text-xs text-neutral-600 text-center">
              by signing up, you agree to our{" "}
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                privacy policy
              </a>
            </p>
          </form>

          {/* Footer */}
          <p className="font-mono text-sm text-neutral-500 text-center">
            already have an account?{" "}
            <Link to="/signin" className="text-white hover:underline transition-colors">
              sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
