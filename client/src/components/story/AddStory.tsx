import React, { useRef, ChangeEvent, useState } from "react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/store/store";
import { Istory } from "../../types/types";
import axiosInstance from "../../axios/axios";
import { setStory } from "../../utils/reducers/StoryData";
import { addStory } from "../../utils/reducers/StoryData";

import ViewStory from "./ViewStory";
function AddStory() {
  // interface FormInputs {
  //   storyUrl: string;
  // }
  // const [storyImg, SetstoryData] = useState<FormInputs>({  storyUrl: '' });
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | string>("");
  const dispatch = useDispatch();

  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedArea, setCroppedArea] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropedImg, setCropImg] = useState(false);
  const [image, setImage] = useState<string | undefined>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [Img, setImg] = useState<string | undefined>("");
  const [showStory, setShowStory] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const presetKey: string = "cloudinaryimg";
  const cloudName: string = "dy9ofwwjp";
  const userData = useSelector((state: any) => state.userDetails.user || "");
  const userId = userData._id;

  const stories = useSelector((state: RootState) => state.StoryData.story);
  console.log("stories:", stories);

  const userStories = Array.isArray(stories)
    ? stories.filter((story) => story.userId._id === userId)
    : [];
  console.log("User's stories:", userStories);

  console.log("User's stories:", userStories);

  // console.log("story data form the redux yo",storyData)

  // console.log("heyyi",storyData[0].stories)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        //   setCroppedImage
        //   setShowConfirmButton(true);
      } else {
        toast.error("Please select an image file.");
      }
    }
  };

  const handleIConClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const handleZoomChange = (zoom: number) => {
    setZoom(zoom);
  };
  const handleCloseModal = async () => {
    setImage("");
    setCropImg(false);
  };

  const closeModal = () => {
    setSelectedFile(null);
    // setShowConfirmButton(false);
  };

  const handleConfirmCrop = async () => {
    try {
      setSelectedFile(null);

      const croppedImageBlob = await getCroppedImage(
        selectedFile!,
        croppedArea
      );
      setCroppedImageBlob(croppedImageBlob); // Set the cropped image blob
      setImg(URL.createObjectURL(croppedImageBlob));
      setShowModal(true);
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  const handleCloseShowModal = () => {
    setImage(""); // Reset the image state
    setShowModal(false); // Hide the modal
  };

  const handleConfirmStory = async () => {
    try {
      const formDataFile = new FormData();

      console.log("Entering the if condition...");
      formDataFile.append("file", croppedImageBlob);

      formDataFile.append("upload_preset", presetKey);

      setCropImg(true); // Show modal while uploading
      console.log("hey goig to cloudin");
      setUploading(true);
      // Upload cropped image to Cloudinary
      const cloudinaryResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formDataFile
      );
      console.log(cloudinaryResponse, "res fromc lurd");
      console.log(cloudinaryResponse);
      setUploading(false);

      const imageUrl = cloudinaryResponse.data.secure_url;
      // SetstoryData({ storyUrl: imageUrl }); // Update storyImg with Cloudinary URL
      setImage(imageUrl); // Set image state with Cloudinary URL

      // Check if Cloudinary upload was successful
      if (cloudinaryResponse.status === 200 && imageUrl) {
        // Create story with Cloudinary URL
        console.log(imageUrl);
        const response = await axiosInstance.post(
          `/createStory`,
          { storyImg: imageUrl, userId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Story response:", response.data);

        if (response.data.success) {
          setShowModal(false); // Close modal
          setCropImg(false); // Reset cropping state
          // SetstoryData({ storyUrl: '' }); // Reset story data
          setSelectedFile(null); // Reset selected file
          dispatch(addStory(response.data.data));
        } else {
          console.error("Failed to create story");
        }
      } else {
        console.error("Cloudinary upload failed");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const getCroppedImage = (file: File, croppedArea: any) => {
    return new Promise<Blob>((resolve, reject) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = croppedArea.width;
        canvas.height = croppedArea.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(
          image,
          croppedArea.x * scaleX,
          croppedArea.y * scaleY,
          croppedArea.width * scaleX,
          croppedArea.height * scaleY,
          0,
          0,
          croppedArea.width,
          croppedArea.height
        );
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to crop image"));
          }
        }, "image/jpeg");
      };
    });
  };

  return (
    <div className="flex gap-4 mb-4">
      {/* Current User Story */}
      <div
        className="relative bg-white rounded-lg shadow-md overflow-hidden"
        style={{
          maxWidth: "150px",
          maxHeight: "200px",
          width: "150px",
          height: "200px",
          boxShadow:
            "5px 5px 10px rgba(0, 0, 0, 0.2), -5px -5px 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        <img
          src={userData.profileimg || "/download.jpeg"}
          alt=""
          onClick={() => {
            setShowStory(!showStory);
          }}
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-4 left-4 text-indigo-400 font-medium">
          {userData.username}
        </span>
        <button
          onClick={handleIConClick}
          className="absolute bottom-8 left-4 rounded-full my-2 w-8 h-8 flex items-center justify-center text-sm text-white bg-indigo-400 shadow-md"
          style={{
            boxShadow:
              "3px 3px 6px rgba(0, 0, 0, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.5)",
          }}
        >
          +
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
          <div className="w-[40rem] h-[40rem] relative">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <Cropper
                image={URL.createObjectURL(selectedFile)}
                crop={crop}
                zoom={zoom}
                aspect={1 / 2}
                onCropChange={handleCropChange}
                onZoomChange={handleZoomChange}
                onCropComplete={onCropComplete}
              />
              <div className="absolute top-5 right-0 m-4 z-10">
                <button
                  onClick={closeModal}
                  className="mr-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmCrop}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Crop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
          <div className="w-[22rem] h-[28rem] relative rounded-3xl shadow-xl shadow-black/30 bg-white/20">
            <div className="bg-white rounded-2xl p-4 shadow-inner shadow-black/10">
              {/* Display the cropped image */}
              <img
                src={Img}
                alt="Cropped"
                className="w-full h-[20rem] object-contain"
              />
              {/* Close button */}

              <button
                onClick={handleCloseShowModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 rounded-full shadow-lg shadow-black/30 bg-white/20 p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {uploading ? (
                <button
                  type="button"
                  className="absolute bottom-4 left-4 right-4 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg shadow-black/30 py-2 px-4"
                  disabled
                >
                  <div className="relative w-6 h-6 mr-2">
                    <div className="absolute inset-0 rounded-full bg-blue-400 blur-sm"></div>
                    <div className="relative flex items-center justify-center rounded-full h-5 w-5 bg-blue-500 shadow-md">
                      <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-2 border-t-blue-200"></div>
                    </div>
                  </div>
                  <span>Loading...</span>
                </button>
              ) : (
                <button
                  onClick={handleConfirmStory}
                  className="absolute bottom-4 left-4 right-4 text-white bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg shadow-black/30 py-2 px-4"
                >
                  Post Story
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showStory && (
        <ViewStory setShowStory={setShowStory} storyData={userStories} />
      )}
      {/* {uploading && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg">
    <div className="relative w-16 h-16 rounded-full bg-white shadow-inner">
      <div className="absolute inset-1 rounded-full bg-gray-200 blur-sm"></div>
      <div className="relative flex items-center justify-center rounded-full h-14 w-14 bg-white shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-400 border-t-4 border-t-gray-600"></div>
      </div>
    </div>
  </div>
)} */}
    </div>
  );
}

export default AddStory;
