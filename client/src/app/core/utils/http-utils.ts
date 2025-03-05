import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export function handleError<T>(operation = 'operation', result?: T) {
  return (error: HttpErrorResponse): Observable<T> => {
    console.error('Failed on ' + operation + '. Error details:');
    console.error(error);
    return throwError(() => error.message || error.statusText);
  };
}

export function handle404<T>(operation = 'operation', result?: T) {
  return (error: HttpErrorResponse): Observable<T> => {
    if (error.status === 404) {
      return throwError(() => '404 - Not Found');
    }
    console.error('Failed on ' + operation + '. Error details:');
    console.error(error);
    return throwError(() => error.message || error.statusText);
  };
}

export function handle500<T>(operation = 'operation', result?: T) {
  return (error: HttpErrorResponse): Observable<T> => {
    if (error.status === 500) {
      return throwError(() => '500 - Internal Server Error');
    }
    console.error('Failed on ' + operation + '. Error details:');
    console.error(error);
    return throwError(() => error.message || error.statusText);
  };
}

export function handle401<T>(operation = 'operation', result?: T) {
  return (error: HttpErrorResponse): Observable<T> => {
    if (error.status === 401) {
      return throwError(() => '401 - Unauthorized');
    }
    console.error('Failed on ' + operation + '. Error details:');
    console.error(error);
    return throwError(() => error.message || error.statusText);
  };
}
