import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface GetStateResponse {
    state: string
}

export async function getStateHandler(): Promise<GetStateResponse> {
    try {
        const res = await axios.get(`${API_BASE_URL}/get-state`);

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
