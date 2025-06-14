import {
  Component,
  HostListener,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { error } from 'console';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConfirmationDialogueComponent } from '../../../shared/component/confirmation-dialogue/confirmation-dialogue.component';
import { StockMain } from '../../../model/StockMain';
import { StockDetail } from '../../../model/StockDetail';
import { Item } from '../../../model/Item';
import { ItemService } from '../../../setup/services/item.service';
import { SaleService } from '../../service/sale.service';

@Component({
  selector: 'app-sale-voucher',
  templateUrl: './sale-voucher.component.html',
  styleUrl: './sale-voucher.component.scss',
})
export class SaleVoucherComponent implements OnInit {
  /**
   * ============================================================
   * ===================  DECLARATIONS     ======================
   * ============================================================
   * ============================================================
   */
  saleForm!: FormGroup;
  stockDetailForm!: FormGroup;
  btnDetail: string = 'Add';
  btnSave: string = 'Save Sale';
  pageTitle: string = 'Sale Voucher';
  stockMain: StockMain = new StockMain();
  dataSource = new MatTableDataSource<StockDetail>();
  btnAdd: string = 'Add';
  isEditMode = signal(false);
  editIndex: number | null = null;
  vrnos: number[] = [];
  drpItem: Item[] = [];
  stockDetailList: StockDetail[] = [];
  voucherListDataSource = new MatTableDataSource<StockMain>();
  voucherListDisplayedColumns: string[] = [
    'intVrno',
    'intVrnoA',
    'dtVrDate',
    'totalAmount',
    'dcDiscountAmount',
    'dcNetAmount',
    'actions',
  ];
  displayedColumns: string[] = [
    'intItemId',
    'varItemName',
    'intQuantity',
    'dcRate',
    'dcAmount',
    'dcDisc',
    'dcDiscAmount',
    'dcInclTaxAmount',
    'dcPurRate',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private itemService: ItemService,
    private saleService: SaleService
  ) {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.getAllVouchers();
    this.initForm();
    this.fetchItems();
    this.getVRNOs();
    this.stockDetailForm.valueChanges.subscribe((values) => {
      debugger;
      const itemId = values.intItemId;
      if (itemId) {
        const selectedItem = this.drpItem.find(
          (item) => item.intItemId === itemId
        );
        if (selectedItem) {
          this.stockDetailForm.patchValue(
            {
              dcRate: selectedItem.dcSellRate,
            },
            { emitEvent: false }
          );
          this.stockDetailForm.patchValue(
            {
              dcPurRate: selectedItem?.dcPurRate,
            },
            { emitEvent: false }
          );
          this.stockDetailForm.patchValue(
            {
              varItemName: selectedItem?.varItemName,
            },
            { emitEvent: false }
          );
        }
      }
      const qty = values.intQuantity || 0;
      const rate = values.dcRate || 0;
      const amount = qty * rate;

      const discP = values.dcDisc || 0;
      const discAmount = (amount * discP) / 100;
      const netAmount = amount - discAmount;
      this.stockDetailForm.patchValue(
        {
          dcAmount: amount,
          dcDiscAmount: discAmount,
          dcInclTaxAmount: netAmount,
        },
        { emitEvent: false }
      );
    });
    this.saleForm
      .get('dcDiscount')
      ?.valueChanges.subscribe((discountPercent) => {
        const totalAmount = this.getTotalAmount(); // method to get base total
        const discountAmount = (totalAmount * discountPercent) / 100;

        const expenses = this.saleForm.get('dcExpense')?.value || 0;
        const additionalCharges =
          this.saleForm.get('dcAdditionalCharges')?.value || 0;
        const netAmount =
          totalAmount + expenses + additionalCharges - discountAmount;
        this.saleForm.patchValue({
          dcDiscountAmount: discountAmount,
          dcNetAmount: netAmount,
        });
      });
    ['dcExpense', 'dcAdditionalCharges', 'dcDiscountAmount'].forEach(
      (field) => {
        this.saleForm.get(field)?.valueChanges.subscribe(() => {
          const totalAmount = this.saleForm.get('dcTotalAmount')?.value || 0;
          const discountAmount =
            this.saleForm.get('dcDiscountAmount')?.value || 0;
          const expenses = this.saleForm.get('dcExpense')?.value || 0;
          const additionalCharges =
            this.saleForm.get('dcAdditionalCharges')?.value || 0;
          const netAmount =
            totalAmount + expenses + additionalCharges - discountAmount;
          this.saleForm.patchValue({
            dcNetAmount: netAmount,
          });
        });
      }
    );
  }

  /**
   * =================================================================================
   * ===================  BASIC IMPlEMENTATION AND CALCULATION  ======================
   * =================================================================================
   * =================================================================================
   */

  getVRNOs(): void {
    const dateObj = this.saleForm.get('dtVrDate')?.value;

    const formattedDate = this.formatDate(dateObj); // e.g. "2025-05-09"

    this.saleService.POSVRNOS(formattedDate).subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.vrnos = res.data;
          this.saleForm.patchValue({
            intVrno: res.data[0],
            intVrnoA: res.data[1]
          });
        }
      },
    });
  }

  getTotalAmount(): number {
    return this.stockDetailList.reduce(
      (sum, item) => sum + (item.dcInclTaxAmount ?? 0),
      0
    );
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  initForm(): void {
    this.stockDetailForm = this.fb.group({
      intStid: [0],
      intItemId: [0],
      varItemName: [''],
      intQuantity: [0, [this.negativeValueValidator]],
      dcRate: [0, this.negativeValueValidator],
      dcAmount: [{ value: 0, disabled: true }, [this.negativeValueValidator]],
      dcDisc: [0, this.discountRangeValidator],
      dcDiscAmount: [{ value: 0, disabled: true }, this.negativeValueValidator],
      dcInclTaxAmount: [
        { value: 0, disabled: true },
        this.negativeValueValidator,
      ],
      varType: [''],
      dcPurRate: [0, this.negativeValueValidator],
    });
    this.saleForm = this.fb.group({
      intStid: [0],
      intVrno: [0, Validators.required],
      intVrnoA: [0, Validators.required],
      dtVrDate: [this.formatDate(new Date()), Validators.required],
      varRemarks: [''],
      varVrType: ['Cash_Sale'],
      dcDiscount: [
        0,
        [this.negativeValueValidator, this.discountRangeValidator],
      ],
      dcDiscountAmount: [
        { value: 0, disabled: true },
        [this.negativeValueValidator],
      ],
      dcExpense: [0, this.negativeValueValidator],
      dcAdditionalCharges: [0, this.negativeValueValidator],
      dcTotalAmount: [
        { value: 0, disabled: true },
        [this.negativeValueValidator],
      ],
      dcNetAmount: [
        { value: 0, disabled: true },
        [this.negativeValueValidator],
      ],
    });
  }

  get stockDetailArray(): FormArray {
    return this.stockDetailForm.get('details') as FormArray;
  }

  removeStockDetail(index: number): void {
    this.stockDetailArray.removeAt(index);
  }

  negativeValueValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    return control.value < 0 ? { negativeValue: true } : null;
  }

  calculateTotals(): void {
    let totalQty = 0;
    let totalAmount = 0;

    this.stockDetailList.forEach((item) => {
      totalQty += item.intQuantity || 0;
      totalAmount += item.dcInclTaxAmount || 0;
    });

    this.saleForm.patchValue({
      dcNetAmount: this.computeNetAmount(totalAmount),
      dcTotalAmount: totalAmount, // optionally store raw amount
    });

    this.saleForm.get('dcNetAmount')?.updateValueAndValidity();
  }
  computeNetAmount(totalAmount: number): number {
    const discountAmount = this.saleForm.get('dcDiscountAmount')?.value || 0;

    const expenses = this.saleForm.get('dcExpense')?.value || 0;
    const additionalCharges =
      this.saleForm.get('dcAdditionalCharges')?.value || 0;

    return totalAmount + expenses + additionalCharges - discountAmount;
  }

  discountRangeValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    return control.value < 0 || control.value > 100
      ? { discountRange: true }
      : null;
  }

  addItem(): void {
    if (this.stockDetailForm.valid) {
      const newItem = new StockDetail();
      newItem.intStid = this.stockDetailForm.get('intStid')?.value;
      newItem.intItemId = this.stockDetailForm.get('intItemId')?.value;
      newItem.varItemName = this.stockDetailForm.get('varItemName')?.value;
      newItem.intQuantity = this.stockDetailForm.get('intQuantity')?.value;
      newItem.dcRate = this.stockDetailForm.get('dcRate')?.value;
      newItem.dcAmount = this.stockDetailForm.get('dcAmount')?.value;
      newItem.dcDisc = this.stockDetailForm.get('dcDisc')?.value;
      newItem.dcDiscAmount = this.stockDetailForm.get('dcDiscAmount')?.value;
      newItem.dcInclTaxAmount =
        this.stockDetailForm.get('dcInclTaxAmount')?.value;
      newItem.varType = this.stockDetailForm.get('varType')?.value;
      newItem.dcPurRate = this.stockDetailForm.get('dcPurRate')?.value;

      if (this.editIndex !== null) {
        this.stockDetailList[this.editIndex] = newItem;
        this.editIndex = null;
        this.btnAdd = 'Add';
      } else {
        this.stockDetailList.push(newItem);
      }
      this.stockDetailForm.reset();
      this.dataSource.data = [...this.stockDetailList];
    }
    this.calculateTotals();
  }

  editItem(index: number) {
    const item = this.stockDetailList[index];
    this.stockDetailForm.patchValue({
      intStid: item.intStid,
      intItemId: item.intItemId,
      varItemName: item.varItemName,
      intQuantity: item.intQuantity,
      dcRate: item.dcRate,
      dcAmount: item.dcAmount,
      dcDisc: item.dcDisc,
      dcDiscAmount: item.dcDiscAmount,
      dcInclTaxAmount: item.dcInclTaxAmount,
      varType: item.varType,
      dcPurRate: item.dcPurRate,
    });
    this.editIndex = index;
    this.btnAdd = 'Update';
  }

  deleteItem(index: number) {
    this.stockDetailList.splice(index, 1);
    this.dataSource.data = [...this.stockDetailList];
  }

  fetchItems(): void {
    this.itemService.GetAllItems().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.drpItem = res.items;
        }
      },
      error: (err) => {
        this.snackbar.open('Failed to fetch Items', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.pageTitle = 'ADD SALE';
        break;
      case 1:
        this.pageTitle = 'SALE LIST';
        break;
    }
  }
  private handleHttpError(error: any): void {
    const msg =
      error.status === 401
        ? 'Unauthorized access'
        : 'An unexpected error occurred';
    this.snackbar.open(msg, 'Close', {
      duration: 2500,
      panelClass: ['snackbar-error'],
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }

  /**
   * ============================================================
   * ===================  CRUD OF VOUCHER  ======================
   * ============================================================
   * ============================================================
   */

  getAllVouchers(): void {
    this.saleService.GetAllVouchers().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.voucherListDataSource.data = res.sales;
          this.voucherListDataSource.filterPredicate = (
            data: any,
            filter: string
          ): boolean => {
            const vrnoMatch = data.intVrno?.toString().includes(filter);
            const remarksMatch = data.varRemarks
              ?.toLowerCase()
              .includes(filter);
            return vrnoMatch || remarksMatch;
          };
        }
      },
      error: (err) => {
        this.snackbar.open('Failed to fetch vouchers', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }

  saveVoucher(): void {
    debugger;
    if (this.saleForm.valid && this.stockDetailList.length > 0) {
      const main: StockMain = {
        ...this.saleForm.getRawValue(), // gets all values including disabled fields
        StockDetails: this.stockDetailList,
        intCompanyId: 1,
        intCreatedBy: 1,
        intUpdatedBy: 1,
      };

      if (main.intStid) {
        this.saleService.UpdateSale(main).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Sale Updated Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success'],
              });
              this.resetForm();
              this.getAllVouchers();
              this.tabGroup.selectedIndex = 1;
            }
          },
          error: this.handleHttpError.bind(this),
        });
      } else {
        this.saleService.SaveSale(main).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Sale Added Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success'],
              });
              this.resetForm();
              this.getAllVouchers();
              this.tabGroup.selectedIndex = 1;
            }
          },
          error: this.handleHttpError.bind(this),
        });
      }
    } else {
      if (this.stockDetailList.length === 0) {
        this.snackbar.open(
          'Please add at least one item to the sale',
          'Close',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-error'],
          }
        );
      } else {
        this.snackbar.open('Please complete all required fields.', 'Close', {
          duration: 2000,
          panelClass: ['snackbar-warning'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
      }
    }
  }

  resetForm(): void {
    this.saleForm.reset({
      intVrno: this.vrnos[0] || 0,
      intVrnoA: this.vrnos[1] || 0,
      dtVrDate: this.formatDate(new Date()),
      varRemarks: '',
      varVrType: 'Cash_Sale',
      dcDiscount: 0,
      dcExpense: 0,
      dcAdditionalCharges: 0,
      dcTotalAmount: 0,
      dcNetAmount: 0,
    });
    this.stockDetailForm.reset({
      intStid: 0,
      intItemId: 0,
      varItemName: '',
      intQuantity: 0,
      dcRate: 0,
      dcAmount: 0,
      dcDisc: 0,
      dcDiscAmount: 0,
      dcInclTaxAmount: 0,
      varType: '',
      dcPurRate: 0,
    });
    this.saleForm.markAsPristine();
    this.saleForm.markAsUntouched();
    this.saleForm.updateValueAndValidity();
    this.stockDetailForm.markAsPristine();
    this.stockDetailForm.markAsUntouched();
    this.stockDetailForm.updateValueAndValidity();
    this.stockDetailList = [];
    this.dataSource.data = [];
    this.editIndex = null;
    this.btnSave = 'Save Sale';
    this.btnAdd = 'Add';
    // this.initForm(); // reinitialize with default values
    this.getVRNOs(); // reload VRNOs
  }

  onEditVoucher(main: StockMain): void {
    console.log(main);
    this.saleForm.patchValue({
      ...main,
      dtVrDate: this.formatDate(main.dtVrDate ?? new Date()),
    });

    this.stockDetailList = main.stockDetails || [];
    this.dataSource.data = [...this.stockDetailList];
    this.btnSave = 'Update Sale';
    this.tabGroup.selectedIndex = 0;
  }
  async onDeleteVoucher(voucherId: number): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      data: { message: `Are you sure you want to delete this voucher?` },
    });
    const confirmDelete = await dialogRef.afterClosed().toPromise();
    if (confirmDelete) {
      this.saleService.DeleteSale(voucherId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.snackbar.open('Sale Deleted Successfully', 'Close', {
              duration: 1500,
              panelClass: ['snackbar-success'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
            this.resetForm();
            this.getAllVouchers();
          }
        },
        error: this.handleHttpError.bind(this),
      });
    }
  }
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.voucherListDataSource.filter = filterValue.trim().toLowerCase();
  }
}
