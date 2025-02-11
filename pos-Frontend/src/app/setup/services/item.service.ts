import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Item } from '../../model/Item';
import { tap, Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = 'https://localhost:44394/api/setup/';
  constructor(private http: HttpClient) { }
  SaveItem(data: Item): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'addItem', data).pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
  GetAllItems(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getItems').pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    )
  }
  DeleteItem(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteItem/${itemId}`).pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    )
  }
  UpdateItem(data: Item): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'updateItem', data).pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    )
  }
}
