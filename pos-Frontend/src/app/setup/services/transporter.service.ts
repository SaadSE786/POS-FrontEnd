import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Transporter } from '../../model/Transporter';

@Injectable({
  providedIn: 'root'
})
export class TransporterService {
  private apiUrl = 'https://localhost:44394/api/setup/';
  constructor(private http: HttpClient) { }
  GetAllTransporter(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getTransporter').pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    )
  }
  SaveTransporter(data: Transporter): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'addTransporter', data).pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
  DeleteTransporter(transporterId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteTransporter/${transporterId}`).pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    )
  }
  UpdateTransporter(data: Transporter): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'updateTransporter', data).pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    )
  }
}
