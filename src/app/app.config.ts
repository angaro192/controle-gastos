import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "./shared/services/auth.interceptor";
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialAuthServiceConfig,
  SOCIAL_AUTH_CONFIG,
} from "@abacritt/angularx-social-login";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    SocialAuthService,
    {
      provide: SOCIAL_AUTH_CONFIG,
      useValue: {
        autoLogin: false,
        lang: "pt-BR",
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              "852837585109-7uoc5jpahbnj4dh82npiq94s421irmk8.apps.googleusercontent.com",
              {
                oneTapEnabled: false, // Desabilita o One Tap
                prompt: "select_account", // Sempre mostra seleção de conta
              }
            ),
          },
        ],
        onError: (err) => {
          console.error("Erro no SocialAuthService:", err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
};
