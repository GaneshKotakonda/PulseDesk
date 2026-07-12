import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { auth } from '../../app/firebase';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  email = '';
  password = '';
  phone = '';
  name = '';

  constructor(private router: Router, private http: HttpClient) {}

  async signUp() {
    try {
      await createUserWithEmailAndPassword(auth, this.email, this.password);

      const appUser: any = await firstValueFrom(
        this.http.post('http://localhost:5132/api/users', {
          fullName: this.name,
          email: this.email,
          phoneNumber: String(this.phone),
          role: 'User',
          status: 'Active'
        })
      );

      localStorage.setItem('role', appUser.role || 'User');
      localStorage.setItem('email', this.email);

      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error(error);
      const errorCode = (error as { code?: string }).code;

      if (errorCode === 'auth/email-already-in-use') {
        alert('This email is already registered. Please login instead.');
        return;
      }

      
      if (error instanceof HttpErrorResponse) {
        const details = typeof error.error === 'string'
          ? error.error
          : error.error?.title || JSON.stringify(error.error);

        alert(`Firebase signup worked, but saving the user profile failed. API status: ${error.status}. ${details}`);
        return;
      }

      alert(error instanceof Error ? error.message : 'Unable to create account.');
    }
  }

  Login() {
    this.router.navigate(['/']);
  }
}
