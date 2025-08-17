export const API_URL = "https://10.89.70.23:8000/";
export const TILE_PATH = API_URL + "static/tiles/{x}/{y}.png";

export type Method = "GET" | "POST" | "PATCH" | "DELETE";

/**
 * Make an API request to the Storypath API.
 *
 * @param endpoint The API endpoint to call.
 * @param method The HTTP method to use.
 * @param body The request body to send.
 * @returns The response from the API.
 * @throws An error if the HTTP response is not OK.
 */
export async function apiRequest(endpoint: string, method: Method, body?: object): Promise<void> {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json", // Indicate that we are sending JSON data
    },
    body: body ? JSON.stringify(body) : null,
  };

  // Make the API request and check if the response is OK
  const response = await fetch(API_URL + endpoint, options);

  if (!response.ok) {
    const info = await response.text();
    throw new Error(`HTTP error ${response.status}: ${info}`);
  }

  // return await response.json();
}
