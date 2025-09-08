// 🔒 AWS Configuration for Email Service - SECURE VERSION
// 
// ⚠️  SECURITY WARNING: NEVER store credentials directly in code!
// ✅  Always use environment variables for sensitive data
// 
// This configuration ONLY uses environment variables and provides
// secure fallbacks for development mode.

export const AWS_CONFIG = {
  region: 'us-east-1', // Change to your preferred AWS region
  
  // 🔐 SECURE: Only reads from environment variables
  // These will be undefined if not set, triggering development mode
  credentials: {
    accessKeyId: getSecureEnvVar('AWS_ACCESS_KEY_ID'),
    secretAccessKey: getSecureEnvVar('AWS_SECRET_ACCESS_KEY')
  },
  
  // Email configuration (safe to store)
  email: {
    sourceEmail: 'contato@arsmachinaconsultancy.com', // Must be verified in AWS SES
    replyToEmail: 'contato@arsmachinaconsultancy.com'
  }
};

/**
 * 🔒 Secure environment variable getter
 * Only returns values from actual environment variables
 * Never returns hardcoded credentials
 */
function getSecureEnvVar(key: string): string | undefined {
  // Check multiple possible sources for environment variables
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // For browser environments, check if variables were injected at build time
  if (typeof window !== 'undefined' && (window as any).env) {
    return (window as any).env[key];
  }
  
  // Return undefined if no environment variable found
  // This will trigger development mode
  return undefined;
}

/**
 * 🔍 Development mode check - secure version
 * Returns true if AWS credentials are not properly configured
 */
export const isDevelopmentMode = (): boolean => {
  const hasAccessKey = !!AWS_CONFIG.credentials.accessKeyId;
  const hasSecretKey = !!AWS_CONFIG.credentials.secretAccessKey;
  
  // Check credentials without logging
  if (!hasAccessKey || !hasSecretKey) {
    return true;
  }
  
  return false;
};

/**
 * 🛡️ Security validation
 * Checks if the current configuration is secure
 */
export const validateSecurityConfiguration = (): {
  isSecure: boolean;
  warnings: string[];
  recommendations: string[];
} => {
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // Check if running in development mode
  if (isDevelopmentMode()) {
    recommendations.push('Configure AWS credentials via environment variables for production');
    recommendations.push('Never commit AWS credentials to version control');
  }
  
  // Check if we're in a browser environment with credentials
  if (typeof window !== 'undefined' && !isDevelopmentMode()) {
    warnings.push('AWS credentials detected in browser environment');
    recommendations.push('Consider using a backend API for email sending in production');
  }
  
  return {
    isSecure: warnings.length === 0,
    warnings,
    recommendations
  };
};

// 📚 Security instructions
export const SECURITY_INSTRUCTIONS = `
🔒 SECURITY BEST PRACTICES:

✅ DO:
- Use environment variables for all sensitive data
- Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your deployment environment
- Use IAM roles with minimal permissions
- Rotate credentials regularly
- Monitor AWS usage and costs

❌ DON'T:
- Never hardcode credentials in source code
- Never commit .env files to version control
- Never share credentials in chat/email
- Never use root AWS account credentials
- Never store credentials in client-side code

🔧 SETUP FOR PRODUCTION:
1. Set environment variables in your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables  
   - AWS: Lambda Environment Variables
   - Docker: Use --env-file or docker-compose.yml

2. For local development, create .env file (add to .gitignore):
   AWS_ACCESS_KEY_ID=your_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_here

3. Verify security with: validateSecurityConfiguration()
`;
