import { ChangeDetectorRef, Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NgToastModule } from 'ng-angular-popup';
import { ToasterPosition } from 'ng-angular-popup';
import { map, Observable } from 'rxjs';
import { User } from '../../Models/user.model';
import { FavoriteService } from '../../Services/favorite.service';
import { CartService } from '../../Services/cart.service';
import { AuthService } from '../../Services/auth.service';
import { UserService } from '../../Services/user.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ProductCart } from '../../Models/productCart.model';
import { ProductFavorite } from '../../Models/productFavorite.model';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    NgToastModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './root.component.html',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate(
          '0.5s cubic-bezier(.4,0,.2,1)',
          style({ transform: 'translateX(0%)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '0.5s cubic-bezier(.4,0,.2,1)',
          style({ transform: 'translateX(100%)' })
        ),
      ]),
    ]),
  ],
})
export class RootComponent {
  ToasterPosition = ToasterPosition;
  user$!: Observable<User | null>;
  cartProductsTotalPrice!: number;
  cartLength!: number;
  cart!: ProductCart[];
  favorites$!: Observable<ProductFavorite[]>;
  favoritesLength$!: Observable<number>;
  favModalShow = false;
  cartModalShow = false;
  isLoggedIn = false;

  constructor(
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
    });

    if (this.isLoggedIn) {
      this.user$ = this.userService.getUser();
      this.favorites$ = this.favoriteService.favorites$;
      this.favoritesLength$ = this.favoriteService.favorites$.pipe(
        map((favorites) => favorites.length)
      );
    }

    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.cartLength = this.cart.length;
    });

    this.cartService.cartSubtotal$.subscribe((subtotal) => {
      this.cartProductsTotalPrice = subtotal;
    });
  }

  deleteFavorite(id: string): void {
    this.favoriteService.toggleFavourite(id).subscribe({
      next: () => {
        this.cdr.markForCheck();
      },
    });
  }

  deleteCartProduct(id: string): void {
    this.cartService.removeProduct(id);
    this.cdr.markForCheck();
  }

  toggleFavModal(open: boolean): void {
    this.favModalShow = open;
    this.toggleBodyScroll(open);
  }

  toggleCartModal(open: boolean): void {
    this.cartModalShow = open;
    this.toggleBodyScroll(open);
  }

  private toggleBodyScroll(isOpen: boolean): void {
    document.body.style.overflowY = isOpen ? 'hidden' : 'auto';
    document.body.style.width = isOpen ? '100%' : '';
  }
}
