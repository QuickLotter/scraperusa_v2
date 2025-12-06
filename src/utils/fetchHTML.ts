export async function fetchHTML(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123 Safari/537.36",
      },
    });

    if (!res.ok) {
      throw new Error(`Erro HTTP ${res.status}`);
    }

    return await res.text();
  } catch (err) {
    throw new Error(`Erro ao acessar ${url}`);
  }
}
