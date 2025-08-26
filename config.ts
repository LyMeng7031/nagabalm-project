// Environment configuration
type EnvConfig = {
  apiBaseUrl: string;
  // Add other environment-specific variables here
};

const getConfig = (): EnvConfig => {
  if (typeof window !== 'undefined') {
    // Browser environment
    return {
      apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    };
  }

  // Server/Node environment
  return {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  };
};

export const config = getConfig();

// Helper function to get the appropriate base URL
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};
