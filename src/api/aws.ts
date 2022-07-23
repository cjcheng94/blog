import { AwsClient } from "aws4fetch";

const aws = new AwsClient({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

export const getImage = async (fileId: string) => {
  const res = await aws.fetch(`${process.env.REACT_APP_AWS_URL}/${fileId}`, {
    headers: {
      "x-api-key": process.env.REACT_APP_AWS_X_API_KEY,
      "Content-Type": "image/jpeg"
    }
  });
  const dataBlob = await res.blob();
  const imgURL = URL.createObjectURL(dataBlob);
  return imgURL;
};

type uploadImagePayload = {
  fileId: string;
  file: ArrayBuffer;
};
export const uploadImage = async (payload: uploadImagePayload) => {
  const { fileId, file } = payload;

  await aws.fetch(`${process.env.REACT_APP_AWS_URL}/${fileId}`, {
    method: "PUT",
    headers: {
      "x-api-key": process.env.REACT_APP_AWS_X_API_KEY,
      "Content-Type": "image/jpeg"
    },
    body: file
  });
};
