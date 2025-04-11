export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, name, number, departure, budget, message, pageURL } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Missing email" });
  }

  const now = new Date();
  const submissionTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": "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",
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: name,
          SMS: number,
          DEPARTURE: departure,
          BUDGET: budget,
          MESSAGE: message,
          PAGE: pageURL,
          SUBMITTED_AT: submissionTime,
        },
        listIds: [5],
        updateEnabled: true,
      }),
    });

    const result = await response.json();
    return res.status(response.status).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed to contact Brevo API", details: err.message });
  }
}
