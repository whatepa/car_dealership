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
    } catch {
      console.error("Error fetching cars");
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
    } catch {
      console.error("Logout error");
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
    } catch {
      alert("Network error");
    }
  };

  const handleCarSubmit = () => {
    setShowCarForm(false);
    setEditingCar(null);
    fetchCars();
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
  };

  const handleCancelEdit = () => {
    setEditingCar(null);
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
    <div className="p-4 min-h-screen bg-gray-100">
      <div className="mx-auto max-w-4xl">
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
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Add Car
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Admin Login
              </button>
            )}
          </div>
        </div>

        {showLogin && <LoginForm onLogin={handleLogin} />}

        {showCarForm && (
          <CarForm
            car={null}
            onSubmit={handleCarSubmit}
            onCancel={() => {
              setShowCarForm(false);
            }}
          />
        )}

        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <input
            type="text"
            placeholder="Search brand/model..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 w-full rounded border md:w-1/2"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="p-2 w-full rounded border md:w-1/2"
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
                <div key={car.id} className="p-4 bg-white rounded shadow">
                  {editingCar && editingCar.id === car.id ? (

                    <CarForm car={car} onSubmit={handleCarSubmit} onCancel={handleCancelEdit} />
                  ) : (

                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-lg font-bold">
                          {car.brand} {car.model}
                        </div>
                        {user && user.role === "ADMIN" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditCar(car)}
                              className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteCar(car.id)}
                              className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
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
                          Engine Capacity:{" "}
                          <span className="font-medium">{car.engineCapacity} L</span>
                        </div>
                      </div>
                    </>
                  )}
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
