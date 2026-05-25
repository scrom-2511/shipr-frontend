import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface CheckRepoNameAvailabilityRequest {
    project_name: string,
}

export interface CheckRepoNameAvailabilityResponse {
    is_available: boolean,
}

export async function checkRepoNameAvailabilityHandler(data: CheckRepoNameAvailabilityRequest): Promise<CheckRepoNameAvailabilityResponse> {
    try {
        const res = await axios.post(`${API_BASE_URL}/check-repo-name-availability`, data);

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
