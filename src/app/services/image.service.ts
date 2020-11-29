import { Injectable } from '@angular/core';
import { CameraPhoto } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor() { }

  async readAsBase64(cameraPhoto: CameraPhoto) 
  {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();
  
    return await this.convertBlobToBase64(blob) as string;  
  }
  
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => 
  {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
