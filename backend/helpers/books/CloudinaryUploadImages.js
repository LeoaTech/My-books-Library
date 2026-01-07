const cloudinary = require("cloudinary").v2;
const axios = require("axios");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

const options = {
  folder: "books",
  use_filename: true,
  unique_filename: false,
  overwrite: true,
};
// Fetch Remote URL for cover image
async function fetchRemoteURL(url) {
  const resp = await axios.get(url, {
    timeout: 10000,
    responseType: "arraybuffer",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; BookCoverUploader/1.0)",
    },
  });
  if (resp.status !== 200) throw new Error(`HTTP ${resp.status} for ${url}`);
  return Buffer.from(resp.data, "binary");
}

// Upload images to cloudinary
async function uploadOne(image, options) {
  const getExtension = (mime) => {
    if (!mime) return undefined;
    return mime.split("/")[1].split("+")[0];
  };
  if (image.secure_url && !image.base64) return image;

  let buffer;
  let detectedFormat = getExtension(image.type);
  try {
    if (
      Array.isArray(image.url) &&
      image.url[0] &&
      typeof image.url[0] === "string"
    ) {
      buffer = await fetchRemoteURL(image.url[0]);
    } else if (
      image.base64 &&
      typeof image.base64 === "string" &&
      image.base64.startsWith("data:")
    ) {
      const raw = image.base64.replace(/^data:\w+\/\w+;base64,/, "");
      if (raw.length < 100)
        throw new Error("Base64 too short—possible parsing error");

      buffer = Buffer.from(raw, "base64");
      if (buffer.length === 0)
        throw new Error("Invalid base64—decoded buffer is empty");
    } else {
      return null;
    }

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          ...options,
          resource_type: "image",
          format: detectedFormat || image.type.split("/")[1] || "jpg",
        },
        (err, result) => (err ? reject(err) : resolve(result))
      );
      stream.end(buffer);
    });
  } catch (error) {
    console.error("Upload Image to cloudinary Error:", error.message);
    throw new Error("Upload Failed: ", error.message);
  }
}

async function uploadBulkImage(imageUrl) {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  const cleanUrl = imageUrl.trim().replace(/['"]+/g, "");

  try {
    const result = await cloudinary.uploader.upload(cleanUrl, {
      folder: "books",
      resource_type: "image",
      timeout: 30000,
    });

    return result;
  } catch (directError) {
    try {
      const buffer = await fetchRemoteURL(cleanUrl);

      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "books",
            resource_type: "image",
          },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
        stream.end(buffer);
      });
    } catch (fallbackError) {
      console.error(`failed to upload image url : ${cleanUrl}`);
      return null;
    }
  }
}

module.exports = {
  uploadOne,
  uploadBulkImage,
};
