"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { auth } from "@/app/api/config";
import AssetDetailsModal from "./[id]/page";
import { useAuth } from "@/context/AuthCOntext";
import UploadAssetModal from "@/components/AssetForm";


interface Asset {
  id: string;
  img1: string;
  assetName: string;
  assetShortDescription: string;
  assetPrice: number;
}

const AssetsGrid: React.FC = () => {
  const { role } = useAuth(); // Access the role
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          return;
        }

        const token = await user.getIdToken();
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
        const response = await axios.get(`${serverURL}/fetchAssets`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAssets(response.data.assets);
      } catch (error) {
        console.error("Failed to fetch assets:", error.message);
      }
    };

    fetchAssets();
  }, []);

  return (
    <div className="p-4">
      {/* Add Asset button for cooperative-admins */}
      {role === "cooperative-admin" && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Asset
          </button>
        </div>
      )}

      {/* Asset Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {assets.map((asset) => (
          <div key={asset.id} className="bg-white w-full h-88 shadow-md rounded-lg p-4">
            <Image
              src={asset.img1 || "/placeholder.jpg"}
              alt={asset.assetName}
              width={280}
              height={600}
              className="object-cover rounded-md"
            />
            <h3 className="mt-2 font-bold text-lg">{asset.assetName}</h3>
            <p className="text-sm text-gray-600">{asset.assetShortDescription}</p>
            <p className="text-green-600 font-semibold">${asset.assetPrice}</p>
            <button
              onClick={() => setSelectedAssetId(asset.id)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modals */}
      <AssetDetailsModal
        assetId={selectedAssetId}
        open={!!selectedAssetId}
        onClose={() => setSelectedAssetId(null)}
      />
      <UploadAssetModal
        open={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </div>
  );
};

export default AssetsGrid;
