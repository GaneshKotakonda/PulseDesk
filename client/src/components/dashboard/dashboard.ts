import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { auth } from '../../app/firebase';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { PatientsComp } from '../patients-comp/patients-comp';
import { DoctorsComp } from '../doctors-comp/doctors-comp';
import { AppointmentComp } from '../appointment-comp/appointment-comp';
import { Billing } from '../billing/billing';
import { Pharmacy } from '../pharmacy/pharmacy';
import { Users } from '../users/users';


@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, NgIf, NgFor, NgClass,PatientsComp,DoctorsComp,AppointmentComp,Billing,Pharmacy,Users],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  recentAppointments = signal<any[]>([]);
  patientCount=signal(0);
  AppointmentCount=signal(0);
  doctorsCount= signal(0);
    constructor(private router: Router,private http:HttpClient) {}
appointmentsChart: any;

ngAfterViewInit() {
  this.appointmentsChart = new Chart('appointmentsChart', {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Appointments',
          data: [],
          tension: 0.4
        },
        {
          label: 'Completed',
          data: [],
          tension: 0.4
        }
      ]
    }
  });

  this.getAppointmentChartData();
}
ngOnInit(){
//recent appointments
    this.http.get<any[]>('http://localhost:5132/api/appointments/recent')
    .subscribe({
      next: data=>{
        this.recentAppointments.set(data);
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

getAppointmentChartData() {
  this.http.get<any[]>('http://localhost:5132/api/appointments')
    .subscribe({
      next: (appointments) => {
        const days = this.getLastSevenDays();
        const appointmentCounts = days.map(day =>
          appointments.filter(appointment => this.getDateKey(appointment.appointmentDate) === day.key).length
        );
        const completedCounts = days.map(day =>
          appointments.filter(appointment =>
            this.getDateKey(appointment.appointmentDate) === day.key &&
            appointment.status === 'Completed'
          ).length
        );

        this.appointmentsChart.data.labels = days.map(day => day.label);
        this.appointmentsChart.data.datasets[0].data = appointmentCounts;
        this.appointmentsChart.data.datasets[1].data = completedCounts;
        this.appointmentsChart.update();
      },
      error: (err) => {
        console.log('Appointment chart error:', err);
      }
    });
}

getLastSevenDays() {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    days.push({
      key: this.getDateKey(date),
      label: date.toLocaleDateString('en-US', { weekday: 'short' })
    });
  }

  return days;
}

getDateKey(value: string | Date) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
selected='dashboard';
role = localStorage.getItem('role') || 'User';

isAdmin() {
  return this.role === 'Admin';
}

isReceptionist() {
  return this.role === 'Receptionist';
}

isDoctor() {
  return this.role === 'Doctor';
}

isUser() {
  return this.role === 'User';
}

canShowPatients() {
  return this.isAdmin() || this.isReceptionist() || this.isDoctor();
}

canShowDoctors() {
  return this.isAdmin() || this.isReceptionist() || this.isUser();
}

canShowPharmacy() {
  return this.isAdmin() || this.isReceptionist();
}
canShowBilling(){
  return this.isAdmin()|| this.isReceptionist();
}


  logout(){

   signOut(auth)
    .then(() => {
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      this.router.navigate(['/']);
    })
    .catch(error => {
      console.log(error);
    });
  }


}
