import { useEffect, useState } from "react";

const CarForm = ({ car, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    productionYear: "",
    price: "",
    fuelType: "",
    mileage: "",
    engineCapacity: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    }
  }, [car]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        const result = await response.json();
        onSubmit(result);
      } else {
        alert("Error saving car");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{car ? "Edit Car" : "Add New Car"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Production Year</label>
            <input
              type="number"
              name="productionYear"
              value={formData.productionYear}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="1900"
              max="2030"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select fuel type</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Mileage (km)</label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Engine Capacity (L)</label>
            <input
              type="number"
              name="engineCapacity"
              value={formData.engineCapacity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              min="0"
              step="0.1"
              required
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : car ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CarForm;
