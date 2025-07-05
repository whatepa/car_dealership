import { useEffect, useState } from "react";
import "./App.css";
import CarForm from "./components/CarForm";
import LoginForm from "./components/LoginForm";

function App() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/cars");
      const data = await res.json();
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (loginData) => {
    setUser({ username: loginData.username, role: loginData.role });
    setShowLogin(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!confirm("Are you sure you want to delete this car?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/cars/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCars();
      } else {
        alert("Error deleting car");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const handleCarSubmit = (car) => {
    setShowCarForm(false);
    setEditingCar(null);
    fetchCars();
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
    setShowCarForm(true);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Car Dealership</h1>
          <div className="flex gap-2">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user.username} ({user.role})
                </span>
                {user.role === "ADMIN" && (
                  <button
                    onClick={() => setShowCarForm(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Add Car
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
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
                  {user && user.role === "ADMIN" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditCar(car)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      {showLogin && <LoginForm onLogin={handleLogin} />}
      {showCarForm && (
        <CarForm
          car={editingCar}
          onSubmit={handleCarSubmit}
          onCancel={() => {
            setShowCarForm(false);
            setEditingCar(null);
          }}
        />
      )}
    </div>
  );
}

export default App;
