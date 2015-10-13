/**
 * Upwork Calendar
 */

if (typeof jQuery == 'undefined') {
    throw new Error('Load jQuery 2.1.4 please');
}

/**
 * Init calendar
 *
 * @param params
 * @returns {*}
 */
$.fn.upworkCalendar = function (params) {

    this.each(function () {
        var $upworkCalendar = $(this);
        var $calendarBoxHtml = $('<div class="calendarBox"></div>');

        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        var dateStartYear, dateStartMonth, currentMonth, currentYear, currentDaysCount, currentDaysInMonth;
        var eventsData = [];

        initDates();
        drawCalendarHeader();
        drawCalendar();
        bindEventToTable();

        $upworkCalendar.find(".calendarBox .tdLeftArrow" ).bind( "click", function() {
            dateStartMonth--;
            if(dateStartMonth <= 0) {
                dateStartYear--;
                dateStartMonth = 11;
            }
            if( (dateStartYear >= 1901) ) {
                initDates(dateStartYear, dateStartMonth);
                drawCalendar();
                updateCalendarHeader();
                bindEventToTable();
            }
        });

        $upworkCalendar.find(".calendarBox .tdRightArrow" ).bind( "click", function() {
            dateStartMonth++;
            if(dateStartMonth === 12) {
                dateStartYear++;
                dateStartMonth = 0;
            }
            initDates(dateStartYear, dateStartMonth);
            drawCalendar();
            updateCalendarHeader();
            bindEventToTable();
        });

        $upworkCalendar.find(".calendarBox .calendarMonthYearDiv" ).bind( "click", function() {
            var currentYearSelector, currentYearSelected, currentMonthSelected;
            var container = $upworkCalendar.find(".popupDiv");
            if(container.val() === "") {
                if(container.is(":visible")) {
                    container.hide();
                } else {
                    container.show();
                }

            } else {
                currentYearSelector = currentYear;

                var $popupDiv = $('<div class="popupDiv"></div>');
                var $popupBox = $('<div class="popupBox"></div>');

                var $tableWithSwitch = $('<table class="switchYear"></table>');

                $tableWithSwitch.append('<tr>' +
                '<td class="leftArrowTd"><div class="leftArrow"></div></td>' +
                '<td></td><td></td><td></td>' +
                '<td class="rightArrowTd"><div class="rightArrow"></div></td>' +
                '</tr>');

                $popupBox.append($tableWithSwitch);

                var $tableWithYear = drawSelectYear();

                $popupBox.append($tableWithYear);
                $popupDiv.append($popupBox);

                $calendarBoxHtml.find('.tableHeader').after($popupDiv);

                $popupDiv.fadeIn('slow', function() {

                });

                $upworkCalendar.find(".calendarBox .switchYear .leftArrowTd" ).bind( "click", function() {
                    currentYearSelector = currentYearSelector - 15;
                    if(currentYearSelector < 1916) {
                        currentYearSelector = 1916;
                    }
                    var $tableWithYear = drawSelectYear();
                    $upworkCalendar.find(".calendarBox .popupBox").append($tableWithYear);
                    setSelectMonthEvent();
                });

                $upworkCalendar.find(".calendarBox .switchYear .rightArrowTd" ).bind( "click", function() {
                    currentYearSelector = currentYearSelector + 15;
                    var $tableWithYear = drawSelectYear();
                    $upworkCalendar.find(".calendarBox .popupBox").append($tableWithYear);
                    setSelectMonthEvent();
                });

                setSelectMonthEvent();

                $(document).mouseup(function (e)
                {
                    var container = $upworkCalendar.find(".popupDiv");
                    var containerButton = $upworkCalendar.find(".calendarMonthYearDiv");

                    if (!container.is(e.target)
                        && !containerButton.is(e.target)
                        && containerButton.has(e.target).length === 0
                        && container.has(e.target).length === 0)
                    {
                        container.fadeOut('slow' , function() {
                            container.hide();
                        });
                    }
                });
            }

            function setSelectMonthEvent() {
                $upworkCalendar.find(".calendarBox .chooseYear .containYear td" ).bind( "click", function() {
                    currentYearSelected = parseInt($(this).html());
                    var $tableWithMonth = drawSelectMonth();
                    $upworkCalendar.find(".calendarBox .popupBox").append($tableWithMonth);
                    $upworkCalendar.find(".calendarBox .popupDiv").css("margin-left", 131);
                    $upworkCalendar.find(".calendarBox .chooseMonth .containMonth td" ).bind( "click", function() {
                        currentMonthSelected = parseInt($(this).find('input').val());
                        $upworkCalendar.find('.popupDiv').fadeOut('slow' , function() {
                            $upworkCalendar.find('.popupDiv').remove();
                        });
                        dateStartMonth = currentMonthSelected;
                        dateStartYear = currentYearSelected;
                        initDates(dateStartYear, dateStartMonth);
                        drawCalendar();
                        updateCalendarHeader();
                        bindEventToTable();
                    });
                });
            }

            function drawSelectMonth() {
                $upworkCalendar.find(".calendarBox .popupDiv .chooseYear" ).remove();
                $upworkCalendar.find(".calendarBox .popupDiv .switchYear" ).remove();
                var $tableWithMonth = $('<table class="chooseMonth"></table>');
                var $tableWithMonthTr;
                for(var i = 0; i<=2; i++) {
                    $tableWithMonthTr = $('<tr class="containMonth"></tr>');
                    for(var j = 0; j <= 3; j++) {
                        $tableWithMonthTr.append('<td>' + monthNames[ i * 4 + j] + '<input type="hidden" value="'+ (i * 4 + j) +'"/></td>');
                    }
                    $tableWithMonth.append($tableWithMonthTr);
                }
                return $tableWithMonth;
            }

            function drawSelectYear() {
                $upworkCalendar.find(".calendarBox .popupDiv .chooseYear" ).remove();
                var $tableWithYear = $('<table class="chooseYear"></table>');
                var $tableWithYearTr;
                var lastSelectYear = currentYearSelector - 15;
                if(lastSelectYear < 1901) {
                    lastSelectYear = 1901;
                }
                for(var i = 0; i<=3; i++) {
                    $tableWithYearTr = $('<tr class="containYear"></tr>');
                    for(var j = 0; j <=4; j++) {
                        $tableWithYearTr.append('<td>' + ( lastSelectYear ) + '</td>');
                        lastSelectYear++;
                    }
                    $tableWithYear.append($tableWithYearTr);
                }
                return $tableWithYear;
            }
        });


        function initDates(dateStartYearNew, dateStartMonthNew) {
            var startDate = new Date();

            if(dateStartYear === undefined) {
                dateStartYearNew = parseInt(startDate.getFullYear());
            }
            if(dateStartMonth === undefined) {
                dateStartMonthNew =  parseInt(startDate.getMonth() + 1) - 1;
            }

            dateStartYear = dateStartYearNew;
            dateStartMonth = dateStartMonthNew;

            var dateStartObject = new Date(dateStartYear, dateStartMonth, 1, 0, 0, 0, 0);
            var dateToGetCountOfDays = new Date(dateStartYear, dateStartMonth + 1, 0);

            currentMonth = dateStartObject.getMonth();
            currentYear = dateStartObject.getFullYear();
            currentDaysCount = dateStartObject.getDay();
            currentDaysInMonth = dateToGetCountOfDays.getDate();
        }

        function updateCalendarHeader() {
            $upworkCalendar.find('.tableHeader .calendarMonthYearDiv').html(monthNames[currentMonth] + ' ' + currentYear);
        }

        function drawCalendarHeader() {
            $upworkCalendar.find('.tableHeader').remove();
            //add table header
            var $tableHeader = $('<table class="tableHeader">' +
            '<tr>' +
            '<td class="tdLeftArrow"><div class="leftArrowBox"><div class="leftArrow"></div></div></td>' +
            '<td class="calendarMonthYearTd"><div class="calendarMonthYearDiv">' + monthNames[currentMonth] + ' ' + currentYear + '</div></td>' +
            '<td class="tdRightArrow"><div class="rightArrowBox"><div class="rightArrow"></div></div></td>' +
            '</tr>' +
            '</table>');

            $calendarBoxHtml.append($tableHeader);

            /////////////////
        }

        function bindEventToTable() {
            $upworkCalendar.find(".calendarBox .tableCalendar .addEvent td" ).bind( "click", function() {
                var $eventDay = $(this);

                var dayNumber = parseInt($(this).html());
                var container = $upworkCalendar.find(".calendarBox .popupEventDiv");
                if(!isNaN(dayNumber)) {
                    if(container.val() === "") {
                        if(container.hasClass('popupEventDay'+dayNumber)) {
                            container.fadeOut('slow' , function() {
                                container.remove();
                            });
                            $upworkCalendar.find('.tableCalendar .addEvent td').removeClass('eventSelected');
                        } else {
                            container.fadeOut('slow' , function() {
                                container.remove();
                            });
                            $upworkCalendar.find('.tableCalendar .addEvent td').removeClass('eventSelected');
                            initEventPopup();
                        }
                    } else {
                        initEventPopup();
                    }
                } else {
                    container.fadeOut('slow' , function() {
                        container.remove();
                    });
                    $upworkCalendar.find('.tableCalendar .addEvent td').removeClass('eventSelected');
                }

                function initEventPopup() {
                    var position = $eventDay.position();

                    var left = position.left + $eventDay.width() + 12;
                    var top = position.top + $eventDay.height()/2 - 78;

                    var $popupEventDiv = $('<div class="popupEventDiv"></div>');
                    var $popupEventBox = $('<div class="popupEventBox"></div>');
                    $popupEventBox.append('' +
                        '<textarea placeholder="Some event!"></textarea>' +
                        '<div class="btnContainer">' +
                        '<a class="btnSave">Save</a>'+
                        '<a class="btnCancel">Cancel</a>' +
                        '</div>'
                    );

                    if( (eventsData !== undefined)
                        && (eventsData[dateStartYear] !== undefined)
                        && (eventsData[dateStartYear][currentMonth] !== undefined)
                        && (eventsData[dateStartYear][currentMonth][dayNumber] !== undefined)
                    ) {
                        $popupEventBox.find('textarea').val(eventsData[dateStartYear][currentMonth][dayNumber]);
                        $eventDay.addClass('eventExistsSelected');
                    } else {
                        $eventDay.addClass('eventSelected');
                    }

                    $popupEventDiv.append($popupEventBox);
                    $popupEventDiv.css('top', top).css('left', left);
                    $popupEventDiv.addClass('popupEventDay'+dayNumber);
                    $upworkCalendar.find(".calendarBox").append($popupEventDiv);

                    $popupEventDiv.fadeIn('slow', function() {

                    });

                    $upworkCalendar.find(".calendarBox .popupEventDiv .popupEventBox .btnContainer .btnSave" ).bind( "click", function() {
                        var container = $upworkCalendar.find(".calendarBox .popupEventDay"+dayNumber);
                        var textareaVal = container.find('textarea').val();
                        if( (eventsData[dateStartYear] !== undefined)
                            && (eventsData[dateStartYear][currentMonth] !== undefined)
                            && (eventsData[dateStartYear][currentMonth][dayNumber] !== undefined)
                        ) {
                            if(textareaVal === '') {
                                delete eventsData[dateStartYear][currentMonth][dayNumber];
                                $eventDay.removeClass('eventExistsSelected');
                            } else {
                                if( eventsData[dateStartYear] === undefined) {
                                    eventsData[dateStartYear] = [];
                                }
                                if( eventsData[dateStartYear][currentMonth] === undefined) {
                                    eventsData[dateStartYear][currentMonth] = [];
                                }
                                eventsData[dateStartYear][currentMonth][dayNumber] = textareaVal;
                                $eventDay.addClass('eventExistsSelected');
                            }
                        } else {
                            if( eventsData[dateStartYear] === undefined) {
                                eventsData[dateStartYear] = [];
                            }
                            if( eventsData[dateStartYear][currentMonth] === undefined) {
                                eventsData[dateStartYear][currentMonth] = [];
                            }
                            eventsData[dateStartYear][currentMonth][dayNumber] = textareaVal;
                            $eventDay.addClass('eventExistsSelected');
                        }
                        $upworkCalendar.find(".calendarBox .popupEventDiv").fadeOut('slow', function() {
                            $upworkCalendar.find(".calendarBox .popupEventDiv").remove();
                        });
                        $upworkCalendar.find('.tableCalendar .addEvent td').removeClass('eventSelected');

                    });

                    $upworkCalendar.find(".calendarBox .popupEventDiv .popupEventBox .btnContainer .btnCancel" ).bind( "click", function() {
                        $upworkCalendar.find(".calendarBox .popupEventDiv").fadeOut('slow', function() {
                            $upworkCalendar.find(".calendarBox .popupEventDiv").remove();
                        });
                        $upworkCalendar.find('.tableCalendar .addEvent td').removeClass('eventSelected');

                    });

                    $(document).mouseup(function (e)
                    {
                        var container = $upworkCalendar.find(".popupEventDiv");
                        var containerButton = $upworkCalendar.find(".tableCalendar .addEvent td");

                        if (!container.is(e.target)
                            && !containerButton.is(e.target)
                            && containerButton.has(e.target).length === 0
                            && container.has(e.target).length === 0)
                        {
                            $upworkCalendar.find('.tableCalendar .addEvent td').removeClass('eventSelected');

                            container.fadeOut('slow' , function() {
                                container.remove();
                            });
                        }
                    });
                }
            });
        }

        function drawCalendar() {
            $upworkCalendar.find('.tableCalendar').remove();

            var $tableBody = $('<table class="tableCalendar"></table>');

            //add day names
            var $dayNames = $('<tr class="dayNames"></tr>');

            $.each(dayNames, function( index, value ) {
                $dayNames.append('<th>'+value+'</th>');
            });
            $tableBody.append($dayNames);
            $calendarBoxHtml.append($tableBody);
            /////////////////


            //add time
            var lastDay = 0;
            for(var i = 0; i <= 5; i++) {
                var $trString = $('<tr class="addEvent"></tr>');
                if(i === 0) {
                    for(var j = 1; j <= currentDaysCount; j++) {
                        $trString.append('<td></td>');
                    }

                    for(var j = currentDaysCount + 1; j <= 7; j++) {
                        $trString.append('<td class="eventNumber' + (j - currentDaysCount) + '"> ' + (j - currentDaysCount) + '</td>');
                    }

                    lastDay = 7 - currentDaysCount + 1;
                }
                if( (i > 0) && (i < 4)) {
                    for(var j = lastDay; j < lastDay + 7; j++) {
                        $trString.append('<td class="eventNumber' + j + '">' + j + '</td>');
                    }
                    lastDay = lastDay + 7;
                }

                if(i === 4) {
                    if(lastDay + 7 <= currentDaysInMonth) {
                        for(var j = lastDay; j < lastDay + 7; j++) {
                            $trString.append('<td class="eventNumber' + j + '">' + j + '</td>');
                        }
                    } else {
                        for(var j = lastDay; j <= currentDaysInMonth; j++) {
                            $trString.append('<td class="eventNumber' + j + '">' + j + '</td>');
                        }

                        for(var j = lastDay + currentDaysInMonth; j <= lastDay + 7; j++) {
                            $trString.append('<td></td>');
                        }
                    }
                    lastDay = lastDay + 7;
                }

                if( ((lastDay <= currentDaysInMonth)) && (i === 5)) {
                    for(var j = lastDay; j <= currentDaysInMonth; j++) {
                        $trString.append('<td class="eventNumber' + j + '">' + j + '</td>');
                    }

                    for(var j = lastDay + currentDaysInMonth; j <= lastDay + 7; j++) {
                        $trString.append('<td></td>');
                    }
                }
                $tableBody.append($trString);
            }

            /////////////////
            $calendarBoxHtml.append($tableBody);
            $upworkCalendar.append($calendarBoxHtml);
            setExistedEventsLabels();

        }
        function setExistedEventsLabels() {
            if( (eventsData !== undefined)
                && (eventsData[dateStartYear] !== undefined)
                && (eventsData[dateStartYear][currentMonth] !== undefined)
            ) {
                $.each(eventsData[dateStartYear][currentMonth], function( index, value ) {
                    if(value !== undefined) {
                        $upworkCalendar.find('.tableCalendar .addEvent .eventNumber'+index).addClass('eventExistsSelected');
                    }
                });
            }
        }

    });
};