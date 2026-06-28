import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Dashboard } from '../dashboard/dashboard';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../app/firebase';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  email = '';
password = '';
    constructor(private router: Router) {}
signUp(){
  this.router.navigate(['/signUp'])
}
  Login(){
signInWithEmailAndPassword(auth,this.email,this.password).then((userCredential)=>{
   console.log("Logged in!", userCredential.user);
    this.router.navigate(['/dashboard']);
}).catch((error) => {
      console.error(error);
      alert(error.message);
    });

}
}
