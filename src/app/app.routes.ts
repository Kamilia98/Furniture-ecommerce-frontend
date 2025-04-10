import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { RootComponent } from './Components/root/root.component';
import { RegistrationComponent } from './Components/registration/registration.component';
import { ShopComponent } from './Components/shop/shop.component';
import { ProductComponent } from './Components/product/product.component';
import { CartComponent } from './Components/cart/cart.component';
import { CheckoutComponent } from './Components/checkout/checkout.component';
import { ContactComponent } from './Components/contact/contact.component';
import { BlogsComponent } from './Components/blogs/blogs.component';
import { BlogComponent } from './Components/blog/blog.component';
import { ErrorComponent } from './Components/error/error.component';
import { ComparisonComponent } from './Components/comparison/comparison.component';
import { SignupComponent } from './Components/registration/signup/signup.component';
import { LoginComponent } from './Components/registration/login/login.component';
import { FavoritesComponent } from './Components/favorites/favorites.component';

import { ForgotPasswordComponent } from './Components/registration/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './Components/registration/reset-password/reset-password.component';
import { AdminComponent } from './Components/admin/admin.component';
import { adminGuard } from './Guards/admin.guard';
import { authGuard } from './Guards/auth.guard';

import { ProfileComponent } from './Components/profile/profile.component';
import { SettingComponent } from './Components/profile/setting/setting.component';
import { OrdersComponent } from './Components/profile/orders/orders.component';
import { FavoritesItemsComponent } from './Components/shared/favorites-items/favorites-items.component';
import { PrivacyPolicyComponent } from './Components/help/privacy-policy/privacy-policy.component';
import { ReturnsComponent } from './Components/help/returns/returns.component';
import { PaymentOptionsComponent } from './Components/help/payment-options/payment-options.component';
import { OrderSuccessComponent } from './Components/order-success/order-success.component';
import { orderGuard } from './Guards/order.guard';
import { profileGuard } from './Guards/profile.guard';
import { checkoutGuard } from './Guards/checkout.guard';

export const routes: Routes = [
  {
    path: 'auth',
    component: RegistrationComponent,
    children: [
      { path: '', component: LoginComponent, canActivate: [authGuard] },
      { path: 'login', component: LoginComponent, canActivate: [authGuard] },
      { path: 'signup', component: SignupComponent, canActivate: [authGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'reset-password', component: ResetPasswordComponent },
      { path: '**', component: ErrorComponent },
    ],
  },
  {
    path: '',
    component: RootComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
      { path: 'home', component: HomeComponent },
      { path: 'shop', component: ShopComponent },
      { path: 'product/:id', component: ProductComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'blog/:id', component: BlogComponent },
      { path: 'comparison', component: ComparisonComponent },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'privacypolicy', component: PrivacyPolicyComponent },
      { path: 'returns', component: ReturnsComponent },
      { path: 'paymentoptions', component: PaymentOptionsComponent },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [profileGuard],
        children: [
          {
            path: '',
            component: OrdersComponent,
          },
          {
            path: 'orders',
            component: OrdersComponent,
          },
          {
            path: 'favorites',
            component: FavoritesItemsComponent,
          },
          {
            path: 'setting',
            component: SettingComponent,
          },
        ],
      },
      { path: 'cart', component: CartComponent },
      {
        path: 'checkout',
        component: CheckoutComponent,
        canActivate: [checkoutGuard],
      },
      {
        path: 'order-success',
        component: OrderSuccessComponent,
        canActivate: [orderGuard],
      },
      {
        path: 'order-complete',
        component: OrdersComponent,
        canActivate: [orderGuard],
      },
      { path: '**', component: ErrorComponent },
    ],
  },
];
