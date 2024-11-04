"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '@/app/api/config';
import { useAuth } from '@/context/AuthCOntext';
import { browserSessionPersistence, setPersistence } from 'firebase/auth';

// Updated Setting interface with id as a string
interface Setting {
  id: string; // Allow `id` to be a string for temporary entries
  minDurationMonths: number | null;
  maxDurationMonths: number | null;
  durationInterestRate: number | null;
  minAmount: number | null;
  maxAmount: number | null;
  amountInterestRate: number | null;
}

const LoanInterestSettings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const { role } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      if (role === 'cooperative-admin') {
        setPersistence(auth, browserSessionPersistence).catch((error) => {
          console.error("Persistence error: ", error);
        });

        auth.onAuthStateChanged(async (user) => {
          if (user) {
            try {
              const token = await user.getIdToken();
              const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/fetch-loan-interest-settings`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });

              if (response.status === 200) {
                // Convert IDs to strings if not already
                const fetchedSettings: Setting[] = response.data.map((setting: any) => ({
                  ...setting,
                  id: String(setting.id), // Ensure ID is a string
                }));
                setSettings(fetchedSettings);
              } else {
                throw new Error('Failed to fetch settings');
              }
            } catch (error) {
              console.error("Error fetching settings:", error);
            }
          }
        });
      }
    };

    fetchSettings();
  }, [role]);

  const handleSettingChange = (index: number, field: keyof Setting, value: number | null) => {
    setSettings((prevSettings) => {
      const newSettings = [...prevSettings];
      newSettings[index] = { ...newSettings[index], [field]: value as number | null };
      return newSettings;
    });
  };

  const saveSetting = async (index: number) => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const setting = settings[index];

          // Type guard to ensure id is a string
          if (typeof setting.id === 'string' && setting.id.startsWith('temp-')) {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/loan-interest-settings`, [setting], {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            alert('New setting created successfully');
          } else {
            const response = await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/loan-interest-settings/${setting.id}`, setting, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            alert('Setting updated successfully');
          }

          setEditIndex(null);
        } catch (error) {
          console.error("Error saving setting:", error);
          alert('Failed to save setting');
        }
      }
    });
  };
  
  const deleteSetting = async (id: string) => { // Changed id parameter type to string
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();

          const response = await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/delete-loan-interest-setting/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            setSettings((prevSettings) => prevSettings.filter((setting) => setting.id !== id));
            alert('Setting deleted successfully');
          } else {
            throw new Error('Failed to delete setting');
          }
        } catch (error) {
          console.error("Error deleting setting:", error);
          alert('Failed to delete setting');
        }
      }
    });
  };

  const addNewSetting = () => {
    setSettings([
      ...settings,
      {
        id: `temp-${Date.now()}`, // Ensure ID is a string prefixed with 'temp-'
        minDurationMonths: null,
        maxDurationMonths: null,
        durationInterestRate: null,
        minAmount: null,
        maxAmount: null,
        amountInterestRate: null,
      },
    ]);
    setEditIndex(settings.length);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Loan Interest Settings</h2>
      <button onClick={addNewSetting} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add New Setting</button>
      <div className="bg-white rounded shadow p-4">
        {settings.map((setting, index) => (
          <div key={setting.id} className="flex items-center gap-4 border-b py-2">
            {editIndex === index ? (
              <>
                <input type="number" placeholder="Min Duration" value={setting.minDurationMonths ?? ''} onChange={(e) => handleSettingChange(index, 'minDurationMonths', e.target.value ? Number(e.target.value) : null)} className="border p-2" />
                <input type="number" placeholder="Max Duration" value={setting.maxDurationMonths ?? ''} onChange={(e) => handleSettingChange(index, 'maxDurationMonths', e.target.value ? Number(e.target.value) : null)} className="border p-2" />
                <input type="number" placeholder="Interest Rate (%)" value={setting.durationInterestRate ?? ''} onChange={(e) => handleSettingChange(index, 'durationInterestRate', e.target.value ? Number(e.target.value) : null)} className="border p-2" />
                <input type="number" placeholder="Min Amount" value={setting.minAmount ?? ''} onChange={(e) => handleSettingChange(index, 'minAmount', e.target.value ? Number(e.target.value) : null)} className="border p-2" />
                <input type="number" placeholder="Max Amount" value={setting.maxAmount ?? ''} onChange={(e) => handleSettingChange(index, 'maxAmount', e.target.value ? Number(e.target.value) : null)} className="border p-2" />
                <input type="number" placeholder="Amount Interest Rate (%)" value={setting.amountInterestRate ?? ''} onChange={(e) => handleSettingChange(index, 'amountInterestRate', e.target.value ? Number(e.target.value) : null)} className="border p-2" />
                <button onClick={() => saveSetting(index)} className="bg-green-500 text-white p-2 rounded">Save</button>
                <button onClick={() => setEditIndex(null)} className="text-red-500 p-2">Cancel</button>
              </>
            ) : (
              <>
                <div>{`Duration: ${setting.minDurationMonths} - ${setting.maxDurationMonths} months, Interest: ${setting.durationInterestRate}%`}</div>
                <div>{`Amount: ${setting.minAmount} - ${setting.maxAmount}, Interest: ${setting.amountInterestRate}%`}</div>
                <button onClick={() => setEditIndex(index)} className="text-blue-500">Edit</button>
                <button onClick={() => deleteSetting(setting.id)} className="text-red-500">Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanInterestSettings;
