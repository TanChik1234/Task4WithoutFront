import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';

@Injectable()
export class FileService {

  /**
   * Method for deleting an image from a folder.
   * @param imageName The name of the image
   */
  async deleteImage(imageName: string): Promise<void> {
    try {
      await fs.unlink(`uploads/${imageName}`); 
      console.log(`Image ${imageName} has been deleted.`);
    } catch (error) {
      console.error(`Error deleting image ${imageName}:`, error);
      throw error;
    }
  }
}
