export const runtime = "nodejs"

type Subscriber = { id?: string; status?: string; segments?: { id: string }[] }
const failure = () => Response.json({ registered: false, error: "We couldn’t request your report. Please try again." }, { status: 502 })

export async function POST(request: Request) {
  let email = ""
  try {
    const body = await request.json()
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  } catch {
    return Response.json({ registered: false, error: "Please enter a valid email address." }, { status: 400 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ registered: false, error: "Please enter a valid email address." }, { status: 400 })
  const key = process.env.FLODESK_API_KEY
  const segment = process.env.FLODESK_ALGORAND_REPORT_SEGMENT_ID
  if (!key || !segment) return Response.json({ registered: false, error: "Report delivery is not connected yet. Please check back soon." }, { status: 503 })
  const headers = {
    Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}`,
    "Content-Type": "application/json",
    "User-Agent": "isakii.net (https://isakii.net)",
  }
  try {
    const response = await fetch("https://api.flodesk.com/v1/subscribers", {
      method: "POST", headers, body: JSON.stringify({ email }), cache: "no-store",
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) {
      console.error("Report subscriber request failed", { status: response.status })
      return failure()
    }
    const subscriber = await response.json() as Subscriber
    if (!subscriber.id) return failure()
    if (subscriber.status !== "active") {
      return Response.json({ registered: false, error: "This address is not active in our mailing list. Please use another email address or contact Lisa for the report." }, { status: 409 })
    }
    // Explicit segment assignment is required to trigger report delivery reliably.
    const endpoint = `https://api.flodesk.com/v1/subscribers/${encodeURIComponent(subscriber.id)}`
    const membership = await fetch(`${endpoint}/segments`, {
      method: "POST", headers, body: JSON.stringify({ segment_ids: [segment] }), cache: "no-store",
      signal: AbortSignal.timeout(15000),
    })
    if (!membership.ok) {
      console.error("Report segment assignment failed", { status: membership.status })
      return failure()
    }
    const verified = await fetch(endpoint, { headers, cache: "no-store", signal: AbortSignal.timeout(15000) })
    if (!verified.ok) return failure()
    const confirmed = await verified.json() as Subscriber
    if (!confirmed.segments?.some(item => item.id === segment)) {
      console.error("Report segment membership was not confirmed")
      return failure()
    }
    return Response.json({ registered: true })
  } catch (error) {
    console.error("Report request failed", { type: error instanceof Error ? error.name : "UnknownError" })
    return failure()
  }
}
