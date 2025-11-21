async function searchWeb(query, env) {
  const url = `https://serpapi.com/search.json?q=${encodeURIComponent(
    query
  )}&engine=google&api_key=${env.SERPAPI_KEY}`

  const res = await fetch(url)
  if (!res.ok) return ""

  const data = await res.json()
  const snippets = (data.organic_results || [])
    .slice(0, 5)
    .map((r) => r.snippet || "")
    .join("\n")

  return snippets
}

export async function handlePrompt(request, env) {
  const { sector, domain, level, useCase, goal, context } = await request.json()

  const webData = await searchWeb(`${sector} ${domain} ${useCase} trends best practices`, env)

  const systemPrompt = `
You are an Organizational Development AI Engine.
You combine:
- internal knowledge
- organizational science
- live web research
- OD best practices

Return two sections:
1. [ORGANIZATIONAL_PROMPT]
2. [ACTION_PLAYBOOK]
`.trim()

  const userPrompt = `
Sector: ${sector}
Domain: ${domain}
Leadership level: ${level}
Use case: ${useCase}

Goal:
${goal}

Context:
${context}

Web Research:
${webData}
`.trim()

  const ai = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    })
  })

  const result = await ai.json()
  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" }
  })
}
