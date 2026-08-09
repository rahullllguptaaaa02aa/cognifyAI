module.exports = async function handler(req, res) {
  try {
    const pathParts = req.query.path;

    const path = Array.isArray(pathParts)
      ? pathParts.join("/")
      : pathParts || "";

    const backendUrl =
      `https://cognifyai-wyh3.onrender.com/api/${path}`;

    const headers = {
      "Content-Type": "application/json",
    };

    const options = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(backendUrl, options);

    const data = await response.text();

    res.status(response.status);

    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") ||
        "application/json"
    );

    return res.send(data);
  } catch (error) {
    console.error("Vercel proxy error:", error);

    return res.status(500).json({
      error: "Backend proxy failed",
      message: error.message,
    });
  }
};