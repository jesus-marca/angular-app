import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import {
  AuthStatus,
  CheckTokenResponse,
  LoginResponse,
  User,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.baseUrl;
  private http = inject(HttpClient);
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);
  private setAuthUser(user: User, token: string): boolean {
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authentitcated);
    localStorage.setItem('token', token);
    return true;
  }

  //al mundo exterior
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());
  constructor() {
    this.checkAuthStatus().subscribe();
  }
  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.notAuthentitcated);
  }
  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };
    return this.http.post<LoginResponse>(url, body).pipe(
      // tap(({ user, token }) => {
      //   this.setAuthUser(user,token)
      //   console.log({ user, token });
      // }),
      map(({ user, token }) => this.setAuthUser(user, token)),
      catchError((err) => throwError(() => err.error.message))
      //todo errores
    );
  }
  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-token`;
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(
        ({ token, user }) => this.setAuthUser(user, token)
        // this._currentUser.set(user);
        // this._authStatus.set(AuthStatus.authentitcated);
        // localStorage.setItem('token', token);
        // console.log({ user, token });
        // return true;
      ),

      catchError(() => {
        this._authStatus.set(AuthStatus.notAuthentitcated);
        return of(false);
      })
    );
  }
}
