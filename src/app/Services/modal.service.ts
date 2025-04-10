import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private dialog: MatDialog) {}

  show(component: any, data?: any) {
    this.dialog.open(component, {
      data,
      panelClass: 'custom-dialog',
    });
  }
}
