import axios from "axios";
import { z } from "zod";
import { saveToken } from "./cookies";

const API_BASE_URL = "http://localhost:9000";

export const githubCallbackSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
});

export type GithubCallbackRequest = z.infer<typeof githubCallbackSchema>;

export interface GithubAuthResponse {
  message: string;
  token: string;
}

export interface GithubAuthError {
  error_code: "GithubOAuthError" | "ValidationError" | "DatabaseError" | "InternalServerError";
  message: string;
}

const GITHUB_CLIENT_ID = "github_client_id"; // Replace with actual client ID from env
const REDIRECT_URI = window.location.origin + "/auth/github/callback";

export function getGithubAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    scope: "read:user user:email",
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

export function initiateGithubAuth(): void {
  window.location.href = getGithubAuthUrl();
}

export function validateGithubCallback(data: unknown): { success: true; data: GithubCallbackRequest } | { success: false; error: string } {
  const result = githubCallbackSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const firstError = result.error.issues[0];
  return { success: false, error: firstError?.message ?? "Validation failed" };
}

export async function handleGithubCallback(code: string): Promise<GithubAuthResponse> {
  const validated = validateGithubCallback({ code });
  if (!validated.success) {
    throw { error_code: "ValidationError", message: validated.error } as GithubAuthError;
  }

  const response = await axios.post<GithubAuthResponse>(`${API_BASE_URL}/auth/github/callback`, {
    code: validated.data.code,
  });

  saveToken(response.data.token);
  return response.data;
}