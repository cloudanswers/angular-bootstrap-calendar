'use strict';

var angular = require('angular');

angular
  .module('mwl.calendar')
  .controller('MwlCalendarWeekCtrl', function($scope, $sce, moment, calendarHelper, calendarConfig) {

    var vm = this;

    vm.showTimes = calendarConfig.showTimesOnWeekView;
    vm.$sce = $sce;

    $scope.$on('calendar.refreshView', function() {
      vm.dayViewSplit = vm.dayViewSplit || 30;
      vm.dayViewHeight = calendarHelper.getDayViewHeight(
        vm.dayViewStart,
        vm.dayViewEnd,
        vm.dayViewSplit
      );
      if (vm.showTimes) {
        vm.view = calendarHelper.getWeekViewWithTimes(
          vm.events,
          vm.viewDate,
          vm.dayViewStart,
          vm.dayViewEnd,
          vm.dayViewSplit
        );
      } else {
        vm.view = calendarHelper.getWeekView(vm.events, vm.viewDate);
      }

      vm.view.allDayEvents = vm.arrangeAllDay(vm.view.events.filter(function(event) {
        return event.allDay || !moment(event.startsAt).isSame(event.endsAt, 'day');
      }));

      vm.view.nonAllDayEvents = vm.view.events.filter(function(event) {
        return !event.allDay && moment(event.startsAt).isSame(event.endsAt, 'day');
      });

    });

    vm.arrangeAllDay = function(events) {
      var rows = [];
      angular.forEach(events, function(e) {
        var rowInsert = -1;
        e.draggable = e.daySpan !== 7;
        for (var i = 0; i < rows.length; i++) {
          if (vm.fitsInRow(e, rows[i])) {
            rowInsert = i;
            break;
          }
        }
        if (rowInsert === -1) {
          rows.push([e]);
        } else {
          rows[rowInsert].push(e);
        }
      });
      return rows;
    };

    vm.getSlotsTaken = function(e) {
      var slotsTaken = [];
      for (var i = e.dayOffset; i < e.dayOffset + e.daySpan; i++) {
        slotsTaken.push(i);
      }
      return slotsTaken;
    };

    vm.fitsInRow = function(event, row) {
      var rowSlotsTaken = [];
      var eventSlotsTaken = vm.getSlotsTaken(event);
      for (var x = 0; x < row.length; x++) {
        rowSlotsTaken = rowSlotsTaken.concat(vm.getSlotsTaken(row[x]));
      }
      for (var i = 0; i < eventSlotsTaken.length; i++) {
        if (rowSlotsTaken.includes(eventSlotsTaken[i])) {
          return false;
        }
      }
      return true;
    };

    vm.weekDragged = function(event, daysDiff, minuteChunksMoved) {

      var newStart = moment(event.startsAt).add(daysDiff, 'days');
      var newEnd = moment(event.endsAt).add(daysDiff, 'days');

      if (minuteChunksMoved) {
        var minutesDiff = minuteChunksMoved * vm.dayViewSplit;
        newStart = newStart.add(minutesDiff, 'minutes');
        newEnd = newEnd.add(minutesDiff, 'minutes');
      }

      delete event.tempStartsAt;

      vm.onEventTimesChanged({
        calendarEvent: event,
        calendarNewEventStart: newStart.toDate(),
        calendarNewEventEnd: event.endsAt ? newEnd.toDate() : null
      });
    };

    vm.eventDropped = function(event, date) {
      var daysDiff = moment(date).diff(moment(event.startsAt), 'days');
      vm.weekDragged(event, daysDiff);
    };

    vm.weekResized = function(event, edge, daysDiff) {

      var start = moment(event.startsAt);
      var end = moment(event.endsAt);
      if (edge === 'start') {
        start.add(daysDiff, 'days');
      } else {
        end.add(daysDiff, 'days');
      }

      vm.onEventTimesChanged({
        calendarEvent: event,
        calendarNewEventStart: start.toDate(),
        calendarNewEventEnd: end.toDate()
      });

    };

    vm.tempTimeChanged = function(event, minuteChunksMoved, ignore) {
      if (ignore) {
        return;
      }
      var minutesDiff = minuteChunksMoved * vm.dayViewSplit;
      event.tempStartsAt = moment(event.startsAt).add(minutesDiff, 'minutes').toDate();
    };

  })
  .directive('mwlCalendarWeek', function(calendarConfig) {

    return {
      templateUrl: calendarConfig.templates.calendarWeekView,
      restrict: 'E',
      require: '^mwlCalendar',
      scope: {
        events: '=',
        viewDate: '=',
        onEventClick: '=',
        onEventTimesChanged: '=',
        dayViewStart: '=',
        dayViewEnd: '=',
        dayViewSplit: '=',
        dayViewEventChunkSize: '=',
        onTimespanClick: '='
      },
      controller: 'MwlCalendarWeekCtrl as vm',
      link: function(scope, element, attrs, calendarCtrl) {
        scope.vm.calendarCtrl = calendarCtrl;
      },
      bindToController: true
    };

  });
