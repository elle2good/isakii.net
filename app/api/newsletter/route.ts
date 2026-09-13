const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FLODESK_SUBSCRIBERS_URL = "https://api.flodesk.com/v1/subscribers"

export const runtime = "nodejs"

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

  const apiKey = process.env.FLODESK_API_KEY
  const segmentId = process.env.FLODESK_SEGMENT_ID

  if (!apiKey || !segmentId) {
    return Response.json(
      { registered: false, error: "Newsletter registration is not connected yet." },
      { status: 503 },
    )
  }

  try {
    const response = await fetch(FLODESK_SUBSCRIBERS_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
        "User-Agent": "isakii.net (https://isakii.net)",
      },
      body: JSON.stringify({
        email,
        segment_ids: [segmentId],
        ...(process.env.FLODESK_DOUBLE_OPT_IN === "true" ? { double_optin: true } : {}),
      }),
      cache: "no-store",
    })

    if (!response.ok) {
      console.error("Flodesk newsletter registration failed", { status: response.status })
      return Response.json(
        { registered: false, error: "Newsletter registration could not be completed." },
        { status: 502 },
      )
    }

    return Response.json({ registered: true, message: "You're subscribed." })
  } catch (error) {
    console.error("Flodesk newsletter request failed", {
      message: error instanceof Error ? error.message : "Unknown error",
    })
    return Response.json(
      { registered: false, error: "Newsletter registration could not be completed." },
      { status: 502 },
    )
  }
}
