import { useEffect, useState } from "react";
import { AwsClient } from "aws4fetch";

const aws = new AwsClient({
  accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
  secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
});

const getUrlFromArrayBuffer = (arrayBuffer: ArrayBuffer) => {
  const arrayBufferView = new Uint8Array(arrayBuffer);
  const blob = new Blob([arrayBufferView]);
  return URL.createObjectURL(blob);
};

type useUploadImagePayload = {
  fileId: string;
  file: ArrayBuffer;
};
const useUploadImage = (payload: useUploadImagePayload) => {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [data, setData] = useState("");

  const uploadImage = async (payload: useUploadImagePayload) => {
    const { fileId, file } = payload;

    if (!fileId || !file) {
      setFailed(true);
      setLoading(false);
      setData("");
      return;
    }

    setLoading(true);

    const res = await aws.fetch(`${import.meta.env.VITE_AWS_URL}/${fileId}`, {
      method: "PUT",
      headers: {
        "x-api-key": import.meta.env.VITE_AWS_X_API_KEY,
        "Content-Type": "image/jpeg"
      },
      body: file
    });

    // return empty string if we can't find such image
    if (res.status !== 200) {
      setFailed(true);
      setLoading(false);
      setData("");
      return;
    }

    const objectUrl = getUrlFromArrayBuffer(file);

    setFailed(false);
    setLoading(false);
    setData(objectUrl);
  };

  useEffect(() => {
    uploadImage(payload);
  }, []);

  return { loading, failed, data };
};

export default useUploadImage;
