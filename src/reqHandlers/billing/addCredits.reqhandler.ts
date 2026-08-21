import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface AddCreditsRequest {
  amount: number;
}

export interface AddCreditsResponse {
  new_balance: number;
  added_amount: number;
  invoice_number: string;
}

export async function addCreditsHandler(data: AddCreditsRequest): Promise<AddCreditsResponse> {
  try {
    const res = await axios.post(`${API_BASE_URL}/add-credits`, data);

    if (res.data.success) {
      return res.data.data;
    }

    throw new Error(res.data.message);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || err.message);
    }

    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("Failed to add credits, please try again.");
  }
}
