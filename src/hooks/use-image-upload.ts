import { useState } from "react";
import { toast } from "sonner";

interface UseImageUploadOptions {
  folder?: string;
  uploadPreset?: string;
  maxFileSize?: number;
  allowedTypes?: string[];
}

interface UploadState {
  isUploading: boolean;
  uploadedUrl: string | null;
  previewUrl: string | null;
  selectedFile: File | null;
  error: string | null;
}

export const useImageUpload = (
  options: UseImageUploadOptions = {},
) => {
  const {
    folder = "recipes",
    uploadPreset = "recipe_images",
    maxFileSize = 30 * 1024 * 1024,
    allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"],
  } = options;

  const [state, setState] = useState<UploadState>({
    isUploading: false,
    uploadedUrl: null,
    previewUrl: null,
    selectedFile: null,
    error: null,
  });

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    // Add optimization parameters
    formData.append("quality", "auto:best");
    formData.append("fetch_format", "auto");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error("Something went wrong");
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, WebP)";
    }

    // Check file size
    if (file.size > maxFileSize) {
      const maxSizeMB = maxFileSize / (1024 * 1024);
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const selectFile = (file: File) => {
    const validationError = validateFile(file);

    if (validationError) {
      setState((prev) => ({ ...prev, error: validationError }));
      toast.error("Something went wrong");
      console.error(validationError);
      return false;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setState((prev) => ({
      ...prev,
      selectedFile: file,
      previewUrl,
      error: null,
      uploadedUrl: null,
    }));

    return true;
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!state.selectedFile) {
      toast.error("No file selected");
      return null;
    }

    setState((prev) => ({ ...prev, isUploading: true, error: null }));
    // toast.info("Uploading image...");

    try {
      const uploadedUrl = await uploadToCloudinary(state.selectedFile);

      setState((prev) => ({
        ...prev,
        uploadedUrl,
        isUploading: false,
      }));

      // toast.success("Image uploaded successfully!");
      console.log("Image uploaded successfully:", uploadedUrl);
      return uploadedUrl;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Upload failed";

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isUploading: false,
      }));

      toast.error("Something went wrong");
      console.error(errorMessage);
      return null;
    }
  };

  const removeFile = () => {
    // Clean up preview URL to prevent memory leaks
    if (state.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }

    setState({
      isUploading: false,
      uploadedUrl: null,
      previewUrl: null,
      selectedFile: null,
      error: null,
    });
  };

  const reset = () => {
    removeFile();
  };

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      selectFile(file);
    }
  };

  return {
    // State
    isUploading: state.isUploading,
    uploadedUrl: state.uploadedUrl,
    previewUrl: state.previewUrl,
    selectedFile: state.selectedFile,
    error: state.error,

    // Actions
    selectFile,
    uploadFile,
    removeFile,
    reset,
    handleFileChange,

    // Helper
    hasFile: !!state.selectedFile,
    isReady: !!state.selectedFile && !state.isUploading,
  };
};
