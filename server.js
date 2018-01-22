const express = require('express');
const app = express();
const session = require('express-session');
const PORT = process.env.PORT || 3001;
app.listen(PORT, console.log('Scheduler App Listening on port: ', PORT));

// ==============
// MIDDLEWARE
// ==============

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(session({
  secret: 'aoi339801n1ndlkwafjj3k2l220dk',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static('public'));

// ==============
// CONTROLLERS
// ==============
const adminScheduleController = require('./controllers/admin.js')
const employeeScheduleController = require('./controllers/employee.js')
const loginController = require('./controllers/login.js')

// ==============
// USE OF CONTROLLERS
// ==============

app.use('/admin', adminScheduleController);
app.use('/employee', employeeScheduleController);
app.use('/login', loginController);

// ==============
// ROUTES
// ==============

app.get('/', (req, res) => {
  res.render("index.ejs");
});
