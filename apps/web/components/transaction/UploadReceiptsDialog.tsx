"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface UploadReceiptsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
}

interface FileWithPreview {
  file: File;
  id: string;
}

export function UploadReceiptsDialog({
  isOpen,
  onClose,
  onUpload,
}: UploadReceiptsDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Validate file types
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    const newFiles = Array.from(files).filter((file) =>
      validTypes.includes(file.type)
    );

    if (newFiles.length !== files.length) {
      alert("Invalid file type. Please upload only JPG, PNG, or PDF files.");
      return;
    }

    const filesWithPreview = newFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substring(7),
    }));

    setSelectedFiles((prev) => [...prev, ...filesWithPreview]);
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsUploading(true);
      await onUpload(selectedFiles.map((f) => f.file));
      setSelectedFiles([]);
      onClose();
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const truncateFileName = (name: string) => {
    if (name.length <= 20) return name;
    return name.substring(0, 10) + "..." + name.substring(name.length - 7);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-sm sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Receipts</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="m-3 border border-gray-200 min-h-[100px] rounded-md shadow shadow-gray-300">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".jpg,.jpeg,.png,.pdf"
              multiple
              className="hidden"
            />

            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              Select Files
            </Button>

            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected Files:</p>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {selectedFiles.map(({ file, id }) => (
                    <div
                      key={id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {truncateFileName(file.name)}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({file.type.split("/")[1].toUpperCase()})
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
