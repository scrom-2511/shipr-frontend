import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface PaymentConfirmationRequest {
    payment_id: string;
}

export interface PaymentConfirmationResponse {
    confirmed: boolean;
}

export async function getPaymentConfirmationHandler(payment_id: string): Promise<PaymentConfirmationResponse> {
    try {
        const res = await axios.get(`${API_BASE_URL}/payment-confirmation`, { params: { payment_id } });

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

        throw new Error("There was an unknown error, please try again.");
    }
}
