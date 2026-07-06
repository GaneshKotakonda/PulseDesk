import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patients-comp',
  imports: [NgFor,FormsModule,NgIf],
  templateUrl: './patients-comp.html',
  styleUrl: './patients-comp.css',
})
export class PatientsComp {
  patients:any =[];
constructor(private html :HttpClient){}
  ngOnInit(){
    this.html.get<any[]>("http://localhost:5132/api/Patients").subscribe({
      next:(data)=>{
        this.patients=data;
      },
      error:(err)=>{
        console.log('All Patients Display error:', err);
      }
    })
  }
}
