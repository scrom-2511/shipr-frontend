import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

enum ProjectStatus {
    ACTIVE = "active",
    BUILDING = "building",
    ERROR = "error"
}

export interface Project {
    id: string;
    project_id: string;
    full_name: string;
    branch: string;
    status: ProjectStatus;
    last_deployment_time: string;
}

export interface GetAllDeployedProjectsResponse {
    projects: Project[]
}

export async function getAllDeployedProjectsHandler(): Promise<GetAllDeployedProjectsResponse> {
    try {
        const res = await axios.get(`${API_BASE_URL}/get-all-deployed-projects`);

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
