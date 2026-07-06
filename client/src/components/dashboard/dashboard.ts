import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { auth } from '../../app/firebase';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { PatientsComp } from '../patients-comp/patients-comp';
@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, NgIf, NgFor, NgClass,PatientsComp],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  recentAppointments: any[] = [];
  patientCount=signal(0);
  AppointmentCount=signal(0);
  doctorsCount= signal(0);
    constructor(private router: Router,private http:HttpClient) {}
appointmentsChart: any;

ngAfterViewInit() {
  this.appointmentsChart = new Chart('appointmentsChart', {
    type: 'line',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Appointments',
          data: [60, 65, 45, 75, 58, 80, 100],
          tension: 0.4
        },
        {
          label: 'Completed',
          data: [20, 38, 22, 50, 33, 52, 65],
          tension: 0.4
        }
      ]
    }
  });
}
ngOnInit(){
//recent appointments
    this.http.get<any[]>('http://localhost:5132/api/appointments/recent')
    .subscribe({
      next: data=>{
        this.recentAppointments=data;
      },
      error: err=>{
        console.log('Recent appointments error:', err);
      }
    });
//doctors count
 this.http.get<number>('http://localhost:5132/api/doctors/count')
.subscribe({
  next:(count)=>{
    
          this.doctorsCount.set(count);

  },
  error:(err:any)=>{

console.log(err);

    }
});
//appointments count;
this.http.get<number>('http://localhost:5132/api/appointments/count')
.subscribe({
  next:(count)=>{
    this.AppointmentCount.set(count);
  },
  error:(err:any)=>{

console.log(err);

    }
});
//patients count;
this.http.get<number>('http://localhost:5132/api/patients/count')
.subscribe({ 
    next: (count:any)=>{
                console.log('Patient count:', count);
      this.patientCount.set(count);
    },
    error:(err:any)=>{
console.log(err);
    }
  });

}
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
