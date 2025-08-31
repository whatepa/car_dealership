import { Injectable } from '@angular/core';

export interface CarModel {
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

@Injectable({
  providedIn: 'root',
})
export class Car {
  private readonly baseUrl = 'http://localhost:8080/api/cars';

  async list(): Promise<CarModel[]> {
    const response = await fetch(this.baseUrl);
    if (!response.ok) throw new Error('Failed to fetch cars');
    return response.json();
  }

  async create(car: CarModel, token: string): Promise<CarModel> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(car),
    });
    if (!response.ok) throw new Error('Failed to create car');
    return response.json();
  }

  async update(id: number, car: CarModel, token: string): Promise<CarModel> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(car),
    });
    if (!response.ok) throw new Error('Failed to update car');
    return response.json();
  }

  async remove(id: number, token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to delete car');
  }

  async addImage(id: number, file: File, token: string): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${this.baseUrl}/${id}/gallery`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload image');
  }

  async removeImage(id: number, imageUrl: string, token: string): Promise<void> {
    const params = new URLSearchParams({ imageUrl });
    const response = await fetch(`${this.baseUrl}/${id}/gallery?${params.toString()}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to remove image');
  }
}
