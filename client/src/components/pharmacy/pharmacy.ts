import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Medicine {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
}

@Component({
  selector: 'app-pharmacy',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './pharmacy.html',
  styleUrl: './pharmacy.css',
})
export class Pharmacy {
  medicines = signal<Medicine[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  isAdding = signal(false);
  isEditing = signal(false);
  role = localStorage.getItem('role') || 'User';

  selectedMedicine: any = {
    id: 0,
    name: '',
    category: '',
    stock: 0,
    price: 0,
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getMedicines();
  }

  canManage() {
    return this.role === 'Admin';
  }

  getMedicines() {
    this.isLoading.set(true);
    this.http.get<Medicine[]>('http://localhost:5132/api/medicines')
      .subscribe({
        next: (data) => {
          this.medicines.set(data);
          this.errorMessage.set('');
          this.isLoading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.errorMessage.set('Unable to load medicines. Check that the API and MySQL are running.');
          this.isLoading.set(false);
        }
      });
  }

  addMedicine() {
    this.selectedMedicine = {
      id: 0,
      name: '',
      category: '',
      stock: 0,
      price: 0,
    };
    this.isAdding.set(true);
    this.isEditing.set(false);
  }

  editMedicine(medicine: Medicine) {
    this.selectedMedicine = { ...medicine };
    this.isEditing.set(true);
    this.isAdding.set(false);
  }

  cancelForm() {
    this.isAdding.set(false);
    this.isEditing.set(false);
  }

  saveMedicine() {
    if (!this.selectedMedicine.name || !this.selectedMedicine.category) {
      return;
    }

    const payload = {
      ...this.selectedMedicine,
      stock: Number(this.selectedMedicine.stock),
      price: Number(this.selectedMedicine.price),
    };

    const request = this.isAdding()
      ? this.http.post<any>('http://localhost:5132/api/medicines', payload)
      : this.http.put<any>(`http://localhost:5132/api/medicines/${this.selectedMedicine.id}`, payload);

    request.subscribe({
      next: () => {
        this.getMedicines();
        this.cancelForm();
      },
      error: (err) => {
        console.log('Medicine save error:', err);
      }
    });
  }

  deleteMedicine(id: number) {
    const confirmed = confirm('Are you sure you want to delete this record?');
    if (!confirmed) {
      return;
    }

    this.http.delete(`http://localhost:5132/api/medicines/${id}`).subscribe({
      next: () => {
        this.getMedicines();
      },
      error: (err) => {
        console.log('Medicine delete error:', err);
      }
    });
  }
}
