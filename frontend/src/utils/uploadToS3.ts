import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID!,
    secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (file: File, folderName: string) => {
  if (!file || !folderName) return;

  const params = {
    Bucket: import.meta.env.VITE_APP_BUCKET_NAME,
    Key: `${folderName}/${file.name}`,
    Body: file,
    ContentType: file.type,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    return `https://${import.meta.env.VITE_APP_BUCKET_NAME}.s3.amazonaws.com/${folderName}/${file.name}`;
  } catch (e) {
    console.error("S3 Upload Error:", e);
  }
};
