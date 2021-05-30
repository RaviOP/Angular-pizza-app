import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Menu } from './menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  menu!: Menu[];
  menuUpdates = new Subject<Menu[]>();
  readonly ROOT_URL;

  constructor(private http: HttpClient, private router: Router) {
    // this.ROOT_URL = 'https://ravi-pizza-api.herokuapp.com/api/menus'
    // this.ROOT_URL = 'http://localhost:3000/api/menus';
    this.ROOT_URL = '/api/menus';
  }

  getMenuUpdates() {
    return this.menuUpdates.asObservable();
  }

  getMenuItem(id: string) {
    return this.http.get<Menu>(`${this.ROOT_URL}/${id}`);
  }

  getMenuItems() {
    this.http.get<Menu[]>(this.ROOT_URL).subscribe((menu: Menu[]) => {
      this.menu = menu;
      this.menuUpdates.next(menu);
    });
  }

  createMenuItem(
    menuData: { name: string; size: string; price: number },
    image: File
  ) {
    const menu = new FormData();
    menu.append('name', menuData.name);
    menu.append('size', menuData.size);
    menu.append('price', menuData.price.toString());
    menu.append('image', image, menuData.name);
    this.http.post<Menu>(this.ROOT_URL, menu).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  updateMenuItem(
    menuId: string,
    menuData: { name: string; size: string; price: number },
    image: File | string
  ) {
    let menuItem:
      | { name: string; price: number; size: string; image: string }
      | FormData;
    if (typeof image === 'object') {
      menuItem = new FormData();
      menuItem.append('name', menuData.name);
      menuItem.append('size', menuData.size);
      menuItem.append('price', menuData.price.toString());
      menuItem.append('image', image, menuData.name);
    } else {
      menuItem = {
        name: menuData.name,
        size: menuData.size,
        price: menuData.price,
        image: image,
      };
    }
    this.http
      .put<Menu>(`${this.ROOT_URL}/${menuId}`, menuItem)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deleteMenuItem(menuId: string) {
    return this.http.delete<Menu>(`${this.ROOT_URL}/${menuId}`);
  }
}
