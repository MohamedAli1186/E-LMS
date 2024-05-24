import { Component, inject } from '@angular/core';
import { User, UserRole } from '../../models/user';
import { ApiService } from '../../the-helpers/data-service/auth.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../the-designs/layouts/header/header.component';
import { FooterComponent } from '../../the-designs/layouts/footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ReactiveFormsModule,
    FooterComponent,
    HeaderComponent,
  ],
})
export class RegisterComponent {
  signUpfrom!: FormGroup;
  user_reg_data: any;
  userData!: User;
  href: string = '';
  regForm: boolean = false;
  fb = inject(FormBuilder);
  authService = inject(ApiService);
  router = inject(Router);
  UserRole: any;
  submitted = false;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.href = this.router.url;
    if (this.href == '/register') {
      this.regForm = true;
    } else if (this.href == '/sign-in') {
      this.regForm = false;
    }
    this.signUpfrom = this.formBuilder.group({
      username: [''],
      email: [''],
      password: [''],
      phone: [''],
      approved: [false],
      role: [UserRole.Student],
    });
  }

  createUser() {
    if (this.signUpfrom.invalid) {
      return;
    }
    this.user_reg_data = this.signUpfrom.value;
    this.userData = {
      username: this.user_reg_data.username,
      email: this.user_reg_data.email,
      password: this.user_reg_data.password,
      phone: this.user_reg_data.phone,
      approved: false,
      role: this.user_reg_data.role as UserRole,
    };

    const email = this.userData.email || ''; // Add null check for email
    const password = this.userData.password || ''; // Add null check for password

    this.authService.register(email, password, this.userData).then(() => {
      console.log('new user created');
      console.log(this.userData.role);
      this.signUpfrom.reset();
      this.router.navigate(['sign-in']);
      this.submitted = true;
    });
  }
  resetForm(form: NgForm) {
    form.reset();
  }
}
