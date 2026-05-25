import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface GithubAfterInstallationRequest {
    installation_id: number,
    state: string
}

export async function githubAfterInstallationHandler(data: GithubAfterInstallationRequest): Promise<void> {
    try {
        const res = await axios.post(`${API_BASE_URL}/github/update-userid-github-app-installations`, data);

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
