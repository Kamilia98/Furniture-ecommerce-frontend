import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accordion',
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
})
export class AccordionComponent {
  @Input() title: string = '';
  isOpen: boolean = false;
  toggle() {
    this.isOpen = !this.isOpen;
  }
}
