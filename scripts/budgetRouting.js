//==========[Define Globals]==========//
var budgetApp = angular.module("budgetApp", ['ngRoute']);

//==========[Define Routes for App]==========//
budgetApp.config(["$routeProvider", function($routeProvider){
	$routeProvider
	.when("/", {
		templateUrl: "pages/budgetFront.html",
		controller: "incomeController"
	})

	.when("/budgetCalc/:income", {
		templateUrl: "pages/budgetMain.html",
		controller: "budgetController"
	})
}]);


//==========[Define Income Controller]==========//
budgetApp.controller("incomeController", ["$scope", "$log", "$routeParams", function($scope, $log, $routeParams){
	$scope.income = 0;
	$scope.errortext = "";

	$scope.submitIncome = function(){
		if($scope.income == NaN || $scope.income == undefined){
			$scope.errortext = "There is something wrong with the number you have selected. Please insure that your number is in the correct currency format.";
		}else{
			window.location.hash = "#!/budgetCalc/" + $scope.income; 
		}
	}


}]);


//==========[Define Budget Controller]==========//
budgetApp.controller("budgetController", ["$scope", "$log", "$routeParams", function($scope, $log, $routeParams){
	//==========[Define mainController scope variables]==========//
	$scope.billList = [];
	$scope.bill = "";
	$scope.amount = 0;
	$scope.desc = "";
	$scope.errortext = "";
	$scope.obj = {};
	$scope.total = 0;
	$scope.income = parseFloat($routeParams.income);
	$scope.incomeDisplay = accounting.formatMoney($scope.income);
	$scope.comparison = accounting.formatMoney($scope.income - $scope.total);

	//====================//
		/*
			function $scope.addBill
			-Add bill to the list and calculate total costs of all bills
			-Returns: nothing || break function on undefined

		*/
	//====================//

	$scope.addBill = function(){
		console.log($scope.bill + " " + $scope.amount + " " + $scope.desc);
		$scope.errortext = "";
		$scope.obj = {};
		$scope.obj.bill = $scope.bill;

		if($scope.amount == undefined){
			$scope.errortext = "The number you input was incorrect! Try again!";
			return;
		}

		$scope.obj.amount = $scope.amount;
		$scope.obj.desc = $scope.desc;

		console.log($scope.obj);

		if(!$scope.bill){return;}

		if($scope.billList.length > 0){
			for(var i = 0;i<$scope.billList.length;i++){
				if($scope.billList[i].bill == $scope.bill){
					$scope.errortext = "That item already exists as a bill of yours.";
					return;
				}
			}

			$scope.billList.push($scope.obj);
			$scope.total += $scope.obj.amount;
			$scope.comparison = accounting.formatMoney($scope.income - $scope.total);	
		}else if($scope.billList.length == 0){
			$scope.billList.push($scope.obj);
			$scope.total += $scope.obj.amount;
			$scope.comparison = accounting.formatMoney($scope.income - $scope.total);	
		}

		if($scope.total < $scope.income){
			if($("#budget").hasClass("alert-danger")){
				$("#budget").removeClass("alert-danger");
				$("#budget").addClass("alert-success");
			}
		}else if($scope.total > $scope.income){
			if($("#budget").hasClass("alert-success")){
				$("#budget").removeClass("alert-success");
				$("#budget").addClass("alert-danger");
			}
		}

		console.log($scope.billList);
		$scope.bill = "";
		$scope.amount = "";
		$scope.desc = "";
	}

	//====================//
		/*
			function removeBill
			-Removes bill from list and recalculate all bills
			-Returns: nothing
		*/
	//====================//

	
	$scope.removeBill = function(x){
		$scope.errortext = "";
		$scope.total -= $scope.billList[x].amount;
		$scope.comparison = accounting.formatMoney($scope.income - $scope.total);	
		$scope.billList.splice(x, 1);
	}
}]);