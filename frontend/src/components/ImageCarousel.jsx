import { useState } from "react";

const ImageCarousel = ({ images, onRemoveImage, carId, isAdmin }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);

  if (!images || images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleRemoveImage = async (imageUrl) => {
    if (!confirm("Are you sure you want to remove this image?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/cars/${carId}/gallery?imageUrl=${encodeURIComponent(imageUrl)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        onRemoveImage(imageUrl);
        // Reset to first image if we're removing the current one
        if (images[currentIndex] === imageUrl) {
          setCurrentIndex(0);
        }
      } else {
        alert("Error removing image");
      }
    } catch {
      alert("Network error");
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold text-white mb-3">Image Gallery</h3>

      {/* Main Carousel */}
      <div className="relative">
        <div className="relative h-64 bg-zinc-700 rounded-lg overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`Car image ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            onClick={() => handleImageClick(images[currentIndex])}
          />

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-opacity"
                title="Previous image"
              >
                ‹
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-opacity"
                title="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Remove button for admin */}
          {isAdmin && (
            <button
              onClick={() => handleRemoveImage(images[currentIndex])}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              title="Remove image"
            >
              ×
            </button>
          )}
        </div>

        {/* Image counter */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {images.map((imageUrl, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`flex-shrink-0 w-16 h-12 rounded border-2 transition-all ${
                index === currentIndex
                  ? "border-blue-500 opacity-100"
                  : "border-zinc-600 opacity-60 hover:opacity-80"
              }`}
            >
              <img
                src={imageUrl}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal for full-size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-4xl max-h-full p-4">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
