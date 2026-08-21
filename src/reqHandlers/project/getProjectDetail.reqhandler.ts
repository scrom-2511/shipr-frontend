import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface ProjectDetail {
    id: string;
    name: string;
    full_name: string;
    branch: string;
    status: "active" | "building" | "error";
    last_deployment_time: string;
    root_dir: string;
    install_cmds: string[];
    build_cmds: string[];
    run_cmds: string[];
    envs: { key: string; value: string }[];
    github_url: string;
    commit_hash: string;
}

export async function getProjectDetailHandler(id: string): Promise<ProjectDetail> {
    try {
        const res = await axios.get(`${API_BASE_URL}/get-project-detail?project_id=${id}`);

        if (res.data.success) {
            console.log(res.data.data);
            return res.data.data;
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
