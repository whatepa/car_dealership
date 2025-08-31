import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-carousel.component.html',
  styleUrl: './image-carousel.component.scss',
})
export class ImageCarouselComponent {
  images = input<string[]>([]);
  isAdmin = input<boolean>(false);
  carId = input<number | null>(null);
  showThumbnails = input<boolean>(true);
  onRemoveImage = output<string>();
  onImageClick = output<string>();

  currentIndex: number = 0;
  selectedImage: string | null = null;

  get shouldRender(): boolean {
    const imgs = this.images();
    return !!imgs && imgs.length > 0;
  }

  get shouldShowNavigation(): boolean {
    const imgs = this.images();
    return !!imgs && imgs.length > 1;
  }

  nextImage(): void {
    const imgs = this.images();
    if (imgs && imgs.length > 1) {
      this.currentIndex = (this.currentIndex + 1) % imgs.length;
    }
  }

  prevImage(): void {
    const imgs = this.images();
    if (imgs && imgs.length > 1) {
      this.currentIndex = this.currentIndex === 0 ? imgs.length - 1 : this.currentIndex - 1;
    }
  }

  handleImageClick(imageUrl: string): void {
    // Always show modal for full-size image
    this.selectedImage = imageUrl;

    // Emit event for parent component (for listing view navigation)
    this.onImageClick.emit(imageUrl);
  }

  handleThumbnailClick(index: number, event: Event): void {
    event.stopPropagation();
    this.currentIndex = index;
  }

  handleModalClose(): void {
    this.selectedImage = null;
  }

  handleModalImageClick(event: Event): void {
    event.stopPropagation();
  }

  handleRemoveImage(imageUrl: string): void {
    this.onRemoveImage.emit(imageUrl);
  }
}
