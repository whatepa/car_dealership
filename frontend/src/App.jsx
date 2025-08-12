import { useCallback, useEffect, useState } from "react";
import "./App.css";
import CarForm from "./components/CarForm";
import ImageCarousel from "./components/ImageCarousel";
import LoginForm from "./components/LoginForm";

function App() {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [carsWithImagesLoading, setCarsWithImagesLoading] = useState(new Set());

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchCars();

    const handleCarsUpdated = () => {
      fetchCars();
      setCarsWithImagesLoading(new Set());
    };

    const handleCarImagesUploaded = (event) => {
      const carId = event.detail.carId;
      const status = event.detail.status || "completed";

      if (status === "loading") {
        setCarsWithImagesLoading((prev) => {
          const newSet = new Set(prev);
          newSet.add(carId);
          return newSet;
        });
      } else if (status === "completed") {
        setCarsWithImagesLoading((prev) => {
          const newSet = new Set(prev);
          newSet.delete(carId);
          return newSet;
        });

        fetchCars();
      }
    };

    window.addEventListener("carsUpdated", handleCarsUpdated);
    window.addEventListener("carImagesUploaded", handleCarImagesUploaded);

    return () => {
      window.removeEventListener("carsUpdated", handleCarsUpdated);
      window.removeEventListener("carImagesUploaded", handleCarImagesUploaded);
    };
  }, []);

  useEffect(() => {}, [showCarForm]);

  useEffect(() => {}, [formKey]);

  useEffect(() => {
    if (formKey > 0) {
      setShowCarForm(false);
    }
  }, [formKey]);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setUpdating(true);
    try {
      const res = await fetch("http://localhost:8080/api/cars");
      const data = await res.json();
      setCars(data);
    } catch {
      console.error("Error fetching cars");
    } finally {
      setLoading(false);
      setUpdating(false);
    }
  }, []);

  const handleRemoveImage = useCallback(() => {
    setUpdating(true);
    fetchCars();
  }, [fetchCars]);

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
      setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
      const response = await fetch(`http://localhost:8080/api/cars/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) {
        fetchCars();
        alert("Error deleting car");
      }
    } catch {
      fetchCars();
      alert("Network error");
    }
  };

  const handleCarSubmit = () => {
    if (isSubmitting) {
      return;
    }

    if (showCarForm === false && !editingCar) {
      return;
    }

    setIsSubmitting(true);

    if (editingCar) {
      setEditingCar(null);
    } else {
      setShowCarForm(false);

      setFormKey((prev) => prev + 1);
    }

    setEditingCar(null);

    fetchCars();

    setTimeout(() => {
      setIsSubmitting(false);
    }, 100);
  };

  const handleEditCar = (car) => {
    setEditingCar(car);
  };

  const handleCancelEdit = () => {
    setEditingCar(null);
    setFormKey((prev) => prev + 1);
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
    <div className="p-4 min-h-screen bg-zinc-900">
      <div className="mx-auto max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Car Dealership</h1>
          <div className="flex gap-2">
            {user ? (
              <>
                <span className="text-sm text-zinc-300">
                  Welcome, {user.username} ({user.role})
                </span>
                {user.role === "ADMIN" && (
                  <button
                    onClick={() => {
                      if (showCarForm) {
                        return;
                      }
                      setFormKey(0);
                      setShowCarForm(true);
                    }}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {showCarForm && formKey === 0 && (
          <div>
            <CarForm
              key={`new-car-form-${formKey}`}
              car={null}
              onSubmit={() => {
                handleCarSubmit();
              }}
              onCancel={() => {
                setShowCarForm(false);
              }}
            />
          </div>
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
          <div className="text-center text-white">Loading...</div>
        ) : updating ? (
          <div className="text-center text-white">Updating...</div>
        ) : (
          <div className="grid gap-4">
            {filteredCars.length === 0 ? (
              <div className="text-center text-white">No listings found.</div>
            ) : (
              filteredCars.map((car) => (
                <div key={car.id} className="p-4 rounded border shadow bg-zinc-800 border-zinc-700">
                  {editingCar && editingCar.id === car.id ? (
                    <CarForm
                      key={`edit-car-${car.id}-${formKey}`}
                      car={car}
                      onSubmit={handleCarSubmit}
                      onCancel={handleCancelEdit}
                    />
                  ) : (
                    <>
                      <div className="flex gap-4">
                        {car.imageGallery && car.imageGallery.length > 0 ? (
                          <div className="flex-shrink-0">
                            <img
                              src={car.imageGallery[0]}
                              alt={`${car.brand} ${car.model}`}
                              className="object-cover w-32 h-24 rounded border border-zinc-600"
                            />
                          </div>
                        ) : carsWithImagesLoading.has(car.id) ? (
                          <div className="flex flex-shrink-0 justify-center items-center w-32 h-24 rounded border border-zinc-600 bg-zinc-700">
                            <div className="text-center text-zinc-400">
                              <div className="mx-auto mb-2 w-8 h-8 rounded-full border-b-2 border-blue-500 animate-spin"></div>
                              <div className="text-xs">Loading images...</div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-shrink-0 justify-center items-center w-32 h-24 rounded border border-zinc-600 bg-zinc-700">
                            <div className="text-center text-zinc-400">
                              <div className="mb-1 text-2xl">📷</div>
                              <div className="text-xs">No images</div>
                            </div>
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div className="text-lg font-bold text-white">
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
                          <div className="grid grid-cols-2 gap-2 text-sm text-zinc-300 md:grid-cols-3">
                            <div>
                              Production Year:{" "}
                              <span className="font-medium text-white">{car.productionYear}</span>
                            </div>
                            <div>
                              Price: <span className="font-medium text-white">${car.price}</span>
                            </div>
                            <div>
                              Fuel Type:{" "}
                              <span className="font-medium text-white">{car.fuelType}</span>
                            </div>
                            <div>
                              Mileage:{" "}
                              <span className="font-medium text-white">{car.mileage} km</span>
                            </div>
                            <div>
                              Engine Capacity:{" "}
                              <span className="font-medium text-white">{car.engineCapacity} L</span>
                            </div>
                          </div>

                          {/* Image Carousel */}
                          {car.imageGallery && car.imageGallery.length > 0 ? (
                            <ImageCarousel
                              images={car.imageGallery}
                              onRemoveImage={handleRemoveImage}
                              carId={car.id}
                              isAdmin={user?.role === "ADMIN"}
                            />
                          ) : carsWithImagesLoading.has(car.id) ? (
                            <div className="mt-4">
                              <h3 className="mb-3 text-lg font-semibold text-white">
                                Image Gallery
                              </h3>
                              <div className="flex justify-center items-center h-64 rounded-lg bg-zinc-700">
                                <div className="text-center text-zinc-400">
                                  <div className="mx-auto mb-3 w-12 h-12 rounded-full border-b-2 border-blue-500 animate-spin"></div>
                                  <div>Uploading images...</div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-4">
                              <h3 className="mb-3 text-lg font-semibold text-white">
                                Image Gallery
                              </h3>
                              <div className="flex justify-center items-center h-64 rounded-lg bg-zinc-700">
                                <div className="text-center text-zinc-400">
                                  <div className="mb-2 text-4xl">📷</div>
                                  <div>No images available</div>
                                </div>
                              </div>
                            </div>
                          )}
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
