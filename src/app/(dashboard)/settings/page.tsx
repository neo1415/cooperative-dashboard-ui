"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Setting {
  id: number;
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

  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('firebaseToken');
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/fetch-loan-interest-settings`;
      console.log("Fetching settings from:", url);  // Log the URL for debugging

      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSettings(response.data);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleSettingChange = (index: number, field: keyof Setting, value: number | null) => {
    setSettings((prevSettings) => {
      const newSettings = [...prevSettings];
      newSettings[index] = { ...newSettings[index], [field]: value as number | null };
      return newSettings;
    });
  };

  const saveSetting = async (index: number) => {
    const token = localStorage.getItem('firebaseToken');
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    const setting = settings[index];
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/update-loan-interest-settings/${setting.id}`;
    console.log("Updating setting at URL:", url);  // Log the URL for debugging

    try {
      await axios.put(url, setting, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditIndex(null);
      alert('Setting updated successfully');
    } catch (error) {
      console.error("Error updating setting:", error);
      alert('Failed to update setting');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Loan Interest Settings</h2>
      <button
        onClick={() => setSettings([
          ...settings,
          { id: Date.now(), minDurationMonths: null, maxDurationMonths: null, durationInterestRate: null, minAmount: null, maxAmount: null, amountInterestRate: null }
        ])}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New Setting
      </button>
      <div className="bg-white rounded shadow p-4">
        {settings.map((setting, index) => (
          <div key={setting.id} className="flex items-center gap-4 border-b py-2">
            {editIndex === index ? (
              <>
                <input
                  type="number"
                  placeholder="Min Duration"
                  value={setting.minDurationMonths ?? ''}
                  onChange={(e) => handleSettingChange(index, 'minDurationMonths', e.target.value ? Number(e.target.value) : null)}
                  className="border p-2"
                />
                <input
                  type="number"
                  placeholder="Max Duration"
                  value={setting.maxDurationMonths ?? ''}
                  onChange={(e) => handleSettingChange(index, 'maxDurationMonths', e.target.value ? Number(e.target.value) : null)}
                  className="border p-2"
                />
                <input
                  type="number"
                  placeholder="Interest Rate (%)"
                  value={setting.durationInterestRate ?? ''}
                  onChange={(e) => handleSettingChange(index, 'durationInterestRate', e.target.value ? Number(e.target.value) : null)}
                  className="border p-2"
                />
                <input
                  type="number"
                  placeholder="Min Amount"
                  value={setting.minAmount ?? ''}
                  onChange={(e) => handleSettingChange(index, 'minAmount', e.target.value ? Number(e.target.value) : null)}
                  className="border p-2"
                />
                <input
                  type="number"
                  placeholder="Max Amount"
                  value={setting.maxAmount ?? ''}
                  onChange={(e) => handleSettingChange(index, 'maxAmount', e.target.value ? Number(e.target.value) : null)}
                  className="border p-2"
                />
                <input
                  type="number"
                  placeholder="Amount Interest Rate (%)"
                  value={setting.amountInterestRate ?? ''}
                  onChange={(e) => handleSettingChange(index, 'amountInterestRate', e.target.value ? Number(e.target.value) : null)}
                  className="border p-2"
                />
                <button onClick={() => saveSetting(index)} className="bg-green-500 text-white p-2 rounded">Save</button>
                <button onClick={() => setEditIndex(null)} className="text-red-500 ml-2">Cancel</button>
              </>
            ) : (
              <>
                <span>{setting.minDurationMonths} - {setting.maxDurationMonths} Months</span>
                <span>{setting.durationInterestRate}% Interest</span>
                <span>{setting.minAmount} - {setting.maxAmount}</span>
                <span>{setting.amountInterestRate}% Interest</span>
                <button onClick={() => setEditIndex(index)} className="text-blue-500">Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanInterestSettings;
