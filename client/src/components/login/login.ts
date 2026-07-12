import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../app/firebase';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  email = '';
  password = '';

  constructor(private router: Router, private http: HttpClient) {}

  signUp(){
    this.router.navigate(['/signUp'])
  }

  async Login(){
    try {
      const userCredential = await signInWithEmailAndPassword(auth,this.email,this.password);
      console.log("Logged in!", userCredential.user);

      const appUser = await this.ensureUserProfile();
      localStorage.setItem('role', appUser.role || 'User');
      localStorage.setItem('email', this.email);

      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : 'Unable to login.');
    }
  }

  private async ensureUserProfile(): Promise<any> {
    try {
      return await firstValueFrom(
        this.http.get(`${environment.apiUrl}/users/email/${encodeURIComponent(this.email)}`)
      );
    } catch (error) {
      if (error instanceof HttpErrorResponse && error.status === 404) {
        return await firstValueFrom(
          this.http.post(`${environment.apiUrl}/users`, {
            fullName: this.email.split('@')[0],
            email: this.email,
            phoneNumber: '',
            role: 'User',
            status: 'Active'
          })
        );
      }

      throw error;
    }
  }
}
