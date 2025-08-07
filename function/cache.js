export async function saveToKV(data, env) {
    await env.DATABASE_CACHE.put("search_results", JSON.stringify(data), {
      expirationTtl: 864000, // 12 jam
    });
  }
  
  export async function getFromKV(env) {
    const data = await env.DATABASE_CACHE.get("search_results");
    return data ? JSON.parse(data) : null;
  }
//==============================inout===================================================  
  export async function saveToKV_inout(data, env) {
    await env.DATABASE_CACHE.put("inout_cache", JSON.stringify(data), {
      expirationTtl: 864000, // 12 jam
    });
  }
  
  export async function getFromKV_inout(env) {
    const data = await env.DATABASE_CACHE.get("inout_cache");
    return data ? JSON.parse(data) : null;
  }
//============================stok================================================================  
  export async function saveToKV_stok(data, env) {
    await env.DATABASE_CACHE.put("stok_cache", JSON.stringify(data), {
      expirationTtl: 864000, // 12 jam
    });
  }
  
  export async function getFromKV_stok(env) {
    const data = await env.DATABASE_CACHE.get("stok_cache");
    return data ? JSON.parse(data) : null;
  }