import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patients-comp',
  imports: [NgFor, FormsModule, NgIf],
  templateUrl: './patients-comp.html',
  styleUrl: './patients-comp.css',
})
export class PatientsComp {
  patients = signal<any[]>([]);
  isEditing = signal(false);
  isAdding = signal(false);
  role = localStorage.getItem('role') || 'User';

  selectedPatient: any = {
    id: 0,
    name: '',
    age: 0,
    gender: '',
    phone: '',
    disease: '',
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getPatients();
  }

  canManage() {
    return this.role === 'Admin' || this.role === 'Receptionist';
  }

  getPatients() {
    this.http.get<any[]>('http://localhost:5132/api/patients').subscribe({
      next: (data) => {
        this.patients.set(data);
      },
      error: (err) => {
        console.log('All Patients Display error:', err);
      }
    });
  }

  addPatient() {
    this.selectedPatient = {
      id: 0,
      name: '',
      age: 0,
      gender: '',
      phone: '',
      disease: '',
    };
    this.isAdding.set(true);
    this.isEditing.set(false);
  }

  editPatient(patient: any) {
    this.selectedPatient = { ...patient };
    this.isEditing.set(true);
    this.isAdding.set(false);
  }

  cancelForm() {
    this.isAdding.set(false);
    this.isEditing.set(false);
  }

  savePatient() {
    if (!this.selectedPatient.name || !this.selectedPatient.gender || !this.selectedPatient.phone) {
      return;
    }

    const request = this.isAdding()
      ? this.http.post<any>('http://localhost:5132/api/patients', this.selectedPatient)
      : this.http.put<any>(`http://localhost:5132/api/patients/${this.selectedPatient.id}`, this.selectedPatient);

    request.subscribe({
      next: () => {
        this.getPatients();
        this.cancelForm();
      },
      error: (err) => {
        console.log('Patient save error:', err);
      }
    });
  }

  deletePatient(id: number) {
    const confirmed = confirm('Are you sure you want to delete this record?');
    if (!confirmed) {
      return;
    }

    this.http.delete(`http://localhost:5132/api/patients/${id}`).subscribe({
      next: () => {
        this.getPatients();
      },
      error: (err) => {
        console.log('Patient delete error:', err);
      }
    });
  }
}
