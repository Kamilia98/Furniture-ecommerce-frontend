import { Injectable } from '@angular/core';
import { product } from '../Models/product.model';
import { ProductDetails } from '../Models/product-details.model';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { catchError, tap, take, map, switchMap } from 'rxjs/operators';
import { environment } from '../environments/environment';

enum SortOptions {
  Default = 'Default',
  LowToHigh = 'Price: Low to High',
  HighToLow = 'Price: High to Low',
  Newest = 'Newest',
  Oldest = 'Oldest',
  AtoZ = 'Alphabetically: A to Z',
  ZtoA = 'Alphabetically: Z to A',
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  private productsSubject = new BehaviorSubject<product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Fetch products from API
  getProducts(
    page: number = 1,
    limit: number = 16,
    categories: string[] = [],
    sortBy: SortOptions = SortOptions.Default,
    minPrice?: number,
    maxPrice?: number
  ): Observable<any> {
    console.log('[ProductService] Fetching products with params:', {
      page,
      limit,
      categories,
      sortBy,
      minPrice,
      maxPrice,
    });

    if (minPrice === undefined || maxPrice === undefined) {
      console.log(
        '[ProductService] Fetching min/max price before proceeding...'
      );
      return combineLatest([this.getMinPrice(), this.getMaxPrice()]).pipe(
        switchMap(([fetchedMin, fetchedMax]) => {
          console.log('[ProductService] Min/Max price fetched:', {
            min: fetchedMin,
            max: fetchedMax,
          });
          return this.getProducts(
            page,
            limit,
            categories,
            sortBy,
            minPrice ?? fetchedMin,
            maxPrice ?? fetchedMax
          );
        })
      );
    }

    let url = `${this.apiUrl}?categories=${
      categories.length ? categories.join(',') : ''
    }&page=${page}&limit=${limit}&minPrice=${minPrice}&maxPrice=${maxPrice}`;
    console.log('[ProductService] the full data', url);

    switch (sortBy) {
      case SortOptions.LowToHigh:
        url += '&sortBy=price&order=asc';
        break;
      case SortOptions.HighToLow:
        url += '&sortBy=price&order=desc';
        break;
      case SortOptions.Newest:
        url += '&sortBy=date&order=desc';
        break;
      case SortOptions.Oldest:
        url += '&sortBy=date&order=asc';
        break;
      case SortOptions.AtoZ:
        url += '&sortBy=name&order=asc';
        break;
      case SortOptions.ZtoA:
        url += '&sortBy=name&order=desc';
        break;
    }

    console.log('[ProductService] API Request URL:', url);

    return this.http
      .get<{ data: { totalProducts: number; products: any[] } }>(url)
      .pipe(
        tap((response) => {
          console.log('[ProductService] Raw API response:', response);

          if (!response.data || !response.data.products) {
            console.error('[ProductService] Invalid API response:', response);
            return;
          }

          const apiProducts = response.data.products.map((p) => ({
            id: p._id,
            name: p.productName,
            image: p.productImage,
            subTitle: p.productSubtitle,
            price: p.productPrice,
            quantity: p.productQuantity,
            categories: p.productCategories.map(
              (cat: { catName: string }) => cat.catName
            ),
            date: p.productDate,
            sale: p.productSale,
            color: p.mainColor,
          }));

          console.log(
            '[ProductService] Transformed product data:',
            apiProducts
          );
          this.productsSubject.next(apiProducts);
        }),
        catchError((error) => {
          console.error('[ProductService] Error fetching products:', error);
          return of([]);
        })
      );
  }

  // Get a single product by ID
  getProduct(productId: string): Observable<ProductDetails> {
    console.log('[ProductService] Fetching product with ID:', productId);

    return this.http
      .get<{ status: string; data: { product: any } }>(
        `${this.apiUrl}/${productId}`
      )
      .pipe(
        tap((response) =>
          console.log('[ProductService] Raw product response:', response)
        ),
        map(({ data }) => ({
          id: data.product._id,
          productName: data.product.productName,
          productSubtitle: data.product.productSubtitle,
          productPrice: data.product.productPrice,
          productDate: data.product.productDate,
          productSale: data.product.productSale,
          productDescription: data.product.productDescription,
          brand: data.product.brand,

          productCategories: data.product.productCategories.map(
            (cat: string) => cat
          ),

          colors: data.product.colors.map((color: any) => ({
            name: color.name,
            hex: color.hex,
            quantity: color.quantity,
            sku: color.sku,
            mainImage: color.images.length > 0 ? color.images[0].url : null,
            galleryImages: color.images.map((img: any) => img.url),
          })),

          additionalInformation: data.product.additionalInformation || {},
        })),
        tap((product) =>
          console.log('[ProductService] Transformed product:', product)
        ),

        catchError((error) => {
          console.error('[ProductService] Error fetching product:', error);
          return of(null as unknown as ProductDetails);
        })
      );
  }

  getMinPrice(): Observable<number> {
    console.log('[ProductService] Fetching minimum price...');
    return this.http
      .get<{ data: { minEffectivePrice: number } }>(`${this.apiUrl}/min-price`)
      .pipe(
        tap((response) =>
          console.log('[ProductService] Min price response:', response)
        ),
        map((response) => response.data?.minEffectivePrice ?? 0),
        catchError((error) => {
          console.error('[ProductService] Error fetching min price:', error);
          return of(0);
        })
      );
  }

  getMaxPrice(): Observable<number> {
    console.log('[ProductService] Fetching maximum price...');
    return this.http
      .get<{ data: { maxEffectivePrice: number } }>(`${this.apiUrl}/max-price`)
      .pipe(
        tap((response) =>
          console.log('[ProductService] Max price response:', response)
        ),
        map((response) => response.data?.maxEffectivePrice ?? 0),
        catchError((error) => {
          console.error('[ProductService] Error fetching max price:', error);
          return of(0);
        })
      );
  }

  searchProducts(query: string): Observable<{ id: string; value: string }[]> {
    console.log('[ProductService] Searching for products with query:', query);

    if (!query.trim()) return of([]);

    return this.http
      .get<{ data: any[] }>(`${this.apiUrl}/search?query=${query}`)
      .pipe(
        tap((response) =>
          console.log('[ProductService] Search response:', response)
        ),
        map((response) =>
          response.data.map((p) => ({ id: p._id, value: p.productName }))
        ),
        catchError((error) => {
          console.error('[ProductService] Search error:', error);
          return of([]);
        })
      );
  }
}
