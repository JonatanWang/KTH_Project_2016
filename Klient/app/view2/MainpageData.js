var sliderVal=1;
var enemyType="global_stats";
var choosedSeason=1;
var currentSeason=1;
var flagg=false; //flagg..
var jsonData = null;

/**
 * enemyType lagt till för funktionen som dropdown menyn för fiendetyp använder.
 * Slås ihop med Dani, Alican och Fadis uppladdning, denna kommentar är för debug
 * ifall det inte fungerar efter ihopslagning.
 */


function evalSlider2() {

    sliderVal = document.getElementById('rating').value;
    document.getElementById('sliderValue').innerHTML = sliderVal;

    var integer = sliderVal | 0;
    var float=sliderVal%integer;

    if(float > 0.23){

        sliderVal=integer+1;
        document.getElementById('sliderValue').innerHTML= sliderVal;
        float=0;
    }
}

function isInt(number){

    if(number % 1 == 0) {

        return true;
    }
    else {

        return false;
    }
}

function createSelectOptions() {

    //  document.write("in test: "+currentSeason);
    var x = document.getElementById('seasons');
    var i;

    if (flagg != true) {

        for (i = 1; i <= currentSeason; i++) {

            var option = document.createElement("option");
            option.text = i;
            x.add(option);
        }

        flagg = true;
    }
}

function saveSeason() {
    choosedSeason = document.getElementById('seasons').value;
}

var app = angular.module('app', [], function($httpProvider){

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
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
            /*method: 'POST',
            url: 'https://api.helldiversgame.com/0.3/',*/
            method:'GET',
            url:"http://localhost:8080/GetSnapshots",
            header: 'Content-Type : application/x-www-form-urlencoded',
            //action : 'get_snapshots',
            params: {"season": season, "start": start, "end": end}


        });
    };

    this.getCampaign=function () {

        return $http({
            method:'GET',
            url:"http://localhost:8080/GetCampaignStatus",
            //method: "POST",
            //url: 'https://api.helldiversgame.com/0.3/',
            //header: 'Content-Type : application/x-www-form-urlencoded',
            //header: 'Access-Control-Allow-Origin : *',
            //header: "Accept: application/json",
            //params: {"season": choosedSeason, "start": sliderVal, "end": sliderVal}
            headers: { "Content-Type" : "application/x-www-form-urlencoded"},
            //params: {"season": season, "start": start, "end": end}
            data :'action=get_campaign_status'
        });
    };
});


app.controller("WebApiCtrl", function($scope, dataService) {

    $scope.data = null;

    dataService.getData(choosedSeason, sliderVal, sliderVal).then(function (dataResponse) {
        $scope.data = dataResponse;
    });

    $scope.evalSlider = function () {
        dataService.getData(choosedSeason, sliderVal, sliderVal).then(function (dataResponse) {
            $scope.data = dataResponse;
        });
    };

    $scope.camp=function () {
        
        enemyType=document.getElementById('enemyType').value;
        var filterOption = document.getElementById('all').value;
        var allFilter = document.getElementById('all').firstElementChild;

        if(enemyType == "global_stats")
        {
            dataService.getCampaign().then(function (dataResponse) {

                $scope.data = dataResponse.data;
            });
        }
        else //this means that other than global i chosen
        {
            dataService.getData(choosedSeason, sliderVal, sliderVal).then(function (dataResponse) {
                jsonData = dataResponse;
                
                var result = [];

                if(allFilter.value != filterOption)
                {
                    var json = dataResponse.data;
                    //console.log(json[filterOption]);
                    result = json[filterOption];
                }
                else
                {
                    if(enemyType != "globla_stats")
                    {
                        var eventslist = [];
                        for(var i=0;i<dataResponse.data.defend_events.length;i++)
                        {
                            if(enemyType == dataResponse.data.defend_events[i].enemy)
                            {
                                console.log(dataResponse.data.defend_events[i]);
                                eventslist.push(dataResponse.data.defend_events[i]);
                            }
                        }

                        for(var i=0;i<dataResponse.data.attack_events.length;i++)
                        {
                            if(enemyType == dataResponse.data.attack_events[i].enemy)
                            {
                                eventslist.push(dataResponse.data.attack_events[i]);
                            }
                        }
                        console.log(eventslist);
                        result = eventslist;
                    }
                    else
                    {
                        result = dataResponse.data;
                        console.log(result);
                    }

                }

                /*if(result == null)
                {

                    $scope.data = "there is no such option at this moment";
                }*/

                $scope.data = result;
            });
        }

    };

    $scope.getSeason = function () {

        dataService.getCampaign().then(function (dataResponse) {

            $scope.trubble = dataResponse;
            currentSeason = dataResponse.data.campaign_status[1].season;
            createSelectOptions();
            run(dataResponse.data.statistics);
            $scope.calculation=getCalculations();
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
    dataService.getCampaign().then(function (response) {

        $scope.campaign = response.data;
        currentSeason = response.data.campaign_status[0].season;
        run(response.data.statistics);
        $scope.calculation=getCalculations();
    });

    /**
     * Lagt till från Teddy & Carlos för val av fiende/globala värden i dropdown meny
     */
    /**
     saveEnemyType - current start + end value should be dynamic
     **/
    $scope.selectStatisticsInSeason = function (){
        enemyType=document.getElementById('enemyType').value;
    };

    $scope.filterData = function(){


        var element = document.getElementById('all');
        if(element.firstElementChild.nextElementSibling==null)
        {
            console.log("det är null");
        }

        if(jsonData != null && element.firstElementChild.nextElementSibling==null)
        {
            for(var datafiltered  in jsonData.data)
            {
                var option = document.createElement("option");
                option.text = datafiltered;
                //console.log(option);
                element.add(option);
            }

            /**
             * this part of filtering is not used
             * **/

            /*var option = document.createElement("option");
            option.text = "----------";
            element.add(option);

            if(jsonData.data.defend_events != null)
            {
                for(var datafiltered  in jsonData.data.defend_events[0])
                {
                    var option = document.createElement("option");
                    option.text = datafiltered;
                    //console.log(option);
                    element.add(option);
                }
            }
            else if(jsonData.data.attack_events != null)
            {
                for(var datafiltered  in jsonData.data.attack_events[0])
                {
                    var option = document.createElement("option");
                    option.text = datafiltered;
                    //console.log(option);
                    element.add(option);
                }
            }*/
        }
    }

});