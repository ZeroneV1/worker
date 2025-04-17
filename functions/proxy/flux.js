export default async (request) => {
  const url = new URL(request.url);
  url.hostname = "fluxaga.glitch.me"; // Change this for each route

  // If WebSocket upgrade request
  if (request.headers.get('Upgrade') === 'websocket') {
    return fetch(url.toString(), request);
  }

  const modifiedRequest = new Request(url, request);
  const response = await fetch(modifiedRequest);

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, x-requested-with",
    "Access-Control-Expose-Headers": "Content-Length, X-Kuma-Revision",
    "Access-Control-Max-Age": "86400"
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  const modifiedResponse = new Response(response.body, response);
  Object.entries(corsHeaders).forEach(([key, value]) => {
    modifiedResponse.headers.set(key, value);
  });

  // Remove CSP headers if they exist
  if (modifiedResponse.headers.has("Content-Security-Policy")) {
    modifiedResponse.headers.delete("Content-Security-Policy");
  }

  return modifiedResponse;
};
