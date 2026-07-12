import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctors-comp',
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './doctors-comp.html',
  styleUrl: './doctors-comp.css',
})
export class DoctorsComp {
  doctors = signal<any[]>([]);
  isAdding = signal(false);
  isEditing = signal(false);
  role = localStorage.getItem('role') || 'User';

  selectedDoctor: any = {
    id: 0,
    name: '',
    specialization: '',
    phone: '',
    email: '',
    experience: 0,
  };

  public constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getDoctors();
  }

  canManage() {
    return this.role === 'Admin';
  }

  getDoctors() {
    this.http.get<any[]>('http://localhost:5132/api/doctors')
      .subscribe({
        next: (data) => {
          this.doctors.set(data);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  addDoctor() {
    this.selectedDoctor = {
      id: 0,
      name: '',
      specialization: '',
      phone: '',
      email: '',
      experience: 0,
    };
    this.isAdding.set(true);
    this.isEditing.set(false);
  }

  editDoctor(doctor: any) {
    this.selectedDoctor = { ...doctor };
    this.isEditing.set(true);
    this.isAdding.set(false);
  }

  cancelForm() {
    this.isAdding.set(false);
    this.isEditing.set(false);
  }

  saveDoctor() {
    if (!this.selectedDoctor.name || !this.selectedDoctor.specialization || !this.selectedDoctor.phone || !this.selectedDoctor.email) {
      return;
    }

    const request = this.isAdding()
      ? this.http.post<any>('http://localhost:5132/api/doctors', this.selectedDoctor)
      : this.http.put<any>(`http://localhost:5132/api/doctors/${this.selectedDoctor.id}`, this.selectedDoctor);

    request.subscribe({
      next: () => {
        this.getDoctors();
        this.cancelForm();
      },
      error: (err) => {
        console.log('Doctor save error:', err);
      }
    });
  }

  deleteDoctor(id: number) {
    const confirmed = confirm('Are you sure you want to delete this record?');
    if (!confirmed) {
      return;
    }

    this.http.delete(`http://localhost:5132/api/doctors/${id}`).subscribe({
      next: () => {
        this.getDoctors();
      },
      error: (err) => {
        console.log('Doctor delete error:', err);
      }
    });
  }
}
