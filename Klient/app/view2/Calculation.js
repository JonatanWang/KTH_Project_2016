/**
 * Created by Fadi on 2016-05-06.
 */

var season; //ID
var enemy; //enemy ID
var missions, successful_missions; //missions percentage
var defend_events, successful_defend_events; //defend event percentage
var attack_events, successful_attack_events; //attack event percentage
var deaths, kills, accidentals; //KD
var shots, hits; //accuracy
var players, total_unique_players;
var total_mission_difficulty, completed_planets;
var accuracy, kdRatio, missionsPercentage, defendPercentage, attackPercentage, accidentalKills;
var jsObject;

function run() {

    getJSONObject();
    accuracyCalc();
    kdRatioCalc();
    missionSuccessCalc();
    defendSuccessCalc();
    attackSuccessCalc();
    accidentialCalc();
}

function getJSONObject() {

    enemy = jsObject.get("enemy");
    season = jsObject.get("season");
    players = jsObject.get("players");
    total_unique_players = jsObject.get("total_unique_players");
    total_mission_difficulty = jsObject.get("total_mission_difficulty");
    completed_planets = jsObject.get("completed_planets");
}

function accuracyCalc() {

    if (hits == 0 || shots == 0) {

        accuracy = 0;
    }else {

        accuracy = (hits / shots) * 100;
    }
}

function kdRatioCalc() {

    if (kills == 0 || deaths == 0){

        kdRatio = 0;
    }else {

        kdRatio = kills / deaths;
    }
}

function missionSuccessCalc () {

    if (successful_missions == 0 || missions == 0) {

        missionsPercentage = 0;
    }
    else {

        missionsPercentage = (successful_missions / missions) * 100;
    }
}

function defendSuccessCalc (){

    if (successful_defend_events == 0 || defend_events == 0){

        defendPercentage = 0;
    }
    else {

        defendPercentage = (successful_defend_events / defend_events) * 100;
    }
}

function attackSuccessCalc () {

    if (successful_attack_events == 0 || attack_events == 0) {

        attackPercentage = 0;
    }
    else {

        attackPercentage = (successful_attack_events / attack_events) * 100;
    }
}

function accidentialCalc () {

    accidentalKills = (accidentals / kills) * 100;
}