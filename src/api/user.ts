
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
