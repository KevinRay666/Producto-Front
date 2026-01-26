import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { URL_LOGIN } from '@env/environments';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private LOGIN_URL = URL_LOGIN.URL_LOGIN;
  private tokenKey = 'authToken';

  constructor(
    private httpClient: HttpClient) { }

  public logIn(user: any): Observable<any> {
    return this.httpClient.post<any>(this.LOGIN_URL, user).pipe(
      tap(response => {
        if(response.data.token){
          console.log(response.data.token);
          this.setToken(response.data.token);
        }
      })
    )
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuth(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }

  logout(): void{
    localStorage.removeItem(this.tokenKey);
  }

}

