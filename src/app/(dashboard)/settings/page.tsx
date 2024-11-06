"use client";

"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '@/app/api/config';
import { useAuth } from '@/context/AuthCOntext';
import { Button, TextField, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CustomModal from '@/components/CustomModal';

interface Setting {
  id: string;
  minDurationMonths: number | null;
  maxDurationMonths: number | null;
  durationInterestRate: number | null;
  minAmount: number | null;
  maxAmount: number | null;
  amountInterestRate: number | null;
}

const LoanInterestSettings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSetting, setNewSetting] = useState<Partial<Setting>>({});
  const [editSetting, setEditSetting] = useState<Setting | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { role } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      if (role === 'cooperative-admin') {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            const token = await user.getIdToken();
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/fetch-loan-interest-settings`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) setSettings(response.data);
          }
        });
      }
    };
    fetchSettings();
  }, [role]);

  const handleAddSetting = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdToken();
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/loan-interest-settings`, [newSetting], {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 201) {
          setSettings((prev) => [...prev, response.data[0]]);
          setNewSetting({});
          setIsModalOpen(false);
        }
      }
    });
  };

  const handleDeleteSetting = async () => {
    if (deleteId) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const token = await user.getIdToken();
          await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/delete-loan-interest-setting/${deleteId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSettings((prev) => prev.filter((setting) => setting.id !== deleteId));
          setDeleteId(null);
        }
      });
    }
  };

  const handleEditSetting = async () => {
    if (editSetting) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const token = await user.getIdToken();
          await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/edit-loan-interest-setting/${editSetting.id}`, editSetting, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setSettings((prev) =>
            prev.map((setting) => (setting.id === editSetting.id ? editSetting : setting))
          );
          setEditSetting(null);
        }
      });
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Loan Interest Settings</h2>
      <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
        Add New Setting
      </Button>

      <CustomModal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Loan Interest Setting" confirmText="Save" onConfirm={handleAddSetting}>
        <Typography variant="h6">Duration Settings</Typography>
        <TextField label="Min Duration (Months)" type="number" fullWidth margin="normal" onChange={(e) => setNewSetting({ ...newSetting, minDurationMonths: +e.target.value })} />
        <TextField label="Max Duration (Months)" type="number" fullWidth margin="normal" onChange={(e) => setNewSetting({ ...newSetting, maxDurationMonths: +e.target.value })} />
        <TextField label="Duration Interest Rate (%)" type="number" fullWidth margin="normal" onChange={(e) => setNewSetting({ ...newSetting, durationInterestRate: +e.target.value })} />

        <Typography variant="h6" className="mt-4">Amount Settings</Typography>
        <TextField label="Min Amount" type="number" fullWidth margin="normal" onChange={(e) => setNewSetting({ ...newSetting, minAmount: +e.target.value })} />
        <TextField label="Max Amount" type="number" fullWidth margin="normal" onChange={(e) => setNewSetting({ ...newSetting, maxAmount: +e.target.value })} />
        <TextField label="Amount Interest Rate (%)" type="number" fullWidth margin="normal" onChange={(e) => setNewSetting({ ...newSetting, amountInterestRate: +e.target.value })} />
      </CustomModal>

      <CustomModal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Deletion" confirmText="Delete" onConfirm={handleDeleteSetting}>
        <p>Are you sure you want to delete this setting?</p>
      </CustomModal>

      <CustomModal open={!!editSetting} onClose={() => setEditSetting(null)} title="Edit Loan Interest Setting" confirmText="Update" onConfirm={handleEditSetting}>
        <Typography variant="h6">Duration Settings</Typography>
        <TextField label="Min Duration (Months)" type="number" fullWidth margin="normal" value={editSetting?.minDurationMonths ?? ''} onChange={(e) => setEditSetting((prev) => prev ? { ...prev, minDurationMonths: +e.target.value } : prev)} />
        <TextField label="Max Duration (Months)" type="number" fullWidth margin="normal" value={editSetting?.maxDurationMonths ?? ''} onChange={(e) => setEditSetting((prev) => prev ? { ...prev, maxDurationMonths: +e.target.value } : prev)} />
        <TextField label="Duration Interest Rate (%)" type="number" fullWidth margin="normal" value={editSetting?.durationInterestRate ?? ''} onChange={(e) => setEditSetting((prev) => prev ? { ...prev, durationInterestRate: +e.target.value } : prev)} />

        <Typography variant="h6" className="mt-4">Amount Settings</Typography>
        <TextField label="Min Amount" type="number" fullWidth margin="normal" value={editSetting?.minAmount ?? ''} onChange={(e) => setEditSetting((prev) => prev ? { ...prev, minAmount: +e.target.value } : prev)} />
        <TextField label="Max Amount" type="number" fullWidth margin="normal" value={editSetting?.maxAmount ?? ''} onChange={(e) => setEditSetting((prev) => prev ? { ...prev, maxAmount: +e.target.value } : prev)} />
        <TextField label="Amount Interest Rate (%)" type="number" fullWidth margin="normal" value={editSetting?.amountInterestRate ?? ''} onChange={(e) => setEditSetting((prev) => prev ? { ...prev, amountInterestRate: +e.target.value } : prev)} />
      </CustomModal>

      <div className="bg-white rounded shadow p-4 mt-4">
        <Typography variant="h6">Duration-Based Interest Settings</Typography>
        {settings.filter(s => s.minDurationMonths !== null).map((setting) => (
          <div key={setting.id} className="flex items-center gap-4 border-b py-2">
            <div>{`Duration: ${setting.minDurationMonths} - ${setting.maxDurationMonths} months, Interest: ${setting.durationInterestRate}%`}</div>
            <IconButton onClick={() => setDeleteId(setting.id)} color="secondary">
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => setEditSetting(setting)} color="primary">
              <EditIcon />
            </IconButton>
          </div>
        ))}

        <Typography variant="h6" className="mt-4">Amount-Based Interest Settings</Typography>
        {settings.filter(s => s.minAmount !== null).map((setting) => (
          <div key={setting.id} className="flex items-center gap-4 border-b py-2">
            <div>{`Amount: ${setting.minAmount} - ${setting.maxAmount}, Interest: ${setting.amountInterestRate}%`}</div>
            <IconButton onClick={() => setDeleteId(setting.id)} color="secondary">
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={() => setEditSetting(setting)} color="primary">
              <EditIcon />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoanInterestSettings;
