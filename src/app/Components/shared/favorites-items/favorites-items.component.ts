import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../Services/cart.service';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../button/button.component';
import { Observable, map } from 'rxjs';
import { FavoriteService } from '../../../Services/favorite.service';
import { productCart } from '../../../Models/productCart.model';
import { productFavorite } from '../../../Models/productFavorite.model';
@Component({
  selector: 'app-favorites-items',
  imports: [ButtonComponent, CommonModule, RouterModule],
  templateUrl: './favorites-items.component.html',
  styleUrl: './favorites-items.component.css',
})
export class FavoritesItemsComponent implements OnInit {
  favorites$!: Observable<productFavorite[]>;
  favoritesLength$!: Observable<number>;
  cart$!: Observable<productCart[]>;

  constructor(
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
    this.favorites$ = this.favoriteService.favorites$;
    this.favoritesLength$ = this.favoriteService.favorites$.pipe(
      map((favorites) => favorites.length)
    );
  }
}
