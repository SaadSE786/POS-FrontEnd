import {
  Component,
  signal,
  ElementRef,
  ViewChildren,
  QueryList,
  computed,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ForgotPassword } from '../../../model/ForgotPassword';
import { LoginService } from '../../services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VerificationCode } from '../../../model/VerificationCode';
import { ResetPassword } from '../../../model/ResetPassword';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetPasswordComponent {
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;

  // Modern dependency injection
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);
  private readonly snackBar = inject(MatSnackBar);

  // Signals for reactive state management
  protected readonly isLoading = signal(false);
  protected readonly emailSent = signal(false);
  protected readonly submittedEmail = signal('');
  protected readonly codeVerified = signal(false);
  protected readonly verificationCode = signal(['', '', '', '']);
  protected readonly hideNewPassword = signal(true);
  protected readonly hideConfirmPassword = signal(true);
  protected readonly passwordResetComplete = signal(false);
  protected readonly userId = signal<number | null>(null);
  protected readonly errorMessage = signal('');

  // Computed signals for derived state
  protected readonly isCodeComplete = computed(() => {
    return this.verificationCode().every((digit) => digit !== '');
  });

  // Forms with modern initialization
  protected readonly forgotPasswordForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  protected readonly passwordResetForm: FormGroup = this.fb.group(
    {
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator.bind(this) }
  );
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');

      const email = this.forgotPasswordForm.value.email;
      const forgotPasswordRequest = new ForgotPassword();
      forgotPasswordRequest.email = email;

      this.loginService.forgotPassword(forgotPasswordRequest).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.snackBar.open(
              `Email has been sent successfully to ${response.verificationCode.user.varEmail}`,
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success'],
              }
            );

            // Store user ID for later use in password reset
            this.userId.set(response.verificationCode.user.intUserId);
            this.submittedEmail.set(response.verificationCode.user.varEmail);
            this.emailSent.set(true);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error occurred during forgot password:', error);
          this.isLoading.set(false);
          this.errorMessage.set(
            error.error?.message || 'Failed to send verification email'
          );
          this.snackBar.open(this.errorMessage(), 'Close', {
            duration: 5000,
            panelClass: ['snackbar-error'],
          });
        },
      });
    }
  }

  resendEmail(): void {
    if (this.submittedEmail()) {
      this.isLoading.set(true);

      // Simulate resend API call
      setTimeout(() => {
        this.isLoading.set(false);
        // Show success message or toast
        console.log('Verification email resent to:', this.submittedEmail());
      }, 1500);
    }
  }

  onCodeInput(event: any, index: number): void {
    const input = event.target;
    const value = input.value;

    // Update the verification code signal
    const currentCode = this.verificationCode();
    currentCode[index] = value;
    this.verificationCode.set([...currentCode]);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = this.codeInputs.toArray()[index + 1];
      if (nextInput) {
        nextInput.nativeElement.focus();
      }
    }

    // Auto-submit when all fields are filled
    if (currentCode.every((digit) => digit !== '')) {
      this.verifyCode();
    }
  }

  onCodeKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Handle backspace
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = this.codeInputs.toArray()[index - 1];
      if (prevInput) {
        prevInput.nativeElement.focus();
      }
    }

    // Allow only numbers
    if (
      !/[0-9]/.test(event.key) &&
      !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(
        event.key
      )
    ) {
      event.preventDefault();
    }
  }
  onCodePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text');

    if (pastedData && /^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      this.verificationCode.set(digits);

      setTimeout(() => {
        this.codeInputs.forEach((input, index) => {
          input.nativeElement.value = digits[index];
        });

        // Focus last input
        const lastInput = this.codeInputs.toArray()[3];
        if (lastInput) {
          lastInput.nativeElement.focus();
        }

        // Auto-verify if all digits are entered
        this.verifyCode();
      }, 0);
    }
  }

  verifyCode(): void {
    const code = this.verificationCode().join('');

    if (code.length === 4) {
      this.isLoading.set(true);

      const verificationRequest = new VerificationCode();
      verificationRequest.code = code;
      verificationRequest.email = this.submittedEmail(); // Include email for verification

      this.loginService.verifyCode(verificationRequest).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.snackBar.open('Verification code is correct!', 'Close', {
            duration: 1000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['snackbar-success'],
          });
          this.codeVerified.set(true);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.snackBar.open(
            'Invalid verification code. Please try again.',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            }
          );
          this.clearCode();
        },
      });
    }
  }

  clearCode(): void {
    this.verificationCode.set(['', '', '', '']);
    this.codeInputs.forEach((input) => {
      input.nativeElement.value = '';
    });

    // Focus first input
    const firstInput = this.codeInputs.toArray()[0];
    if (firstInput) {
      firstInput.nativeElement.focus();
    }
  }

  goBackToEmail(): void {
    this.emailSent.set(false);
    this.codeVerified.set(false);
    this.verificationCode.set(['', '', '', '']);
  }

  // Password reset methods
  toggleNewPasswordVisibility(): void {
    this.hideNewPassword.set(!this.hideNewPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }
  onPasswordReset(): void {
    if (this.passwordResetForm.valid && this.userId()) {
      this.isLoading.set(true);

      const resetPasswordRequest = new ResetPassword();
      resetPasswordRequest.newPassword =
        this.passwordResetForm.value.newPassword;
      resetPasswordRequest.userId = this.userId()!;

      console.log('Reset Password Request:', resetPasswordRequest);

      this.loginService.resetPassword(resetPasswordRequest).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.snackBar.open(
              'Password reset successfully. Redirecting to login...',
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: ['snackbar-success'],
              }
            );
            this.isLoading.set(false);
            this.passwordResetComplete.set(true);

            // Redirect to login after a short delay
            setTimeout(() => {
              this.router.navigate(['/auth/signin']);
            }, 2000);
          }
        },
        error: (error) => {
          console.error('Password reset error:', error);
          this.snackBar.open(
            error.error?.message || 'Password reset failed. Please try again.',
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['snackbar-error'],
            }
          );
          this.isLoading.set(false);
        },
      });
    } else {
      this.snackBar.open(
        'Please fill in all required fields correctly.',
        'Close',
        {
          duration: 3000,
          panelClass: ['snackbar-error'],
        }
      );
    }
  }

  getPasswordStrength(): string {
    const password = this.passwordResetForm.get('newPassword')?.value || '';

    if (password.length === 0) return '';
    if (password.length < 6) return 'Weak';

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength < 3) return 'Weak';
    if (strength < 4) return 'Medium';
    return 'Strong';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    return `strength-${strength.toLowerCase()}`;
  }

  getPasswordStrengthPercentage(): number {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'Weak':
        return 33;
      case 'Medium':
        return 66;
      case 'Strong':
        return 100;
      default:
        return 0;
    }
  }

  // Password requirement check methods for template
  hasMinLength(): boolean {
    const password = this.passwordResetForm.get('newPassword')?.value || '';
    return password.length >= 8;
  }

  hasUppercase(): boolean {
    const password = this.passwordResetForm.get('newPassword')?.value || '';
    return /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.passwordResetForm.get('newPassword')?.value || '';
    return /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.passwordResetForm.get('newPassword')?.value || '';
    return /[0-9]/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.passwordResetForm.get('newPassword')?.value || '';
    return /[@$!%*?&]/.test(password);
  }
}
