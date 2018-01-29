const app = angular.module('LoginApp', []);

app.controller('MainController', ['$http', function ($http) {

  this.url = "http://localhost:3000";



  

  this.registerUser = (id) => {

    this.shortUser = false;
    this.shortPass = false;
    this.taken = false;

    let pass = true;
    const newUser = {
      'username': `${this.newUserForm.username}@sample.com`,
      'password': this.newUserForm.password
    }

    const newCompany = {
      'company_name': this.newUserForm.company_name
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
      'username': this.loginForm.username,
      'password': this.loginForm.password
    }

    $http({
      url: this.url + '/users/login',
      method: 'POST',
      data: user
    }).then(response => {
      console.log(response);
      this.user = response.data;

    }, error => {
      this.badLogin = true;
      console.log(error.message);
    }).catch(err => console.log(err))
  }

}]);

