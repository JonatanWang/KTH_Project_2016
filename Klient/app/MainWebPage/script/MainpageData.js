var sliderVal = 1;
var enemyType = "global_stats"; // Teddy & Co, default drop down menu value
var choosedSeason = 1;
var currentSeason = 1;
var flagg = false;
var mapImgBugs = "Images/helldivers_galcamp_progression/bug/helldivers_galcamp_progression_bug_";
var mapImgCyborgs = "Images/helldivers_galcamp_progression/cyborg/helldivers_galcamp_progression_cyborg_";
var mapImgIllu = "Images/helldivers_galcamp_progression/illuminate/helldivers_galcamp_progression_illuminate_";
var IMGformat = ".png";
var jsonData = null; // Teddy & Co, for filtering
var APIURL1 = "https://api.helldiversgame.com/1.0/";
var APIURL2 = "https://files.arrowheadgs.com/helldivers_api/default/" ;

function evalSlider2() {

    sliderVal = document.getElementById('slider').value;
    document.getElementById('sliderValue').innerHTML = sliderVal;

    var integer = sliderVal | 0;
    var float=sliderVal%integer;

    if(float > 0.99){

        sliderVal=integer+1;
        document.getElementById('sliderValue').innerHTML= sliderVal;
        float=0;
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
/**
 * app2 should be named an other name.
* **/
var app = angular.module('app', ['app2']);


function calculate_region(points, points_max) {
    var points_per_region = points_max / 10;
    var region = Math.min(Math.max(Math.floor(points / points_per_region), 0), 10);
    return region;
}


function insertionSortEvents(events) {

    for(var i=1;i<events.length;i++)
    {
        var temp = events[i];
        var tempIndex = i;
        while(tempIndex > 0 && temp.end_time < events[tempIndex-1].end_time){
            events[tempIndex] = events[tempIndex-1];
            tempIndex--;
        }
        events[tempIndex] = temp;
    }
}


app.controller("WebApiCtrl", function ($scope, dataService) {

    $scope.data = null;

    // Ändrar dynamisk storleken på slidern beroende av den valda säsongen
    $scope.setEventSize = function () {
        console.log("choosedSeason before="+choosedSeason);
        document.getElementById('slider').max = getLatestDayInSeason(choosedSeason);
        console.log("choosedSeason after="+choosedSeason);
    };

    $scope.resetSlider = function() {
        var defaultValue = 1;
        document.getElementById('slider').value = defaultValue;
        document.getElementById('sliderValue').innerHTML = defaultValue;
        $scope.setEventSize();
    }

    $scope.getInfoTest=function () {
        var seasonResult=getSeasonInfo(choosedSeason);  // returnerar information beroende av säsongen och dagen som skickas in
        var result= calculateLerp(seasonResult, sliderVal);

    };


    /**
     * Teddy & Co modified:
     */
    $scope.camp = function () {
        enemyType=document.getElementById('enemyType').value;

        /**
         * to get Region img :
         * **/
        $scope.getImagePath();
        /**
         * to get global stats:
         * **/

        /**
         * to get enemy stats:
         * */
                $scope.newsFeed();
    };

    $scope.defaultSlide = function () {
        return 1;
    };

    /**fixed currentsSeason in getCampaign function. It gets the currentSeason value**/
    dataService.getCampaign().then(function (response) {

        $scope.campaign = response.data;
        currentSeason = response.data.campaign_status[0].season;
        run(response.data.statistics);
        $scope.calculation=getCalculations();
    });

    /**
     * Teddy & Co modified:
     */
    $scope.selectStatisticsInSeason = function (){
        enemyType=document.getElementById('enemyType').value;
    };

    /**
     * Teddy & Co added:
     */
    $scope.filterData = function(){


        var element = document.getElementById('all');

        if(jsonData != null && element.firstElementChild.nextElementSibling==null)
        {
            for(var datafiltered  in jsonData.data)
            {
                var option = document.createElement("option");
                option.text = datafiltered;
                element.add(option);
            }
        }
    }

    $scope.getImagePath = function(){

        var URL;
        var result;


            var dataResponse = getSeasonInfo(choosedSeason);
        var lastDay = dataResponse.length-1;
        var attack_evets = getSeasonAttackEvents(choosedSeason);

                if(attack_evets[attack_evets.length-1] != null)
                {
                    result = 12;
                }
                else
                {
                    var points_max = dataResponse[lastDay][enemyType].points_max;
                    var points = dataResponse[lastDay][enemyType].points;

                    result = calculate_region(points, points_max) + 1;

                    if (result < 10)
                    {
                        result = "0".concat(result);
                    }
                }

                switch(enemyType){
                    case "0":
                        URL = mapImgBugs.concat(result, IMGformat);
                        break;
                    case "1":
                        URL = mapImgCyborgs.concat(result, IMGformat);
                        break;
                    case "2":
                        URL = mapImgIllu.concat(result, IMGformat);
                        break;
                    default:
                        console.log("gettImagePath in default")
                }


                var regionIMG = document.getElementById("mapURL");

                regionIMG.src = URL;

    };



    $scope.newsFeed = function(){

        var currentTime = sliderVal;
        var dataResponse = getSeasonInfo(choosedSeason);

        var allDefendEvents = getSeasonDefendEvents(choosedSeason);
        var allAttackEvents = getSeasonAttackEvents(choosedSeason);
        var allEvents = [];

            allEvents = allAttackEvents.concat(allDefendEvents);

            //
            insertionSortEvents(allEvents);

            //test -  to get all events into the newsfeed viewer
            //counting days:
            var firstDay;
            if( dataResponse.length != 0)
            {
                firstDay = dataResponse[0][0].time;
            }
            //chrono sort text for attack and def
            var newsfeedText = [];

            for(var i=0;i<allEvents.length;i++)
            {
                var datatext = [];
                datatext.push("DAY " + Math.floor((allEvents[i].end_time - firstDay)/(60*60*24)));
                if(allEvents[i].region)//waiting for file
                {
                    datatext.push("Region " + allEvents[i].region + " was attacked by " + allEvents[i].enemy +
                        " and Helldivers " +  (allEvents[i].status == "success" ? "defended" : "got crushed"));
                }
                else
                {
                    datatext.push("Final assault on " + allEvents[i].enemy + " was a " +
                        allEvents[i].status);
                }
                newsfeedText.push(datatext);
            }

            //text table
            var table = document.getElementById("newsfeed");
            while(table.rows.length > 0)
            {
                table.deleteRow(0);
            }
            while(newsfeedText.length > 0){
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                var td2 = document.createElement("td");
                var newsrow = newsfeedText.shift();

                td.appendChild(document.createTextNode(newsrow[0]));
                td.className = "newsfeedDayColumn";
                td2.appendChild(document.createTextNode(newsrow[1]));
                td2.className = "newsfeedStringColumn";
                tr.appendChild(td);
                tr.appendChild(td2);
                table.appendChild(tr);
            }
    };

});