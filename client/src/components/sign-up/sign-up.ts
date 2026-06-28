import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../app/firebase';
@Component({
  selector: 'app-sign-up',
  imports: [FormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  email =''
  password = ''
 constructor(private router: Router) {}
signUp(){
createUserWithEmailAndPassword( auth,this.email,this.password ).then((UserCredential)=>{
console.log("userCreated",UserCredential.user);
  this.router.navigate(['/dashboard'])

}).catch((error) => {
      console.error(error);
      alert(error.message);
    });

}
Login(){
  this.router.navigate(['/'])
}
}
