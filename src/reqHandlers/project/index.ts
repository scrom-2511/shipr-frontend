import { API_BASE_URL } from "@/src/config/endpoints";
import { validateInput } from "@/src/helper/validateInput";
import axios from "axios";
import { z } from "zod";

export const deployProjectSchema = z.object({
  name: z.string(),
  install: z.array(z.string()).optional(),
  build: z.array(z.string()).optional(),
  run: z.array(z.string()).optional(),
  branch: z.string().optional(),
  dist_dir: z.string(),
  home_dir: z.string(),
  full_name: z.string(),
  installation_id: z.number(),
});

export type DeployProjectRequest = z.infer<typeof deployProjectSchema>;

export interface DeployProjectResponse {
  success: boolean;
  message?: string;
}

export async function deployProject(data: DeployProjectRequest): Promise<DeployProjectResponse> {
  try {
    await validateInput(data, deployProjectSchema);

    const res = await axios.post(`${API_BASE_URL}/deploy-project`, data);

    if (res.data.success) {
      return res.data;
    }

    throw new Error(res.data.error?.message);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || err.response?.data?.error?.message || err.message);
    }

    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("There was an unknown error, please try again.");
  }
}