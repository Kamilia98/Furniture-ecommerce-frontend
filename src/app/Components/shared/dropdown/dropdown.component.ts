import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="absolute w-full top-full right-0 bg-white min-w-max rounded-md p-2 mt-2 z-10 shadow"
    >
      <ul class="flex flex-col">
        <li
          *ngFor="let item of normalizedItems"
          (click)="selectItem(item)"
          class="p-2 duration-300 ease-in-out cursor-pointer rounded-md hover:bg-secondary"
        >
          {{ item.value }}
        </li>
      </ul>
    </div>
  `,
})
export class DropdownComponent implements OnInit {
  @Input() items: { id: string; value: string }[] | string[] = [];
  @Output() selectedValueChange = new EventEmitter<{
    id: string;
    value: string;
  }>();
  normalizedItems!: { id: string; value: string }[];

  ngOnInit(): void {
    this.normalizedItems = this.items.map((item, index) =>
      typeof item === 'string' ? { id: String(index), value: item } : item
    );
  }

  selectItem(item: { id: string; value: string }) {
    this.selectedValueChange.emit(item as { id: string; value: string });
  }
}
