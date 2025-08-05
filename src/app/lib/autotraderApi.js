// const AUTOTRADER_CONFIG = {
//   baseUrl: process.env.AUTOTRADER_BASE_URL || 'https://api.autotrader.co.uk',
//   apiKey: process.env.AUTOTRADER_API_KEY,
//   apiSecret: process.env.AUTOTRADER_API_SECRET,
//   advertiserId: process.env.AUTOTRADER_ADVERTISER_ID,
//   tokenUrl: 'https://api-sandbox.autotrader.co.uk/auth/token' // OAuth token endpoint
// };

// // In-memory token cache (in production, use Redis or database)
// let tokenCache = {
//   token: null,
//   expiresAt: null
// };

// // Get OAuth 2.0 access token
// async function getAccessToken() {
//   try {
//     // Check if we have a valid cached token
//     if (tokenCache.token && tokenCache.expiresAt && Date.now() < tokenCache.expiresAt) {
//       console.log('Using cached access token');
//       return tokenCache.token;
//     }

//     console.log('Fetching new access token...');

//     // Prepare credentials for OAuth
//     const credentials = Buffer.from(`${AUTOTRADER_CONFIG.apiKey}:${AUTOTRADER_CONFIG.apiSecret}`).toString('base64');

//     const response = await fetch(AUTOTRADER_CONFIG.tokenUrl, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Basic ${credentials}`,
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Accept': 'application/json'
//       },
//       body: 'grant_type=client_credentials'
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('OAuth Token Error:', errorText);
//       throw new Error(`OAuth token request failed: ${response.status} ${response.statusText}`);
//     }

//     const tokenData = await response.json();
//     console.log('Token response:', tokenData);

//     // Cache the token (subtract 60 seconds for safety margin)
//     const expiresIn = tokenData.expires_in || 3600; // Default to 1 hour
//     tokenCache = {
//       token: tokenData.access_token,
//       expiresAt: Date.now() + (expiresIn - 60) * 1000
//     };

//     return tokenData.access_token;
//   } catch (error) {
//     console.error('Error getting access token:', error);
//     throw error;
//   }
// }

// // Generate Bearer Authentication header
// async function getAuthHeader() {
//   const token = await getAccessToken();
//   return `Bearer ${token}`;
// }

// // Fetch all vehicles for your dealership
// export async function fetchAutoTraderStock() {
//   try {
//     console.log('Fetching Auto Trader stock...');
    
//     const authHeader = await getAuthHeader();
    
//     const response = await fetch(
//       `${AUTOTRADER_CONFIG.baseUrl}/stock/advertisers/${AUTOTRADER_CONFIG.advertiserId}`,
//       {
//         method: 'GET',
//         headers: {
//           'Authorization': authHeader,
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       }
//     );

//     console.log('Auto Trader API Response Status:', response.status);

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Auto Trader API Error:', errorText);
      
//       // If unauthorized, clear token cache and retry once
//       if (response.status === 401) {
//         console.log('Token expired, clearing cache and retrying...');
//         tokenCache = { token: null, expiresAt: null };
        
//         // Retry with fresh token
//         const newAuthHeader = await getAuthHeader();
//         const retryResponse = await fetch(
//           `${AUTOTRADER_CONFIG.baseUrl}/stock/advertisers/${AUTOTRADER_CONFIG.advertiserId}`,
//           {
//             method: 'GET',
//             headers: {
//               'Authorization': newAuthHeader,
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             }
//           }
//         );

//         if (!retryResponse.ok) {
//           const retryErrorText = await retryResponse.text();
//           throw new Error(`Auto Trader API error (retry): ${retryResponse.status} ${retryResponse.statusText} - ${retryErrorText}`);
//         }

//         const retryData = await retryResponse.json();
//         console.log('Auto Trader Stock Data (retry):', retryData);
//         return retryData;
//       }
      
//       throw new Error(`Auto Trader API error: ${response.status} ${response.statusText} - ${errorText}`);
//     }

//     const data = await response.json();
//     console.log('Auto Trader Stock Data:', data);
    
//     return data;
//   } catch (error) {
//     console.error('Error fetching Auto Trader stock:', error);
//     throw error;
//   }
// }

// // Fetch details for a specific vehicle
// export async function fetchVehicleDetails(stockId) {
//   try {
//     const authHeader = await getAuthHeader();
    
//     const response = await fetch(
//       `${AUTOTRADER_CONFIG.baseUrl}/stock/vehicles/${stockId}`,
//       {
//         method: 'GET',
//         headers: {
//           'Authorization': authHeader,
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       }
//     );

//     if (!response.ok) {
//       // Handle token expiry
//       if (response.status === 401) {
//         tokenCache = { token: null, expiresAt: null };
//         const newAuthHeader = await getAuthHeader();
        
//         const retryResponse = await fetch(
//           `${AUTOTRADER_CONFIG.baseUrl}/stock/vehicles/${stockId}`,
//           {
//             method: 'GET',
//             headers: {
//               'Authorization': newAuthHeader,
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             }
//           }
//         );

//         if (!retryResponse.ok) {
//           throw new Error(`Auto Trader API error: ${retryResponse.status} ${retryResponse.statusText}`);
//         }

//         return await retryResponse.json();
//       }
      
//       throw new Error(`Auto Trader API error: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error fetching vehicle details:', error);
//     throw error;
//   }
// }

// // Search vehicles with filters
// export async function searchVehicles(searchParams = {}) {
//   try {
//     const authHeader = await getAuthHeader();
    
//     const queryParams = new URLSearchParams({
//       advertiserId: AUTOTRADER_CONFIG.advertiserId,
//       ...searchParams
//     });

//     const response = await fetch(
//       `${AUTOTRADER_CONFIG.baseUrl}/stock/search?${queryParams}`,
//       {
//         method: 'GET',
//         headers: {
//           'Authorization': authHeader,
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         }
//       }
//     );

//     if (!response.ok) {
//       // Handle token expiry
//       if (response.status === 401) {
//         tokenCache = { token: null, expiresAt: null };
//         const newAuthHeader = await getAuthHeader();
        
//         const retryResponse = await fetch(
//           `${AUTOTRADER_CONFIG.baseUrl}/stock/search?${queryParams}`,
//           {
//             method: 'GET',
//             headers: {
//               'Authorization': newAuthHeader,
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             }
//           }
//         );

//         if (!retryResponse.ok) {
//           throw new Error(`Auto Trader API error: ${retryResponse.status} ${retryResponse.statusText}`);
//         }

//         return await retryResponse.json();
//       }
      
//       throw new Error(`Auto Trader API error: ${response.status} ${response.statusText}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error searching vehicles:', error);
//     throw error;
//   }
// }

// // Test function to verify API connection
// export async function testAutoTraderConnection() {
//   try {
//     console.log('Testing Auto Trader API connection...');
//     console.log('Config:', {
//       baseUrl: AUTOTRADER_CONFIG.baseUrl,
//       advertiserId: AUTOTRADER_CONFIG.advertiserId,
//       hasApiKey: !!AUTOTRADER_CONFIG.apiKey,
//       hasApiSecret: !!AUTOTRADER_CONFIG.apiSecret
//     });
    
//     // First test OAuth token
//     const token = await getAccessToken();
//     console.log('✅ OAuth token obtained successfully');
    
//     // Then test API call
//     const data = await fetchAutoTraderStock();
//     console.log('✅ Auto Trader API connection successful!');
//     return { success: true, data };
//   } catch (error) {
//     console.error('❌ Auto Trader API connection failed:', error);
//     return { success: false, error: error.message };
//   }
// }

// // Clear token cache (useful for debugging)
// export function clearTokenCache() {
//   tokenCache = { token: null, expiresAt: null };
//   console.log('Token cache cleared');
// }