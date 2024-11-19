import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';

export interface AdminSetting {
  id: string;
  loanFormPrice: number | null;
  shareCapital: number | null;
  entranceFee: number | null;
  loanUpperLimit: number | null;
  monthsToLoan: number | null;
}

const useFetchAdminSettings = (role: string) => {
  const [adminSettings, setAdminSettings] = useState<Partial<AdminSetting>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminSettings = async () => {
      if (role !== 'cooperative-admin' && role !== 'member') return;

      try {
        const auth = getAuth();
        await setPersistence(auth, browserSessionPersistence);

        auth.onAuthStateChanged(async (user) => {
          if (user) {
            const token = await user.getIdToken();
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/fetch-cooperative-admin-settings`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (response.status === 200) {
              const settings: Partial<AdminSetting> = response.data.reduce(
                (acc: Partial<AdminSetting>, setting: AdminSetting) => ({
                  ...acc,
                  ...setting,
                }),
                {}
              );

              setAdminSettings(settings);
            } else {
              throw new Error('Failed to fetch settings');
            }
          }
        });
      } catch (fetchError) {
        setError('Failed to fetch admin settings');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminSettings();
  }, [role]);

  // Helper function to get a specific setting by key
  const getSettingValue = (key: keyof AdminSetting) => adminSettings[key] || null;

  return { adminSettings, loading, error, getSettingValue };
};

export default useFetchAdminSettings;
