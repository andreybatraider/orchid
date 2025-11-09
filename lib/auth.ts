import { cookies } from 'next/headers';

export async function isAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('admin-auth');
    return authCookie?.value === 'authenticated';
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

