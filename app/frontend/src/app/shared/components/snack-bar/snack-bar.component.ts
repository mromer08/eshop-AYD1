import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

interface Data {
  icon:     string;
  message:  string;
  color:    string;
}

@Component({
  templateUrl: './snack-bar.component.html',
  styles: ``
})
export class SnackBarComponent {

  constructor (@Inject(MAT_SNACK_BAR_DATA) public data?: Data) { }

}
