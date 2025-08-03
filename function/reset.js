import { resetCacheUtama } from './search';
import { resetInoutCache } from './inout';
import { resetStokCache } from './stok';


export async function resetSemuaCache(env) {
  try {
    await Promise.all([
      resetCacheUtama(env),
      resetInoutCache(env),
      resetStokCache(env)
    ]);

    const timestamp = new Date().toISOString();
    await env.DATABASE_CACHE.put("lastUpdate", timestamp);

    return new Response(JSON.stringify({ status: "success", message: "✅ Semua cache berhasil di-reset!" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Gagal reset semua cache:", error);
    return new Response(JSON.stringify({ status: "error", message: "Gagal reset semua cache!" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
