import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface UpdateProjectRequest {
    project_id: string;
    name: string;
    branch: string;
    root_dir: string;
    dist_dir: string;
    install_cmds: string[];
    build_cmds: string[];
    run_cmds: string[];
    envs: { key: string; value: string }[];
}

export async function updateProjectDetailHandler(data: UpdateProjectRequest): Promise<{ success: boolean; message: string }> {
    try {
        const res = await axios.post(`${API_BASE_URL}/update-project`, data);

        if (res.data.success) {
            return res.data;
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
