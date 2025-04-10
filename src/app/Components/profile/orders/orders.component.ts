import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../Services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownComponent } from '../../shared/dropdown/dropdown.component';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

interface Order {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  imports: [CommonModule, FormsModule],
})
export class OrdersComponent implements OnInit {
  orders$!: Observable<Order[]>;
  totalOrders$!: Observable<number>;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orders$ = this.orderService.orders$;
    this.totalOrders$ = this.orderService.totalOrders$;
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getOrders();
  }
}
