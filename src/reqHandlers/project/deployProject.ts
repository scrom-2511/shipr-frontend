import { API_BASE_URL } from "@/src/config/endpoints";
import { validateInput } from "@/src/helper/validateInput";
import axios from "axios";
import { z } from "zod";

export const deployProjectSchema = z.object({
    project_id: z.string().min(1, "Name is required"),
    envs: z.array(z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string()
    })),
    branch: z.string().min(1, "Branch is required"),
    root_dir: z.string().min(1, "Home dir is required"),
    full_name: z.string().min(1, "Full name is required"),
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

        console.log("hi thereeeeeeeeeeee");

        const res = await axios.post(`${API_BASE_URL}/deploy-project`, data);

        if (res.data.success) {
            return res.data;
        }

        throw new Error(res.data.error?.message || res.data.message);
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
