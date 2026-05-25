import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface GithubRepository {
    id: number,
    name: string,
    full_name: string,
    installation_id: number,
}

export interface GetGithubInstalledReposResponse {
    repos: GithubRepository[]
}

export async function getGithubInstalledReposHandler(): Promise<GetGithubInstalledReposResponse> {
    try {
        const res = await axios.get(`${API_BASE_URL}/get-all-github-app-installed-repos`);

        if (res.data.success) {
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
