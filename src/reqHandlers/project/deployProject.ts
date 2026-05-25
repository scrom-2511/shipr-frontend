import { API_BASE_URL } from "@/src/config/endpoints";
import { validateInput } from "@/src/helper/validateInput";
import axios from "axios";
import { z } from "zod";

export const deployProjectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    install_cmds: z.array(z.string()).min(1, "Install commands are required"),
    build_cmds: z.array(z.string()).min(1, "Build commands are required"),
    run_cmds: z.array(z.string()).min(1, "Run commands are required"),
});

export type DeployProjectRequest = z.infer<typeof deployProjectSchema>;

export interface DeployProjectResponse {
    message: string;
}

export async function deployProject(data: DeployProjectRequest): Promise<DeployProjectResponse> {
    try {
        await validateInput(data, deployProjectSchema);

        const res = await axios.post(`${API_BASE_URL}/signup`, data);

        if (res.data.success) {
            return;
        }

        throw new Error(res.data.message);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data?.message || err.message);
        }

        if (err instanceof Error) {
            throw new Error(err.message)
        }

        throw new Error('There was an unknown error, please try again.');
    }
}


