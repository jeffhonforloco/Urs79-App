import { ImageSource } from '@nativescript/core';

export class ImageOptimizer {
  static async optimizeForUpload(imagePath: string): Promise<ImageSource> {
    const image = await ImageSource.fromFile(imagePath);
    
    // Calculate new dimensions while maintaining aspect ratio
    const maxDimension = 1200;
    let width = image.width;
    let height = image.height;
    
    if (width > maxDimension || height > maxDimension) {
      if (width > height) {
        height = (height / width) * maxDimension;
        width = maxDimension;
      } else {
        width = (width / height) * maxDimension;
        height = maxDimension;
      }
    }

    return await ImageSource.fromImage(
      image.resize(Math.round(width), Math.round(height))
    );
  }

  static async generateThumbnail(imagePath: string): Promise<ImageSource> {
    const image = await ImageSource.fromFile(imagePath);
    return await ImageSource.fromImage(
      image.resize(200, 200)
    );
  }
}