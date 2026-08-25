import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface DodoCheckoutRequest {
  amount?: number;
  currency?: string;
  product_id?: string;
  customer_email?: string;
  return_url?: string;
  redirect_url?: string;
  metadata?: Record<string, string>;
  payment_method_type?: "card" | "upi" | "netbanking";
  card_number?: string;
  exp_month?: number;
  exp_year?: number;
  cvc?: string;
  cardholder_name?: string;
  upi_id?: string;
  bank_name?: string;
}

export interface DodoCheckoutResponse {
  checkout_url: string;
}

export async function dodoCheckoutHandler(data: DodoCheckoutRequest): Promise<DodoCheckoutResponse> {
  try {
    const res = await axios.post(`${API_BASE_URL}/checkout`, data, {
      withCredentials: true,
    });

    return {
      checkout_url: res.data.data.checkout_url,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.message || err.message);
    }

    if (err instanceof Error) {
      throw new Error(err.message);
    }

    throw new Error("Failed to create Dodo Payments checkout session");
  }
}

