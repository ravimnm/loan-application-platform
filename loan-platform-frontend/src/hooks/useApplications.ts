import { useCallback, useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { applicationApi } from '../api/applicationApi';
import type { Application } from '../types/application';

export const useApplications = () => {
  const { isAuthenticated } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const apps = await applicationApi.getApplications();
      const sorted = [...apps].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
      setApplications(sorted);
    } catch {
      setApplications([]);
      setError('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apps = await applicationApi.getApplications();
        if (!active) return;
        const sorted = [...apps].sort((a, b) => {
          const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bTime - aTime;
        });
        setApplications(sorted);
      } catch {
        if (!active) return;
        setApplications([]);
        setError('Failed to load applications');
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  return {
    applications,
    isLoading,
    error,
    refetch: loadApplications,
  };
};
