"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { auth } from '@/app/api/config';
import { useAuth } from '@/context/AuthCOntext';
import { Button, TextField, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import CustomModal from '@/components/CustomModal';

export interface Setting {
  id: string;
  minDurationMonths: number | null;
  maxDurationMonths: number | null;
  durationInterestRate: number | null;
  minAmount: number | null;
  maxAmount: number | null;
  amountInterestRate: number | null;
}

export interface AdminSetting {
  id: string;
  loanFormPrice: number | null;
  shareCapital: number | null;
  entranceFee: number | null;
  loanUpperLimit: number | null;
  monthsToLoan: number | null;
  gracePeriod: number | null,
}

type SettingType = 'loan' | 'admin';

const LoanInterestSettings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSetting[]>([]);
    const [newSetting, setNewSetting] = useState<Partial<Setting>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSetting, setEditSetting] = useState<Setting | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [adminNewValues, setAdminNewValues] = useState<Partial<AdminSetting>>({});
  const { role } = useAuth();

  const apiEndpoints = {
    loan: {
      fetch: '/fetch-loan-interest-settings',
      add: '/loan-interest-settings',
      edit: '/edit-loan-interest-setting/',
      delete: '/delete-loan-interest-setting/',
    },
    admin: {
      fetch: '/fetch-cooperative-admin-settings',
      edit: '/edit-cooperative-admin-setting/',
    },
  };

  const defaultAdminSettings: AdminSetting = {
    id: 'default', // Temporary ID for default settings
    loanFormPrice: 0,
    shareCapital: 0,
    entranceFee: 0,
    loanUpperLimit: 0,
    monthsToLoan: 0,
    gracePeriod: 0, // Added this field to match your AdminSetting interface
  };

  const fetchData = useCallback(
    async (type: SettingType) => {
      if (role !== 'cooperative-admin') return;
      const endpoint = apiEndpoints[type].fetch;
      const token = await auth.currentUser?.getIdToken();
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (type === 'loan') {
          setSettings(response.data);
        } else {
          const adminData = response.data;
          setAdminSettings(adminData.length > 0 ? adminData : [defaultAdminSettings]);
        }
      } catch (error) {
        console.error(`Error fetching ${type} settings:`, error);
        // If fetching fails, ensure default settings are displayed
        if (type === 'admin') setAdminSettings([defaultAdminSettings]);
      }
    },
    [role]
  );

  const handleAddSetting = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}${apiEndpoints.loan.add}`,
        [newSetting],
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSettings((prev) => [...prev, response.data[0]]);
      setNewSetting({});
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding new loan setting:", error);
    }
  };

  const handleEditSetting = async () => {
    if (!editSetting) return;
    const endpoint = `${apiEndpoints.loan.edit}${editSetting.id}`;
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, editSetting, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings((prev) =>
        prev.map((s) => (s.id === editSetting.id ? (editSetting as Setting) : s))
      );
      setEditSetting(null);
    } catch (error) {
      console.error(`Error editing loan setting:`, error);
    }
  };

  const handleDeleteSetting = async () => {
    if (!deleteId) return;
    const endpoint = `${apiEndpoints.loan.delete}${deleteId}`;
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings((prev) => prev.filter((s) => s.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error(`Error deleting loan setting:`, error);
    }
  };

  const handleEditAdminSetting = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}${apiEndpoints.admin.edit}${adminSettings[0].id}`, adminNewValues, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminSettings((prev) =>
        prev.map((setting) => ({ ...setting, ...adminNewValues }))
      );
      setIsEditingAdmin(false);
      setAdminNewValues({});
    } catch (error) {
      console.error("Error saving admin setting:", error);
    }
  };

  useEffect(() => {
    fetchData('loan');
    fetchData('admin');
  }, [fetchData, role]);

  const currentAdminSettings = adminSettings[0] || defaultAdminSettings;


  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-semibold mb-4">Loan Interest Settings</h2>
      
      {/* Add Loan Interest Setting Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsModalOpen(true)}
        className="mb-4"
      >
        Add New Interest Setting
      </Button>

      {/* Add Setting Modal */}
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Loan Interest Setting"
        confirmText="Save"
        onConfirm={() => handleAddSetting()}
      >
        <Typography variant="h6" className="mb-2">Duration Settings</Typography>
        <TextField
          label="Min Duration (Months)"
          type="number"
          fullWidth
          margin="normal"
          onChange={(e) => setNewSetting({ ...newSetting, minDurationMonths: +e.target.value })}
        />
        <TextField
          label="Max Duration (Months)"
          type="number"
          fullWidth
          margin="normal"
          onChange={(e) => setNewSetting({ ...newSetting, maxDurationMonths: +e.target.value })}
        />
        <TextField
          label="Duration Interest Rate (%)"
          type="number"
          fullWidth
          margin="normal"
          onChange={(e) => setNewSetting({ ...newSetting, durationInterestRate: +e.target.value })}
        />
        <Typography variant="h6" className="mt-4 mb-2">Amount Settings</Typography>
        <TextField
          label="Min Amount"
          type="number"
          fullWidth
          margin="normal"
          onChange={(e) => setNewSetting({ ...newSetting, minAmount: +e.target.value })}
        />
        <TextField
          label="Max Amount"
          type="number"
          fullWidth
          margin="normal"
          onChange={(e) => setNewSetting({ ...newSetting, maxAmount: +e.target.value })}
        />
        <TextField
          label="Amount Interest Rate (%)"
          type="number"
          fullWidth
          margin="normal"
          onChange={(e) => setNewSetting({ ...newSetting, amountInterestRate: +e.target.value })}
        />
      </CustomModal>

      {/* Edit Setting Modal */}
      <CustomModal
        open={!!editSetting}
        onClose={() => setEditSetting(null)}
        title="Edit Loan Interest Setting"
        confirmText="Save Changes"
        onConfirm={handleEditSetting}
      >
        <Typography variant="h6" className="mb-2">Duration Settings</Typography>
        <TextField
          label="Min Duration (Months)"
          type="number"
          fullWidth
          margin="normal"
          value={editSetting?.minDurationMonths ?? ''}
          onChange={(e) =>
            setEditSetting({ ...editSetting, minDurationMonths: +e.target.value } as Setting)
          }
        />
        <TextField
          label="Max Duration (Months)"
          type="number"
          fullWidth
          margin="normal"
          value={editSetting?.maxDurationMonths ?? ''}
          onChange={(e) =>
            setEditSetting({ ...editSetting, maxDurationMonths: +e.target.value } as Setting)
          }
        />
        <TextField
          label="Duration Interest Rate (%)"
          type="number"
          fullWidth
          margin="normal"
          value={editSetting?.durationInterestRate ?? ''}
          onChange={(e) =>
            setEditSetting({ ...editSetting, durationInterestRate: +e.target.value } as Setting)
          }
        />
        <Typography variant="h6" className="mt-4 mb-2">Amount Settings</Typography>
        <TextField
          label="Min Amount"
          type="number"
          fullWidth
          margin="normal"
          value={editSetting?.minAmount ?? ''}
          onChange={(e) =>
            setEditSetting({ ...editSetting, minAmount: +e.target.value } as Setting)
          }
        />
        <TextField
          label="Max Amount"
          type="number"
          fullWidth
          margin="normal"
          value={editSetting?.maxAmount ?? ''}
          onChange={(e) =>
            setEditSetting({ ...editSetting, maxAmount: +e.target.value } as Setting)
          }
        />
        <TextField
          label="Amount Interest Rate (%)"
          type="number"
          fullWidth
          margin="normal"
          value={editSetting?.amountInterestRate ?? ''}
          onChange={(e) =>
            setEditSetting({ ...editSetting, amountInterestRate: +e.target.value } as Setting)
          }
        />
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <CustomModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Deletion"
        confirmText="Delete"
        onConfirm={handleDeleteSetting}
      >
        <p>Are you sure you want to delete this setting?</p>
      </CustomModal>

      {/* Loan Settings */}
      <div className="bg-white rounded shadow p-4 mt-6">
        <Typography variant="h6" className="mb-3">Duration-Based Interest Settings</Typography>
        {settings.filter(s => s.minDurationMonths !== null).map((setting) => (
          <div key={setting.id} className="flex flex-col sm:flex-row items-center gap-4 border-b py-2">
            <div className="flex-1">
              {`Duration: ${setting.minDurationMonths} - ${setting.maxDurationMonths} months, Interest: ${setting.durationInterestRate}%`}
            </div>
            <IconButton onClick={() => setEditSetting(setting)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setDeleteId(setting.id)} color="secondary">
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
        <Typography variant="h6" className="mt-6 mb-3">Amount-Based Interest Settings</Typography>
        {settings.filter(s => s.minAmount !== null).map((setting) => (
          <div key={setting.id} className="flex flex-col sm:flex-row items-center gap-4 border-b py-2">
            <div className="flex-1">
              {`Amount: ₦${setting.minAmount} - ₦${setting.maxAmount}, Interest: ${setting.amountInterestRate}%`}
            </div>
            <IconButton onClick={() => setEditSetting(setting)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => setDeleteId(setting.id)} color="secondary">
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>

      {/* Admin Settings */}
      <Typography variant="h6" className="mt-6 mb-3">Admin Settings</Typography>
      <div className="bg-white rounded shadow p-4">
        <div className="flex flex-col gap-4">
          {['loanFormPrice', 'shareCapital', 'entranceFee', 'loanUpperLimit', 'monthsToLoan', 'gracePeriod'].map(
            (field) => (
              <div key={field} className="flex items-center gap-2">
                <span>{`${field}: `}</span>
                {isEditingAdmin ? (
                  <TextField
                    type="number"
                    value={adminNewValues[field as keyof AdminSetting] ?? currentAdminSettings[field as keyof AdminSetting] ?? 0}
                    onChange={(e) =>
                      setAdminNewValues((prev) => ({ ...prev, [field]: +e.target.value }))
                    }
                  />
                ) : (
                  <span>{currentAdminSettings[field as keyof AdminSetting] ?? 0}</span>
                )}
              </div>
            )
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (isEditingAdmin) handleEditAdminSetting();
              setIsEditingAdmin(!isEditingAdmin);
            }}
            className="mt-4"
          >
            {isEditingAdmin ? 'Save' : 'Edit'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoanInterestSettings;