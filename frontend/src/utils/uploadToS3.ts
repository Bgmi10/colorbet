import AWS from "aws-sdk";

const region = 'us-east-1';

AWS.config.update({
    region: region,
    accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

// const clientS3 = new S3Client({
//     region: region,
//     credentials: {
//         accessKeyId: import.meta.env.VITE_APP_AWS_ACCESS_KEY_ID,
//         secretAccessKey: import.meta.env.VITE_APP_AWS_SECRET_ACCESS_KEY
//     }
// });


export const uploadToS3 = async (file, folderName ) => {
    if(!file || !folderName)return;

    const params: AWS.S3.PutObjectRequest = {
        Bucket: import.meta.env.VITE_APP_BUCKET_NAME,
        Key: `${folderName}/${file.name}`,
        Body: file,
        ContentType: file.type,
        //ACL: 'public-read'
    }

    try{
        const manageUpload = s3.upload(params);
        const fileContent = await manageUpload.promise();
        return fileContent.Location;
    }
    catch(e){
        console.log(e);
    }
     
}