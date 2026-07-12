import { NgFor, NgIf, DatePipe, NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-appointment-comp',
  imports: [FormsModule, NgClass, NgFor, NgIf, DatePipe],
  templateUrl: './appointment-comp.html',
  styleUrl: './appointment-comp.css',
})
export class AppointmentComp {
  appointments = signal<any[]>([]);
  patients = signal<any[]>([]);
  doctors = signal<any[]>([]);
  isAdding = signal(false);
  isEditing = signal(false);
  role = localStorage.getItem('role') || 'User';

  selectedAppointment: any = {
    id: 0,
    patientId: '',
    doctorId: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: '',
    durationMinutes: 0,
    status: 'Scheduled',
    reasonForVisit: '',
    notes: '',
  };

  statuses = ['Scheduled', 'Completed', 'Cancelled', 'Pending'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAppointments();
    this.getPatients();
    this.getDoctors();
  }

  canManage() {
    return this.role === 'Admin' || this.role === 'Receptionist';
  }

  getAppointments() {
    this.http.get<any[]>(`${environment.apiUrl}/appointments`)
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

  getPatients() {
    this.http.get<any[]>(`${environment.apiUrl}/patients`)
      .subscribe({
        next: (data) => this.patients.set(data),
        error: (err) => console.log('Patients dropdown error:', err)
      });
  }

  getDoctors() {
    this.http.get<any[]>(`${environment.apiUrl}/doctors`)
      .subscribe({
        next: (data) => this.doctors.set(data),
        error: (err) => console.log('Doctors dropdown error:', err)
      });
  }

  addAppointment() {
    this.selectedAppointment = {
      id: 0,
      patientId: '',
      doctorId: '',
      appointmentDate: '',
      appointmentTime: '',
      appointmentType: '',
      durationMinutes: 0,
      status: 'Scheduled',
      reasonForVisit: '',
      notes: '',
    };
    this.isAdding.set(true);
    this.isEditing.set(false);
  }

  editAppointment(appointment: any) {
    this.selectedAppointment = {
      id: appointment.id,
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentDate: this.formatDate(appointment.appointmentDate),
      appointmentTime: appointment.appointmentTime,
      appointmentType: appointment.appointmentType,
      durationMinutes: appointment.durationMinutes,
      status: appointment.status,
      reasonForVisit: appointment.reasonForVisit || '',
      notes: appointment.notes || '',
    };
    this.isEditing.set(true);
    this.isAdding.set(false);
  }

  cancelForm() {
    this.isAdding.set(false);
    this.isEditing.set(false);
  }

  saveAppointment() {
    if (!this.selectedAppointment.patientId || !this.selectedAppointment.doctorId || !this.selectedAppointment.appointmentDate || !this.selectedAppointment.appointmentTime) {
      alert('Please select patient, doctor, appointment date, and appointment time.');
      return;
    }

    const payload = {
      ...this.selectedAppointment,
      patientId: Number(this.selectedAppointment.patientId),
      doctorId: Number(this.selectedAppointment.doctorId),
      durationMinutes: Number(this.selectedAppointment.durationMinutes),
    };

    const request = this.isAdding()
      ? this.http.post<any>(`${environment.apiUrl}/appointments`, payload)
      : this.http.put<any>(`${environment.apiUrl}/appointments/${this.selectedAppointment.id}`, payload);

    request.subscribe({
      next: () => {
        this.getAppointments();
        this.cancelForm();
      },
      error: (err) => {
        console.log('Appointment save error:', err);
        alert(err.error || 'Appointment could not be saved.');
      }
    });
  }

  deleteAppointment(id: number) {
    const confirmed = confirm('Are you sure you want to delete this record?');
    if (!confirmed) {
      return;
    }

    this.http.delete(`${environment.apiUrl}/appointments/${id}`).subscribe({
      next: () => this.getAppointments(),
      error: (err) => console.log('Appointment delete error:', err)
    });
  }

  private formatDate(value: string) {
    if (!value) {
      return '';
    }

    return value.split('T')[0];
  }
}
