import { afterNextRender, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
@Component({
  // selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent {
  //es util porque pemiteinyectar servicios en funciones
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router =inject(Router)
  public myForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  login() {
    const { email, password } = this.myForm.value;
    this.authService.login(email, password).subscribe({
      next: () => {
        return this.router.navigateByUrl('/dashboard')
        // Swal.fire({
        //   title: 'success!',
        //   text: 'success',
        //   icon: 'success',
        //   confirmButtonText: 'Ok'
        // })
      },
      error: (errorMessage) => {
        // console.log({ loginError: error });
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Ok'
        })

      },
    });
  }
  // (success) => {
  // console.log({ success });
}
