const { processEmailQueue } = require("../workers/emailProcess");
const { processPushQueue } = require("../workers/pushProcess");

export default async function handler(request, response) {
  if (
    request.headers["authorization"] !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return response.status(401).end("Unauthorized Request");
  }

  try {
    await Promise.all([processPushQueue(), processEmailQueue()]);

    response.status(200).end("queues process completed successfully");
  } catch (error) {
    console.error("Error processing queues:", error);
    response.status(500).json({ error: "Failed to process queues" });
  }
}
