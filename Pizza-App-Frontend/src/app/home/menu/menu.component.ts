import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CartService } from 'src/app/customer/cart.service';
import { Menu } from './menu.model';
import { MenuService } from './menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit,OnDestroy {
  userIsAuthenticated: boolean = false
  private authListenerSubs!: Subscription
  menus!: Menu[];
  menuUpdates!: Subscription;
  @Output() userIsAdmin: boolean = false

  constructor(private menuService: MenuService,private authService: AuthService,private cartService: CartService,private router: Router,private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.menuService.getMenuItems()
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(
      (isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated
      }
    )
    this.menuUpdates = this.menuService.getMenuUpdates().subscribe(
      (menu: Menu[]) => {
        this.menus = menu
      }
    )

    if (this.userIsAuthenticated) {
      const id = this.authService.getUserId()
      this.authService.getUser(id).subscribe(
        (user) => {
          if (user.role === 'admin') {
            this.userIsAdmin = true
          }
        }
      )
    }
  }

  onAdd(menu: Menu) {
    if (this.userIsAuthenticated) {
      this.notifierService.notify("success", "Item Added To Cart")
      this.cartService.addToCart(menu)
      setTimeout(() => {
        this.notifierService.hideNewest()
      },1000)
    } else {
      this.router.navigate(['/login'])
    }
  }

  onDelete(id: string) {
    this.menuService.deleteMenuItem(id)
      .subscribe(
        (deletedMenu: Menu) => {
          const updatedMenuItems = this.menus.filter(menu => {
            return menu._id !== deletedMenu._id
          })
          this.menus = updatedMenuItems
        })
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe()
  }
}
