import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-stepper',
  standalone: true,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.css',
  imports: [MatButtonModule, MatInputModule, CommonModule],
})
export class StepperComponent implements OnInit {
  steps = ['cart', 'checkout', 'order-success'];
  stepIndex = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateStep(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateStep(event.url);
      }
    });
  }

  updateStep(url: string) {
    const currentStep = url.split('/').pop();
    this.stepIndex = this.steps.indexOf(currentStep || 'cart');
  }

  navigateToStep(index: number) {
    if (index < this.stepIndex) {
      this.router.navigate([`/${this.steps[index]}`]);
    }
  }
}
