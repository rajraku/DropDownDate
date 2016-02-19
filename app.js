var app = angular.module('MyTestApp', []);
app.value("_$userDetails", { UserName: 'Raj', Country: 'India'});
app.constant("_$monthNames", ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]);
app.directive("dropdownDate", ['dateFilter', '_$monthNames', function(dateFilter, _$monthNames) {

	function updateArrays(scope)
	{
		var stDt = new Date(scope.startDate);
		var edDt = new Date(scope.endDate);
		
		updateYearArrays(scope, stDt, edDt)
		udpateMonthArrays(scope, stDt, edDt);
		udpateDayArrays(scope, stDt, edDt);
	}
	
	function updateSelectedDate(scope)
	{
		if(typeof scope.selectedYear != 'undefined' && typeof scope.selectedMonth != 'undefined' && typeof scope.selectedDate != 'undefined' &&
		   scope.selectedYear != '' && scope.selectedMonth != '' && scope.selectedDate != '')
		{
			scope.ngModel = scope.selectedYear + '-' + (parseInt(scope.selectedMonth) + 1) + '-' + scope.selectedDate;			
	    }
		else
		{
			scope.ngModel = '';
		}
	}
	
	function onYearChange(scope)
	{
		var stDt = new Date(scope.startDate);
		var edDt = new Date(scope.endDate);
		
		udpateMonthArrays(scope, stDt, edDt);
		updateSelectedDate(scope);
	}
	
	function onMonthChange(scope)
	{
		var stDt = new Date(scope.startDate);
		var edDt = new Date(scope.endDate);
		
		udpateDayArrays(scope, stDt, edDt);
		updateSelectedDate(scope);
	}
	
	function onDateChange(scope)
	{
		updateSelectedDate(scope);
	}
	
	function updateYearArrays(scope, stDt, edDt)
	{
		var diffYears = new Array();
		var startYear = stDt.getFullYear();
		var endYear = edDt.getFullYear();
		
		for(var i=startYear; i<=endYear; i++)
		{
			diffYears.push({ key: i.toString(), value: i.toString()});
		}
		scope.years = diffYears;
		if(startYear == endYear)
		{
			scope.selectedYear = startYear.toString();
		}
	}
	
	function udpateMonthArrays(scope, stDt, edDt)
	{
		var diffMonths = new Array();
		if(typeof scope.selectedYear != 'undefined' && scope.selectedYear != '')
		{
			var stMonth = scope.selectedYear != stDt.getFullYear() ? 0 : stDt.getMonth();
			var edMonth = stDt.getMonth();
			if(scope.selectedYear == edDt.getFullYear())
			{
				edMonth = edDt.getMonth();
			}			
			else
			{
				edMonth = 11;
			}
			
			for(var i = stMonth; i<=edMonth; i++)
			{
				diffMonths.push({key: i.toString(), value: _$monthNames[i] });
			}
			if(stMonth == edMonth) scope.selectedMonth = stMonth.toString();
			if(scope.selectedMonth < stMonth || scope.selectedMonth > edMonth)
			{
				scope.selectedMonth = '';
			}
		}
		else
		{
			scope.selectedMonth = '';
		}
		scope.months = diffMonths;		
	}
	
	function udpateDayArrays(scope, stDt, edDt)	
	{
		var diffDays = new Array();
		if(typeof scope.selectedYear != 'undefined' && typeof scope.selectedMonth != 'undefined' && scope.selectedYear != '' && scope.selectedMonth != '')
		{				
			var stDate = 1;
			var edDate = new Date(scope.selectedYear, scope.selectedMonth+1, 0).getDate();
			
			if(scope.selectedYear == edDt.getFullYear() && scope.selectedMonth == edDt.getMonth())
			{
				edDate = edDt.getDate();
			}			
			else if(scope.selectedYear == stDt.getFullYear() && scope.selectedMonth == edDt.getMonth())
			{
				stDate = stDt.getDate();
			}
			
			for(var i = stDate; i<=edDate; i++)
			{
				diffDays.push({ key:i.toString(), value: i.toString()});
			}
			if(stDate == edDate) 
			{
				scope.selectedDate = stDate.toString();
				console.log('Changed date');
			}
			if(scope.selectedDate <stDate || scope.selectedDate > edDate)
			{
				scope.selectedDate  = '';
			}
		}
		else
		{
			scope.selectedDate  = '';
		}
		scope.days = diffDays;
	}

return {
	
	scope: {  startDate: "=sd", endDate: "=ed", ngModel: "=" },
	templateUrl: './dateControl.html',
	link: function(scope, element, attributes, controller)
	{	
		scope.years= [];
		scope.months= [];
		scope.days= [];
		if(scope.startDate != 'undefined' && scope.endDate != 'undefined')
		{
			updateArrays(scope);
		}
		scope.$watch('selectedYear', function(){ onYearChange(scope); });
		scope.$watch('selectedMonth', function(){ onMonthChange(scope); });
		scope.$watch('selectedDate', function(){ onMonthChange(scope); });
		scope.$watch('startDate', function(){ updateArrays(scope); });
		scope.$watch('endDate', function(){ updateArrays(scope); });
	}
};
	
}]);

app.controller('OptionsController', ['$scope', 'dateFilter', function($scope, dateFilter){
	$scope.startDateConfig = { RangeStart: '2016-1-1', RangeEnd: '2017-12-31', SelectedDate: '' };
	$scope.endDateConfig = { RangeStart: '2016-1-1', RangeEnd: '2017-12-31', SelectedDate: ''};	
	$scope.$watch('startDateConfig.SelectedDate', function() { 
		$scope.endDateConfig.RangeStart = $scope.startDateConfig.SelectedDate != '' ? 
												$scope.startDateConfig.SelectedDate : 
												$scope.startDateConfig.RangeStart; 
	});
	$scope.$watch('endDateConfig.RangeStart', function() { 
		var rangeEnd = new Date($scope.endDateConfig.RangeStart);
		rangeEnd = new Date(rangeEnd.getFullYear(), rangeEnd.getMonth(), rangeEnd.getDate() + 179);
		$scope.endDateConfig.RangeEnd = dateFilter(rangeEnd, 'yyyy-MM-dd'); 
	});
}]);

app.run(['$rootScope', '_$userDetails', function($rootScope, _$userDetails) {
	$rootScope._$userDetails = _$userDetails;
}]);