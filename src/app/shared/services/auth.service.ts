import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  picture: string;
}

export interface User {
  email: string;
  name: string;
  picture: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = "https://localhost:7207/api/auth";
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private socialAuthService: SocialAuthService
  ) {
    // Carregar usuário do localStorage se existir
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }

    // Escutar mudanças no estado de autenticação do Google
    this.socialAuthService.authState.subscribe((socialUser: SocialUser) => {
      if (socialUser) {
        this.loginWithGoogle(socialUser.idToken || "").subscribe();
      }
    });
  }

  loginWithGoogle(idToken: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/google-login`, { idToken })
      .pipe(
        tap((response) => {
          // Salvar token e dados do usuário
          localStorage.setItem("token", response.token);
          const user: User = {
            email: response.email,
            name: response.name,
            picture: response.picture,
          };
          localStorage.setItem("currentUser", JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
    this.socialAuthService.signOut();
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
