'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Modal, Box, Typography } from '@mui/material';
import { auth } from '@/app/api/config';
import Image from 'next/image';
import { useAuth } from '@/context/AuthCOntext';

interface AssetRequest {
  id: string;
  img1: string;
  member: {
    firstName: string;
    surname: string;
    email: string;
    telephone1: string;
    memberDetails?: { 
        middleName: string;
        telephone1: string; };
  };
  assetName: string;
  assetShortDescription: string;
  assetPrice: string;
  pending: boolean;
  approved: boolean;
  rejected: boolean;
}


const AssetsTable: React.FC = () => {
  const [data, setData] = useState<AssetRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<AssetRequest | null>(null); // Selected asset request for modal
  const [isModalOpen, setModalOpen] = useState(false); // Modal open state
  const { role} = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = await auth.currentUser?.getIdToken();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/assets-requested-table`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setData(response.data.data);
      } catch (error) {
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();
      await axios.patch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/assets-requested/${id}/update-status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the status in the frontend
      setData((prevData) =>
        prevData.map((request) =>
          request.id === id
            ? {
                ...request,
                approved: status === 'approved',
                rejected: status === 'rejected',
                pending: status === 'pending',
              }
            : request
        )
      );
      alert(`Status updated to ${status}`);
      setModalOpen(false); // Close modal
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  const getStatusColor = (request: AssetRequest) => {
    if (request.approved) return 'bg-green-100';
    if (request.rejected) return 'bg-red-100';
    if (request.pending) return 'bg-yellow-100';
    return '';
  };

  const handleViewDetails = (request: AssetRequest) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      {error && <div className="text-red-500">{error}</div>}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Member Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Asset Details</TableCell>
            <TableCell>Status</TableCell>
            {role === 'cooperative-admin' && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((request) => (
            <TableRow key={request.id} className={getStatusColor(request)}>
              <TableCell>
                <Image
                  src={request.img1 || '/default-image.jpg'} // Replace with a placeholder image
                  alt={request.assetName || 'No image available'}
                  className="h-16 w-16 object-cover"
                  width={100}
                  height={100}
                />
              </TableCell>
              <TableCell>{`${request.member.firstName} ${request.member.surname}`}</TableCell>
              <TableCell>{request.member.email}</TableCell>
              <TableCell>{request.member.memberDetails.telephone1}</TableCell>
              <TableCell>
                <div>
                  <strong>{request.assetName}</strong>
                  <p>{request.assetShortDescription}</p>
                  <p>Price: {request.assetPrice}</p>
                </div>
              </TableCell>
              <TableCell>
                {request.pending ? 'Pending' : request.approved ? 'Approved' : 'Rejected'}
              </TableCell>
              {role === 'cooperative-admin' && (
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewDetails(request)}
                  >
                    View
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal for Viewing Details */}
      <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
        <Box className="p-4 bg-white rounded shadow" style={{ maxWidth: 500, margin: '50px auto' }}>
          {selectedRequest && (
            <>
              <Typography variant="h6">Asset Details</Typography>
              <Image
              src={selectedRequest.img1 || '/default-image.jpg'}
              alt={selectedRequest.assetName || 'No image available'}
              className="h-32 w-32 object-cover"
              width={150}
              height={150}
            />
              <p><strong>Member Name:</strong> {`${selectedRequest.member.firstName} ${selectedRequest.member.surname}`}</p>
              <p><strong>Email:</strong> {selectedRequest.member.email}</p>
              <p><strong>Phone:</strong> {selectedRequest.member.memberDetails.telephone1}</p>
              <p><strong>Asset:</strong> {selectedRequest.assetName}</p>
              <p><strong>Description:</strong> {selectedRequest.assetShortDescription}</p>
              <p><strong>Price:</strong> {selectedRequest.assetPrice}</p>
              <div className="mt-4">
                <Button onClick={() => handleStatusUpdate(selectedRequest.id, 'approved')} variant="contained" color="success">
                  Approve
                </Button>
                <Button onClick={() => handleStatusUpdate(selectedRequest.id, 'rejected')} variant="contained" color="error" style={{ marginLeft: '10px' }}>
                  Reject
                </Button>
                <Button onClick={() => handleStatusUpdate(selectedRequest.id, 'pending')} variant="contained" color="warning" style={{ marginLeft: '10px' }}>
                  Set to Pending
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default AssetsTable;
