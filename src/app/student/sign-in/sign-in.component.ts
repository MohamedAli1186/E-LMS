import { Component, inject } from '@angular/core';
import { ApiService } from '../../the-helpers/data-service/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule} from '@angular/forms';
import { from } from 'rxjs';
import { FirebaseError } from 'firebase/app';
import { CommonModule } from '@angular/common';
import { User, UserRole } from '../../models/user';
import { HeaderComponent } from '../../the-designs/layouts/header/header.component';
import { FooterComponent } from '../../the-designs/layouts/footer/footer.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  imports: [
    FormsModule,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
  ],
})
export class SignInComponent {
  invalidEmailOrPassword: boolean = false;
  signInForm: FormGroup;
  authService = inject(ApiService);
  userData: User | undefined;
  userID = localStorage.getItem('userId');
  users: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {
    this.signInForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
  }

  submitHandler() {
    const { email, password } = this.signInForm.value;
    if (email == 'admin@admin' && password == 'admin') {
      this.router.navigate(['admin']);
    }
    from(this.authService.signIn(email, password)).subscribe({
      next: (userId) => {
        this.signInForm.reset();
        console.log('Done');

        this.authService.getUsersByID(userId).subscribe((user) => {
          this.userData = user;
          const userData = JSON.parse(JSON.stringify(this.userData));
          const user_role = userData.fields.role.stringValue;
          console.log(user_role);
          user_role === UserRole.Student
            ? this.router.navigate(['home'])
            : this.router.navigate(['courses']);
        });
      },
      error: (error: FirebaseError) => {
        if (error.message.includes('wrong credential')) {
          this.invalidEmailOrPassword = true;
        }
      },
    });
  }
}
