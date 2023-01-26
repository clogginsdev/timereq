export async function apiFetch(path, { method, body }) {
    const res = await fetch(`/api/${path}`, {
        method,
        body: JSON.stringify(body),
    });

    return await res.json();
}
