import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Level1 } from '../../model/Level1';
import { Level2 } from '../../model/Level2';
import { Level3 } from '../../model/Level3';


@Injectable({
  providedIn: 'root'
})
export class ChartOfAccountService {
  private apiUrl = 'https://localhost:44394/api/setup/';

  constructor(private http: HttpClient, private matSnackBar: MatSnackBar) { }

  //Level 1 API's
  SaveLevel1(data: Level1): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'addLevel1', data).pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
  GetAllLevel1(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getLevel1').pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
  DeleteLevel1(level1Id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteLevel1/${level1Id}`).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }
      )
    );
  }
  UpdateLevel1(data: Level1): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'updateLevel1', data).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }
      )
    );
  }

  //Level 2 API's
  GetAllLevel2(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getLevel2').pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
  SaveLevel2(data: Level2): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'addLevel2', data).pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  DeleteLevel2(level2Id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteLevel2/${level2Id}`).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }
      )
    );
  }
  UpdateLevel2(data: Level2): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'updateLevel2', data).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }
      )
    );
  }
  //Level 3 API's
  GetAllLevel3(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'getLevel3').pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }
  SaveLevel3(data: Level3): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'addLevel3', data).pipe(
      tap((res: any) => {

      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      })
    );
  }

  DeleteLevel3(level3Id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}deleteLevel3/${level3Id}`).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }
      )
    );
  }
  UpdateLevel3(data: Level3): Observable<any> {
    return this.http.put<any>(this.apiUrl + 'updateLevel3', data).pipe(
      tap((res: any) => {
      }),
      catchError((error) => {
        console.error('Error occurred:', error);
        return throwError(() => error);
      }
      )
    );
  }
}
