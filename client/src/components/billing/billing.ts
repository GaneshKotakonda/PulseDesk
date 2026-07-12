import { NgClass, NgFor, DatePipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment';

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
    const apiUrl = `${environment.apiUrl}/Bill`;
    console.log('Billing get API URL:', apiUrl);

    this.http.get<any[]>(apiUrl)
      .subscribe({
        next: (data) => {
          this.bills.set(data);
        },
        error: (err) => {
          console.error('Billing list error:', err);
          console.error('Billing list backend response:', err?.error);
        }
      });
  }

  getAppointments() {
    const apiUrl = `${environment.apiUrl}/appointments`;
    console.log('Billing appointments API URL:', apiUrl);

    this.http.get<any[]>(apiUrl)
      .subscribe({
        next: (data) => {
          this.appointments.set(data);
        },
        error: (err) => {
          console.error('Billing appointments dropdown error:', err);
          console.error('Billing appointments backend response:', err?.error);
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
    console.log('saveBill executed with selectedBill:', this.selectedBill);

    if (!this.selectedBill.appointmentId || !this.selectedBill.billDate) {
      console.error('Bill validation failed: appointment and bill date are required.', this.selectedBill);
      return;
    }

    const appointmentId = Number(this.selectedBill.appointmentId);
    const amount = Number(this.selectedBill.amount);
    const billId = Number(this.selectedBill.id);

    if (!Number.isFinite(appointmentId) || appointmentId <= 0) {
      console.error('Bill validation failed: appointmentId is invalid.', this.selectedBill.appointmentId);
      return;
    }

    if (this.isEditing() && (!Number.isFinite(billId) || billId <= 0)) {
      console.error('Bill validation failed: bill id is invalid for edit.', this.selectedBill.id);
      return;
    }

    const payload = {
      ...this.selectedBill,
      id: this.isAdding() ? 0 : billId,
      appointmentId,
      amount: Number.isFinite(amount) ? amount : 0,
    };

    const apiUrl = this.isAdding()
      ? `${environment.apiUrl}/Bill`
      : `${environment.apiUrl}/Bill/${billId}`;

    console.log('Bill save API URL:', apiUrl);
    console.log('Bill save request body:', payload);

    const request = this.isAdding()
      ? this.http.post<any>(apiUrl, payload)
      : this.http.put<any>(apiUrl, payload);

    request.subscribe({
      next: (savedBill) => {
        console.log('Bill save success:', savedBill);
        this.cancelForm();
        this.getBills();
      },
      error: (err) => {
        console.error('Bill save error:', err);
        console.error('Bill save backend response:', err?.error);
      }
    });
  }

  deleteBill(id: number) {
    const confirmed = confirm('Are you sure you want to delete this record?');
    if (!confirmed) {
      return;
    }

    this.http.delete(`${environment.apiUrl}/Bill/${id}`).subscribe({
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
