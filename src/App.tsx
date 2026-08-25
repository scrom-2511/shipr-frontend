import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LandingPage } from "@/src/components/LandingPage";
import { SignInPage } from "@/src/components/SignInPage";
import { SignUpPage } from "@/src/components/SignUpPage";
import { ProjectsPage } from "@/src/components/ProjectsPage";
import { ProjectDetailPage } from "@/src/components/ProjectDetailPage";
import { BillingPage } from "@/src/components/BillingPage";
import { CheckoutSuccessPage } from "@/src/components/CheckoutSuccessPage";
import { CheckoutCancelPage } from "@/src/components/CheckoutCancelPage";
import GithubAfter from "./components/ui/GithubAfter";

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
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          <Route path="/github/after-installation" element={<GithubAfter />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
