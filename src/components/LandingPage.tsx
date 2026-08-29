import { Terminal } from "./Terminal";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { GitHubIcon } from "@/src/components/GitHubIcon";

const steps = [
  {
    number: "01",
    title: "Connect Your Repo",
    description: "Link your GitHub account and select the repository you want to deploy.",
  },
  {
    number: "02",
    title: "Configure & Deploy",
    description: "Set your build command and output directory. We'll handle the rest.",
  },
  {
    number: "03",
    title: "Ship with Confidence",
    description: "Your app is live on our global edge network. Monitor, iterate, repeat.",
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-900 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-mono text-lg font-medium tracking-tight">shipr</span>
          </Link>

          <div className="hidden items-center gap-8 font-mono text-sm text-neutral-500 md:flex">
            <a href="#features" className="hover:text-white transition-colors">
              features
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              how it works
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              pricing
            </a>
          </div>

          <div className="flex items-center gap-6 font-mono text-sm">
            <Link
              to="/signin"
              className="text-neutral-500 hover:text-white transition-colors"
            >
              sign in
            </Link>
            <Link
              to="/signup"
              className="flex items-center gap-2 border border-neutral-700 px-4 py-2 hover:bg-white hover:text-black transition-colors"
            >
              <GitHubIcon className="size-4" />
              connect
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="font-mono text-4xl font-medium leading-[1.3] tracking-tight md:text-5xl lg:text-6xl">
                Ship to production
                <br />
                <span className="text-neutral-500">in seconds</span>
              </h1>
            </div>

            <p className="mx-auto max-w-lg font-mono text-base text-neutral-500 leading-relaxed">
              The deployment platform for developers. Connect your GitHub repo and ship to production.
            </p>

            <div className="flex items-center justify-between font-mono text-sm px-42">
              <Link
                to="/signup"
                className="flex items-center gap-2 bg-white px-5 py-3 text-black hover:bg-neutral-200 transition-colors font-mono text-sm"
              >
                <GitHubIcon className="size-4" />
                connect with github
              </Link>
              <a
                href="#"
                className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
              >
                view demo
                <ArrowRight className="size-4" />
              </a>
            </div>
            {/* Terminal inline */}
            <div className="mt-8">
              <p className="font-mono text-sm text-neutral-500 text-left pb-5">// deploy your projects</p>
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-neutral-900">
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-3 divide-x divide-neutral-900">
            <div className="py-10 text-center">
              <div className="font-mono text-3xl font-medium">10k+</div>
              <div className="mt-2 font-mono text-sm text-neutral-500">deploys daily</div>
            </div>
            <div className="py-10 text-center">
              <div className="font-mono text-3xl font-medium">99.9%</div>
              <div className="mt-2 font-mono text-sm text-neutral-500">uptime sla</div>
            </div>
            <div className="py-10 text-center">
              <div className="font-mono text-3xl font-medium">&lt;10s</div>
              <div className="mt-2 font-mono text-sm text-neutral-500">avg deploy time</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="pt-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16">
            <p className="font-mono text-sm text-neutral-500">// how it works</p>
            <h2 className="mt-4 font-mono text-3xl font-medium tracking-tight md:text-4xl">
              Three steps to production
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={i}
                className="border border-neutral-800 p-8 hover:border-neutral-600 transition-colors"
              >
                <span className="font-mono text-sm text-neutral-500">{step.number}</span>
                <h3 className="mt-4 font-mono text-lg font-medium">{step.title}</h3>
                <p className="mt-3 font-mono text-sm text-neutral-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="border border-neutral-800 p-12">
            <p className="font-mono text-sm text-neutral-500">// ready to ship?</p>
            <h2 className="mt-4 font-mono text-3xl font-medium tracking-tight">
              Join thousands of developers
            </h2>
            <p className="mt-4 font-mono text-base text-neutral-500">
              Free to start. No credit card required.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="flex items-center justify-center gap-2 bg-white px-6 py-3 font-mono text-sm text-black hover:bg-neutral-200 transition-colors"
              >
                <GitHubIcon className="size-4" />
                start deploying for free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="font-mono text-sm text-neutral-500">shipr</div>

            <div className="flex items-center gap-8 font-mono text-sm text-neutral-500">
              <a href="#" className="hover:text-white transition-colors">
                privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                docs
              </a>
            </div>

            <div className="font-mono text-sm text-neutral-600">
              built for developers
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
