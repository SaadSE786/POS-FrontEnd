import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../../model/LoginRequest';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  request = new LoginRequest();
  private apiUrl = environment.apiUrl + '/auth';
  constructor(private http: HttpClient) {}

  login(data: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(
        (res: any) => {},
        catchError((error) => {
          console.error('Error occurred during login:', error);
          return throwError(() => error);
        })
      )
    );
  }
}
