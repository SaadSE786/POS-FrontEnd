import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TransporterService } from '../../services/transporter.service';
import { ConfirmationDialogueComponent } from '../../../shared/component/confirmation-dialogue/confirmation-dialogue.component';
import { Transporter } from '../../../model/Transporter';
@Component({
  selector: 'app-add-transporter',
  templateUrl: './add-transporter.component.html',
  styleUrl: './add-transporter.component.scss'
})
export class AddTransporterComponent implements OnInit {
  transporterForm!: FormGroup;
  btnAdd = 'Add Transporter';
  transporter: Transporter = new Transporter();
  datasource = new MatTableDataSource<Transporter>();
  displayedColumns: string[] = ['intTransporterId', 'varTransporterName', 'varContactNo', 'varAddress', 'varEmail', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private fb: FormBuilder, private transporterService: TransporterService, private snackbar: MatSnackBar, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.transporterForm = this.fb.group({
      intTransporterId: [0],
      varTransporterName: ['', Validators.required],
      varContactNo: ['', Validators.required],
      varAddress: ['', Validators.required],
      varEmail: ['', [Validators.required, Validators.email]],
    });
    this.fetchTransporter();
  }
  fetchTransporter() {
    this.transporterService.GetAllTransporter().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.datasource = new MatTableDataSource(res.transporter);
          this.datasource.paginator = this.paginator;
        }
      },
      error: (err) => {
        this.snackbar.open('Failed to fetch transporters', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
      },
    })
  }

  SaveTransporter() {
    if (this.transporterForm.valid) {
      this.transporter.intTransporterId = this.transporterForm.get('intTransporterId')?.value;
      this.transporter.varTransporterName = this.transporterForm.get('varTransporterName')?.value;
      this.transporter.varContactNo = this.transporterForm.get('varContactNo')?.value;
      this.transporter.varAddress = this.transporterForm.get('varAddress')?.value;
      this.transporter.varEmail = this.transporterForm.get('varEmail')?.value;
      this.transporter.intCompanyId = 1;
      this.transporter.intCreatedBy = 1;
      this.transporter.intUpdatedBy = 1;
      if (this.transporter.intTransporterId) {
        this.transporterService.UpdateTransporter(this.transporter).subscribe({
          next: (res) => {
            if (res.status === 200) {
              this.snackbar.open('Transporter updated successfully', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-success'] });
              this.resetTransporterForm();
              this.fetchTransporter();
            }
          },
          error: (err) => {
            this.snackbar.open('Failed to update transporter', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
          },
        });
      }
      else {
        this.transporterService.SaveTransporter(this.transporter).subscribe({
          next: (res) => {
            if (res.status === 200) {
              this.snackbar.open('Transporter added successfully', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-success'] });
              this.resetTransporterForm();
              this.fetchTransporter();
            }
          },
          error: (err) => {
            this.snackbar.open('Failed to add transporter', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
          },
        });
      }

    }
  }
  onEditTransporter(transporter: Transporter) {
    this.transporterForm.patchValue({
      intTransporterId: transporter.intTransporterId,
      varTransporterName: transporter.varTransporterName,
      varContactNo: transporter.varContactNo,
      varAddress: transporter.varAddress,
      varEmail: transporter.varEmail
    });
    this.btnAdd = 'Update Transporter';
  }
  onDeleteTransporter(transporter: Transporter) {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      width: '250px',
      data: { title: 'Delete Transporter', message: 'Are you sure you want to delete this transporter?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transporterService.DeleteTransporter(transporter.intTransporterId).subscribe({
          next: (res) => {
            if (res.status === 200) {
              this.snackbar.open('Transporter deleted successfully', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-success'] });
              this.fetchTransporter();
            }
          },
          error: (err) => {
            this.snackbar.open('Failed to delete transporter', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
          },
        });
      }
    });
  }

  resetTransporterForm() {
    this.transporterForm.reset({
      intTransporterId: 0,
      varTransporterName: '',
      varContactNo: '',
      varAddress: '',
      varEmail: ''
    });
    this.transporterForm.markAsPristine();
    this.transporterForm.markAsUntouched();
    this.transporterForm.updateValueAndValidity();
    this.btnAdd = 'Add Transporter';
  }
}
