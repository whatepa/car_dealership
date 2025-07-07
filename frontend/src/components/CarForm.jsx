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

  const isInlineEdit = car && car.id;

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
              className="p-2 w-full text-white rounded border border-zinc-600"
              required
            />
          </div>

          <div className={isInlineEdit ? "mb-3" : "mb-4"}>
            <label className="block mb-1 text-sm font-medium text-white">Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              className="p-2 w-full text-white rounded border border-zinc-600"
              required
            />
          </div>

          <div className={isInlineEdit ? "mb-3" : "mb-4"}>
            <label className="block mb-1 text-sm font-medium text-white">Production Year</label>
            <input
              type="number"
              name="productionYear"
              value={formData.productionYear}
              onChange={handleChange}
              className="p-2 w-full text-white rounded border border-zinc-600"
              min="1900"
              max="2025"
              required
            />
          </div>

          <div className={isInlineEdit ? "mb-3" : "mb-4"}>
            <label className="block mb-1 text-sm font-medium text-white">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="p-2 w-full text-white rounded border border-zinc-600"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className={isInlineEdit ? "mb-3" : "mb-4"}>
            <label className="block mb-1 text-sm font-medium text-white">Fuel Type</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="p-2 w-full text-white rounded border border-zinc-600"
              required
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
              className="p-2 w-full text-white rounded border border-zinc-600"
              min="0"
              required
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
            className="p-2 w-full rounded border"
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : car ? "Update" : "Add"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded text-zinc-700 bg-zinc-300 hover:bg-zinc-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarForm;
