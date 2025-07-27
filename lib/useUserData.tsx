import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '~/lib/supabase';

const UserDataContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [credits, setCredits] = useState(25);
  const [unlockedTips, setunlockedTips] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all user data together
  useEffect(() => {
    let mounted = true;
    async function fetchAllUserData() {
      setLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const sessionUser = sessionData?.session?.user;
      if (!sessionUser) {
        setUser(null);
        setProfile(null);
        setCredits(25);
        setunlockedTips([]);
        setBookmarks([]);
        setLoading(false);
        return;
      }
      setUser(sessionUser);
      // Fetch profile, credits, unlockedTips
      const { data: userData } = await supabase
        .from('users')
        .select('profile_photo_url, name, email, credits, unlockedTips')
        .eq('id', sessionUser.id)
        .single();
      setProfile(userData);
      setCredits(userData?.credits ?? 25);
      setunlockedTips(userData?.unlockedTips ?? []);
      // Fetch bookmarks
      const { data: bookmarksData } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', sessionUser.id);
      setBookmarks(bookmarksData || []);
      setLoading(false);
    }
    fetchAllUserData();
    return () => { mounted = false; };
  }, []);

  // Expose update functions as needed
  const refreshUserData = async () => {
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    const sessionUser = sessionData?.session?.user;
    if (!sessionUser) {
      setUser(null);
      setProfile(null);
      setCredits(25);
      setunlockedTips([]);
      setBookmarks([]);
      setLoading(false);
      return;
    }
    setUser(sessionUser);
    const { data: userData } = await supabase
      .from('users')
      .select('profile_photo_url, name, email, credits, unlockedTips')
      .eq('id', sessionUser.id)
      .single();
    setProfile(userData);
    setCredits(userData?.credits ?? 25);
    setunlockedTips(userData?.unlockedTips ?? []);
    const { data: bookmarksData } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', sessionUser.id);
    setBookmarks(bookmarksData || []);
    setLoading(false);
  };

  return (
    <UserDataContext.Provider value={{
      user,
      profile,
      credits,
      unlockedTips,
      bookmarks,
      loading,
      refreshUserData,
      setCredits,
      setunlockedTips,
      setBookmarks,
    }}>
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  return useContext(UserDataContext);
}
