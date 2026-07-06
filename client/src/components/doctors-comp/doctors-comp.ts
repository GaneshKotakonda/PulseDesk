import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctors-comp',
  imports: [NgFor,NgIf,FormsModule],
  templateUrl: './doctors-comp.html',
  styleUrl: './doctors-comp.css',
})
export class DoctorsComp {
  doctors = signal<any[]>([]);

   public constructor( private http : HttpClient){}

ngOnInit() {
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
}
