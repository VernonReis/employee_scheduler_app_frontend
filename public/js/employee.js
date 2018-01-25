const app = angular.module('EmployeeApp', []);

app.controller('MainController', ['$http', function ($http) {


  $http({
    url: '/user/schedules/' + this.employeeId,
    method: 'GET',
  }).then(response => {
    this.employeeSchedule = response.data;
  }, error => {
    console.log(error.message);
  }).catch(err => console.log(err))

}]);