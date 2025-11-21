export async function handleDepartment(request, env) {
  const body = await request.json()

  const systemPrompt = `
You create department structures, KPIs, and operating cadences.
Return:
[STRUCTURE_BLUEPRINT]
[OPERATING_CADENCE]
[MINIMUM_DATA_STACK]
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
        { role: "user", content: JSON.stringify(body) }
      ]
    })
  })

  const json = await ai.json()
  return new Response(JSON.stringify(json), {
    headers: { "Content-Type": "application/json" }
  })
}
