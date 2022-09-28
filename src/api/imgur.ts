const exampleResponse = {
  data: {
    id: "SNRYddm",
    title: null,
    description: null,
    datetime: 1664387859,
    type: "image/jpeg",
    animated: false,
    width: 259,
    height: 194,
    size: 10179,
    views: 0,
    bandwidth: 0,
    vote: null,
    favorite: false,
    nsfw: null,
    section: null,
    account_url: null,
    account_id: 0,
    is_ad: false,
    in_most_viral: false,
    has_sound: false,
    tags: [],
    ad_type: 0,
    ad_url: "",
    edited: "0",
    in_gallery: false,
    deletehash: "54oPxWt1DFrccrM",
    name: "",
    link: "https://i.imgur.com/SNRYddm.jpg"
  },
  success: true,
  status: 200
};

const auth = "Client-ID " + import.meta.env.VITE_IMGUR_CLIENT_ID;

type SerializedResponse = typeof exampleResponse;

export const uploadImage = async (file: File): Promise<SerializedResponse> => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("https://api.imgur.com/3/image", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: auth
    }
  });

  const responseData = await res.json();

  return responseData;
};
