const app = angular.module('AdminApp', []);

app.controller('MainController', ['$http', function ($http) {

  this.currentWeek = 0;
  this.employer = 1;



  this.url = "http://localhost:3000";
  this.scheduleView = true;

  parseDate = (dateString) => {
    const date = dateString.slice(0, 10);
    console.log(dateString);
    console.log(date);
    return date
  }

  parseTime = (dateString) => {
    const time = dateString.slice(11, 16);
    return time;
  }

  parseDateTime = (dateString) => {
    // Date inputs in format ("YYYY-MM-DD"T"HH:MM:SS.SSS"Z)
    // Trim first 11 chars for date
    // Trim chars 12-17 for time
    const date = dateString.slice(0, 10);
    const time = dateString.slice(11, 16);
    const test = new Date(date + " " + time);
    console.log(test.getDay());
    console.log(test);
    return date + " " + time;
  }

  getDay = (dateString) => {
    // Date inputs in format ("YYYY-MM-DD"T"HH:MM:SS.SSS"Z)
    // Trim first 11 chars for date
    // Trim chars 12-17 for time
    const date = dateString.slice(0, 10);
    const time = dateString.slice(11, 16);
    const test = new Date(date + " " + time);
    return test.getDay();
  }

  convertDate = (date) => {
    let dateString = "";
    dateString += (date.getMonth() + 1);
    dateString += "/";
    dateString += (date.getDate());
    dateString += "/";
    dateString += (date.getFullYear());
    dateString += " ";
    dateString += (date.getHours());
    dateString += ":";
    dateString += (date.getMinutes());
    return dateString;
  }

  $http({
    url: this.url + '/employers/1',
    method: 'GET'
  }).then(response => {
    this.payPeriods = response.data.pay_periods;

    for (index in this.payPeriods) {
      this.payPeriods[index].start_date = parseDateTime(this.payPeriods[index].start_date)
    }

    this.employees = response.data.employees;
    console.log(response);
  }, error => {
    // console.log(error.message);
  }).catch(err => console.log(err))


  this.createScheduleEntry = (entry) => {
    $http({
      url: this.url + '/schedule_entries',
      method: 'POST',
      data: entry
    }).then(response => {
      // Reload week
      this.loadWeek(this.currentWeek);
    }).catch(err => console.log('Catch', err))



  }





  this.loadWeek = (payPeriodId) => {
    this.currentPeriod = 1;
    $http({
      url: this.url + '/pay_periods/1',
      method: 'GET'
    }).then(response => {
      this.scheduleEntries = response.data.schedule_entries;

      for (index in this.scheduleEntries) {
        this.scheduleEntries[index].start_time = parseDateTime(this.scheduleEntries[index].start_time)
        this.scheduleEntries[index].end_time = parseDateTime(this.scheduleEntries[index].end_time)
      }

      this.daySchedules = this.schedule_entries;
      this.loadDay(0);

    }, error => {
      // console.log(error.message);
    }).catch(err => console.log(err))


  }

  this.loadDay = (dayOfWeek) => {
    this.daySchedules = null;


    for (employee of this.employees) {
      let newLine = {
        employee: employee,
        schedule_entry: null,
        hasEntry: false
      };
      $http({
        url: this.url + '/employees/' + employee.id,
        method: 'GET'
      }).then(response => {
        for (entry of response.data.schedule_entries) {
          if (entry.pay_period_id == this.currentPeriod && getDay(entry.start_time) == dayOfWeek) {
            newLine.schedule_entry = entry;
            newLine.start_time = new Date(parseDateTime(entry.start_time));
            newLine.end_time = new Date(parseDateTime(entry.end_time));
            newLine.hasEntry = true;
          }
        }
        if (this.daySchedules == null) {
          this.daySchedules = [newLine];
          console.log("bargle");
          console.log(this.daySchedules);
        }
        else {
          this.daySchedules.push(newLine);
        }
      }, error => {
        // console.log(error.message);
      }).catch(err => console.log(err))

    }
  }
  this.updateEntry = (entry) => {
    const params = {
      start_time: convertDate(entry.start_time),
      end_time: convertDate(entry.end_time)
    }
    console.log("entry");
    console.log(entry);
    console.log("start_time");
    console.log(entry.start_time);
    console.log("params");
    console.log(params);
    $http({
      url: this.url + '/schedule_entries/' + entry.schedule_entry.id,
      method: 'PUT',
      data: params
    }).then(response => {
      console.log(response);
    }, error => {
      console.log(error.message);
    }).catch(err => console.log(err))
  }


}]);