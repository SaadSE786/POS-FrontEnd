import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../model/User';
import { tap, Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private apiUrl = 'https://localhost:44394/api/setup/';
  private apiUrl = environment.apiUrl + '/setup/';
  constructor(private http: HttpClient) {}

  SaveUser(data: User): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'addUser', data).pipe(
      tap((res: any) => {
        // You can handle success here if needed
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  GetAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getUser').pipe(
      tap((res: any) => {
        // You can handle success here if needed
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  DeleteUser(userId?: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteUser/${userId}`).pipe(
      tap((res: any) => {
        // You can handle success here if needed
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  UpdateUser(data: User): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'updateUser', data).pipe(
      tap((res: any) => {
        // You can handle success here if needed
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  GetUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getUserById/${userId}`).pipe(
      tap((res: any) => {
        // You can handle success here if needed
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
}
