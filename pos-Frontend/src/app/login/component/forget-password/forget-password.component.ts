import {
  Component,
  signal,
  ElementRef,
  ViewChildren,
  QueryList,
  computed,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.scss',
})
export class ForgetPasswordComponent {
  @ViewChildren('codeInput') codeInputs!: QueryList<ElementRef>;
  // Signals for reactive state
  isLoading = signal(false);
  emailSent = signal(false);
  submittedEmail = signal('');
  codeVerified = signal(false);
  verificationCode = signal(['', '', '', '']);
  hideNewPassword = signal(true);
  hideConfirmPassword = signal(true);
  passwordResetComplete = signal(false);

  // Computed signal for form validation
  isCodeComplete = computed(() => {
    return this.verificationCode().every((digit) => digit !== '');
  });

  forgotPasswordForm: FormGroup;
  passwordResetForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.passwordResetForm = this.fb.group(
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
      { validators: this.passwordMatchValidator }
    );
  }
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
      const email = this.forgotPasswordForm.value.email;

      // Simulate API call
      setTimeout(() => {
        this.submittedEmail.set(email);
        this.emailSent.set(true);
        this.isLoading.set(false);

        // Here you would call your forgot password service
        // this.authService.forgotPassword(email).subscribe({...});
      }, 2000);
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

      // Update input values
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

      // Simulate API call for code verification
      setTimeout(() => {
        this.isLoading.set(false);

        // For demo purposes, accept any 4-digit code
        // In real app, you'd call your verification service
        this.codeVerified.set(true);

        // Redirect to reset password page or show success
        console.log('Code verified:', code);
        // this.router.navigate(['/auth/reset-password'], { queryParams: { token: 'verified' } });
      }, 1500);
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
    if (this.passwordResetForm.valid) {
      this.isLoading.set(true);
      const { newPassword } = this.passwordResetForm.value;

      // Simulate API call for password reset
      setTimeout(() => {
        this.isLoading.set(false);
        this.passwordResetComplete.set(true);

        // Redirect to login after showing success message
        setTimeout(() => {
          this.router.navigate(['/auth/signin']);
        }, 3000);

        // In real app, you'd call your password reset service
        // this.authService.resetPassword(newPassword, token).subscribe({
        //   next: () => {
        //     this.passwordResetComplete.set(true);
        //     setTimeout(() => {
        //       this.router.navigate(['/auth/signin']);
        //     }, 3000);
        //   },
        //   error: (error) => {
        //     console.error('Password reset failed:', error);
        //   }
        // });
      }, 2000);
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
