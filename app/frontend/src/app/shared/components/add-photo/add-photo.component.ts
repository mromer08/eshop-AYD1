import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'shared-add-photo',
  templateUrl: './add-photo.component.html',
  styleUrl: './add-photo.component.css'
})
export class AddPhotoComponent {

  @Input() public scale: string = '1';
  @Input() public url?: string;
  @Output() public image: EventEmitter<File> =  new EventEmitter<File>();

  constructor() { }

  public catchImage(event: Event): void {
    const fileList: FileList | null = (event.target as HTMLInputElement).files;
    if (fileList) {
      const file = fileList[0];
      if (file) {
        this.url = URL.createObjectURL(file);
        this.image.emit(file);
      }
    }
  }

  public returnScale(): string {
    return `scale(${this.scale})`;
  }

}
