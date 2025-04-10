import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { product } from '../Models/product.model';
import { AuthService } from './auth.service';
import { productCart } from '../Models/productCart.model';
import { NgToastService } from 'ng-angular-popup';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private cartSubject = new BehaviorSubject<productCart[]>([]);
  cart$ = this.cartSubject.asObservable();

  private cartSubtotalSubject = new BehaviorSubject<number>(0);
  cartSubtotal$ = this.cartSubtotalSubject.asObservable();

  private checkoutSubject = new BehaviorSubject<productCart[]>([]);
  checkoutData$ = this.checkoutSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toast: NgToastService
  ) {
    this.authService.isLoggedIn$.subscribe((status) => {
      this.isLoggedInSubject.next(status);
      console.log(`[CartService] User login status: ${status}`);
      this.loadCart();
    });
  }

  /*** Helper Methods ***/
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private getGuestCart(): productCart[] {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    console.log('[CartService] Loaded guest cart:', cart);
    return cart;
  }

  private saveGuestCart(cart: productCart[]): void {
    if (cart.length === 0) {
      console.log('[CartService] Guest cart cleared.');
      localStorage.removeItem('cart');
    } else {
      console.log('[CartService] Guest cart saved:', cart);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (error.status != 404)
        console.error(`[CartService] ${operation} failed:`, error);
      return of(result as T);
    };
  }

  private calculateDiscountedPrice(price: number, sale?: number): number {
    return sale ? price * (1 - sale / 100) : price;
  }

  /*** Cart Operations ***/
  private loadCart(): void {
    console.log('[CartService] Loading cart...');
    this.getCart().subscribe();
  }

  private mapToProductCart(p: any): productCart {
    return {
      id: p._id,
      name: p.productName,
      image: p.productImage,
      price: p.productPrice,
      quantity: p.productQuantity,
      subtotal: p.productPrice * p.productQuantity,
      color: p.productColor,
    };
  }

  getCart(): Observable<productCart[]> {
    if (this.isLoggedInSubject.getValue()) {
      console.log('[CartService] Fetching cart for logged-in user...');
      return this.http
        .get<{ data: { products: any[]; totalPrice: number } }>(this.apiUrl, {
          headers: this.getAuthHeaders(),
        })
        .pipe(
          map(({ data }) => {
            console.log('[CartService] Cart data received:', data);
            this.cartSubtotalSubject.next(data.totalPrice);
            return data.products.map((p) => this.mapToProductCart(p));
          }),
          tap((cart) => {
            console.log('[CartService] Updated cart:', cart);
            this.cartSubject.next(cart);
          }),
          catchError(this.handleError<productCart[]>('getCart', []))
        );
    } else {
      console.log('[CartService] Fetching guest cart...');
      const guestCart = this.getGuestCart();
      this.cartSubject.next(guestCart);
      this.cartSubtotalSubject.next(
        guestCart.reduce((sum, p) => sum + p.subtotal, 0)
      );
      return of(guestCart);
    }
  }

  addProduct(product: product, quantity: number = 1): void {
    console.log(`[CartService] Adding product to cart: ${product.name}`);

    if (!this.isLoggedInSubject.getValue()) {
      this.handleGuestAddProduct(product, quantity);
      return;
    }

    const body = [
      {
        productId: product.id,
        quantity,
        color: product.color,
      },
    ];

    this.http
      .post(this.apiUrl, body, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.handleError('addProduct')))
      .subscribe({
        next: (response: any) => {
          console.log('[CartService] Add product response:', response);

          if (response.status !== 'success') return;

          const cartProducts = response.data.products.map((p: productCart) =>
            this.mapToProductCart(p)
          );

          this.cartSubject.next(cartProducts);
          this.cartSubtotalSubject.next(response.data.totalPrice);

          this.toast.success(`${product.name} added to cart successfully.`);
        },
      });
  }

  private handleGuestAddProduct(product: product, quantity: number): void {
    let cart = [...this.cartSubject.getValue()];
    // const price = this.calculateDiscountedPrice(product.price, product.sale);

    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      subtotal: product.price * product.quantity,
    });

    this.saveGuestCart(cart);
    this.cartSubject.next(cart);
    this.cartSubtotalSubject.next(cart.reduce((sum, p) => sum + p.subtotal, 0));

    console.log('[CartService] Product added for guest user:', cart);
    this.toast.success(`${product.name} added to cart successfully.`);
  }

  removeProduct(productId: string, color?: string): void {
    console.log(`[CartService] Removing product ID: ${productId}`);
    this.modifyQuantity(productId, 0, true, color);
  }

  private modifyQuantity(
    productId: string,
    change: number,
    remove = false,
    color?: string
  ): void {
    let cart = [...this.cartSubject.getValue()];
    let productName = '';

    const product = cart.find((p) => p.id === productId);
    if (product) {
      productName = product.name;
      if (remove) {
        cart = cart.filter((p) => p.id !== productId);
      } else {
        product.quantity += change;
        product.subtotal = product.quantity * product.price;
        if (product.quantity <= 0) {
          cart = cart.filter((p) => p.id !== productId);
        }
      }
    }

    if (this.isLoggedInSubject.getValue()) {
      // Logged-in users: Send API request
      this.http
        .patch(
          this.apiUrl,
          { productId, quantity: remove ? 0 : product?.quantity || 0, color },
          { headers: this.getAuthHeaders() }
        )
        .pipe(
          catchError((error) => {
            this.toast.danger(
              remove
                ? `Failed to remove ${productName} from cart.`
                : `Failed to update ${productName} quantity.`
            );
            return this.handleError('modifyQuantity')(error);
          })
        )
        .subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              this.cartSubject.next(cart);
              this.cartSubtotalSubject.next(
                cart.reduce((sum, p) => sum + p.subtotal, 0)
              );

              const message = remove
                ? `${productName} has been removed from the cart.`
                : `${productName} quantity updated successfully.`;
              this.toast.success(message);
            }
          },
        });
    } else {
      this.saveGuestCart(cart);
      this.cartSubject.next(cart);
      this.cartSubtotalSubject.next(
        cart.reduce((sum, p) => sum + p.subtotal, 0)
      );
      const message = remove
        ? `${productName} has been removed from the cart.`
        : `${productName} quantity updated successfully.`;
      this.toast.success(message);
    }
  }

  increaseQuantity(productId: string): void {
    console.log(
      `[CartService] Increasing quantity for product ID: ${productId}`
    );
    this.modifyQuantity(productId, 1);
  }

  decreaseQuantity(productId: string): void {
    console.log(
      `[CartService] Decreasing quantity for product ID: ${productId}`
    );
    this.modifyQuantity(productId, -1);
  }

  isInCart(productId: string): boolean {
    const exists = this.cartSubject.getValue().some((p) => p.id === productId);
    console.log(
      `[CartService] Checking if product ${productId} is in cart: ${exists}`
    );
    return exists;
  }

  clearCart(): void {
    console.log('[CartService] Clearing cart...');
    this.cartSubject.next([]);
    localStorage.removeItem('cart');
    this.cartSubtotalSubject.next(0);
  }
  private updateCartState(cart: productCart[]): void {
    // Update the cart items
    this.cartSubject.next(cart);

    // Calculate new subtotal
    const newSubtotal = cart.reduce((sum, p) => sum + p.subtotal, 0);
    this.cartSubtotalSubject.next(newSubtotal);

    // Persist guest cart
    if (!this.isLoggedInSubject.getValue()) {
      this.saveGuestCart(cart);
    }

    console.log('[CartService] Cart state updated:', cart);
  }

  addProductWithColor(product: product, quantity: number): void {
    if (this.isLoggedInSubject.getValue()) {
      console.log('juiyvuyyyyyyyyyyyyyyyyyyy', product.color);
      this.http
        .post(
          this.apiUrl,
          [
            {
              productId: product.id,
              quantity,
              color: product.color,
            },
          ],
          { headers: this.getAuthHeaders() }
        )
        .pipe(catchError(this.handleError('addProductWithColor')))
        .subscribe({
          next: (response: any) => {
            if (response.status === 'success') {
              const cartProducts = response.data.products.map(
                (p: productCart) => this.mapToProductCart(p)
              );
              console.log(cartProducts);
              this.cartSubject.next(cartProducts);
              this.cartSubtotalSubject.next(response.data.totalPrice);

              this.toast.success(
                `${product.name} (${product.color}) added to cart successfully`
              );
            }
          },
        });
    } else {
      this.handleGuestAddProductWithColor(product, quantity, product.price);
      this.toast.success(
        `${product.name} (${product.color}) added to cart successfully`
      );
    }
  }

  removeColorVariant(productId: string, color: string): void {
    this.removeProduct(productId, color);
    // const cart = this.cartSubject.getValue();
    // const product = cart.find((p) => p.id === productId && p.color === color);
    // console.log(cart);
    // console.log(productId);
    // console.log(color);
    // if (product) {
    //   const filteredCart = cart.filter(
    //     (p) => !(p.id === productId && p.color === color)
    //   );
    //   this.updateCartState(filteredCart);
    //   this.toast.success(`${product.name} (${color}) removed from the cart`);
    // }
  }

  private handleGuestAddProductWithColor(
    product: product,
    quantity: number,
    price: number
  ): void {
    const cart = [...this.cartSubject.getValue()];
    const existing = cart.find(
      (p) => p.id === product.id && p.color === product.color
    );

    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = existing.quantity * price;
    } else {
      cart.push({
        ...product,
        price,
        quantity,
        subtotal: price * quantity,
        color: product.color,
      });
    }

    this.updateCartState(cart);
  }

  isColorInCart(productId: string, colorName: string): boolean {
    const cart = this.cartSubject.getValue();
    console.log('[isColorInCart]', cart);
    console.log(cart);
    return cart.some(
      (item) => item.id === productId && item.color === colorName
    );
  }
  isUserLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }
}
