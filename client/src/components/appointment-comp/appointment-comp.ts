import { NgFor, NgIf,DatePipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-appointment-comp',
  imports: [FormsModule,NgClass,NgFor,NgIf,DatePipe],
  templateUrl: './appointment-comp.html',
  styleUrl: './appointment-comp.css',
})
export class AppointmentComp {
  appointments = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAppointments();
  }

  getAppointments() {
    this.http.get<any[]>('http://localhost:5132/api/appointments')
      .subscribe({
        next: (data) => {

          data.sort((a, b) => {

            const dateA = new Date(`${a.appointmentDate} ${a.appointmentTime}`);
            const dateB = new Date(`${b.appointmentDate} ${b.appointmentTime}`);

            return dateB.getTime() - dateA.getTime();
          });

          this.appointments.set(data);
        },
        error: (err) => console.log(err)
      });
  }

}
