import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    const res = await fetch("http://localhost:8080/api/cars");
    const data = await res.json();
    setCars(data);
    setLoading(false);
  };

  const filteredCars = cars
    .filter(
      (car) =>
        car.brand.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sort) return 0;
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "year-asc") return a.productionYear - b.productionYear;
      if (sort === "year-desc") return b.productionYear - a.productionYear;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Car Dealership</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search brand/model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 border rounded w-full md:w-1/2"
          >
            <option value="">Sort by...</option>
            <option value="price-asc">Price ascending</option>
            <option value="price-desc">Price descending</option>
            <option value="year-asc">Year ascending</option>
            <option value="year-desc">Year descending</option>
          </select>
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {filteredCars.length === 0 ? (
              <div className="text-center">No listings found.</div>
            ) : (
              filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="font-bold text-lg">
                      {car.brand} {car.model}
                    </div>
                    <div>
                      Production Year: <span className="font-medium">{car.productionYear}</span>
                    </div>
                    <div>
                      Price: <span className="font-medium">${car.price}</span>
                    </div>
                    <div>
                      Fuel Type: <span className="font-medium">{car.fuelType}</span>
                    </div>
                    <div>
                      Mileage: <span className="font-medium">{car.mileage} km</span>
                    </div>
                    <div>
                      Engine Capacity: <span className="font-medium">{car.engineCapacity} L</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
