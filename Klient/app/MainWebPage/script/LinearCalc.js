/**
 * Created by Alican Bircan 
 * Edited by Fadi Kamil & Dani Daryaweesh
 */

var requestedTime, convertedTime;
var startPoints, endPoints;

function main(reqTime, stPoints, enPoints){

    requestedTime = reqTime;
    startPoints = stPoints;
    endPoints = enPoints;
  
    //ent.writeln("requ: "+requestedTime+" ,start: "+startPoints+" ,end: "+endPoints);
  
    getT();

    return lerp(startPoints, endPoints, convertedTime);
}

function getT(){

    var rTime = Math.floor(requestedTime);
    convertedTime = requestedTime - rTime;
    convertedTime = Math.ceil(convertedTime * 100) / 100;
}

function lerp(a, b, t) {
    var x = a + t * (b - a);
    return x;
}

/*
 returnerar ett array resultat där enemy0-2 och sista är globalstats!
 */
function calculateLerp(res, sliderValue){
    var tmpSlider= sliderVal, points_taken=null, globalStats=null;
    var lerpResult=[];

    if(sliderVal % 1 !=0 && sliderVal!=0){
        tmpSlider = sliderValue | 0;
        tmpSlider++;
    }

    for(var day=0;day<res[day].length;day++){
        lerpResult[day] = res[tmpSlider][day].points_taken;
        globalStats+= res[tmpSlider][day].points_taken;

        if(day == res[day].length-1){
            lerpResult[lerpResult.length]=globalStats;
        }
    }

    for(var lerp=0;lerp<lerpResult.length;lerp++){
        lerpResult[lerp] = main(sliderVal, 0, lerpResult[lerp]);
    }

    return lerpResult;
}