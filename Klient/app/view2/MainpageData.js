var sliderVal=1;
var enemyType="general";
var choosedSeason=1;
var currentSeason=1;
var flagg=false; //flagg..

/**
 * enemyType lagt till för funktionen som dropdown menyn för fiendetyp använder.
 * Slås ihop med Dani, Alican och Fadis uppladdning, denna kommentar är för debug
 * ifall det inte fungerar efter ihopslagning.
 */
var enemyType="bugs";

function evalSlider2() {

    sliderVal = document.getElementById('rating').value;
    document.getElementById('sliderValue').innerHTML = sliderVal;
}

function saveEnemyType(){

    enemyType=document.getElementById('enemyType').value;
}


function createSelectOptions(){
 //  document.write("in test: "+currentSeason);
    var x = document.getElementById('seasons');
    if(flagg!=true) {
        for (i = 1; i <= currentSeason; i++) {
            var option = document.createElement("option");
            option.text = i;
            x.add(option);
        }
        flagg=true;
    }
}

function saveSeason(){
    choosedSeason=document.getElementById('seasons').value;
}

var app = angular.module('app', [], function($httpProvider){

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
});



/**
 *  Denna funktion modifierades av Teddy & Carlos för att fungera med drop-down
 *  menyn. Anropen bör ske med parametrarna season, start, end. Statiska värden
 *  lagt till för befintliga anrop till dataService. Dessa anrop till service bör ses till om det
 *  int fungerar som det bör.
 */
app.service('dataService', function($http) {
    
    this.getData = function(season, start, end) {

        // $http() returns a $promise that we can add handlers with .then()
        return $http({
            method: 'GET',
            url: "http://localhost:8080/GetSnapshots",
            //params: {"season": choosedSeason, "start": sliderVal, "end": sliderVal}
            params: {"season": season, "start": start, "end": end}
        });
    };

    this.getCampaign=function () {

        return $http({
            method:'GET',
            url:"http://localhost:8080/GetCampaignStatus"
        });
    };
});


app.controller("WebApiCtrl", function($scope, dataService) {

    $scope.data = null;

    dataService.getData(sliderVal, sliderVal, sliderVal).then(function (dataResponse) {
        $scope.data = dataResponse;
    });

    $scope.evalSlider = function () {
        dataService.getData(sliderVal, sliderVal, sliderVal).then(function (dataResponse) {
            $scope.data = dataResponse;
        });
    };

    $scope.camp=function () {
        dataService.getData(sliderVal, sliderVal, sliderVal).then(function (dataResponse) {
            $scope.data = dataResponse;
        });
    };
    $scope.getSeason=function () {
        dataService.getCampaign().then(function (dataResponse) {
            $scope.trubble = dataResponse;
            currentSeason = dataResponse.data.campaign_status[1].season;
            createSelectOptions();
        });
    };
    
    $scope.defaultSlide = function () {
        return 1;
    };

    // möjliggöra dynamisk ändring --> kommer att användas senare
    $scope.getEventSize = function () {
        return 50;
    };

    /**fixed currentsSeason in getCampaign function. It gets the currentSeason**/
    dataService.getCampaign().then(function(response){
        $scope.campaign=response.data;
        currentSeason = response.data.campaign_status[0].season;
    });

    /**
     * Lagt till från Teddy & Carlos för val av fiende/globala värden i dropdown meny
     */
    /**
     saveEnemyType - current start + end value should be dynamic
     **/
    $scope.selectStatisticsInSeason = function (){
        var def_events = [];
        enemyType=document.getElementById('enemyType').value;
        dataService.getData(currentSeason, 2, 2).then(function(response)
        {
            if(enemyType == "global_stats")
            {
                $scope.data = response.data;
            }
            else
            {
                var i;
                if(response.data.defend_events != null)
                {
                    for(i =0;i<response.data.defend_events.length;i++)
                    {
                        if(response.data.defend_events[i].enemy == enemyType)
                        {
                            def_events.push(response.data.defend_events[i]);
                        }
                    }
                    $scope.data = def_events;
                }
            }
        });
    };

});