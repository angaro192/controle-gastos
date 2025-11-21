import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { LabelComponent } from "../../form/label/label.component";
import { CheckboxComponent } from "../../form/input/checkbox.component";
import { ButtonComponent } from "../../ui/button/button.component";
import { InputFieldComponent } from "../../form/input/input-field.component";
import { Router, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import {
  SocialAuthService,
  GoogleSigninButtonModule,
} from "@abacritt/angularx-social-login";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: "app-signin-form",
  imports: [
    CommonModule,
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule,
    GoogleSigninButtonModule,
  ],
  templateUrl: "./signin-form.component.html",
  styles: ``,
  standalone: true,
})
export class SigninFormComponent implements OnInit {
  private socialAuthService: SocialAuthService = inject(SocialAuthService);
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  public errorMessage: string = "";
  public showPassword: boolean = false;
  public isChecked: boolean = false;

  public email: string = "";
  public password: string = "";

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/dashboard"]);
    }

    this.socialAuthService.authState.subscribe({
      next: (user: any) => {
        if (user) {
          this.authService.loginWithGoogle(user.idToken).subscribe({
            next: () => {
              this.router.navigate(["/dashboard"]);
            },
            error: (error) => {
              this.errorMessage = "Erro ao fazer login. Tente novamente.";
              console.error("Login error:", error);
            },
          });
        }
      },
      error: (error) => {
        this.errorMessage = "Erro ao autenticar com o Google.";
        console.error("Social auth error:", error);
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    console.log("Email:", this.email);
    console.log("Password:", this.password);
    console.log("Remember Me:", this.isChecked);
  }
}
