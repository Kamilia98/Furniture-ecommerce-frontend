import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import Swiper from 'swiper';
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from 'swiper/modules';

import { CommonModule, UpperCasePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { ButtonComponent } from '../shared/button/button.component';
import { ProductItemComponent } from '../shared/product-item/product-item.component';
import { Observable } from 'rxjs';
import { product } from '../../Models/product.model';
import { CategoriesService } from '../../Services/categories.service';

@Component({
  selector: 'app-home',
  imports: [
    ButtonComponent,
    UpperCasePipe,
    ProductItemComponent,
    RouterModule,
    CommonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, AfterViewInit {
  products$!: Observable<product[]>;
  categories: any;

  @ViewChild('swiperRef', { static: false }) swiperRef!: ElementRef;
  @ViewChild('imageSwiper', { static: false }) imageSwiper!: ElementRef;
  @ViewChild('imageSwiper2', { static: false }) imageSwiper2!: ElementRef;

  constructor(
    private productService: ProductService,
    private categoriesService: CategoriesService,
    private cdr: ChangeDetectorRef,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.products$ = this.productService.products$;
    this.productService.getProducts(1, 10).subscribe({
      next: () => this.cdr.detectChanges(),
    });
    this.categoriesService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  ngAfterViewInit() {
    this.products$.subscribe((products) => {
      if (products?.length) {
        setTimeout(() => this.initSwipers(), 0);
      }
    });
  }

  private initSwipers(): void {
    new Swiper(this.swiperRef.nativeElement, {
      modules: [Navigation, EffectCoverflow, Pagination],
      effect: 'coverflow',
      centeredSlides: true,
      slidesPerView: 2,
      spaceBetween: 100,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      loop: true,
      coverflowEffect: {
        rotate: 40,
        stretch: 50,
        depth: 240,
        modifier: 1,
        slideShadows: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });

    new Swiper(this.imageSwiper.nativeElement, {
      modules: [Pagination, Autoplay],
      slidesPerView: 4,
      spaceBetween: 20,
      grid: {
        rows: 1,
        fill: 'row',
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      loop: true,
    });

    new Swiper(this.imageSwiper2.nativeElement, {
      modules: [Pagination, Autoplay],
      slidesPerView: 4,
      spaceBetween: 20,
      effect: 'slide',
      grid: {
        rows: 1,
        fill: 'row',
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        reverseDirection: true,
      },
      loop: true,
    });
  }
}
