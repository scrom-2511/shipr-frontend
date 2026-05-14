import { API_BASE_URL } from "@/src/config/endpoints";
import { validateInput } from "@/src/helper/validateInput";
import axios from "axios";
import { z } from "zod";

export const deployProjectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  install_cmds: z.array(z.string()).default([]),
  build_cmds: z.array(z.string()).default([]),
  run_cmds: z.array(z.string()).default([]),
});

export type DeployProjectRequest = z.infer<typeof deployProjectSchema>;

export interface DeployProjectResponse {
  success: boolean;
  message?: string;
}

export async function deployProject(data: DeployProjectRequest): Promise<DeployProjectResponse> {
  try {
    await validateInput(data, deployProjectSchema);

    const res = await axios.post(`${API_BASE_URL}/projects`, data);

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