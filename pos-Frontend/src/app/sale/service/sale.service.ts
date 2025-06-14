import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { StockMain } from '../../model/StockMain';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private apiUrl = environment.apiUrl + '/sale/';
  // private apiUrl = 'https://localhost:44394/api/sale/';
  constructor(private http: HttpClient) {}
  POSVRNOS(vrdate: string): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'posvrnos', { date: vrdate }).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
  //Saves the sale voucher
  SaveSale(data: StockMain): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'addSale', data).pipe(
      tap(() => {}),
      catchError(this.handleError)
    );
  }

  UpdateSale(data: StockMain): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'updateSale', data).pipe(
      tap(() => {}),
      catchError(this.handleError)
    );
  }

  DeleteSale(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteSale/${id}`).pipe(
      tap(() => {}),
      catchError(this.handleError)
    );
  }

  // sale.service.ts
  GetAllVouchers(): Observable<StockMain[]> {
    return this.http.get<StockMain[]>(this.apiUrl + 'getSales').pipe(
      tap((res: any) => {
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('SaleService error:', error);
    return throwError(() => error);
  }
}
