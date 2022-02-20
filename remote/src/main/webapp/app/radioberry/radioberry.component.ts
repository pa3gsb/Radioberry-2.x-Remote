import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'rb-radioberry',
  templateUrl: './radioberry.component.html',
  styleUrls: ['./radioberry.component.css']
})
export class RadioberryComponent implements OnInit {

  styleExp = "none";

  constructor( ) { }

  ngOnInit() { }

  w3_open() {
    this.styleExp = "block";
  }

  w3_close() {
    this.styleExp = "none";
  }
}
