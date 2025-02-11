import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { Item } from '../../../model/Item';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ItemService } from '../../services/item.service';
import { error } from 'console';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConfirmationDialogueComponent } from '../../../shared/component/confirmation-dialogue/confirmation-dialogue.component';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss'
})
export class AddItemComponent implements OnInit {
  itemForm!: FormGroup;
  btnItem: string = 'SAVE ITEM';
  pageTitle: string = 'ADD ITEM';
  item: Item = new Item();
  dataSource = new MatTableDataSource<Item>();
  displayedColumns: string[] = ['intItemId', 'varItemName', 'dcPurRate', 'dcSellRate', 'isActive', 'isExpirable', 'isTaxable', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  constructor(private fb: FormBuilder, private itemService: ItemService, private snackbar: MatSnackBar, private dialog: MatDialog) {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.itemForm = this.fb.group({
      intItemId: [null],
      varItemName: ['', Validators.required],
      dcOrderLevel: [null, this.negativeValueValidator],
      dcMinLevel: [null, this.negativeValueValidator],
      dcMaxLevel: [null, this.negativeValueValidator],
      dcOpenStock: [null, this.negativeValueValidator],
      dtOpenDate: [{ value: null, disabled: true }, Validators.required],
      dcPurRate: [null, [Validators.required, this.negativeValueValidator]],
      dcSellRate: [null, [Validators.required, this.negativeValueValidator]],
      dcRetailSaleRate: [null, this.negativeValueValidator],
      dcDistributorSaleRate: [null, this.negativeValueValidator],
      dcDiscount: [null, this.discountRangeValidator],
      isTaxable: [false],
      isExpirable: [false],
      dtExpiryDate: [{ value: null, disabled: true }, Validators.required],
      varUom: [''],
      isActive: [true]
    });

    this.itemForm.get('dcOpenStock')?.valueChanges.subscribe(value => {
      const openDateControl = this.itemForm.get('dtOpenDate');
      if (value > 0) {
        openDateControl?.enable();
        openDateControl?.setValidators(Validators.required);
      } else {
        openDateControl?.disable();
        openDateControl?.clearValidators();
      }
      openDateControl?.updateValueAndValidity();
    });

    this.itemForm.get('isExpirable')?.valueChanges.subscribe(value => {
      const expiryDateControl = this.itemForm.get('dtExpiryDate');
      if (value) {
        expiryDateControl?.enable();
        expiryDateControl?.setValidators(Validators.required);
      } else {
        expiryDateControl?.disable();
        expiryDateControl?.clearValidators();
      }
      expiryDateControl?.updateValueAndValidity();
    });
    this.fetchItems();
  }
  negativeValueValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return control.value < 0 ? { 'negativeValue': true } : null;
  }

  discountRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return control.value < 0 || control.value > 100 ? { 'discountRange': true } : null;
  }
  fetchItems(): void {
    this.itemService.GetAllItems().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.dataSource = new MatTableDataSource(res.items);
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        this.snackbar.open('Failed to fetch Warehouses', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
      },
    });
  }
  saveItem() {
    if (this.itemForm.valid) {
      debugger;
      this.item.intItemId = this.itemForm.get('intItemId')?.value;
      this.item.varItemName = this.itemForm.get('varItemName')?.value;
      this.item.dcOrderLevel = this.itemForm.get('dcOrderLevel')?.value;
      this.item.dcMinLevel = this.itemForm.get('dcMinLevel')?.value;
      this.item.dcMaxLevel = this.itemForm.get('dcMaxLevel')?.value;
      this.item.dcOpenStock = this.itemForm.get('dcOpenStock')?.value;
      this.item.dtOpenDate = this.itemForm.get('dtOpenDate')?.value;
      this.item.dcPurRate = this.itemForm.get('dcPurRate')?.value;
      this.item.dcSellRate = this.itemForm.get('dcSellRate')?.value;
      this.item.dcRetailSaleRate = this.itemForm.get('dcRetailSaleRate')?.value;
      this.item.dcDistributorSaleRate = this.itemForm.get('dcDistributorSaleRate')?.value;
      this.item.dcDiscount = this.itemForm.get('dcDiscount')?.value;
      this.item.isTaxable = this.itemForm.get('isTaxable')?.value;
      this.item.isExpirable = this.itemForm.get('isExpirable')?.value;
      this.item.dtExpiryDate = this.itemForm.get('dtExpiryDate')?.value;
      this.item.varUom = this.itemForm.get('varUom')?.value;
      this.item.isActive = this.itemForm.get('isActive')?.value;
      this.item.intCompanyId = 1;
      this.item.intCreatedBy = 1;
      this.item.intUpdatedBy = 1;
      if (this.item.intItemId) {
        this.itemService.UpdateItem(this.item).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Item Updated Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              });
              this.resetItemForm();
              this.fetchItems();
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
        });
      }
      else {
        this.itemService.SaveItem(this.item).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Level Updated Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              });
              this.resetItemForm();
              this.fetchItems();
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
        });
      }
    }
  }

  resetItemForm() {
    this.itemForm.reset({
      varItemName: '',
      dcOrderLevel: null,
      dcMinLevel: null,
      dcMaxLevel: null,
      dcOpenStock: null,
      dtOpenDate: { value: null, disabled: true },
      dcPurRate: null,
      dcSellRate: null,
      dcRetailSaleRate: null,
      dcDistributorSaleRate: null,
      dcDiscount: null,
      isTaxable: false,
      isExpirable: false,
      dtExpiryDate: { value: null, disabled: true },
      varUom: '',
      isActive: true
    });
    this.itemForm.markAsPristine();
    this.itemForm.markAsUntouched();
    this.itemForm.updateValueAndValidity();
  }
  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.pageTitle = 'ADD ITEM';
        break;
      case 1:
        this.pageTitle = 'ITEM LIST';
        break;
    }
  }

  async onDeleteItem(element: Item): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      data: {
        message: `Are you sure you want to delete this ${element.varItemName} ?`
      }
    })
    const confirmDelete = await dialogRef.afterClosed().toPromise();
    if (confirmDelete) {
      this.itemService.DeleteItem(element.intItemId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.snackbar.open('Level Deleted Successfully', 'Close', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success']
            });
            this.fetchItems();
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
  onEditItem(element: Item) {
    this.btnItem = 'UPDATE';
    const formatDate = (dateString: Date | null): string | null => {
      if (!dateString) return null;
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      return `${year}-${month}-${day}`;
    };

    const dtExpiryDate = formatDate(element.dtExpiryDate);
    const dtOpenDate = formatDate(element.dtOpenDate);

    console.log(dtOpenDate + "   " + element.dtOpenDate);

    this.itemForm.patchValue({
      intItemId: element.intItemId,
      varItemName: element.varItemName,
      dcOrderLevel: element.dcOrderLevel,
      dcMinLevel: element.dcMinLevel,
      dcMaxLevel: element.dcMaxLevel,
      dcOpenStock: element.dcOpenStock,
      dtOpenDate: dtOpenDate,
      dcPurRate: element.dcPurRate,
      dcSellRate: element.dcSellRate,
      dcRetailSaleRate: element.dcRetailSaleRate,
      dcDistributorSaleRate: element.dcDistributorSaleRate,
      dcDiscount: element.dcDiscount,
      isTaxable: element.isTaxable,
      isExpirable: element.isExpirable,
      dtExpiryDate: dtExpiryDate,
      varUom: element.varUom,
      isActive: element.isActive
    });

    if (element.dcOpenStock > 0) {
      this.itemForm.get('dtOpenDate')?.enable();
    } else {
      this.itemForm.get('dtOpenDate')?.disable();
    }

    if (element.isExpirable) {
      this.itemForm.get('dtExpiryDate')?.enable();
    } else {
      this.itemForm.get('dtExpiryDate')?.disable();
    }
    this.tabGroup.selectedIndex = 0;
  }
}
