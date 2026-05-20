import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "device_id";

export async function trackUniqueVisit(): Promise<void> {
  try {
    let deviceId = window.localStorage.getItem(STORAGE_KEY);
    if (!deviceId) {
      deviceId = Date.now().toString();
      window.localStorage.setItem(STORAGE_KEY, deviceId);
    }

    await supabase.rpc("log_unique_visit", { p_device_id: deviceId });
  } catch (error) {
    console.warn("trackUniqueVisit failed", error);
  }
}

export default trackUniqueVisit;
