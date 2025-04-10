import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { NgToastService } from 'ng-angular-popup';
import { environment } from '../environments/environment';

interface Order {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  private totalOrdersSubject = new BehaviorSubject<number>(0);
  totalOrders$ = this.totalOrdersSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private toast: NgToastService
  ) {}

  /***  AUTHORIZATION HEADER ***/
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /*** FETCH USER ORDERS & UPDATE SUBJECTS ***/
  getOrders(limit: number = 10, page: number = 1): void {
    this.http
      .get<{ data: { orders: any[]; totalOrders: number } }>(
        `${this.apiUrl}?limit=${limit}&page=${page}`,
        { headers: this.getAuthHeaders() }
      )
      .pipe(
        tap((response) => console.log('Orders fetched:', response.data.orders)),
        map((response) => ({
          orders: this.mapOrders(response.data.orders),
          totalOrders: response.data.totalOrders,
        })),
        catchError((error) => this.handleOrderError(error))
      )
      .subscribe((data) => {
        this.ordersSubject.next(data.orders);
        this.totalOrdersSubject.next(data.totalOrders);
      });
  }

  /*** API RESPONSE MAPPING  ***/
  private mapOrders(apiOrders: any[]): Order[] {
    return apiOrders.map((o) => ({
      orderNumber: o.orderNumber,
      status: o.status,
      total: parseFloat(o.total),
      createdAt: o.createdAt,
    }));
  }

  /*** ERROR HANDLING ***/
  private handleOrderError(
    error: any
  ): Observable<{ orders: Order[]; totalOrders: number }> {
    if (error.status !== 404) {
      console.error('Error fetching orders:', error);
      this.toast.danger('Failed to load orders. Please try again.');
    }
    return of({ orders: [], totalOrders: 0 });
  }
}
