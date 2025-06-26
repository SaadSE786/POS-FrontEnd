import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginRequest } from '../../../model/LoginRequest';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  request = new LoginRequest();
  isLoading = signal(false);

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private matSnackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.request.varEmail = this.loginForm.get('email')?.value;
      this.request.varPassword = this.loginForm.get('password')?.value;
      this.loginService.login(this.request).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.matSnackBar.open('Login Successfull', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
            this.isLoading.set(false);
            this.authService.setToken(response.token);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          this.matSnackBar.open(
            'Login failed. Please check your credentials.',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            }
          );
          this.isLoading.set(false);
          console.error('Login error:', error);
        },
      });
    }
  }
}
