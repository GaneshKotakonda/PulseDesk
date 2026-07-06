import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../app/firebase';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-sign-up',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  email =''
  password = ''
  phone='';
  name ='';
 constructor(private router: Router,private http :HttpClient) {}
 
signUp(){
createUserWithEmailAndPassword(auth, this.email, this.password)
  .then((userCredential) => {

      // Firebase account created successfully

      this.http.post('http://localhost:5132/api/users', {
          fullName: this.name,
          email: this.email,
          phoneNumber: this.phone
      }).subscribe(() => {

          // User added to your SQL database
          this.router.navigate(['/dashboard']);

      });

  })
  .catch(err => {
      console.log(err);
  });
}
Login(){
  this.router.navigate(['/'])
}
}
