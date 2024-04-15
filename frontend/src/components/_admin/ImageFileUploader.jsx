import { useState } from "react";
import { useDropzone } from "react-dropzone";
import add from "../../assets/add1.svg";
import close from "../../assets/cross.svg";
import { resizeFile } from "../../utiliz/constants";
import { RiErrorWarningFill } from "react-icons/ri";

const ImageUploader = ({ setImagesList, errors, register }) => {
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(0);
  const [LoadingState, setLoadingState] = useState(false);

  // Drop images Files in dropzone
  const onDrop = (acceptedFiles) => {
    const updatedImages = acceptedFiles?.map((file) =>
      Object?.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );

    // Filter out duplicates and limit to 5 images
    const uniqueImages = Array.from(
      new Set([...images, ...updatedImages]?.map((image) => image.name))
    )
      .map((name) => {
        return (
          images.find((image) => image.name === name) ||
          updatedImages.find((image) => image.name === name)
        );
      })
      .slice(0, 5);

    console.log(uniqueImages);
    setImages(uniqueImages);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleImageUpload = (e) => {
    e.preventDefault();

    if (images.length > 0) {
      setLoadingState(true);
      onUploadImages();
    }
  };
  // Resize the images files then saved the results in images list to upload cover images
  const onUploadImages = () => {
    // const coverImgFiles = document.getElementById("cover_img_url").files;
    setCount(count + 1);

    console.log(images, "Count", count);
    let files = Array.from(images);

    files.forEach(async (file) => {
      const newImage = await resizeFile(file);
      setImagesList((prev) => [...prev, newImage]);
      setLoadingState(false);
    });
  };

  // to Remove selected cover images before submitting Form
  function deleteImage(name) {
    let updatedImages = [...images];
    console.log(updatedImages);
    setImages(updatedImages.filter((img) => img.name !== name));
  }

  return (
    <div className="innerSection images">
      <p>Upload Images </p>
      <div className="flex flex-col gap-5 lg:flex-row md:justify-between md:items-center lg:gap-8">
        <div {...getRootProps({ className: "dropzone" })}>
          {" "}
          <input
            {...getInputProps()}
            id="cover_img_url"
            {...register("cover_img_url")}
          />
          {/* Image files errors */}
          {errors && <p className="format-message error">{errors}</p>}
          <span>
            <div className="rounded-[16px] bg-white  p-5 shadow-sm shadow-purple-200/50">
              <img src={add} alt="Add image" width={24} height={24} />
            </div>
            <p className="font-medium text-[14px] leading-[120%]">
              {" "}
              Click here to upload image
            </p>
          </span>
        </div>
        {/* Display selected images */}

        {images.length > 5 ? (
          <p className="text-red-600 flex justify-center items-center gap-2">
            <span>
              <RiErrorWarningFill />
            </span>{" "}
            Only 5 Images are allowed, Please remove other files
          </p>
        ) : (
          <div className="image-actions">
            {images.length > 0 && count < 1 && (
              <span
                id="btnUpload"
                onClick={(e) => handleImageUpload(e)}
                disabled={count > 0 || images.length === 0 || LoadingState}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <polygon
                    fill="var(--ci-primary-color, currentColor)"
                    points="346.231 284.746 256.039 194.554 165.847 284.746 188.474 307.373 240.039 255.808 240.039 496 272.039 496 272.039 255.808 323.604 307.373 346.231 284.746"
                    className="ci-primary"
                  />
                  <path
                    fill="var(--ci-primary-color, currentColor)"
                    d="M400,161.453V160c0-79.4-64.6-144-144-144S112,80.6,112,160v2.491A122.285,122.285,0,0,0,49.206,195.2,109.4,109.4,0,0,0,16,273.619c0,31.119,12.788,60.762,36.01,83.469C74.7,379.275,105.338,392,136.07,392H200V360H136.07C89.154,360,48,319.635,48,273.619c0-42.268,35.64-77.916,81.137-81.155L144,191.405V160a112,112,0,0,1,224,0v32.04l15.8.2c46.472.588,80.2,34.813,80.2,81.379C464,322.057,428.346,360,382.83,360H312v32h70.83a109.749,109.749,0,0,0,81.14-35.454C484.625,334.339,496,304.889,496,273.619,496,215.182,455.716,169.392,400,161.453Z"
                    className="ci-primary"
                  />
                </svg>
              </span>
            )}
          </div>
        )}
        <div className="mt-10 flex  md:flex-wrap gap-2">
          {images &&
            images?.map((file) => (
              <div key={file.name} className="image-container">
                <img
                  src={file.preview}
                  alt="cover_img_url"
                  className="preview-image"
                />
                <div
                  className="delete-icon"
                  onClick={() => deleteImage(file.name)}
                >
                  <img src={close} alt="delete" className="delete-img" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
