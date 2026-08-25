import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface StripeCheckoutLineItem {
  name: string;
  description?: string;
  amount: number;
  quantity?: number;
}

export interface StripeCheckoutRequest {
  amount?: number;
  currency?: string;
  line_items?: StripeCheckoutLineItem[];
  customer_email?: string;
  success_url?: string;
  cancel_url?: string;
  metadata?: Record<string, string>;
}

export interface StripeCheckoutResponse {
  url: string;
  session_id: string;
}

export async function stripeCheckoutHandler(data: StripeCheckoutRequest): Promise<StripeCheckoutResponse> {
  try {
    const res = await axios.post(`${API_BASE_URL}/checkout`, data, {
      withCredentials: true,
    });

    const targetUrl = res.data.checkout_url || res.data.url || res.data.data?.checkout_url || res.data.data?.url || "";
    const sessionId = res.data.session_id || res.data.data?.session_id || "";

    if (targetUrl) {
      return { url: targetUrl, session_id: sessionId };
    }

    throw new Error(res.data.message || "Failed to create checkout session");
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || err.message);
    }

    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("Failed to create checkout session");
  }
}
