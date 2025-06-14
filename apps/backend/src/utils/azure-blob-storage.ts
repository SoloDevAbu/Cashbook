import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const CONTAINER_NAME = process.env.AZURE_BLOB_CONTAINER_NAME!;

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error("Azure Connection string not found");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

export const uploadFileToAzure = async (buffer: Buffer, originalName: string, mimeType: string) => {
  const blobName = `${uuidv4()}-${originalName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  });

  return blockBlobClient.url;
};