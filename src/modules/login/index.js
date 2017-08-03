import { Aurelia, inject } from 'aurelia-framework';
import { AuthService } from "aurelia-authentication";
import './style.css';

@inject(AuthService)
export class Login { 
    username="";
    password="";

    constructor(authService) {
        this.authService = authService;
    }

    login() {
        return this.authService.login({ "username": this.username, "password": this.password })
            .then(response => {
                console.log("success logged " + response);
            })
            .catch(err => {
                console.log(err);
                console.log("login failure");
            });
    }
} 
