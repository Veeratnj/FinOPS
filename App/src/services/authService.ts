
// const API_BASE_URL = "http://127.0.0.1:8001";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LoginPayload {
  email: string;
  password: string;
  username: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  confirm_password: string;
  username: string;
  company_name: string;
}

/* LOGIN RESPONSE */
export interface AuthResponse {

  access_token?: string;
  refresh_token?: string;
  token_type?: string;

  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };

  requires_2fa?: boolean;
  message?: string;
  email?: string;

}

/* SIGNUP RESPONSE */
export interface SignupResponse {
  id: string;
  email: string;
  username: string;
  role: string;
}

/* LOGIN */
export const loginUser = async (
  data: LoginPayload
): Promise<AuthResponse> => {
  const formData = new URLSearchParams();
  formData.append("username", data.username || data.email);
  formData.append("password", data.password);

  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    }
  );

  if (!response.ok) {

  const errorData = await response.json();

  throw new Error(
    errorData.detail || "Invalid credentials"
  );
}

  return response.json();
};

/* SIGNUP */
export const signupUser = async (
  data: SignupPayload
): Promise<SignupResponse> => {

  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

   if (!response.ok) {

  const errorData = await response.json();

  throw new Error(
    errorData.detail || "Signup failed"
  );
}

  return response.json();
};
/* VERIFY EMAIL */
export interface VerifyEmailPayload {
  email: string;
  verification_code: string;
}

export const verifyEmail = async (
  data: VerifyEmailPayload
) => {

  const response = await fetch(
    `${API_BASE_URL}/auth/verify-email`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: data.email,
        verification_code: data.verification_code,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {

    throw new Error(
      result.detail || "OTP verification failed"
    );
  }

  return result;
};
/* FORGOT PASSWORD */

export interface ForgotPasswordPayload {
  email: string;
}

export const forgotPassword = async (
  data: ForgotPasswordPayload
) => {

  const response = await fetch(
    `${API_BASE_URL}/auth/forgot-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: data.email,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {

    throw new Error(
      result.detail || "Failed to send reset code"
    );
  }

  return result;
};
/* RESET PASSWORD */

export interface ResetPasswordPayload {
  email: string;
  verification_code: string;
  new_password: string;
  confirm_password: string;
}

export const resetPassword = async (
  data: ResetPasswordPayload
) => {

  const response = await fetch(
    `${API_BASE_URL}/auth/reset-password`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: data.email,
        verification_code: data.verification_code,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {

    throw new Error(
      result.detail || "Password reset failed"
    );
  }

  return result;
};
/* RESEND VERIFICATION */

export interface ResendVerificationPayload {
  email: string;
}

export const resendVerification = async (
  data: ResendVerificationPayload
) => {

  const response = await fetch(
    `${API_BASE_URL}/auth/resend-verification`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: data.email,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {

    throw new Error(
      result.detail || "Failed to resend OTP"
    );
  }

  return result;
};
/* VERIFY LOGIN OTP */

export interface VerifyLoginOtpPayload {
  email: string;
  verification_code: string;
}

export const verifyLoginOtp = async (
  data: VerifyLoginOtpPayload
) => {

  const response = await fetch(
    `${API_BASE_URL}/auth/verify-login-otp`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: data.email,
        verification_code: data.verification_code,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {

    throw new Error(
      result.detail || "OTP verification failed"
    );
  }

  return result;
};