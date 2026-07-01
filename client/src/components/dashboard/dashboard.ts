import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { auth } from '../../app/firebase';
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule,NgIf],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
    constructor(private router: Router) {}

  num = 100
  selected='dashboard';
  logout(){

   signOut(auth)
    .then(() => {
      this.router.navigate(['/']);
    })
    .catch(error => {
      console.log(error);
    });
  }


}
