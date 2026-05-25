import { API_BASE_URL } from "@/src/config/endpoints";
import { validateInput } from "@/src/helper/validateInput";
import axios from "axios";
import { z } from "zod";

export const signinSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SigninRequest = z.infer<typeof signinSchema>;

export interface SigninResponse {
  message: string;
}

export async function signin(data: SigninRequest): Promise<SigninResponse> {
  try {
    await validateInput(data, signinSchema);

    const res = await axios.post(`${API_BASE_URL}/signin`, data, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" }
    });

    console.log(res)

    if (res.data.success) {
      return;
    }

    throw new Error(res.data.error?.message);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error?.message || err.message);
    }
    throw new Error('There was an unknown error, please try again.');
  }

}