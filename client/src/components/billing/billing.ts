import { NgClass, NgFor, DatePipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-billing',
  imports: [NgFor, NgClass, DatePipe, NgIf, FormsModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class Billing {
  bills = signal<any[]>([]);
  appointments = signal<any[]>([]);
  isAdding = signal(false);
  isEditing = signal(false);
  role = localStorage.getItem('role') || 'User';

  selectedBill: any = {
    id: 0,
    appointmentId: '',
    amount: 0,
    billDate: '',
    paymentStatus: 'Pending',
  };

  paymentStatuses = ['Paid', 'Pending', 'Cancelled'];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBills();
    this.getAppointments();
  }

  canManage() {
    return this.role === 'Admin' || this.role === 'Receptionist';
  }

  getBills() {
    this.http.get<any[]>('http://localhost:5132/api/Bill')
      .subscribe({
        next: (data) => {
          this.bills.set(data);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  getAppointments() {
    this.http.get<any[]>('http://localhost:5132/api/appointments')
      .subscribe({
        next: (data) => {
          this.appointments.set(data);
        },
        error: (err) => {
          console.log('Billing appointments dropdown error:', err);
        }
      });
  }

  addBill() {
    this.selectedBill = {
      id: 0,
      appointmentId: '',
      amount: 0,
      billDate: '',
      paymentStatus: 'Pending',
    };
    this.isAdding.set(true);
    this.isEditing.set(false);
  }

  editBill(bill: any) {
    this.selectedBill = {
      id: bill.id,
      appointmentId: bill.appointmentId,
      amount: bill.amount,
      billDate: this.formatDate(bill.billDate),
      paymentStatus: bill.paymentStatus,
    };
    this.isEditing.set(true);
    this.isAdding.set(false);
  }

  cancelForm() {
    this.isAdding.set(false);
    this.isEditing.set(false);
  }

  saveBill() {
    if (!this.selectedBill.appointmentId || !this.selectedBill.billDate) {
      return;
    }

    const payload = {
      ...this.selectedBill,
      appointmentId: Number(this.selectedBill.appointmentId),
      amount: Number(this.selectedBill.amount),
    };

    const request = this.isAdding()
      ? this.http.post<any>('http://localhost:5132/api/Bill', payload)
      : this.http.put<any>(`http://localhost:5132/api/Bill/${this.selectedBill.id}`, payload);

    request.subscribe({
      next: () => {
        this.cancelForm();
        this.getBills();
      },
      error: (err) => {
        console.log('Bill save error:', err);
      }
    });
  }

  deleteBill(id: number) {
    const confirmed = confirm('Are you sure you want to delete this record?');
    if (!confirmed) {
      return;
    }

    this.http.delete(`http://localhost:5132/api/Bill/${id}`).subscribe({
      next: () => {
        this.getBills();
      },
      error: (err) => {
        console.log('Bill delete error:', err);
      }
    });
  }

  private formatDate(value: string) {
    if (!value) {
      return '';
    }

    return value.split('T')[0];
  }
}
