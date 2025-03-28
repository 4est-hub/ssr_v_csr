import { useState, useEffect } from 'react';

type StoredData = {
  first: string;
  last: string;
  email: string;
  address: string;
  created: string;
  balance: string;
};

type UseCachingFetch = (url: string) => {
  data: StoredData[] | null;
  isLoading: boolean;
  error: Error | null;
};

type Cache = {
  [key: string]: {
    data: StoredData[] | null;
    error: Error | null;
  };
};

const cache: Cache = {};

export const useCachingFetch: UseCachingFetch = (url: string) => { 
  const [storedData, setStoredData] = useState<StoredData[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const isServer = typeof window === "undefined";
  if (isServer && cache[url] && cache[url].data) {
    return {
      data: cache[url].data,
      isLoading: false,
      error: null,
    };    
  }

  useEffect(() => {
    const fetchData = async () => {
      if (cache[url] && cache[url].data) {
        setStoredData(cache[url].data);
        setError(cache[url].error);
        setIsLoading(false);
        return;
      }

      const cachedFromSession = sessionStorage.getItem('cache');
      if (cachedFromSession) {
        const parsedCache = JSON.parse(cachedFromSession);
        if (parsedCache[url]) {
          setStoredData(parsedCache[url].data);
          setError(parsedCache[url].error);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);
      try {
        const response = await fetch(url);
        const data = await response.json();
        setStoredData(data);
        cache[url] = { data, error: null };
      } catch (err) {
        setError(err as Error);
        cache[url] = { data: null, error: err as Error };
      } finally {
        setIsLoading(false); 
      }
    };
  
    fetchData();
  }, [url]);

  return {
    data: storedData,
    isLoading,
    error
  };
};

export const preloadCachingFetch = async (url: string): Promise<void> => {
  if (!cache[url]) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      cache[url] = {data, error: null};
    } catch (err) {
      cache[url] = {data: null, error: err as Error};
    }
  }
};

export const serializeCache = (): string => {
  return JSON.stringify(cache);
};

export const initializeCache = (serializedCache: string): void => {
  const parsedCache = JSON.parse(serializedCache);
  Object.assign(cache, parsedCache);

  if (typeof window !== 'undefined') {
    sessionStorage.setItem('cache', serializedCache);
  }
};

export const wipeCache = (): void => {};
