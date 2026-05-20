import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'device_id';

export async function trackUniqueVisit(): Promise<void> {
  try {
    let deviceId = await AsyncStorage.getItem(STORAGE_KEY);
    if (!deviceId) {
      let id: string | null = null;
      try {
        if (Platform.OS === 'android') {
          id = (Application as any).androidId ?? null;
        } else if (Platform.OS === 'ios' && typeof Application.getIosIdForVendorAsync === 'function') {
          id = await (Application as any).getIosIdForVendorAsync();
        }
      } catch (e) {
        // ignore and fall back
      }

      if (!id) id = Date.now().toString();
      await AsyncStorage.setItem(STORAGE_KEY, id);
      deviceId = id;
    }

    await supabase.rpc('log_unique_visit', { p_device_id: deviceId });
  } catch (error) {
    // fail silently — tracking shouldn't break the app
    // eslint-disable-next-line no-console
    console.warn('trackUniqueVisit failed', error);
  }
}

export default trackUniqueVisit;
