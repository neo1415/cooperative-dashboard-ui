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

      console.log('Fetching cooperative admin settings for role:', role);

      try {
        const auth = getAuth();
        await setPersistence(auth, browserSessionPersistence);

        auth.onAuthStateChanged(async (user) => {
          if (user) {
            const token = await user.getIdToken();
            console.log('Token obtained:', token);

            try {
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
                console.log('Cooperative admin settings fetched successfully:', response.data);

                // Map the response data to a keyed object for direct access
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
            } catch (fetchError) {
              console.error('Error fetching admin settings:', fetchError);
              setError('Failed to fetch admin settings');
            } finally {
              setLoading(false);
            }
          }
        });
      } catch (persistenceError) {
        console.error('Persistence error:', persistenceError);
        setError('Failed to maintain session persistence');
        setLoading(false);
      }
    };

    fetchAdminSettings();
  }, [role]);

  return { adminSettings, loading, error };
};

export default useFetchAdminSettings;
