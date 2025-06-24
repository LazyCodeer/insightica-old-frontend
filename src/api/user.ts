
import apiClient from '@/lib/apiClient';
import type { SignupFormValues } from '@/components/auth/SignupForm';
import type { AppUser } from '@/types/user';

export const signupUser = async (userData: SignupFormValues) => {
  try {
    const response = await apiClient.post('/user/signup/', {
      email: userData.email,
      username: userData.username,
      password: userData.password,
      name: userData.name,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      // Backend sends specific field errors, let's format them.
      const errorData = error.response.data;
      const errorMessages = Object.entries(errorData)
        .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
        .join(' ');
      throw new Error(errorMessages || 'An unknown error occurred during signup.');
    }
    throw error;
  }
};

export const getMe = async (): Promise<AppUser> => {
    const response = await apiClient.get('/user/me/');
    return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await apiClient.post('/user/verify-email/', { token });
  return response.data;
};

export const requestPasswordReset = async (email: string) => {
  const response = await apiClient.post('/user/reset-password-request/', { email });
  return response.data;
};

export const resetPassword = async (token: string, new_password: string) => {
  const response = await apiClient.post('/user/reset-password/', { token, new_password });
  return response.data;
};

// --- New Early Access API ---

export interface EarlyAccessPayload {
  full_name: string;
  email_address: string;
  trading_experience: string;
  referral_source?: string | "";
  referral_other_specify?: string;
  biggest_challenge?: string;
  anything_else?: string;
}


export const submitEarlyAccessForm = async (userData: EarlyAccessPayload) => {
  try {
    const response = await apiClient.post('/user/early-access/', userData);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      const errorMessages = Object.entries(errorData)
        .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${(value as string[]).join(', ')}`)
        .join(' ');
      throw new Error(errorMessages || 'An unknown error occurred during submission.');
    }
    throw error;
  }
};


// --- New Investment Interest API ---
export interface InvestmentInterestPayload {
  name: string;
  email: string;
  phone?: string;
  investor_type: string;
  investor_type_other?: string;
  organization?: string;
  source?: string | "" | null;
  source_other?: string;
  interest?: string | "" | null;
  interest_other?: string;
  comments?: string;
}

export const submitInvestmentInterest = async (payload: InvestmentInterestPayload) => {
  try {
    const response = await apiClient.post('/user/investment-interest/', payload);
    return response.data;
  } catch (error: any) {
     if (error.response && error.response.data) {
      const errorData = error.response.data;
      const errorMessages = Object.entries(errorData)
        .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${(value as string[]).join(', ')}`)
        .join(' ');
      throw new Error(errorMessages || 'An unknown error occurred during submission.');
    }
    throw error;
  }
}

// --- New User Feedback API ---
export interface UserFeedbackPayload {
  name: string;
  email: string;
  profession: string[];
  profession_other?: string;
  source: string[];
  source_other?: string;
  tools?: string[];
  usage_frequency?: string;
  motivation?: string[];
  motivation_other?: string;
  primary_trading_goal: string;
  primary_trading_goal_other?: string;
  other_tools_platforms_methods?: string;
  experience_rating?: number;
  platform_feel?: string;
  learning_curve?: string;
  helpful_visual?: string;
  polished_part?: string;
  clunky_parts?: string;
  one_word?: string;
  market_participant?: string;
  understand_indicators?: string;
  understand_how?: string;
  discovered_patterns?: string;
  patterns_details?: string;
  trade_results?: string;
  recommend_likelihood?: number;
  new_feature?: string;
  new_feature_other?: string;
  best_suited?: string;
  follow_up?: string;
  follow_up_contact?: string;
  final_thoughts?: string;
}


export const submitUserFeedback = async (payload: UserFeedbackPayload) => {
  try {
    const response = await apiClient.post('/user/user-feedback/', payload);
    return response.data;
  } catch (error: any) {
     if (error.response && error.response.data) {
      const errorData = error.response.data;
      const errorMessages = Object.entries(errorData)
        .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${(value as string[]).join(', ')}`)
        .join(' ');
      throw new Error(errorMessages || 'An unknown error occurred during submission.');
    }
    throw error;
  }
};


// --- New Work With Us API ---
export const submitWorkWithUsForm = async (formData: FormData) => {
  try {
    const response = await apiClient.post('/user/work-with-us/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      const errorMessages = Object.entries(errorData)
        .map(([key, value]) => {
          const message = Array.isArray(value) ? value.join(', ') : String(value);
          return `${key.replace(/_/g, ' ')}: ${message}`;
        })
        .join(' ');
      throw new Error(errorMessages || 'An unknown error occurred during application.');
    }
    throw error;
  }
};
