export default async function handler(req, res) {
  try {
    const path = Array.isArray(req.query.path)
      ? req.query.path.join("/")
      : req.query.path || "";

    const backendUrl =
      `https://cognifyai-wyh3.onrender.com/api/${path}`;

    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
      },
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : JSON.stringify(req.body),
    });

    const data = await response.text();

    res.status(response.status);

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") ||
        "application/json"
    );

    res.send(data);
  } catch (error) {
    console.error("Proxy error:", error);

    res.status(500).json({
      error: "Backend proxy failed",
      message: error.message,
    });
  }
}