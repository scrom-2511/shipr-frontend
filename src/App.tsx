import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LandingPage } from "@/src/components/LandingPage";
import { SignInPage } from "@/src/components/SignInPage";
import { SignUpPage } from "@/src/components/SignUpPage";
import { ProjectsPage } from "@/src/components/ProjectsPage";

function ProjectDetailPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-sm text-neutral-500">// project details</p>
        <h1 className="mt-4 font-mono text-2xl">coming soon</h1>
        <Link
          to="/dashboard"
          className="mt-6 inline-block font-mono text-sm text-neutral-500 hover:text-white transition-colors"
        >
          ← back to projects
        </Link>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
