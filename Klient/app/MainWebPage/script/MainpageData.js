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

    sliderVal = document.getElementById('rating').value;
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
    $scope.getEventSize = function () {
        $scope.len=sliderlength;
        return $scope.len;
    };

    $scope.getInfoTest=function () {
        var seasonResult=getSeasonInfo(choosedSeason);  // returnerar information beroende av säsongen och dagen som skickas in
        var result= calculateLerp(seasonResult, sliderVal);

        for(var counter=0;counter<t.length;counter++){
            //document.writeln("i: "+i+ "  ,result[i]: "+result[i]);
        }
    };


    /**
     * Teddy & Co modified:
     */
    $scope.camp = function () {
        enemyType=document.getElementById('enemyType').value;
        var filterOption = document.getElementById('all').value;
        var season = document.getElementById('seasons').value;
        console.log(enemyType);
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

                /*var dataResponse = getSeasonDay(choosedSeason, sliderVal);

               // console.log("allfilter=" + allFilter + "filterOption=" + filterOption);
                console.log(filterOption);
                //save data to var
                var result = [];
                //save data to var
                var atta_events = [];
                var def_events = [];

                for(var i=0;i<dataResponse.data.defend_events.length;i++)
                {
                    if(enemyType == dataResponse.data.defend_events[i].enemy)
                    {
                        //console.log(dataResponse.data.defend_events[i]);
                        def_events.push(dataResponse.data.defend_events[i]);
                    }
                }
                for(var i=0;i<dataResponse.data.attack_events.length;i++)
                {
                    if(enemyType == dataResponse.data.attack_events[i].enemy)
                    {
                        atta_events.push(dataResponse.data.attack_events[i]);
                    }
                }*/
                //save data to var end
                    switch(filterOption)
                    {
                        case "defend_events":
                            result = getDefend_evArray();
                            //console.log("in defend_events");
                            
                            break;
                        case "attack_events":
                            result = getAttack_evArray();
                            //console.log("in attack_events");
                            break;
                        default:
                            result = def_events.concat(atta_events);
                            console.log("in default");
                            //console.log(result);
                    }

                $scope.data = result;
                $scope.newsFeed(dataResponse);


    };

    $scope.defaultSlide = function () {
        return 1;
    };

    // möjliggöra dynamisk ändring --> kommer att användas senare
    $scope.getEventSize = function () {
        return 30;
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
                //console.log(option);
                element.add(option);
            }
        }
    }

    $scope.getImagePath = function(){

        var URL;
        var success = 0;
        var result;

        console.log("succes=" + success);

            var dataResponse = getSeasonInfo(choosedSeason);

                if(success > 0){
                    result = 12;
                }
                else
                {
                    var points_max = dataResponse.points_max[enemyType];

                    var points = (dataResponse.snapshots[dataResponse.snapshots.length - 1])[enemyType].points;
                    console.log("antal dagar:" + dataResponse.snapshots.length);
                    console.log("points=" + points);
                    result = calculate_region(points, points_max) + 1;
                    console.log("In getdata result=" + result);

                    if (result < 10)
                    {
                        result = "0".concat(result);
                    }
                }
                console.log("Mresult=" + result);

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

                //console.log("URL: "+URL);
                var regionIMG = document.getElementById("mapURL");
                console.log("result"+result);
                regionIMG.src = URL;
                console.log("src=" + regionIMG.src);

    };



    $scope.newsFeed = function(gameData){

        var currentTime = sliderVal;
        var dataResponse = getSeasonInfo(choosedSeason);
        var allDefendEvents = getDefend_evArray();
        var allAttackEvents = getAttack_evArray();
        var allEvents = [];

            allEvents = allAttackEvents.concat(allDefendEvents);

            //
            console.log("in newsFeed");
            insertionSortEvents(allEvents);
            console.log(allEvents);
            //test -  to get all events into the newsfeed viewer
            //counting days:
            var firstDay;
            if(dataResponse.snapshots != null)
            {
                firstDay = dataResponse.snapshots[0].time;
                console.log("firstDay="+firstDay);
                console.log("time="+ dataResponse.snapshots[1].time);
            }
            //chrono sort text for attack and def
            var newsfeedText = [];

            for(var i=0;i<allEvents.length;i++)
            {
                //console.log("in for loop");
                var datatext = [];
                datatext.push("DAY " + Math.floor((allEvents[i].end_time - firstDay)/(60*60*24)));
                if(allEvents[i].region)//waiting for file
                {
                   //console.log("event end time=" + allEvents[i].end_time);
                    datatext.push("Region " + allEvents[i].region + " was attacked by " + allEvents[i].enemy +
                        " and Helldivers " +  (allEvents[i].status == "success" ? "defended" : "got crushed"));
                }
                else
                {
                    console.log("in attak and day is:" + Math.floor((allEvents[i].end_time - firstDay)/(60*60*24)));
                    datatext.push("Final assault on " + allEvents[i].enemy + " was a " +
                        allEvents[i].status);
                    console.log("attackEvent=" + allEvents[i]);
                }
                newsfeedText.push(datatext);

            }
            //console.log("text= " + newsfeedText.toString());


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