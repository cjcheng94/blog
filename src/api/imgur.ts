const auth = "Client-ID " + import.meta.env.VITE_IMGUR_CLIENT_ID;

export const uploadImage = async (
  file: File
): Promise<{
  link: string;
  success: boolean;
  errorMessage: string;
}> => {
  const formData = new FormData();
  formData.append("image", file);

  let success = false;
  let link = "";
  let errorMessage = "";

  try {
    const res = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: auth
      }
    });

    const responseData = await res.json();

    success = responseData.success;
    link = responseData.data.link;
    errorMessage = success ? "" : responseData.data.error.message;
  } catch (err) {
    success = false;
    link = "";

    if (err instanceof Error) {
      errorMessage = err.message;
    } else {
      errorMessage = String(err);
    }
  }

  return {
    link,
    success,
    errorMessage
  };
};
