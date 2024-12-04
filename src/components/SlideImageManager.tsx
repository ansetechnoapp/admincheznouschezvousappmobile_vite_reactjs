import React, { useState, useEffect } from "react";
import { uploadImageToFirebase, saveImageUrlToFirestore, fetchImageUrlsFromFirestore } from "../../services/slideImageService";
import { addImage, setImages, selectImages } from "../../Redux/Slices/slideImageSlice";
import { useSelector, useDispatch } from "react-redux";

export const UploadImage: React.FC = () => {
  const [selectedImageId, setSelectedImageId] = useState<string>("image1");
  const [image, setImage] = useState<File | null>(null);
  const dispatch = useDispatch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      console.error("No image selected");
      return;
    }

    try {
      const downloadURL = await uploadImageToFirebase(image, selectedImageId);
      await saveImageUrlToFirestore(downloadURL, selectedImageId);
      dispatch(addImage({ imageId: selectedImageId, imageUrl: downloadURL }));
      console.log("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Slide Image Manager</h2>
      <DisplayImages />
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Upload New Image</h3>
        <div className="flex flex-col space-y-4">
          <select 
            onChange={(e) => setSelectedImageId(e.target.value)} 
            value={selectedImageId}
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="image1">Image 1</option>
            <option value="image2">Image 2</option>
            <option value="image3">Image 3</option>
            <option value="image4">Image 4</option>
          </select>
          <input 
            type="file" 
            onChange={handleImageChange} 
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={handleUpload}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Upload Image
          </button>
        </div>
      </div>
    </div>
  );
};

const DisplayImages: React.FC = () => {
  const images = useSelector(selectImages);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageUrls = await fetchImageUrlsFromFirestore();
        const defaultEntries = ["image1", "image2", "image3", "image4"];
        const completeImages = defaultEntries.map((entry) => imageUrls[entry] || "");
        dispatch(setImages(completeImages));
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {images.map((url, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">{`Image ${index + 1}`}</h3>
          {url ? (
            <img 
              src={url} 
              alt={`slide-${index}`} 
              className="w-full h-48 object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md">
              <p className="text-gray-500">No image uploaded</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};