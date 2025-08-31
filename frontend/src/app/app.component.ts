import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarFormComponent } from './components/car-form/car-form.component';
import { ImageCarouselComponent } from './components/image-carousel/image-carousel.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { Auth } from './services/auth';
import { Car as CarService } from './services/car';

interface Car {
  id: number;
  brand: string;
  model: string;
  productionYear: number;
  price: number;
  fuelType: string;
  mileage: number;
  engineCapacity: number;
  transmission: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  imageGallery?: string[];
}

interface User {
  username: string;
  role: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CarFormComponent,
    ImageCarouselComponent,
    LoginFormComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  cars: Car[] = [];
  search: string = '';
  sort: string = '';
  loading: boolean = true;
  updating: boolean = false;
  user: User | null = null;
  showLogin: boolean = false;
  showCarForm: boolean = false;
  editingCar: Car | null = null;
  isSubmitting: boolean = false;
  formKey: number = 0;
  carsWithImagesLoading: Set<number> = new Set();
  selectedCar: Car | null = null;
  isCarDetailView: boolean = false;

  private carsUpdatedListener = () => this.fetchCars();
  private carImagesUploadedListener = (event: Event) =>
    this.handleCarImagesUploaded(event as CustomEvent);

  constructor(private auth: Auth, private carService: CarService) {}

  ngOnInit() {
    this.initializeApp();
  }

  ngOnDestroy() {
    window.removeEventListener('carsUpdated', this.carsUpdatedListener);
    window.removeEventListener('carImagesUploaded', this.carImagesUploadedListener);
  }

  private initializeApp() {
    const savedUser = this.auth.getUser<{ username: string; role: string } | null>();
    if (this.auth.isLoggedIn() && savedUser) {
      this.user = savedUser;
    }

    this.fetchCars();

    window.addEventListener('carsUpdated', this.carsUpdatedListener);
    window.addEventListener('carImagesUploaded', this.carImagesUploadedListener);
  }

  private handleCarImagesUploaded(event: CustomEvent) {
    const carId = event.detail.carId;
    const status = event.detail.status || 'completed';

    if (status === 'loading') {
      this.carsWithImagesLoading.add(carId);
    } else if (status === 'completed') {
      this.carsWithImagesLoading.delete(carId);
      this.fetchCars();
    }
  }

  async fetchCars() {
    this.loading = true;
    this.updating = true;

    try {
      const data = await this.carService.list();
      this.cars = data.map((car: any) => ({
        ...car,
        createdAt: car.createdAt ? new Date(car.createdAt) : undefined,
        updatedAt: car.updatedAt ? new Date(car.updatedAt) : undefined,
      })) as Car[];
    } catch (error) {
      console.error('Error fetching cars');
    } finally {
      this.loading = false;
      this.updating = false;
    }
  }

  async handleRemoveImage(carId: number, imageUrl: string) {
    try {
      this.updating = true;
      const token = this.auth.getToken() || '';
      await this.carService.removeImage(carId, imageUrl, token);
    } catch (e) {
      alert('Network error');
    } finally {
      await this.fetchCars();
    }
  }

  handleLogin(loginData: any) {
    this.user = { username: loginData.username, role: loginData.role };
    this.showLogin = false;
  }

  async handleLogout() {
    await this.auth.logout();
    this.user = null;
  }

  async handleDeleteCar(carId: number) {
    if (!confirm('Are you sure you want to delete this car?')) return;

    try {
      this.cars = this.cars.filter((car) => car.id !== carId);
      const token = this.auth.getToken() || '';
      await this.carService.remove(carId, token);
    } catch (error) {
      this.fetchCars();
      alert('Network error');
    }
  }

  handleCarSubmit() {
    if (this.isSubmitting) return;
    if (this.showCarForm === false && !this.editingCar) return;

    this.isSubmitting = true;

    if (this.editingCar) {
      this.editingCar = null;
    } else {
      this.showCarForm = false;
      this.formKey++;
    }

    this.editingCar = null;
    this.fetchCars();

    setTimeout(() => {
      this.isSubmitting = false;
    }, 100);
  }

  handleEditCar(car: Car) {
    this.editingCar = {
      ...car,
      createdAt: car.createdAt ? new Date(car.createdAt) : undefined,
      updatedAt: car.updatedAt ? new Date(car.updatedAt) : undefined,
    };
  }

  handleCancelEdit() {
    this.editingCar = null;
    this.formKey++;
  }

  handleAddCar() {
    if (this.showCarForm) {
      return;
    }
    this.formKey = 0;
    this.showCarForm = true;
  }

  get filteredCars(): Car[] {
    return this.cars
      .filter(
        (car) =>
          car.brand.toLowerCase().includes(this.search.toLowerCase()) ||
          car.model.toLowerCase().includes(this.search.toLowerCase())
      )
      .sort((a, b) => {
        if (!this.sort) return 0;
        if (this.sort === 'price-asc') return a.price - b.price;
        if (this.sort === 'price-desc') return b.price - a.price;
        if (this.sort === 'year-asc') return a.productionYear - b.productionYear;
        if (this.sort === 'year-desc') return b.productionYear - a.productionYear;
        return 0;
      });
  }

  trackByCarId(index: number, car: Car): number {
    return car.id;
  }

  handleCarClick(car: Car) {
    this.selectedCar = {
      ...car,
      createdAt: car.createdAt ? new Date(car.createdAt) : undefined,
      updatedAt: car.updatedAt ? new Date(car.updatedAt) : undefined,
    };
    this.isCarDetailView = true;
  }

  handleBackToList() {
    this.selectedCar = null;
    this.isCarDetailView = false;
  }

  handleImageClick(imageUrl: string) {
    // In listing view, clicking on image shows modal (handled by carousel component)
    // In detail view, clicking on image also shows modal
    // No navigation needed - modal is handled by the carousel component itself
  }
}
