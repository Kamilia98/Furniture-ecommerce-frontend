import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { RouterModule } from '@angular/router';
import {
  trigger,
  transition,
  animate,
  style,
  state,
} from '@angular/animations';

import { FavoriteService } from '../../../Services/favorite.service';
import { CartService } from '../../../Services/cart.service';
import { product } from '../../../Models/product.model';
import { productCart } from '../../../Models/productCart.model';
import { Subscription } from 'rxjs';
import { ComparisonService } from '../../../Services/comparison.service';

@Component({
  selector: 'app-product-item',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterModule],
  providers: [CurrencyPipe],
  templateUrl: './product-item.component.html',
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateY(0%)', opacity: 1 })),
      state(
        'out',
        style({ transform: 'translateY(100%)', opacity: 0, display: 'none' })
      ),
      transition('in <=> out', [animate('300ms ease-in-out')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemComponent implements OnInit, OnDestroy {
  @Input({ required: true }) product!: product;

  isHovered = false;
  showActions = false;

  isInCartState = false;
  isFavoriteState = false;

  private subs = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private favoriteService: FavoriteService,
    private cartService: CartService,
    private ComparisonService: ComparisonService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.cartService.cart$.subscribe((cart) => {
        this.isInCartState = cart.some((item) => item.id === this.product.id);
        this.cdr.markForCheck();
      })
    );

    this.subs.add(
      this.favoriteService.favorites$.subscribe((favorites) => {
        this.isFavoriteState = favorites.some(
          (fav) => fav.id === this.product.id
        );
        this.cdr.markForCheck();
      })
    );
  }

  toggleFavourites(): void {
    this.favoriteService.toggleFavourite(this.product.id).subscribe();
  }

  toggleCart(): void {
    if (this.isInCartState) {
      this.cartService.removeProduct(this.product.id);
    } else {
      this.cartService.addProduct(this.product);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.showActions) {
      this.isHovered = true;
      this.cdr.markForCheck();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (!this.showActions) {
      this.isHovered = false;
      this.cdr.markForCheck();
    }
  }

  isNewProduct(): boolean {
    if (!this.product?.date) return false;
    const productDate = new Date(this.product.date).getTime();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return productDate > oneMonthAgo.getTime();
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/images/mainsofa.png';
  }
  onAddToComparison(): void {
    if (this.product) {
      console.log('Adding to comparison:', this.product.id);
      this.ComparisonService.addToComparison(
        this.product.id,
        this.product.name
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
