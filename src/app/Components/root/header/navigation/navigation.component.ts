import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterModule],
  template: `
    <ul class="flex flex-col justify-center md:flex-row lg:gap-[40px]">
      <li
        class="ease cursor-pointer border-b border-gray px-[10px] leading-[40px] font-medium duration-300 hover:bg-secondary md:border-transparent md:hover:border-primary md:hover:bg-transparent"
        routerLink="/"
      >
        Home
      </li>

      <li
        class="ease cursor-pointer border-b border-gray px-[10px] leading-[40px] font-medium duration-300 hover:bg-secondary md:border-transparent md:hover:border-primary md:hover:bg-transparent"
        routerLink="/shop"
      >
        Shop
      </li>
      <li
        class="ease cursor-pointer border-b border-gray px-[10px] leading-[40px] font-medium duration-300 hover:bg-secondary md:border-transparent md:hover:border-primary md:hover:bg-transparent"
        routerLink="/blogs"
      >
        Blogs
      </li>
      <li
        class="ease cursor-pointer border-b border-gray px-[10px] leading-[40px] font-medium duration-300 hover:bg-secondary md:border-transparent md:hover:border-primary md:hover:bg-transparent"
        routerLink="/contact"
      >
        Contact
      </li>
    </ul>
  `,
})
export class NavigationComponent {}
