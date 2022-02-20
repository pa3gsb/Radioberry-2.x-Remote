import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'rb-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  nav_back() {
    this.router.navigate(['/online'])
  }
}
