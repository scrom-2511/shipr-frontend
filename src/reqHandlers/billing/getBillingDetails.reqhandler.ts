import { API_BASE_URL } from "@/src/config/endpoints";
import axios from "axios";

export interface ProjectBillingUsage {
  id: number;
  project_id: string;
  full_name: string;
  status: string;
  active_seconds: number;
  active_hours: number;
  hourly_rate: number;
  cost: number;
}

export interface InvoiceItem {
  id: number;
  invoice_number: string;
  amount: number;
  status: string;
  active_hours: number;
  rate_per_hour: number;
  period_start?: string;
  period_end?: string;
  created_at?: string;
}

export interface PaymentMethodItem {
  id: number;
  card_brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export interface BillingDetails {
  plan_name: string;
  hourly_rate: number;
  credit_balance: number;
  total_active_seconds: number;
  total_active_hours: number;
  current_month_cost: number;
  estimated_monthly_cost: number;
  projects: ProjectBillingUsage[];
}

export async function getBillingDetailsHandler(): Promise<BillingDetails> {
  try {
    const res = await axios.get(`${API_BASE_URL}/get-billing-details`);

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
