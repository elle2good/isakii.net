const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  let email = ""

  try {
    const payload = (await request.json()) as { email?: unknown }
    email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : ""
  } catch {
    return Response.json({ registered: false, error: "Please enter a valid email address." }, { status: 400 })
  }

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ registered: false, error: "Please enter a valid email address." }, { status: 400 })
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL
  if (!webhookUrl) {
    return Response.json(
      { registered: false, error: "Newsletter registration is not connected yet." },
      { status: 503 },
    )
  }

  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    if (process.env.NEWSLETTER_WEBHOOK_SECRET) {
      headers.Authorization = `Bearer ${process.env.NEWSLETTER_WEBHOOK_SECRET}`
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, source: "isakii.net", subscribedAt: new Date().toISOString() }),
      cache: "no-store",
    })

    if (!response.ok) {
      return Response.json(
        { registered: false, error: "Newsletter registration could not be completed." },
        { status: 502 },
      )
    }

    return Response.json({ registered: true })
  } catch {
    return Response.json(
      { registered: false, error: "Newsletter registration could not be completed." },
      { status: 502 },
    )
  }
}
