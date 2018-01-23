const app = angular.module('LoginApp', []);

app.controller('MainController', ['$http', function ($http) {

  this.url = "http://localhost:3000"

  this.registerUser = (id) => {

    this.shortUser = false;
    this.shortPass = false;
    this.taken = false;

    let pass = true;
    const newUser = {
      'email': `${this.newUserForm.username}@sample.com`,
      'password': this.newUserForm.password
    }


    if (this.newUserForm.username.length < 6) {
      pass = false;
      this.shortUser = true;
    }

    if (this.newUserForm.password.length < 8) {
      pass = false;
      this.shortPass = true;
    }

    if (pass) {
      $http({
        url: this.url + '/auth/',
        method: 'POST',
        data: newUser
      }).then(response => {
        this.user = response.data;
        this.user.name = this.newUserForm.username;
        this.newUserForm = {};
        this.shortPass = false;
        this.shortUser = false;
        this.taken = false;
        closeNav();
      }, error => {
        this.newUserForm = {};
        this.taken = true;
        console.log(error.message);
      }).catch(err => console.log(err))
    }

  }

  this.logout = () => {
    this.user = null;

    $http({
      url: '/session',
      method: 'DELETE',
    }).then(response => {
    }, error => {
      console.log(error.message);
    }).catch(err => console.log(err))
  }

  // ==============
  // Login Route
  // ==============

  this.loginUser = (id) => {

    const user = {
      'email': this.loginForm.username,
      'password': this.loginForm.password
    }

    $http({
      url: this.url + '/auth/sign_in',
      method: 'POST',
      data: user
    }).then(response => {
      console.log(response);
      this.user = response.data;
      this.user.name = this.loginForm.username;
      this.loginForm = {};
      this.badLogin = false;
      this.shortUser = false;
      this.shortPass = false;
      closeNavLogin();

      // $http({
      //   url: '/session',
      //   method: 'POST',
      //   data: this.user
      // }).then(response => {

      // }, error => {

      //   console.log(error.message);
      // }).catch(err => console.log(err))

    }, error => {
      this.badLogin = true;
      console.log(error.message);
    }).catch(err => console.log(err))
  }

}]);

