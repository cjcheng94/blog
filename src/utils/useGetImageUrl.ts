import { useEffect, useState } from "react";
import { AwsClient } from "aws4fetch";

const aws = new AwsClient({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const useGetImageUrl = (fileId: string) => {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [data, setData] = useState("");

  const getImage = async (fileId: string) => {
    setLoading(true);
    const res = await aws.fetch(`${process.env.REACT_APP_AWS_URL}/${fileId}`, {
      headers: {
        "x-api-key": process.env.REACT_APP_AWS_X_API_KEY,
        "Content-Type": "image/jpeg"
      }
    });

    // return empty string if we can't find such image
    if (res.status !== 200) {
      setFailed(true);
    } else {
      setFailed(false);
    }

    const dataBlob = await res.blob();
    const imgURL = URL.createObjectURL(dataBlob);

    setLoading(false);
    setData(imgURL);
  };

  useEffect(() => {
    getImage(fileId);
  }, []);

  return { loading, failed, data };
};

export default useGetImageUrl;
