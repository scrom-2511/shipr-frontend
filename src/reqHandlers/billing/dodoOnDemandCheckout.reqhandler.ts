import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface DodoOnDemandCheckoutRequest {
  user_id?: number;
}

export interface DodoOnDemandCheckoutResponse {
  checkout_url: string;
}

export async function dodoOnDemandCheckoutHandler(
  data: DodoOnDemandCheckoutRequest = { user_id: 1 }
): Promise<DodoOnDemandCheckoutResponse> {
  try {
    const res = await axios.post(
      `${API_BASE_URL}/on-demand-checkout`,
      {
        user_id: data.user_id ?? 1,
      },
      {
        withCredentials: true,
      }
    );

    const checkout_url = res.data?.data?.checkout_url || res.data?.checkout_url;
    if (!checkout_url) {
      throw new Error("No checkout URL returned from server");
    }

    return { checkout_url };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || err.message);
    }
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("Failed to initialize on-demand checkout session");
  }
}
