import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../../model/LoginRequest';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ForgotPassword } from '../../model/ForgotPassword';
import { ResetPassword } from '../../model/ResetPassword';
import { VerificationCode } from '../../model/VerificationCode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl + '/auth';

  login(data: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      catchError((error) => {
        console.error('Error occurred during login:', error);
        return throwError(() => error);
      })
    );
  }

  forgotPassword(forgotPasswordRequest: ForgotPassword): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/forgot-password`, forgotPasswordRequest)
      .pipe(
        catchError((error) => {
          console.error('Error occurred during forgot password:', error);
          return throwError(() => error);
        })
      );
  }

  verifyCode(verificationCodeRequest: VerificationCode): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/verify-code`, verificationCodeRequest)
      .pipe(
        catchError((error) => {
          console.error('Error occurred during code verification:', error);
          return throwError(() => error);
        })
      );
  }

  resetPassword(resetPasswordRequest: ResetPassword): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/reset-password`, resetPasswordRequest)
      .pipe(
        catchError((error) => {
          console.error('Error occurred during reset password:', error);
          return throwError(() => error);
        })
      );
  }
}
