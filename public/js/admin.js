const app = angular.module('AdminApp', []);

app.controller('MainController', ['$http', function ($http) {

  this.currentWeek = 0;
  this.employer = 1;
  



  this.url = "http://localhost:3000";
  this.scheduleView = true;

  parseDate = (dateString) => {
    const date = dateString.slice(0, 10);
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

  addDays = (date, days) => {
    return new Date(date.setTime(date.getTime() + days * 86400000));
  }

  addHours = (date, days) => {
    return new Date(date.setTime(date.getTime() + days * 3600000));
  }

  convertDate = (date) => {
    let dateString = "";
    dateString += (date.getFullYear());
    dateString += "-";
    dateString += (date.getMonth() + 1);
    dateString += "-";
    dateString += (date.getDate());
    dateString += " ";
    dateString += (date.getHours());
    dateString += ":";
    dateString += (date.getMinutes());
    return dateString;
  }

  compareLastName = (a, b) => {
    if (a.employee.last_name < b.employee.last_name) return -1;
    if (a.employee.last_name > b.employee.last_name) return 1;
    return 0;
  }

  comparePayId = (a, b) => {
    if (a.id > b.id) return -1;
    if (a.id < b.id) return 1;
    return 0;
  }


  this.initialize = () => {
    $http({
      url: this.url + '/employers/1',
      method: 'GET'
    }).then(response => {
      this.payPeriods = response.data.pay_periods;
      this.payPeriods.sort(comparePayId);

      for (index in this.payPeriods) {
        this.payPeriods[index].start_date = parseDateTime(this.payPeriods[index].start_date)
      }



      this.employees = response.data.employees;
    }, error => {
      // console.log(error.message);
    }).catch(err => console.log(err))
  }

  this.initialize();


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

  this.setupNew = (entry) => {
    entry.newShift = true;
    entry.start_time = new Date(this.periodStartDate);
    entry.end_time = new Date(this.periodStartDate);
    addHours(entry.start_time, 9);
    addHours(entry.end_time, 17)
    addDays(entry.start_time, this.currentDay);
    addDays(entry.end_time, this.currentDay);
    console.log(entry.start_time);
    console.log(entry.end_time);
  }





  this.loadWeek = () => {

    this.currentPeriod = this.selectedPeriod;
    $http({
      url: this.url + '/pay_periods/1',
      method: 'GET'
    }).then(response => {
      this.scheduleEntries = response.data.schedule_entries;
      this.periodStartDate = parseDateTime(response.data.start_date);
      for (index in this.scheduleEntries) {
        this.scheduleEntries[index].start_time = parseDateTime(this.scheduleEntries[index].start_time)
        this.scheduleEntries[index].end_time = parseDateTime(this.scheduleEntries[index].end_time)
      }

      this.daySchedules = this.schedule_entries;
      if (this.selectedPeriod != null) {
        this.loadDay(0);
      }
    }, error => {
      // console.log(error.message);
    }).catch(err => console.log(err))


  }

  this.loadDay = (dayOfWeek) => {
    this.daySchedules = null;
    this.currentDay = dayOfWeek;


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
            newLine.newShift = false;
          }
        }
        if (this.daySchedules == null) {
          this.daySchedules = [newLine];
        }
        else {
          this.daySchedules.push(newLine);
        }
        this.daySchedules.sort(compareLastName);
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
    $http({
      url: this.url + '/schedule_entries/' + entry.schedule_entry.id,
      method: 'PUT',
      data: params
    }).then(response => {
      this.loadDay(this.currentDay);
    }, error => {
      console.log(error.message);
    }).catch(err => console.log(err))
  }

  this.deleteEntry = (entry) => {

    $http({
      url: this.url + '/schedule_entries/' + entry.schedule_entry.id,
      method: 'DELETE',
    }).then(response => {
      delete entry;
      this.loadDay(this.currentDay);
    }, error => {
      console.log(error.message);
    }).catch(err => console.log(err))
  }

  this.newShift = (entry) => {
    params = {
      employee_id: entry.employee.id,
      employer_id: entry.employee.employer_id,
      pay_period_id: this.currentPeriod,
      start_time: convertDate(entry.start_time),
      end_time: convertDate(entry.end_time)
    }

    $http({
      url: this.url + '/schedule_entries',
      method: 'POST',
      data: params
    }).then(response => {
      this.loadDay(this.currentDay);
    }, error => {
      console.log(error.message);
    }).catch(err => console.log(err))


  }

  this.createWeek = () => {
    newStart = new Date(this.payPeriods[0].start_date);
    addDays(newStart, 7);
    params = {
      employer_id: this.employer,
      start_date: convertDate(newStart)
    }
    $http({
      url: this.url + '/pay_periods',
      method: 'POST',
      data: params
    }).then(response => {
      this.initialize();
    }, error => {
      console.log(error.message);
    }).catch(err => console.log(err))
  }

  this.createEmployee = () => {
    params = {
      employer_id: this.employer,
      first_name: this.newUser.first_name,
      last_name: this.newUser.last_name
    }
    $http({
      url: this.url + '/employees',
      method: 'POST',
      data: params
    }).then(response => {
      this.initialize();
    }, error => {
      console.log(error.message);
    }).catch(err => console.log(err))
  }


}]);