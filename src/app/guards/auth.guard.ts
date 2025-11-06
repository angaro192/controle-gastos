import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem("token");
  if (!token) {
    toNavigate(router, "/signin");
    return false;
  }

  if (token) {
    if (!validateTokenExpiration(token)) {
      localStorage.removeItem("token");
      toNavigate(router, "/signin");
      return false;
    }
  }

  toNavigate(router, "/signin");
  return false;
};

/**
 * Validate if token is not expired
 * @param token - Token to validate
 * @returns - True if token is not expired, false otherwise
 */
export function validateTokenExpiration(token: string): boolean {
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  if (tokenPayload.exp < Date.now() / 1000) {
    return false;
  }
  return true;
}

export function toNavigate(router: Router, route: string) {
  router.navigate([route]);
}
