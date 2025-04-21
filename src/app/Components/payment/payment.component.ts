import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CheckoutService } from '../../Services/checkout.service';
import {
  loadStripe,
  Stripe,
  StripeCardElement,
  StripeElements,
} from '@stripe/stripe-js';
import { ModalService } from '../../Services/modal.service';
import { PaymentFailedModalComponent } from '../modals/payment-failed-modal/payment-failed-modal.component';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
})
export class PaymentComponent implements OnInit {
  @ViewChild('cardElement') cardElement!: ElementRef;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;

  constructor(
    private checkoutService: CheckoutService,
    private modalService: ModalService,
  ) {}
  async ngOnInit() {
    this.stripe = await loadStripe(environment.stripePublishableKey);
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount(this.cardElement.nativeElement);
    }
  }
  async validatePaymentForm() {
    if (!this.stripe || !this.elements || !this.card) {
      console.error('Stripe.js not initialized.');
      return;
    }
    console.log('Client Secret:', this.checkoutService.clientSecret);
    const { paymentIntent, error } = await this.stripe.confirmCardPayment(
      this.checkoutService.clientSecret,
      {
        payment_method: {
          card: this.card,
        },
      },
    );

    if (error) {
      // console.error('Payment failed:', error);
      if (error.code === 'card_declined') {
        this.modalService.show(PaymentFailedModalComponent);
      } else {
        console.error('Other payment error:', error);
      }
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      console.log('Payment succeeded!');
      this.checkoutService.paymentIntentId = paymentIntent.id;
      this.checkoutService.paymentCompleted.next(true);
    }
  }

  resetCardElement() {
    if (this.card) {
      this.card.destroy();
      this.card = this.elements?.create('card') || null;
      if (this.card) {
        this.card.mount(this.cardElement.nativeElement);
      }
    }
  }
}
