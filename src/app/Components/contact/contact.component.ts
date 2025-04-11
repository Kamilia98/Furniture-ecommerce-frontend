import { Component, inject } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderBannerComponent } from '../shared/header-banner/header-banner.component';
import { FeatureBannerComponent } from '../shared/feature-banner/feature-banner.component';
import { ButtonComponent } from '../shared/button/button.component';
import { ContactService } from '../../Services/contact.service';
import { InputComponent } from '../shared/input/input.component';
import { ContactConfirmModalComponent } from '../modals/contact-confim-modal/contact-confirm-modal.component';
import { ModalService } from '../../Services/modal.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderBannerComponent,
    FeatureBannerComponent,
    ButtonComponent,
    InputComponent,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  message: string = '';
  isSuccess: boolean = false;
  isLoading: boolean = false;

  contactForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    subject: new FormControl<string>(''),
    message: new FormControl<string>('', [Validators.required]),
  });

  constructor(
    private contactService: ContactService,
    private modalService: ModalService
  ) {
    this.contactService.message$.subscribe((response) => {
      if (response) {
        this.message = response.message;
        this.isSuccess = response.isSuccess;
      }
    });
  }

  onSubmit() {
    this.modalService.show(ContactConfirmModalComponent, {
      isSuccess: true,
      title: 'Thank you for reaching out!',
      message: 'We will get back to you as soon as we can.',
      buttonText: 'Continue Shopping',
    });
    // if (this.contactForm.valid) {
    //   this.isLoading = true; // Set loading to true

    //   const formValues = this.contactForm.value;
    //   const contactData = {
    //     name: formValues.name ?? '',
    //     email: formValues.email ?? '',
    //     subject: formValues.subject ?? '',
    //     message: formValues.message ?? '',
    //   };

    //   this.contactService.sendMessage(contactData).subscribe({
    //     next: () => {
    //       this.isLoading = false; // Reset loading
    //       this.modalService.show(ContactConfirmModalComponent, {
    //         isSuccess: true,
    //         title: 'Thank you for reaching out!',
    //         message: 'We will get back to you as soon as we can.',
    //         buttonText: 'Continue Shopping',
    //       });
    //       this.contactForm.reset();
    //     },
    //     error: () => {
    //       this.isLoading = false; // Reset loading
    //       this.modalService.show(ContactConfirmModalComponent, {
    //         isSuccess: false,
    //         title: 'Something went wrong!',
    //         message: 'Please try again later.',
    //         buttonText: 'Try Again',
    //       });
    //     },
    //   });
    // } else {
    //   this.message = 'Please fill all fields correctly.';
    //   this.isSuccess = false;
    // }
  }
}
