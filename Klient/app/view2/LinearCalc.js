/**
 * Created by dani on 10/05/16.
 */

var requestedTime, convertedTime;
var startPoints, endPoints, difference, diffperhour;
var text;

function run(reqTime, stPoints, enPoints){

    //requestedTime = reqTime;
    //startPoints = stPoints;
    //endPoints = enPoints;
    requestedTime = document.getElementById("lctime").value;
    startPoints = document.getElementById("lcpoints1").value;
    endPoints = document.getElementById("lcpoints2").value;
    difference = endPoints - startPoints;
    diffperhour = Math.round(difference/24);
    getHours();
    //return pointsAtRequestedTime();
    pointsAtRequestedTime();
}

function getHours(){

    var rTime = requestedTime | 0;
    var mod = Math.round((requestedTime % rTime) * 100);
    convertedTime = mod;
}

function pointsAtRequestedTime(){

    var points = 0;
    var i;

    for(i = 0; i < convertedTime; i++){

        points += diffperhour;
    }

    document.getElementById("linetext").innerHTML = parseInt(points) + parseInt(startPoints);
    document.getElementById("linetime").innerHTML = requestedTime;
    document.getElementById("linestart").innerHTML = startPoints;
    document.getElementById("lineend").innerHTML = endPoints;
    //return points + startPoints;
}