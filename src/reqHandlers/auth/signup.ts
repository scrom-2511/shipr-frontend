import { API_BASE_URL } from "@/src/config/endpoints";
import { validateInput } from "@/src/helper/validateInput";
import axios from "axios";
import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupRequest = z.infer<typeof signupSchema>;

export interface SignupResponse {
  message: string;
}

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  try {
    await validateInput(data, signupSchema);

    const res = await axios.post(`${API_BASE_URL}/signup`, data);

    if (res.data.success) {
      return;
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