import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../core/auth/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { UserInfoType } from "../../../../types/user-info.type";
import { SharedService } from "../../services/shared.service";
import { DefaultResponseType } from "../../../../types/default-response.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isLogged: boolean = false;
  activeLink: string = '';
  user: UserInfoType = {id: '', name: '', email: ''}

  constructor(private authService: AuthService,
              private sharedService: SharedService,
              private _snackBar: MatSnackBar,
              private router: Router) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      this.getUserInfo();
    });

    this.getUserInfo();
  }

  getUserInfo() {
    this.sharedService.getUserInfo()
      .subscribe((data: UserInfoType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        } else {
          this.user = data as UserInfoType;
        }
      })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  changeActiveLink(fragment: string) {
    this.activeLink = fragment;
  }
}
