import { Component, Output, EventEmitter } from "@angular/core";
import { NgxImageCompressService } from "ngx-image-compress";

@Component({
  selector: 'app-image-uploader',
  templateUrl: "image-uploader.component.html",
  styleUrls: ['image-uploader.component.css']
})
export class ImageUploaderComponent {
  imagePath: string;
  imageUploaded: boolean = false;
  @Output() onImageUpload = new EventEmitter<{ imagePath: string }>();

  constructor(private imageCompress: NgxImageCompressService) {}

  // Uploads image if image is valid
  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      const max_size = 500000; // 500 Kb

      if (fileInput.target.files[0].size > max_size) {
        alert('Image too large - required images smaller than 200Kb');
        return false;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = (res) => {
            const imgBase64Path = e.target.result;
            this.compressFile(imgBase64Path);
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  // Compresses image file
  compressFile(image: string) {
    var orientation = -1;
    this.imageCompress.compressFile(image, orientation, 50, 50).then((result) => {
      this.imagePath = result;
      this.imageUploaded = true;
    });
  }
  // Removes uploaded image
  removeImage() {
      this.imagePath = null;
      this.imageUploaded = false;
  }

  // Added uploaded image to project
  uploadImage() {
    this.onImageUpload.emit({ imagePath: this.imagePath });
  }
}
