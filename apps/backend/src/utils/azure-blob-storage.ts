import { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol, StorageSharedKeyCredential } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import dotenv from 'dotenv';

dotenv.config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING!;
const CONTAINER_NAME = process.env.AZURE_STORAGE_ACCOUNT!;
const account = process.env.AZURE_STORAGE_ACCOUNT!;
const accountKey = process.env.AZURE_STORAGE_KEY!;
const credential = new StorageSharedKeyCredential(account, accountKey);

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw new Error("Azure Connection string not found");
}

if (!CONTAINER_NAME) {
  throw new Error("Azure Blob container name not found");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

async function ensureContainerExists() {
  const exists = await containerClient.exists();
  if (!exists) {
    await containerClient.create();
  }
}

export const uploadFileToAzure = async (
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<string> => {
  await ensureContainerExists();

  const blobName = `${uuidv4()}-${originalName.replace(/\s+/g, "_")}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: mimeType,
    },
  });

  return blobName
};


export async function getSignedUrl(containerName: string, blobName: string) {
  const expiresOn = new Date(new Date().valueOf() + 10 * 60 * 1000);
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn,
      protocol: SASProtocol.Https,
    },
    credential
  ).toString();

  return `https://${account}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}
