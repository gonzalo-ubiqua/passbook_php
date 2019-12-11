import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { RemoteCallService, IRemoteCallPHPParams, IRemoteCallReturnFormat } from '../services/remote-call.service'
import * as crypto from 'crypto-js';


@Component({
  selector: 'page-login',
  templateUrl: './page-login.component.html',
  styleUrls: ['./page-login.component.scss']
})
export class PageLoginComponent implements OnInit {
  public loginFormControl = new FormGroup({
    user: new FormControl('', Validators.required),
    pwd: new FormControl('', Validators.required),
  });

  public validating = false;
  public message = '';

  // ===========================================================================
  constructor(private LoginS: LoginService, private RemoteCallS:RemoteCallService) { }

  // ---------------------------------------------------------------------------
  ngOnInit() {

    this.RemoteCallS.onError.subscribe( (error: any) => {
      this.message = error;
    });

    this.RemoteCallS.onPost.subscribe( (ret_data: any) => {

      if (ret_data.valid) {
        this.LoginS.afteLoginValido(this.loginFormControl.value);
      } else {
        this.message = "Error validando usuario";
      }

    });
  }

  // ---------------------------------------------------------------------------
  public sendLoginData(): void {
    const data = Object.assign({}, this.loginFormControl.value);
    this.message = '';

    data.pwd = crypto.MD5(data.pwd).toString();

    const callData: IRemoteCallPHPParams = {
      php_name: 'login',
      params: JSON.stringify(data)
    }

    this.RemoteCallS.remotePost(callData);

  }

}
