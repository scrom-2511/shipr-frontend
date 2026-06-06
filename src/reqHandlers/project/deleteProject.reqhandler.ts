import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export async function deleteProjectHandler(projectId: string | number): Promise<void> {
    try {
        const res = await axios.delete(`${API_BASE_URL}/delete-project?project_id=${projectId}`);

        if (res.data.success) {
            return;
        }

        throw new Error(res.data.message);
    } catch (err) {
        if (axios.isAxiosError(err)) {
            throw new Error(err.response?.data?.message || err.message);
        }

        if (err instanceof Error) {
            throw new Error(err.message);
        }

        throw new Error('There was an unknown error, please try again.');
    }
}
