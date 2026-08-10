import { GoogleAuth } from 'google-auth-library';

/**
 * Retrieves an access token using Application Default Credentials.
 * Throws an informative error if credentials are missing or invalid.
 */
export async function getGoogleAccessToken(): Promise<string> {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  try {
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    if (!tokenResponse || !tokenResponse.token) {
      throw new Error('Failed to obtain access token from Google Auth client');
    }
    return tokenResponse.token;
  } catch (err) {
    console.error('Google Auth error:', err);
    throw new Error('Google Cloud authentication failed. Ensure GOOGLE_APPLICATION_CREDENTIALS points to a valid service account JSON with roles/aiplatform.user');
  }
}

/**
 * Calls a Vertex AI endpoint (AI Companion) with the provided request payload.
 * Handles 403 errors with a clear message.
 */
export async function callVertexAI(endpoint: string, payload: any): Promise<any> {
  const accessToken = await getGoogleAccessToken();
  const url = `${endpoint}`; // Expect full URL including query parameters if needed
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      if (response.status === 403) {
        const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'UNKNOWN_PROJECT';
        console.error(`Google Cloud 403: Check IAM roles for project ${projectId}. Required role: roles/aiplatform.user`);
        throw new Error('Permission denied when calling Vertex AI. Verify service account IAM roles and API enablement.');
      }
      const errText = await response.text();
      throw new Error(`Vertex AI request failed with status ${response.status}: ${errText}`);
    }
    return await response.json();
  } catch (err) {
    console.error('Vertex AI call error:', err);
    throw err;
  }
}
