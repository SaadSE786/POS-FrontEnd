import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { WarehouseService } from '../../services/warehouse.service';
import { Warehouse } from '../../../model/Warehouse';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogueComponent } from '../../../shared/component/confirmation-dialogue/confirmation-dialogue.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-warehouse',
  templateUrl: './add-warehouse.component.html',
  styleUrl: './add-warehouse.component.scss'
})
export class AddWarehouseComponent implements OnInit {
  warehouseForm!: FormGroup;
  btnAdd = 'Add Warehouse';
  warehouse: Warehouse = new Warehouse();
  datasource = new MatTableDataSource<Warehouse>();
  displayedColumns: string[] = ['intWarehouseId', 'varWarehouseName', 'intCreatedBy', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private fb: FormBuilder, private warehouseService: WarehouseService, private snackbar: MatSnackBar, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.warehouseForm = this.fb.group({
      intWarehouseId: [0],
      varWarehouseName: ['', Validators.required]
    });
    this.fetchWarehouse();
  }
  fetchWarehouse(): void {
    this.warehouseService.GetAllWarehouse().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.datasource = new MatTableDataSource(res.warehouses);
          this.datasource.paginator = this.paginator;
        }
      },
      error: (err) => {
        this.snackbar.open('Failed to fetch warehouses', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
      },
    });
  }
  SaveWarehouse() {
    if (this.warehouseForm.valid) {
      this.warehouse.intWarehouseId = this.warehouseForm.get('intWarehouseId')?.value;
      this.warehouse.varWarehouseName = this.warehouseForm.get('varWarehouseName')?.value;
      this.warehouse.intCompanyId = 1;
      this.warehouse.intCreatedBy = 1;
      this.warehouse.intUpdatedBy = 1;
      if (this.warehouse.intWarehouseId) {
        this.warehouseService.UpdateWarehouse(this.warehouse).subscribe({
          next: (res) => {
            if (res.status === 200) {
              this.snackbar.open(res.message, 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-success'] });
              this.resetWarehouseForm();
              this.fetchWarehouse();
            }
          },
          error: (err) => {
            this.snackbar.open('Failed to update warehouse', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
          },
        });
      }
      else {
        this.warehouseService.SaveWarehouse(this.warehouse).subscribe({
          next: (res) => {
            if (res.status === 200) {
              this.snackbar.open(res.message, 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-success'] });
              this.resetWarehouseForm();
              this.fetchWarehouse();
            }
          },
          error: (err) => {
            this.snackbar.open('Failed to save warehouse', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
          },
        });
      }
    }
  }
  onEditWarehouse(warehouse: Warehouse) {
    this.warehouseForm.patchValue({
      intWarehouseId: warehouse.intWarehouseId,
      varWarehouseName: warehouse.varWarehouseName
    });
    this.btnAdd = 'Update Warehouse';
  }
  async onDeleteWarehouse(element: Warehouse): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      data: {
        message: `Are you sure you want to delete this ${element.varWarehouseName} ?`
      }
    })
    const confirmDelete = await dialogRef.afterClosed().toPromise();
    if (confirmDelete) {
      this.warehouseService.DeleteWarehouse(element.intWarehouseId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.snackbar.open('Warehouse Deleted Successfully', 'Close', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success']
            });
            this.fetchWarehouse();
          }
        },
        error: (error) => {
          if (error.status === 401) {
            this.snackbar.open('Unauthorized access', 'Close', {
              duration: 2500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error']
            });
          } else {
            this.snackbar.open('An unexpected error occurred', 'Close', {
              duration: 2500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error']
            });
          }
        }
      })
    }
  }
  resetWarehouseForm() {
    this.warehouseForm.reset({
      intWarehouseId: 0,
      varWarehouse: ''
    });
    this.btnAdd = 'Add Warehouse';
    this.warehouseForm.markAsPristine();
    this.warehouseForm.markAsUntouched();
    this.warehouseForm.updateValueAndValidity();
  }
}
