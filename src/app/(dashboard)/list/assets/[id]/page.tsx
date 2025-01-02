import React, { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { auth } from "@/app/api/config";

const AssetDetailsModal = ({ assetId, open, onClose }) => {
  const [asset, setAsset] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [unitsRequested, setUnitsRequested] = useState(1); // Default to 1 unit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!assetId) return;

    const fetchAssetDetails = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          return;
        }

        const token = await user.getIdToken();
        const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

        const { data } = await axios.get(`${serverURL}/fetchIndividualAssets/${assetId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAsset(data.asset);
        setSelectedDuration(
          data.asset.minDurationMonths ? data.asset.minDurationMonths : ""
        ); // Preselect the minimum duration
        setTotalPrice(calculateTotalPrice(1, data.asset.assetPrice, data.asset.priceInterestRate, data.asset.durationInterestRate));
      } catch (error) {
        console.error("Error fetching asset details:", error);
        setError("Failed to load asset details");
      }
    };

    fetchAssetDetails();
  }, [assetId]);

  const calculateTotalPrice = (units, price, priceRate, durationRate) => {
    const totalInterestRate = (1 + priceRate / 100) * (1 + durationRate / 100) - 1;
    return units * price * (1 + totalInterestRate);
  };

  const handleDurationChange = (event) => {
    const newDuration = event.target.value;
    setSelectedDuration(newDuration);
    setTotalPrice(
      calculateTotalPrice(unitsRequested, asset.assetPrice, asset.priceInterestRate, asset.durationInterestRate)
    );
  };

  const handleIncreaseUnits = () => {
    if (unitsRequested < asset.unitNumber) {
      const newUnits = unitsRequested + 1;
      setUnitsRequested(newUnits);
      setTotalPrice(
        calculateTotalPrice(newUnits, asset.assetPrice, asset.priceInterestRate, asset.durationInterestRate)
      );
    }
  };

  const handleDecreaseUnits = () => {
    if (unitsRequested > 1) {
      const newUnits = unitsRequested - 1;
      setUnitsRequested(newUnits);
      setTotalPrice(
        calculateTotalPrice(newUnits, asset.assetPrice, asset.priceInterestRate, asset.durationInterestRate)
      );
    }
  };

  const handleTakeLoan = async () => {
    if (!selectedDuration || isNaN(unitsRequested) || Number(unitsRequested) <= 0) {
      setError("Please select a valid duration and specify the number of units.");
      return;
    }

    if (!asset || !auth.currentUser) {
      setError("Failed to retrieve required data. Please try again.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const user = auth.currentUser;
      const token = await user.getIdToken();

      const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

      const response = await axios.post(
        `${serverURL}/assets-requested`,
        {
          memberId: user.uid,
          cooperativeId: asset.cooperativeId,
          assetId,
          durationOfLoan: selectedDuration,
          unitsRequested,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        alert("Loan request successfully submitted!");
        onClose();
      } else {
        setError("Failed to submit loan request. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting loan request:", error);
      setError(
        error.response?.data?.error || "Failed to submit loan request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!asset) return null;

  const availableDurations = [];
  if (asset.minDurationMonths && asset.maxDurationMonths) {
    for (let i = asset.minDurationMonths; i <= asset.maxDurationMonths; i++) {
      availableDurations.push(i);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white w-[90%] h-[90%] p-6 overflow-y-auto mx-auto mt-[5%] rounded-lg shadow-lg">
        <div className="flex">
          <Carousel showThumbs={false}>
            {asset.img1 && <div><img src={asset.img1} alt="Asset Image 1" /></div>}
            {asset.img2 && <div><img src={asset.img2} alt="Asset Image 2" /></div>}
            {asset.img3 && <div><img src={asset.img3} alt="Asset Image 3" /></div>}
          </Carousel>

          <div className="flex flex-col ml-6">
            <h1 className="text-2xl font-bold mt-4">{asset.assetName}</h1>
            <p className="text-gray-800 mt-4">Units Available: {asset.unitNumber}</p>
            <p className="text-lg font-semibold mt-2">Unit Price: ${asset.assetPrice}</p>

            <div className="flex items-center mt-4">
              <Button variant="contained" onClick={handleDecreaseUnits} disabled={unitsRequested <= 1}>
                -
              </Button>
              <p className="mx-4">{unitsRequested}</p>
              <Button variant="contained" onClick={handleIncreaseUnits} disabled={unitsRequested >= asset.unitNumber}>
                +
              </Button>
            </div>

            <p className="text-lg mt-4">Total Price: ${totalPrice.toFixed(2)}</p>

            <Select
              value={selectedDuration}
              onChange={handleDurationChange}
              displayEmpty
              renderValue={(value) => (value ? `${value} months` : "Select Duration")}
              className="w-full mt-4"
              disabled={isSubmitting}
            >
              <MenuItem value="" disabled>
                Select Duration
              </MenuItem>
              {availableDurations.map((duration, index) => (
                <MenuItem key={index} value={duration}>
                  {duration} months
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              color="primary"
              className="mt-6"
              onClick={handleTakeLoan}
              disabled={asset.unitNumber === 0 || isSubmitting}
            >
              {asset.unitNumber === 0 ? "Out of Stock" : isSubmitting ? "Submitting..." : "Take Loan"}
            </Button>
            {error && <p className="text-red-600 mt-4">{error}</p>}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AssetDetailsModal;
