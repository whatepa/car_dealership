import { useEffect, useRef, useState } from "react";

const CarForm = ({ car, onSubmit, onCancel }) => {
  const isMounted = useRef(true);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    productionYear: "",
    price: "",
    fuelType: "",
    mileage: "",
    engineCapacity: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [galleryImages, setGalleryImages] = useState(car?.imageGallery || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;

    if (car) {
      setFormData({
        brand: car.brand || "",
        model: car.model || "",
        productionYear: car.productionYear || "",
        price: car.price || "",
        fuelType: car.fuelType || "",
        mileage: car.mileage || "",
        engineCapacity: car.engineCapacity || "",
      });
      if (car.imageGallery && car.imageGallery.length > 0) {
        setImagePreviews(car.imageGallery);
      } else {
        setImagePreviews([]);
      }
      setGalleryImages(car.imageGallery || []);
      setSelectedFiles([]);
      setHasSubmitted(false);
    } else {
      setFormData({
        brand: "",
        model: "",
        productionYear: "",
        price: "",
        fuelType: "",
        mileage: "",
        engineCapacity: "",
      });
      setImagePreviews([]);
      setSelectedFiles([]);
      setGalleryImages([]);
      setHasSubmitted(false);
    }
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (selectedFiles.length + files.length > 12) {
      alert("Maximum 12 images allowed");
      return;
    }

    setSelectedFiles((prev) => {
      const newFiles = [...prev, ...files];
      return newFiles;
    });

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveGalleryImage = (imageUrl) => {
    setGalleryImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const handleRemovePreview = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting || hasSubmitted) {
      return;
    }
    setIsSubmitting(true);
    setHasSubmitted(true);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const url = car
        ? `http://localhost:8080/api/cars/${car.id}`
        : "http://localhost:8080/api/cars";
      const method = car ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          productionYear: parseInt(formData.productionYear),
          price: parseFloat(formData.price),
          mileage: parseInt(formData.mileage),
          engineCapacity: parseFloat(formData.engineCapacity),
        }),
      });

      if (response.ok) {
        if (selectedFiles.length > 0 && isMounted.current) {
          window.dispatchEvent(
            new CustomEvent("carImagesUploaded", {
              detail: { carId: "pending", status: "loading" },
            })
          );
        }

        const carResult = await response.json();

        if (selectedFiles.length > 0 && isMounted.current) {
          window.dispatchEvent(
            new CustomEvent("carImagesUploaded", {
              detail: { carId: carResult.id, status: "loading" },
            })
          );
        }

        if (selectedFiles.length > 0) {
          window.dispatchEvent(
            new CustomEvent("carImagesUploaded", {
              detail: { carId: carResult.id, status: "loading" },
            })
          );
        }

        onSubmit(carResult);

        setLoading(false);
        setIsSubmitting(false);

        const filesToUpload = [...selectedFiles];

        setSelectedFiles([]);
        setImagePreviews([]);

        setHasSubmitted(false);

        if (filesToUpload.length > 0) {
          uploadImagesInBackground(carResult.id, filesToUpload, token);

          setTimeout(() => {
            if (isMounted.current) {
              window.dispatchEvent(
                new CustomEvent("carImagesUploaded", {
                  detail: { carId: carResult.id, status: "completed" },
                })
              );
            }
          }, 10000);
        }
      } else {
        alert("Error saving car");
        setLoading(false);
        setIsSubmitting(false);
      }
    } catch {
      alert("Network error");
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const uploadImagesInBackground = async (carId, files, token) => {
    try {
      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);

        const imageResponse = await fetch(`http://localhost:8080/api/cars/${carId}/gallery`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!imageResponse.ok) {
          const errorText = await imageResponse.text();
          console.error(`Image ${i + 1} upload failed for car ${carId}:`, errorText);
        }
      }

      window.dispatchEvent(
        new CustomEvent("carImagesUploaded", {
          detail: { carId: carId, status: "completed" },
        })
      );
    } catch (error) {
      console.error("Error uploading images in background for car:", carId, error);

      if (isMounted.current) {
        window.dispatchEvent(
          new CustomEvent("carImagesUploaded", {
            detail: { carId: carId, status: "completed" },
          })
        );
      }
    }
  };

  const isInlineEdit = car && car.id;
  const totalImages = imagePreviews.length + galleryImages.length;

  return (
    <div
      className={`bg-zinc-800 rounded-lg shadow-md border border-zinc-700 ${
        isInlineEdit ? "p-4" : "p-6 mb-6"
      }`}
    >
      <h2
        className={`font-bold text-center text-white ${
          isInlineEdit ? "mb-4 text-lg" : "mb-6 text-2xl"
        }`}
      >
        {car ? "Edit Car" : "Add New Car"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={isInlineEdit ? "mb-3" : "mb-4"}>
            <label className="block mb-1 text-sm font-medium text-white">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="p-2 w-full text-black rounded border border-zinc-600"
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <div className={isInlineEdit ? "mb-3" : "mb-4"}>
            <label className="block mb-1 text-sm font-medium text-white">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="p-2 w-full text-black rounded border border-zinc-600"
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <div className={isInlineEdit ? "mb-3" : "mb-4"}>
            <label className="block mb-1 text-sm font-medium text-white">Production Year</label>
            <input
              type="number"
              name="productionYear"
              value={formData.productionYear}
              onChange={handleChange}
              className="p-2 w-full text-black rounded border border-zinc-600"
              min="1900"
              max="2025"
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <div className={isInlineEdit ? "mb-3" : "mb-4"}>
            <label className="block mb-1 text-sm font-medium text-white">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="p-2 w-full text-black rounded border border-zinc-600"
              min="0"
              step="0.01"
              required
              disabled={loading || isSubmitting}
            />
          </div>

          <div className={isInlineEdit ? "mb-3" : "mb-4"}>
            <label className="block mb-1 text-sm font-medium text-white">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="p-2 w-full text-black rounded border border-zinc-600"
              required
              disabled={loading || isSubmitting}
            >
              <option value="">Select fuel type</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className={isInlineEdit ? "mb-3" : "mb-4"}>
            <label className="block mb-1 text-sm font-medium text-white">Mileage (km)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="p-2 w-full text-black rounded border border-zinc-600"
              min="0"
              required
              disabled={loading || isSubmitting}
            />
          </div>
        </div>

        <div className={isInlineEdit ? "mb-4" : "mb-6"}>
          <label className="block mb-1 text-sm font-medium text-white">Engine Capacity (L)</label>
          <input
            type="number"
            name="engineCapacity"
            value={formData.engineCapacity}
            onChange={handleChange}
            className="p-2 w-full text-black rounded border"
            min="0"
            step="0.1"
            required
            disabled={loading || isSubmitting}
          />
        </div>

        {/* Multiple image upload section */}
        <div className={isInlineEdit ? "mb-4" : "mb-6"}>
          <label className="block mb-1 text-sm font-medium text-white">
            Car Images ({totalImages}/12)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="p-2 w-full text-white rounded border border-zinc-600"
            disabled={totalImages >= 12 || loading || isSubmitting}
          />
          <p className="mt-1 text-xs text-zinc-400">
            Select multiple images (max 12 total). First image will be the main image.
          </p>
        </div>

        {/* Image previews for new cars */}
        {!car?.id && imagePreviews.length > 0 && (
          <div className={isInlineEdit ? "mb-4" : "mb-6"}>
            <h3 className="mb-3 text-lg font-semibold text-white">Selected Images</h3>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="object-cover w-full h-24 rounded border border-zinc-600"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePreview(index)}
                    className="flex absolute top-1 right-1 justify-center items-center w-6 h-6 text-xs text-white bg-red-500 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    title="Remove image"
                  >
                    ×
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 px-2 py-1 text-xs text-white bg-blue-500 rounded">
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {car?.id && (
          <div className={isInlineEdit ? "mb-4" : "mb-6"}>
            <h3 className="mb-3 text-lg font-semibold text-white">Current Images</h3>
            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {galleryImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={imageUrl}
                      alt={`Gallery image ${index + 1}`}
                      className="object-cover w-full h-24 rounded border border-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(imageUrl)}
                      className="flex absolute top-1 right-1 justify-center items-center w-6 h-6 text-xs text-white bg-red-500 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                      title="Remove image"
                    >
                      ×
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 px-2 py-1 text-xs text-white bg-blue-500 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-zinc-400 py-8">
                <div className="mb-2 text-2xl">📷</div>
                <div>No images in gallery</div>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="flex-1 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? selectedFiles.length > 0
                ? "Saving car..."
                : "Saving..."
              : car
              ? "Update"
              : "Add"}
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedFiles([]);
              setImagePreviews([]);
              setHasSubmitted(false);
              onCancel();
            }}
            disabled={loading || isSubmitting}
            className="flex-1 px-4 py-2 rounded text-zinc-700 bg-zinc-300 hover:bg-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>

        {selectedFiles.length > 0 && !car?.id && (
          <div className="mt-3 text-center">
            <p className="text-sm text-zinc-400">
              Images will be uploaded in the background after car is saved
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default CarForm;
