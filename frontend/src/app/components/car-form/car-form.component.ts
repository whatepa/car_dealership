import { CommonModule } from '@angular/common';
import { Component, input, OnDestroy, OnInit, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarModel, Car as CarService } from '../../services/car';

interface Car {
  id?: number;
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

interface FormData {
  brand: string;
  model: string;
  productionYear: string;
  price: string;
  fuelType: string;
  mileage: string;
  engineCapacity: string;
  transmission: string;
  description: string;
}

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './car-form.component.html',
  styleUrl: './car-form.component.scss',
})
export class CarFormComponent implements OnInit, OnDestroy {
  car = input<Car | null>(null);

  onSubmit = output<any>();
  onCancel = output<void>();

  formData: FormData = {
    brand: '',
    model: '',
    productionYear: '',
    price: '',
    fuelType: '',
    mileage: '',
    engineCapacity: '',
    transmission: '',
    description: '',
  };

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  loading: boolean = false;
  galleryImages: string[] = [];
  isSubmitting: boolean = false;
  hasSubmitted: boolean = false;
  isMounted: boolean = true;

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.initializeForm();
  }

  ngOnDestroy() {
    this.isMounted = false;
  }

  private initializeForm() {
    const currentCar = this.car();
    if (currentCar) {
      this.formData = {
        brand: currentCar.brand || '',
        model: currentCar.model || '',
        productionYear: currentCar.productionYear?.toString() || '',
        price: currentCar.price?.toString() || '',
        fuelType: currentCar.fuelType || '',
        mileage: currentCar.mileage?.toString() || '',
        engineCapacity: currentCar.engineCapacity?.toString() || '',
        transmission: currentCar.transmission || '',
        description: currentCar.description || '',
      };

      if (currentCar.imageGallery && currentCar.imageGallery.length > 0) {
        this.imagePreviews = [...currentCar.imageGallery];
      } else {
        this.imagePreviews = [];
      }

      this.galleryImages = currentCar.imageGallery || [];
      this.selectedFiles = [];
      this.hasSubmitted = false;
    } else {
      this.formData = {
        brand: '',
        model: '',
        productionYear: '',
        price: '',
        fuelType: '',
        mileage: '',
        engineCapacity: '',
        transmission: '',
        description: '',
      };
      this.imagePreviews = [];
      this.selectedFiles = [];
      this.galleryImages = [];
      this.hasSubmitted = false;
    }
  }

  handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;

    this.formData = {
      ...this.formData,
      [name]: value,
    } as FormData;
  }

  handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = Array.from(target.files || []);

    if (this.selectedFiles.length + files.length > 12) {
      alert('Maximum 12 images allowed');
      return;
    }

    this.selectedFiles = [...this.selectedFiles, ...files];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.imagePreviews = [...this.imagePreviews, e.target.result as string];
        }
      };
      reader.readAsDataURL(file);
    });
  }

  handleRemoveGalleryImage(imageUrl: string) {
    this.galleryImages = this.galleryImages.filter((img) => img !== imageUrl);
  }

  handleRemovePreview(index: number) {
    this.selectedFiles = this.selectedFiles.filter((_, i) => i !== index);
    this.imagePreviews = this.imagePreviews.filter((_, i) => i !== index);
  }

  async handleSubmit(event: Event) {
    event.preventDefault();

    if (this.isSubmitting || this.hasSubmitted) {
      return;
    }

    this.isSubmitting = true;
    this.hasSubmitted = true;
    this.loading = true;

    try {
      const token = localStorage.getItem('token') || '';

      const currentCar = this.car();
      const payload: CarModel = {
        brand: this.formData.brand,
        model: this.formData.model,
        productionYear: parseInt(this.formData.productionYear),
        price: parseFloat(this.formData.price),
        fuelType: this.formData.fuelType,
        mileage: parseInt(this.formData.mileage),
        engineCapacity: parseFloat(this.formData.engineCapacity),
        transmission: this.formData.transmission,
        description: this.formData.description,
      };

      let carResult: CarModel;
      if (currentCar?.id) {
        carResult = await this.carService.update(currentCar.id, payload, token);
      } else {
        carResult = await this.carService.create(payload, token);
      }

      if (carResult && carResult.id) {
        if (this.selectedFiles.length > 0 && this.isMounted) {
          window.dispatchEvent(
            new CustomEvent('carImagesUploaded', {
              detail: { carId: 'pending', status: 'loading' },
            })
          );
        }

        if (this.selectedFiles.length > 0 && this.isMounted) {
          window.dispatchEvent(
            new CustomEvent('carImagesUploaded', {
              detail: { carId: carResult.id, status: 'loading' },
            })
          );
        }

        this.onSubmit.emit(carResult);

        this.loading = false;
        this.isSubmitting = false;

        const filesToUpload = [...this.selectedFiles];

        this.selectedFiles = [];
        this.imagePreviews = [];
        this.hasSubmitted = false;

        if (filesToUpload.length > 0 && token) {
          // Emit event before component destruction to trigger UI refresh
          window.dispatchEvent(
            new CustomEvent('carImagesUploaded', {
              detail: { carId: carResult.id, status: 'loading' },
            })
          );

          this.uploadImagesInBackground(carResult.id as number, filesToUpload, token);
        }
      } else {
        alert('Error saving car');
        this.loading = false;
        this.isSubmitting = false;
      }
    } catch (error) {
      alert('Network error');
      this.loading = false;
      this.isSubmitting = false;
    }
  }

  private async uploadImagesInBackground(carId: number, files: File[], token: string) {
    console.log(`Starting background upload of ${files.length} images for car ${carId}`);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        await this.carService.addImage(carId, file, token);
      } catch (err) {
        console.error(`Failed to upload image ${file.name}:`, err);
      }

      if (i < files.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    console.log(`Background upload completed for car ${carId}`);

    window.dispatchEvent(
      new CustomEvent('carImagesUploaded', {
        detail: { carId: carId, status: 'completed' },
      })
    );
  }

  handleCancel() {
    this.onCancel.emit();
  }
}
