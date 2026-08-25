import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface DodoTopupRequest {
  user_id: number;
  amount_dollars: number;
}

export interface DodoTopupResponse {
  payment_link: string | null;
}

export async function dodoTopupHandler(data: DodoTopupRequest): Promise<DodoTopupResponse> {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/billing/topup`, data, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || err.message);
    }
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("Failed to create topup checkout session");
  }
}
