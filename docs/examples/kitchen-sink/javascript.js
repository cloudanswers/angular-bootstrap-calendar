angular
  .module('mwl.calendar.docs') //you will need to declare your module with the dependencies ['mwl.calendar', 'ui.bootstrap', 'ngAnimate']
  .config(function(calendarConfig) {
    calendarConfig.showTimesOnWeekView = true; //Make the week view more like the day view, with the caveat that event end times are ignored.
  })
  .controller('KitchenSinkCtrl', function(moment, alert) {

    var vm = this;

    //These variables MUST be set as a minimum for the calendar to work
    vm.calendarView = 'month';
    vm.viewDate = new Date();

    vm.events = [
      {
        id: 'xxxxx',
        title: 'An event multi day',
        type: 'warning',
        startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
        endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
        draggable: true,
        resizable: true,
        allDay: true
      }, {
        id: 'yyyyy',
        title: 'some ish',
        type: 'info',
        startsAt: moment().add(2, 'days').toDate(),
        endsAt: moment().add(5, 'days').toDate(),
        draggable: true,
        resizable: true
      }, {
        id: 'dd',
        title: 'boom',
        type: 'info',
        startsAt: moment().add(4, 'days').toDate(),
        endsAt: moment().add(4, 'days').add(30, 'minutes').toDate(),
        draggable: true,
        resizable: true,
        allDay: true
      }, {
        id: 'xees',
        title: 'whatevz',
        type: 'info',
        startsAt: moment().add(2, 'days').toDate(),
        endsAt: moment().add(2, 'days').add(30, 'minutes').toDate(),
        draggable: true,
        resizable: true,
        allDay: true
      }, {
        id: 'zzzz',
        title: 'This is a really long event title that occurs on every year',
        type: 'important',
        startsAt: moment().startOf('day').add(7, 'hours').toDate(),
        endsAt: moment().startOf('day').add(19, 'hours').toDate(),
        recursOn: 'year',
        draggable: true,
        resizable: true
      }, {
        id: 'ddsdfeff',
        title: 'Yessiree bob',
        type: 'important',
        startsAt: moment().startOf('day').add(31, 'hours').toDate(),
        endsAt: moment().startOf('day').add(34, 'hours').toDate(),
        draggable: true,
        resizable: true
      }
    ];

    vm.isCellOpen = true;

    vm.eventClicked = function(event) {
      alert.show('Clicked', event);
    };

    vm.eventEdited = function(event) {
      alert.show('Edited', event);
    };

    vm.eventDeleted = function(event) {
      alert.show('Deleted', event);
    };

    vm.eventTimesChanged = function(event) {
      alert.show('Dropped or resized', event);
    };

    vm.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

  });
