import { Component, ViewChild, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../../../model/User';
import { MatTabGroup } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { UserService } from '../../services/user.service';
import { ConfirmationDialogueComponent } from '../../../shared/component/confirmation-dialogue/confirmation-dialogue.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  btnItem: string = 'SAVE USER';
  pageTitle: string = 'ADD USER';
  hidePassword = true;
  user: User = new User();
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'intUserId',
    'varName',
    'varEmail',
    'varPassword',
    'varContactNo',
    'actions',
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('tabGroup') tabGroup!: MatTabGroup;
  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private userService: UserService
  ) {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      intUserId: [0],
      varName: ['', Validators.required],
      varEmail: ['', Validators.required],
      varAddress: [''],
      varPassword: ['', Validators.required],
      varCnic: [''],
      varContactNo: [''],
      varPhoto: [''],
    });
    this.fetchUser();
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  maskPassword(password: string): string {
    return password ? '*'.repeat(password.length) : '';
  }

  onTabChange(event: MatTabChangeEvent): void {
    switch (event.index) {
      case 0:
        this.pageTitle = 'ADD USER';
        break;
      case 1:
        this.pageTitle = 'USER LIST';
        break;
    }
  }
  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        this.userForm.patchValue({ varPhoto: base64String });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.userForm.patchValue({ varPhoto: '' });
  }

  fetchUser(): void {
    this.userService.GetAllUsers().subscribe({
      next: (res) => {
        if (res.status === 200) {
          this.dataSource = new MatTableDataSource(res.users);
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        this.snackbar.open('Failed to fetch Warehouses', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      },
    });
  }
  saveUser() {
    if (this.userForm.valid) {
      debugger;
      this.user.intUserId = this.userForm.get('intUserId')?.value;
      this.user.varName = this.userForm.get('varName')?.value;
      this.user.varEmail = this.userForm.get('varEmail')?.value;
      this.user.varPassword = this.userForm.get('varPassword')?.value;
      this.user.varAddress = this.userForm.get('varAddress')?.value;
      this.user.varContactNo = this.userForm.get('varContactNo')?.value;
      this.user.varCnic = this.userForm.get('varCnic')?.value;
      this.user.varPhoto = this.userForm.get('varPhoto')?.value;
      this.user.intCompanyId = 1;

      if (this.user.intUserId) {
        this.userService.UpdateUser(this.user).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Item Updated Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success'],
              });
              this.resetUserForm();
              this.fetchUser();
            }
          },
          error: (error) => {
            if (error.status === 401) {
              this.snackbar.open('Unauthorized access', 'Close', {
                duration: 2500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-error'],
              });
            } else {
              this.snackbar.open('An unexpected error occurred', 'Close', {
                duration: 2500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-error'],
              });
            }
          },
        });
      } else {
        this.userService.SaveUser(this.user).subscribe({
          next: (res: any) => {
            if (res.status === 200) {
              this.snackbar.open('Level Updated Successfully', 'Close', {
                duration: 1500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success'],
              });
              this.resetUserForm();
              this.fetchUser();
            }
          },
          error: (error) => {
            if (error.status === 401) {
              this.snackbar.open('Unauthorized access', 'Close', {
                duration: 2500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-error'],
              });
            } else {
              this.snackbar.open('An unexpected error occurred', 'Close', {
                duration: 2500,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-error'],
              });
            }
          },
        });
      }
    }
  }
  resetUserForm() {
    this.userForm.reset({
      intUserId: 0,
      varName: '',
      varEmail: '',
      varAddress: '',
      varPassword: '',
      varCnic: '',
      varContactNo: '',
      varPhoto: '',
    });
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.userForm.updateValueAndValidity();
    this.btnItem = 'SAVE ITEM';
  }
  onEditUser(element: User) {
    this.btnItem = 'UPDATE';

    this.userForm.patchValue({
      intUserId: element.intUserId,
      varName: element.varName,
      varEmail: element.varEmail,
      varAddress: element.varAddress,
      varPassword: element.varPassword,
      varCnic: element.varCnic,
      varContactNo: element.varContactNo,
      varPhoto: element.varPhoto,
    });
    this.tabGroup.selectedIndex = 0;
  }
  async onDeleteItem(element: User): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
      data: {
        message: `Are you sure you want to delete this ${element.varName} ?`,
      },
    });
    const confirmDelete = await dialogRef.afterClosed().toPromise();
    if (confirmDelete) {
      this.userService.DeleteUser(element.intUserId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.snackbar.open('Level Deleted Successfully', 'Close', {
              duration: 1500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
            this.fetchUser();
          }
        },
        error: (error) => {
          if (error.status === 401) {
            this.snackbar.open('Unauthorized access', 'Close', {
              duration: 2500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            });
          } else {
            this.snackbar.open('An unexpected error occurred', 'Close', {
              duration: 2500,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            });
          }
        },
      });
    }
  }
}
