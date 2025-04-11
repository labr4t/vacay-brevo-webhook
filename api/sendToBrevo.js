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
        "api-key": process.env.BREVO_API_KEY,
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
        listIds: [Number(process.env.BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });

    const result = await response.json();
    return res.status(response.status).json(result);
  } catch (err) {
    return res.status(500).json({ error: "Failed to contact Brevo API", details: err.message });
  }
}
