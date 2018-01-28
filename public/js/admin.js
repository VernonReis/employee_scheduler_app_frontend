const app = angular.module('AdminApp', []);

app.controller('MainController', ['$http', function ($http) {


  this.url = "http://localhost:3000";
  this.scheduleView = true;

  parseDate = (dateString) => {
    // Parse date function here
    // Date inputs in format ("YYYY-MM-DD"T"HH:MM:SS.SSS"Z)
    // Trim first 10 chars for date
    // Trim chars 12-17 for time
    const date = dateString.slice(0,9);
    const time = dateString.slice(11,16);
    return date + " " + time;
  }

  $http({
    url: this.url + '/employers/1',
    method: 'GET'
  }).then(response => {
    this.payPeriods = response.data.pay_periods;

    for (index in this.payPeriods)
    {
      this.payPeriods[index].start_date = parseDate(this.payPeriods[index].start_date)
    }

    console.log(response);
  }, error => {
    // console.log(error.message);
  }).catch(err => console.log(err))

  this.loadWeek = (dayNum) =>
  {

  }

}]);