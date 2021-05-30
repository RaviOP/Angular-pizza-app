import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Menu } from '../menu.model';
import { MenuService } from '../menu.service';
import { mimeType } from '../mime-type.validator';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css']
})
export class MenuEditComponent implements OnInit {
  menuEditForm!: FormGroup;
  imagePreview!: string;
  id!: string;
  menu!: Observable<Menu>;

  constructor(private fb: FormBuilder, private menuService: MenuService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!

    this.menuEditForm = this.fb.group({
      'name': new FormControl('', [Validators.required]),
      'price': new FormControl('', [Validators.required]),
      'size': new FormControl('', [Validators.required]),
      'image': new FormControl(
        '',
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

    this.menu = this.menuService.getMenuItem(this.id).pipe(
      tap((menu: Menu) => {
        this.menuEditForm.patchValue({
          'name': menu.name,
          'price': menu.price,
          'size': menu.size,
          'image': menu.image
        })
        this.imagePreview = menu.image
      })
    )
  }

  onSubmit() {
    if (this.menuEditForm.invalid) {
      return
    }
    const menu = {
      name: this.menuEditForm.value.name,
      price: this.menuEditForm.value.price,
      size: this.menuEditForm.value.size
    }
    this.menuService.updateMenuItem(this.id,menu,this.menuEditForm.value.image)
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.menuEditForm.patchValue(
      {
        image: file
      }
    )
    this.menuEditForm.get('image')?.updateValueAndValidity()
    const reader: FileReader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }

}
