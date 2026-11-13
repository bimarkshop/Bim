export default async (request, context) => {
  const url = new URL(request.url);
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|svg|ico|woff2)$/)) {
    return context.next();
  }

  const ua = (request.headers.get("user-agent") || "").toLowerCase();
  const country = (context.geo?.country?.code || "NG").toUpperCase();

  const isBot = /facebookexternalhit|facebot|meta-externalagent|twitterbot|telegrambot|whatsapp|googlebot|bingbot|crawler|spider|headless|phantom|selenium|puppeteer|lighthouse|curl|wget/i.test(ua);
  const moderatorCountries = ["US", "CA", "GB", "IE", "DE", "NL", "FR", "SE", "CH", "ES", "IT", "PL"];

  if (isBot || moderatorCountries.includes(country)) {
    const whitePage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Goal Express — African Football Matchday & Tactical Digest</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f4f6f8; color: #1a202c; margin: 0; line-height: 1.6; }
    header { background: #0f172a; color: #fff; padding: 20px; text-align: center; font-weight: 800; }
    main { max-width: 720px; margin: 24px auto; background: #fff; padding: 28px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
    h1 { font-size: 22px; margin-top: 0; color: #0f172a; }
    .meta { font-size: 13px; color: #64748b; margin-bottom: 16px; }
  </style>
</head>
<body>
  <header>GOAL EXPRESS &bull; African Football Editorial</header>
  <main>
    <h1>AFCON 2027 Qualifiers: Key Matchday Clashes Across the Continent</h1>
    <div class="meta">Updated November 13, 2026 &bull; Editorial Desk</div>
    <p>National teams across Africa return to action today in crucial 2027 Africa Cup of Nations qualifying fixtures, including Nigeria facing Tanzania, South Africa hosting Kenya, and Egypt taking on Malawi.</p>
    <p>Coaching staffs are focusing on high-pressing transitions, squad rotation, and compact defensive shapes as points become vital in the race for qualification.</p>
    <p>Follow Goal Express for daily squad updates, tactical ratings, and post-match analysis from every group.</p>
  </main>
</body>
</html>`;
    return new Response(whitePage, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }
    });
  }

  const response = await context.next();
  response.headers.append("Set-Cookie", `ge_country=${country}; Path=/; Max-Age=86400; SameSite=Lax`);
  return response;
};
