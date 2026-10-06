export const SERVER_IP = 'amazingcraft.org';
export const SERVER_PORT = 19132;
export const STATUS_REFRESH_INTERVAL = 30000;

// The Java proxy reports the network status and honours Minecraft SRV records.
const STATUS_ENDPOINTS = [
  `https://api.mcsrvstat.us/3/${SERVER_IP}`,
  `https://api.mcstatus.io/v2/status/java/${SERVER_IP}`,
];

export async function fetchServerStatus(fetcher = fetch) {
  let offlineResult = null;
  let failed = false;

  for (const endpoint of STATUS_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const startedAt = performance.now();

    try {
      const response = await fetcher(endpoint, { signal: controller.signal });
      if (!response.ok) throw new Error(`Status API returned HTTP ${response.status}`);

      const serverData = await response.json();
      if (typeof serverData?.online !== 'boolean') {
        throw new Error('Status API returned an invalid response');
      }

      const result = {
        serverData,
        responseTime: Math.round(performance.now() - startedAt),
      };

      if (serverData.online) return result;
      offlineResult = result;
    } catch {
      failed = true;
    } finally {
      clearTimeout(timeout);
    }
  }

  // An unavailable provider cannot confirm that the Minecraft server is down.
  if (offlineResult && !failed) return offlineResult;
  throw new Error('Server status is temporarily unavailable');
}
