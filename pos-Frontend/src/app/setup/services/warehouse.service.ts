import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Warehouse } from '../../model/Warehouse';

@Injectable({
  providedIn: 'root',
})
export class WarehouseService {
  // private apiUrl = 'https://localhost:44394/api/setup/';
  private apiUrl = '/api/setup/';
  constructor(private http: HttpClient) {}
  GetAllWarehouse(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getWarehouse').pipe(
      tap((res: any) => {}),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
  SaveWarehouse(data: Warehouse): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'addWarehouse', data).pipe(
      tap((res: any) => {}),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
  DeleteWarehouse(warehouseId: number): Observable<any> {
    return this.http
      .delete<any>(`${this.apiUrl}deleteWarehouse/${warehouseId}`)
      .pipe(
        tap((res: any) => {}),
        catchError((error) => {
          console.error('Error occurred:', error);
          return throwError(() => error);
        })
      );
  }
  UpdateWarehouse(data: Warehouse): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'updateWarehouse', data).pipe(
      tap((res: any) => {}),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
}
