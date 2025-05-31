import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartOfAccountService } from '../../services/chart-of-account.service';
import { Level1 } from '../../../model/Level1';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogueComponent } from '../../../shared/component/confirmation-dialogue/confirmation-dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { Level2 } from '../../../model/Level2';
import { Level2Dto } from '../../../model/DTO/Level2Dto';
import { Level3 } from '../../../model/Level3';
import { Level3Dto } from '../../../model/DTO/Level3Dto';


@Component({
  selector: 'app-chart-of-account',
  templateUrl: './chart-of-account.component.html',
  styleUrl: './chart-of-account.component.scss'
})

export class ChartOfAccountComponent implements OnInit {
  level1Form!: FormGroup;
  level2Form!: FormGroup;
  level3Form!: FormGroup;
  btnLevel1: string = 'ADD';
  btnLevel2: string = 'ADD';
  btnLevel3: string = 'ADD';
  level1: Level1 = new Level1();
  level2: Level2 = new Level2();
  level3: Level3 = new Level3();
  level2Dto: Level2Dto = new Level2Dto();
  level3Dto: Level3Dto = new Level3Dto();

  dataSource = new MatTableDataSource<Level1>();
  dataSource2 = new MatTableDataSource<Level2Dto>();
  dataSource3 = new MatTableDataSource<Level3Dto>();
  displayedColumnsLevel1: string[] = ['intLevel1Id', 'varLevel1Name', 'intCreatedBy', 'actions'];
  displayedColumnsLevel2: string[] = ['intLevel2Id', 'varLevel2Name', 'varLevel1Name', 'intCreatedBy', 'actions'];
  displayedColumnsLevel3: string[] = ['intLevel3Id', 'varLevel3Name', 'varLevel2Name', 'intCreatedBy', 'actions'];
  drpLevel1: Level1[] = [];
  drpLevel2: Level2[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatPaginator) paginator3!: MatPaginator;


  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private chartOfAccountService: ChartOfAccountService, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.level1Form = this.fb.group({
      level1Id: [0],
      level1Name: ['', Validators.required]
    });
    this.level2Form = this.fb.group({
      level2Id: [0],
      level2Name: ['', Validators.required],
      level1Id: [0, Validators.required]
    });
    this.level3Form = this.fb.group({
      level3Id: [0],
      level3Name: ['', Validators.required],
      level2Id: ['', Validators.required]
    });
    this.fetchLevel1s();
    this.fetchLevel2s();
    this.fetchLevel3s();
  }
  // Level 1 implementation
  fetchLevel1s(): void {
    this.chartOfAccountService.GetAllLevel1().subscribe({
      next: (res) => {
        debugger;
        console.log(res);
        if (res.status === 200) {
          this.dataSource = new MatTableDataSource(res.levels);
          this.drpLevel1 = res.levels;
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        this.snackbar.open('Failed to fetch levels', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
      },
    });
  }
  onEditLevel1(element: Level1) {
    this.btnLevel1 = 'UPDATE';
    this.level1Form.patchValue({
      level1Id: element.intLevel1Id,
      level1Name: element.varLevel1Name
    });
  }

  async onDeleteLevel1(element: Level1): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      data: {
        message: `Are you sure you want to delete this ${element.varLevel1Name} ?`
      }
    })
    const confirmDelete = await dialogRef.afterClosed().toPromise();
    if (confirmDelete) {
      this.chartOfAccountService.DeleteLevel1(element.intLevel1Id).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.snackbar.open('Level Deleted Successfully', 'Close', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success']
            });
            this.fetchLevel1s();
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
  SaveLevel1() {
    if (this.level1Form.valid) {
      this.level1.intLevel1Id = this.level1Form.get('level1Id')?.value;
      this.level1.varLevel1Name = this.level1Form.get('level1Name')?.value;
      this.level1.intCompanyId = 1;
      this.level1.intCreatedBy = 1;
      this.level1.intUpdatedBy = 1;
      if (this.level1.intLevel1Id) {
        this.chartOfAccountService.UpdateLevel1(this.level1).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Level Updated Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              });
              this.resetLevel1Form();
              this.fetchLevel1s();
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
        this.chartOfAccountService.SaveLevel1(this.level1).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Level Added Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              });
              this.resetLevel1Form();
              this.fetchLevel1s();
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
  resetLevel1Form() {
    this.level1Form.reset({
      level1Id: 0,
      level1Name: ''
    });
    this.level1Form.markAsPristine();
    this.level1Form.markAsUntouched();
    this.level1Form.updateValueAndValidity();
  }

  // Level 2 implementation
  fetchLevel2s(): void {
    this.chartOfAccountService.GetAllLevel2().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.dataSource2 = new MatTableDataSource(res.levels);
          this.drpLevel2 = res.levels;
          this.dataSource2.paginator = this.paginator2;
        }
      },
      error: (err) => {
        this.snackbar.open('Failed to fetch levels', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
      },
    });
  }

  onEditLevel2(element: Level2) {
    this.btnLevel2 = 'UPDATE';
    this.level2Form.patchValue({
      level2Id: element.intLevel2Id,
      level2Name: element.varLevel2Name,
      level1Id: element.intLevel1Id
    });
  }

  async onDeleteLevel2(element: Level2): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      data: {
        message: `Are you sure you want to delete this ${element.varLevel2Name} ?`
      }
    })
    const confirmDelete = await dialogRef.afterClosed().toPromise();
    if (confirmDelete) {
      this.chartOfAccountService.DeleteLevel2(element.intLevel2Id).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.snackbar.open('Level Deleted Successfully', 'Close', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success']
            });
            this.fetchLevel2s();
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
  SaveLevel2() {
    if (this.level2Form.valid) {
      console.log(this.level2Form.value);
      debugger;
      this.level2.intLevel2Id = this.level2Form.get('level2Id')?.value;
      this.level2.varLevel2Name = this.level2Form.get('level2Name')?.value;
      this.level2.intLevel1Id = this.level2Form.get('level1Id')?.value;
      this.level2.intCreatedBy = 1;
      this.level2.intUpdatedBy = 1;
      console.log(this.level2);
      if (this.level2.intLevel2Id) {
        this.chartOfAccountService.UpdateLevel2(this.level2).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Level Updated Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              });
              this.resetLevel2Form();
              this.fetchLevel2s();
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
        this.chartOfAccountService.SaveLevel2(this.level2).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Level Added Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              });
              this.resetLevel2Form();
              this.fetchLevel2s();
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
  resetLevel2Form() {
    this.level2Form.reset({
      level2Id: 0,
      level2Name: '',
      level1Id: 0
    });
    this.level2Form.markAsPristine();
    this.level2Form.markAsUntouched();
    this.level2Form.updateValueAndValidity();
  }
  // Level 3 implementation
  fetchLevel3s(): void {
    this.chartOfAccountService.GetAllLevel3().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.dataSource3 = new MatTableDataSource(res.levels);
          this.dataSource3.paginator = this.paginator3;
        }
      },
      error: (err) => {
        this.snackbar.open('Failed to fetch levels', 'Close', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['snackbar-error'] });
      },
    });
  }

  onEditLevel3(element: Level3) {
    this.btnLevel3 = 'UPDATE';
    this.level3Form.patchValue({
      level3Id: element.intLevel3Id,
      level3Name: element.varLevel3Name,
      level2Id: element.intLevel2Id
    });
  }

  async onDeleteLevel3(element: Level3): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      data: {
        message: `Are you sure you want to delete this ${element.varLevel3Name} ?`
      }
    })
    const confirmDelete = await dialogRef.afterClosed().toPromise();
    if (confirmDelete) {
      this.chartOfAccountService.DeleteLevel3(element.intLevel3Id).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.snackbar.open('Level Deleted Successfully', 'Close', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success']
            });
            this.fetchLevel3s();
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
  SaveLevel3() {
    if (this.level3Form.valid) {
      this.level3.intLevel3Id = this.level3Form.get('level3Id')?.value;
      this.level3.varLevel3Name = this.level3Form.get('level3Name')?.value;
      this.level3.intLevel2Id = this.level3Form.get('level2Id')?.value;
      this.level3.intCreatedBy = 1;
      this.level3.intUpdatedBy = 1;
      if (this.level3.intLevel3Id) {
        this.chartOfAccountService.UpdateLevel3(this.level3).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Level Updated Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              });
              this.resetLevel3Form();
              this.fetchLevel3s();
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
        this.chartOfAccountService.SaveLevel3(this.level3).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Level Added Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success']
              });
              this.resetLevel3Form();
              this.fetchLevel3s();
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
  resetLevel3Form() {
    this.level3Form.reset({
      level3Id: 0,
      level3Name: '',
      level2Id: 0
    });
    this.level3Form.markAsPristine();
    this.level3Form.markAsUntouched();
    this.level3Form.updateValueAndValidity();
  }
}
