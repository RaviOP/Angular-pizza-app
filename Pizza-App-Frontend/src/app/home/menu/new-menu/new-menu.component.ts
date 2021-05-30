import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuService } from '../menu.service';
import { mimeType } from '../mime-type.validator';

@Component({
  selector: 'app-new-menu',
  templateUrl: './new-menu.component.html',
  styleUrls: ['./new-menu.component.css']
})
export class NewMenuComponent implements OnInit {
  menuForm!: FormGroup;
  imagePreview!: string;

  constructor(private fb: FormBuilder,private menuService: MenuService) { }

  ngOnInit(): void {
    this.menuForm = this.fb.group({
      'name': new FormControl(null, [Validators.required]),
      'price': new FormControl(null, [Validators.required]),
      'size': new FormControl(null, [Validators.required]),
      'image': new FormControl(
        null,
        {
          validators: [
            Validators.required
          ],
          asyncValidators: [
            mimeType
          ]
        }
      )
    })
  }

  onSubmit() {
    if (!this.menuForm.valid) {
      return 
    }
    const menu = {
      name: this.menuForm.value.name,
      price: this.menuForm.value.price,
      size: this.menuForm.value.size
    }
    this.menuService.createMenuItem(menu,this.menuForm.value.image)
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.menuForm.patchValue(
      {
        image: file
      }
    )
    this.menuForm.get('image')?.updateValueAndValidity()
    const reader:FileReader = new FileReader()
      reader.onload = () => {
        this.imagePreview = reader.result as string
      }
      reader.readAsDataURL(file)
  }
}
