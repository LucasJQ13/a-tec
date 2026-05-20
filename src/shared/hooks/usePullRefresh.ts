import { useCallback, useState } from 'react';

export function usePullRefresh(delayMs = 650) {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const timeout = setTimeout(() => {
      setRefreshing(false);
    }, delayMs);

    return () => clearTimeout(timeout);
  }, [delayMs]);

  return { onRefresh, refreshing };
}
