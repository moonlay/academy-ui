import { Aurelia, inject } from 'aurelia-framework';
import { AuthService } from "aurelia-authentication";
import './style.css';

@inject(AuthService)
export class Login { 
    username="";
    password="";
    _isAuthenticated = false;
    constructor(authService) {
        this.authService = authService;
        console.log(this.authService);
        console.log(this.authService.authentication.accessToken);
        this.authenticated = false;
    }

    login() {
        return this.authService.login({ "username": this.username, "password": this.password })
            .then(response => {
                localStorage.setItem("userId", response.userId);
                console.log(response.userId);                
                console.log(response);
                console.log("success logged " + response);
            })
            .catch(err => {
                console.log(err);
                console.log("login failure");
            })
    }
    logout(){
        return this.authService.logout()
        .then(response =>{
            localStorage.clear();
        })
        
            .catch(err => {
                console.log(err);
                console.log("login failure");
            })
    }

    // get isAuthenticated(){
    //     return this.authService.isAuthenticated();
    // }
} 
