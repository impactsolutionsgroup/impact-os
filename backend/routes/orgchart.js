export async function handleOrgChart(request, env) {
  const { orgContext, priority } = await request.json()

  const systemPrompt = `
You design organizational charts.
Return:
[STRUCTURE_OVERVIEW]
[TEXT_ORG_CHART]
[ROLE_LADDER]
[TRADEOFFS]
`.trim()

  const userPrompt = `
Org context:
${orgContext}

Priority:
${priority}
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

  const json = await ai.json()
  return new Response(JSON.stringify(json), {
    headers: { "Content-Type": "application/json" }
  })
}
