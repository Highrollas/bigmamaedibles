import fs from "fs/promises";
import path from "path";

const CACHE_FILE = path.join(process.cwd(), "data", "postcodes-cache.json");

interface CacheData {
      postcodes: Record<string, unknown>;
      addresses: Record<string, unknown>;
}

let cacheData: CacheData | null = null;

async function loadCache(): Promise<CacheData> {
      if (cacheData) {
            return cacheData;
      }

      try {
            const data = await fs.readFile(CACHE_FILE, "utf-8");
            cacheData = JSON.parse(data);
            return cacheData as CacheData;
      } catch (err) {
            console.error("Error loading cache:", err);
            // Return empty cache structure if file doesn't exist
            cacheData = { postcodes: {}, addresses: {} };
            return cacheData;
      }
}

async function saveCache(data: CacheData): Promise<void> {
      try {
            await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
            await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2), "utf-8");
            cacheData = data;
      } catch (err) {
            console.error("Error saving cache:", err);
      }
}

export async function getPostcodeFromCache(postcode: string): Promise<unknown | null> {
      const cache = await loadCache();
      const normalizedPostcode = postcode.toUpperCase().trim();
      return cache.postcodes[normalizedPostcode] || null;
}

export async function savePostcodeToCache(postcode: string, data: unknown): Promise<void> {
      const cache = await loadCache();
      const normalizedPostcode = postcode.toUpperCase().trim();
      cache.postcodes[normalizedPostcode] = data;
      await saveCache(cache);
}

export async function getAddressFromCache(id: string): Promise<unknown | null> {
      const cache = await loadCache();
      return cache.addresses[id] || null;
}

export async function saveAddressToCache(id: string, data: unknown): Promise<void> {
      const cache = await loadCache();
      cache.addresses[id] = data;
      await saveCache(cache);
}
