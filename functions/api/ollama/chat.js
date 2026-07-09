// Cloudflare Pages Function: proxies chatbot requests to Ollama Cloud.
// The API key comes from the OLLAMA_API_KEY environment variable
// (set in Cloudflare Pages -> Settings -> Variables and Secrets).
// Visitors never see the key.

export async function onRequestPost(context) {
  if (!context.env.OLLAMA_API_KEY) {
    return new Response(
      JSON.stringify({ error: "OLLAMA_API_KEY is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const upstream = await fetch("https://ollama.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + context.env.OLLAMA_API_KEY,
    },
    body: context.request.body,
  });

  // Stream the reply straight back to the browser
  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") || "application/x-ndjson",
      "Cache-Control": "no-store",
    },
  });
}
