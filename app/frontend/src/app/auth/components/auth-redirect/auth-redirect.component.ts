import { Component, Input, OnInit } from '@angular/core';

interface OptionValues {
  text:         string;
  question:     string;
  redirectTo:  string;
}

@Component({
  selector: 'auth-redirect',
  templateUrl: './auth-redirect.component.html',
  styles: ``
})
export class AuthRedirectComponent implements OnInit {

  @Input() color: string = 'primary';
  @Input({ required: true }) type!: 'login' | 'register';

  public values: OptionValues = {
    text: 'Registrate',
    question: 'No',
    redirectTo: '/auth/register'
  };
  
  constructor() { }

  ngOnInit(): void {
    if (this.type === 'register') {
      this.values = {
        text: 'Inicia Sesión',
        question: 'Ya',
        redirectTo: '/auth/login'
      }
    }
  }

}
