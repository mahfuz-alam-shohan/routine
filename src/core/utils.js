export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function htmlResponse(html) {
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' }
  });
}