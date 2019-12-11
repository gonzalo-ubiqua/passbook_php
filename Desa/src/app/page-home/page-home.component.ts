import { Component, OnInit } from '@angular/core';
import { LoginService } from '../page-login/login.service';

@Component({
  selector: 'page-home',
  templateUrl: './page-home.component.html',
  styleUrls: ['./page-home.component.scss']
})
export class PageHomeComponent implements OnInit {

  constructor(private LoginS: LoginService) { }

  ngOnInit() {
  }

  public logout() {
    this.LoginS.logout();
  }

}
