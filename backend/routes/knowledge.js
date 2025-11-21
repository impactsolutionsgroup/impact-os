export async function handleKnowledge(request, env) {
  const { text, status = "pending" } = await request.json()

  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/knowledge`, {
    method: "POST",
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fact: text, status })
  })

  if (!res.ok) {
    const error = await res.text()
    return new Response(`Supabase Error: ${error}`, { status: 500 })
  }

  return new Response("OK", { status: 200 })
}
