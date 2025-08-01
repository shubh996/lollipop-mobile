import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

// Central data store for investment tips
const CACHE_KEY = 'investment_tips_cache';
const CACHE_TIME_KEY = 'investment_tips_cache_time';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useTipsData() {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On mount, always check Supabase for new tips and update cache if needed
  useEffect(() => {
    async function loadTips() {
      setLoading(true);
      setError(null);
      try {
        // Step 1: Read cache from AsyncStorage
        console.log('[useTipsData] Step 1: Reading cache from AsyncStorage...');
        const cacheStr = await AsyncStorage.getItem(CACHE_KEY);
        const cache = cacheStr ? JSON.parse(cacheStr) : [];
        console.log('[useTipsData] Cache loaded. Tips count:', cache.length);
        setTips(cache);



        // // Step 2: Fetch latest tips from Supabase
        // console.log('[useTipsData] Step 2: Fetching latest tips from Supabase...');
        // const { data, error } = await supabase
        //   .from('investment_tips')
        //   .select('*')
        //   .order('created_at', { ascending: false });

        // // Step 3: Handle Supabase error
        // if (error) {
        //   console.log('[useTipsData] Supabase fetch error:', error);
        //   // If Supabase fails, fallback to cache
        //   if (cache.length) {
        //     console.log('[useTipsData] Using fallback cache. Tips count:', cache.length);
        //     setTips(cache);
        //   } else {
        //     console.log('[useTipsData] No cache available, returning empty tips.');
        //     setTips([]);
        //   }
        //   setError('Failed to fetch live tips.');
        // } else {
        //   // Step 4: Compare fetched data with cache
        //   const isNew = JSON.stringify(data) !== JSON.stringify(cache);
        //   console.log('[useTipsData] Supabase fetch success. Tips count:', data?.length ?? 0, 'Is new:', isNew);
        //   if (isNew) {
        //     // Step 5: Update cache and memory if new tips exist
        //     console.log('[useTipsData] New tips found. Updating cache and memory.');
        //     await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data || []));
        //     await AsyncStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
        //     setTips(data || []);
        //   } else {
        //     // Step 6: Use cache if no new tips
        //     console.log('[useTipsData] No new tips. Using cache.');
        //     setTips(cache);
        //   }
        // }





      } catch (err) {
        // Step 7: Catch any unexpected errors
        console.log('[useTipsData] Unexpected error:', err);
        setError('Failed to fetch live tips.');
        setTips([]);
      } finally {
        // Step 8: Loading complete
        console.log('[useTipsData] Loading complete.');
        setLoading(false);
      }
    }
    loadTips();
  }, []);

  // Manual refresh
  // Manual refresh: always fetch from Supabase and update cache
  const refresh = async () => {
    console.log('[useTipsData] Manual refresh triggered.');
    setLoading(true);
    setError(null);
    try {
      // Step 1: Fetch latest tips from Supabase
      const { data, error } = await supabase
        .from('investment_tips')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.log('[useTipsData] Supabase fetch error (manual refresh):', error);
        setError('Failed to fetch live tips.');
        setTips([]);
        return;
      }
      // Step 2: Update cache and memory
      console.log('[useTipsData] Manual refresh: updating cache and memory. Tips count:', data?.length ?? 0);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data || []));
      await AsyncStorage.setItem(CACHE_TIME_KEY, String(Date.now()));
      setTips(data || []);
    } catch (err) {
      console.log('[useTipsData] Unexpected error (manual refresh):', err);
      setError('Failed to fetch live tips.');
      setTips([]);
    } finally {
      console.log('[useTipsData] Manual refresh complete.');
      setLoading(false);
    }
  };

  return { tips, loading, error, refresh };
}
