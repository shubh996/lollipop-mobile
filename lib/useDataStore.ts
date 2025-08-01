import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

const CACHE_KEY = 'investment_tips_cache';
const CACHE_TIME_KEY = 'investment_tips_cache_time';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useTipsData() {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTips() {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Read cache
        console.log('[useTipsData] Reading cache from AsyncStorage...');
        const cacheStr = await AsyncStorage.getItem(CACHE_KEY);

        let cache: any[] = [];
        try {
          cache = cacheStr ? JSON.parse(cacheStr) : [];
        } catch (parseErr) {
          console.warn('[useTipsData] JSON parse failed. Clearing corrupted cache.', parseErr);
          await AsyncStorage.removeItem(CACHE_KEY);
        }

        console.log('[useTipsData] Cache loaded. Tips count:', cache.length);
        setTips(cache);

        // Optionally: Skip Supabase fetch if cache is fresh (based on TTL)
        const cacheTimeStr = await AsyncStorage.getItem(CACHE_TIME_KEY);
        const cacheTime = cacheTimeStr ? parseInt(cacheTimeStr, 10) : 0;
        const isCacheFresh = Date.now() - cacheTime < CACHE_TTL;
        if (isCacheFresh) {
          console.log('[useTipsData] Cache is fresh. Skipping Supabase fetch.');
          return;
        }

        // Step 2: Fetch from Supabase
        console.log('[useTipsData] Fetching latest tips from Supabase...');
        const { data, error: supabaseError } = await supabase
          .from('investment_tips')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError || !data) {
          throw supabaseError || new Error('No data from Supabase');
        }

        const isNew = JSON.stringify(data) !== JSON.stringify(cache);
        if (isNew) {
          console.log('[useTipsData] New tips found. Updating cache.');
          await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
          await AsyncStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
          setTips(data);
        } else {
          console.log('[useTipsData] No new tips. Using cache.');
          setTips(cache);
        }

      } catch (err) {
        console.error('[useTipsData] Error loading tips:', err);
        setError('Failed to fetch live tips.');
        setTips([]);
      } finally {
        setLoading(false);
        console.log('[useTipsData] Load complete.');
      }
    }

    loadTips();
  }, []);

  // Manual refresh (no TTL check)
  const refresh = async () => {
    console.log('[useTipsData] Manual refresh triggered.');
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase
        .from('investment_tips')
        .select('*')
        .order('created_at', { ascending: false });

      if (supabaseError || !data) {
        throw supabaseError || new Error('No data returned');
      }

      console.log('[useTipsData] Manual refresh: updating cache. Count:', data.length);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      await AsyncStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      setTips(data);

    } catch (err) {
      console.error('[useTipsData] Manual refresh error:', err);
      setError('Failed to fetch live tips.');
      setTips([]);
    } finally {
      console.log('[useTipsData] Manual refresh complete.');
      setLoading(false);
    }
  };

  return { tips, loading, error, refresh };
}
