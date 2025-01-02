"use client";

import React, { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import { useAuth } from "@/context/AuthCOntext";
import { auth } from "@/app/api/config";

// Validation schema using zod
const assetSchema = z.object({
  assetName: z.string().min(1, "Asset name is required"),
  assetShortDescription: z.string().min(1, "Short description is required"),
  assetLongDescription: z.string().min(1, "Long description is required"),
  assetPrice: z.number().positive("Asset price must be greater than 0"),
  formPrice: z.number().positive("Form price must be greater than 0"),
  unitNumber: z.number().positive("Number of Units must be greater than 0"),
  priceInterestRate: z
    .number()
    .min(0, "Interest rate must be at least 0")
    .max(100, "Interest rate cannot exceed 100"),
  ranges: z.array(
    z.object({
      minDurationMonths: z.number().min(1, "Duration is required"),
      maxDurationMonths: z.number().min(1, "Duration is required"),
      durationInterestRate: z
        .number()
        .min(0, "Interest rate must be at least 0")
        .max(100, "Interest rate cannot exceed 100"),
    })
  ),
  images: z.object({
    img1: z.custom<File>((val) => val instanceof File, {
      message: "Main image must be a file",
    }),
    img2: z
      .custom<File>((val) => val instanceof File, {
        message: "Image must be a file",
      })
      .optional(),
    img3: z
      .custom<File>((val) => val instanceof File, {
        message: "Image must be a file",
      })
      .optional(),
  }),
});

// Define the type for the form data
type AssetFormData = z.infer<typeof assetSchema>;


const UploadAssetModal = () => {
  const { cooperativeId } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      ranges: [
        { maxDurationMonths: 0, minDurationMonths: 0, durationInterestRate: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ranges",
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (data: AssetFormData) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("cooperativeId", cooperativeId);

      for (const key in data) {
        if (key === "images") {
          Object.entries(data.images).forEach(([imgKey, imgValue]) => {
            if (imgValue instanceof File) {
              formData.append(imgKey, imgValue);
            } else if (imgValue) {
              console.error(`${imgKey} is not a valid file.`);
            }
          });
        } else if (key === "ranges") {
          formData.append("interestRates", JSON.stringify(data.ranges));
        } else {
          formData.append(key, String(data[key]));
        }
      }

      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      const token = await user.getIdToken();

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/upload-asset`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response: ", response.data);
      alert("Asset uploaded successfully!");
      handleClose();
    } catch (err) {
      console.error("Error uploading asset:", err);
      alert("Failed to upload asset. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Trigger Button */}
      <Button onClick={handleOpen} variant="contained" color="primary">
        Upload Asset
      </Button>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box
 sx={{
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%", // Responsive width
  maxWidth: "600px", // Optional: Set a max width for larger screens
  maxHeight: "90vh", // Ensure the modal fits within the viewport
  bgcolor: "background.paper",
  overflowY: "auto", // Enable vertical scrolling
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
}}
>
          <Typography variant="h6" gutterBottom>
            Upload Asset
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 16 }}>
            <TextField
              label="Asset Name"
              fullWidth
              {...register("assetName")}
              error={!!errors.assetName}
              helperText={errors.assetName?.message}
              margin="normal"
            />

            <TextField
              label="Short Description"
              fullWidth
              multiline
              rows={2}
              {...register("assetShortDescription")}
              error={!!errors.assetShortDescription}
              helperText={errors.assetShortDescription?.message}
              margin="normal"
            />

            <TextField
              label="Long Description"
              fullWidth
              multiline
              rows={4}
              {...register("assetLongDescription")}
              error={!!errors.assetLongDescription}
              helperText={errors.assetLongDescription?.message}
              margin="normal"
            />

            <TextField
              label="Asset Price"
              type="number"
              fullWidth
              {...register("assetPrice", { valueAsNumber: true })}
              error={!!errors.assetPrice}
              helperText={errors.assetPrice?.message}
              margin="normal"
            />

            <TextField
              label="Form Price"
              type="number"
              fullWidth
              {...register("formPrice", { valueAsNumber: true })}
              error={!!errors.formPrice}
              helperText={errors.formPrice?.message}
              margin="normal"
            />

            <TextField
              label="Units Available"
              type="number"
              fullWidth
              {...register("unitNumber", { valueAsNumber: true })}
              error={!!errors.unitNumber}
              helperText={errors.unitNumber?.message}
              margin="normal"
            />

            <TextField
              label="Interest Rate (%)"
              type="number"
              fullWidth
              {...register("priceInterestRate", { valueAsNumber: true })}
              error={!!errors.priceInterestRate}
              helperText={errors.priceInterestRate?.message}
              margin="normal"
            />

            <Typography variant="subtitle1" marginY={2}>
              Duration Ranges
            </Typography>
            {fields.map((item, index) => (
              <Box key={item.id} display="flex" gap={2} marginBottom={2}>
                <TextField
                  label="Min Duration (Months)"
                  type="number"
                  {...register(`ranges.${index}.minDurationMonths`, {
                    valueAsNumber: true,
                  })}
                  error={!!errors.ranges?.[index]?.minDurationMonths}
                  helperText={
                    errors.ranges?.[index]?.minDurationMonths?.message
                  }
                  fullWidth
                />

                <TextField
                  label="Max Duration (Months)"
                  type="number"
                  {...register(`ranges.${index}.maxDurationMonths`, {
                    valueAsNumber: true,
                  })}
                  error={!!errors.ranges?.[index]?.maxDurationMonths}
                  helperText={
                    errors.ranges?.[index]?.maxDurationMonths?.message
                  }
                  fullWidth
                />

                <TextField
                  label="Interest Rate (%)"
                  type="number"
                  {...register(`ranges.${index}.durationInterestRate`, {
                    valueAsNumber: true,
                  })}
                  error={!!errors.ranges?.[index]?.durationInterestRate}
                  helperText={
                    errors.ranges?.[index]?.durationInterestRate?.message
                  }
                  fullWidth
                />

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => remove(index)}
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button
              variant="contained"
              color="secondary"
              onClick={() =>
                append({
                  minDurationMonths: 0,
                  maxDurationMonths: 0,
                  durationInterestRate: 0,
                })
              }
            >
              Add Range
            </Button>

<div className="flex flex-col"> 
<Typography variant="subtitle1" marginY={2}>
              Upload Images
            </Typography>
            <Box display="flex" gap={2}>
              <input
                type="file"
                onChange={(e) =>
                  setValue("images.img1", e.target.files?.[0] ?? undefined)
                }
                accept="image/*"
              />
              {errors.images?.img1 && (
                <Typography color="error">
                  {errors.images.img1.message}
                </Typography>
              )}

              <input
                type="file"
                onChange={(e) =>
                  setValue("images.img2", e.target.files?.[0] ?? undefined)
                }
                accept="image/*"
              />
              {errors.images?.img2 && (
                <Typography color="error">
                  {errors.images.img2.message}
                </Typography>
              )}

              <input
                type="file"
                onChange={(e) =>
                  setValue("images.img3", e.target.files?.[0] ?? undefined)
                }
                accept="image/*"
              />
              {errors.images?.img3 && (
                <Typography color="error">
                  {errors.images.img3.message}
                </Typography>
              )}
            </Box>

</div>
       
            <Box display="flex" justifyContent="flex-end" marginTop={4}>
              <Button
                onClick={handleClose}
                color="inherit"
                variant="outlined"
                sx={{ marginRight: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default UploadAssetModal;
