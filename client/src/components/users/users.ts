import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-users',
  imports: [FormsModule, NgFor, NgIf, NgClass],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  users = signal<any[]>([]);
  isEditing = signal(false);
  isAdding = signal(false);

  selectedUser: any = {
    id: 0,
    fullName: '',
    email: '',
    phoneNumber: '',
    role: 'User',
    status: 'Active',
  };

  roles = ['Admin', 'Receptionist', 'Doctor', 'User'];
  statuses = ['Active', 'Inactive'];
  role = localStorage.getItem('role') || 'User';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.http.get<any[]>(`${environment.apiUrl}/users`)
      .subscribe({
        next: (data) => {
          this.users.set(data);
        },
        error: (err) => {
          console.log('Users display error:', err);
        }
      });
  }

  canManage() {
    return this.role === 'Admin';
  }

  addUser() {
    this.selectedUser = {
      id: 0,
      fullName: '',
      email: '',
      phoneNumber: '',
      role: 'User',
      status: 'Active',
    };
    this.isAdding.set(true);
    this.isEditing.set(false);
  }

  editUser(user: any) {
    this.selectedUser = { ...user };
    this.isEditing.set(true);
    this.isAdding.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.isAdding.set(false);
  }

  saveUser() {
    if (!this.selectedUser.fullName || !this.selectedUser.email || !this.selectedUser.phoneNumber || !this.selectedUser.role || !this.selectedUser.status) {
      return;
      
    }

    const request = this.isAdding()
      ? this.http.post<any>(`${environment.apiUrl}/users`, this.selectedUser)
      : this.http.put<any>(`${environment.apiUrl}/users/${this.selectedUser.id}`, this.selectedUser);

    request
      .subscribe({
        next: () => {
          this.getUsers();
          this.isEditing.set(false);
        },
        error: (err) => {
          console.log('User update error:', err);
        }
      });
  }

  deleteUser(id: number) {
    const confirmed = confirm('Are you sure you want to delete this record?');

    if (!confirmed) {
      return;
    }

    this.http.delete(`${environment.apiUrl}/users/${id}`)
      .subscribe({
        next: () => {
          this.getUsers();
        },
        error: (err) => {
          console.log('User delete error:', err);
        }
      });
  }
}
