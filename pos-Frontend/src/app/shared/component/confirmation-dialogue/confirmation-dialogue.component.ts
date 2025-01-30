import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialogue',
  templateUrl: './confirmation-dialogue.component.html',
  styleUrl: './confirmation-dialogue.component.scss'
})
export class ConfirmationDialogueComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
