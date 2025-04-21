import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../shared/button/button.component';
import { StepperComponent } from '../shared/stepper/stepper.component';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, StepperComponent],
  templateUrl: './order-success.component.html',
})
export class OrderSuccessComponent {}
