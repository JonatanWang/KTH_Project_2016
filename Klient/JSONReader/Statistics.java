package jsontest;

import org.json.simple.JSONObject;

public class Statistics {

    private long season; //ID
    private long enemy; //enemy ID
    private long missions, successful_missions; //missions percentage
    private long defend_events, successful_defend_events; //defend event percentage
    private long attack_events, successful_attack_events; //attack event percentage
    private long deaths, kills, accidentals; //KD
    private long shots, hits; //accuracy
    private long players, total_unique_players;
    private long total_mission_difficulty, completed_planets;
    private double accuracy, KD, missionsPercentage, defendPercentage, attackPercentage, accidentalKills;

    public Statistics(JSONObject jsonObject) {

        this.season = (long) jsonObject.get("season");
        this.enemy = (long) jsonObject.get("enemy");
        this.missions = (long) jsonObject.get("missions");
        this.successful_missions = (long) jsonObject.get("successful_missions");
        this.defend_events = (long) jsonObject.get("defend_events");
        this.successful_defend_events = (long) jsonObject.get("successful_defend_events");
        this.attack_events = (long) jsonObject.get("attack_events");
        this.successful_attack_events = (long) jsonObject.get("successful_attack_events");
        this.deaths = (long) jsonObject.get("deaths");
        this.kills = (long) jsonObject.get("kills");
        this.accidentals = (long) jsonObject.get("accidentals");
        this.shots = (long) jsonObject.get("shots");
        this.hits = (long) jsonObject.get("hits");
        this.players = (long) jsonObject.get("players");
        this.total_unique_players = (long) jsonObject.get("total_unique_players");
        this.total_mission_difficulty = (long) jsonObject.get("total_mission_difficulty");
        this.completed_planets = (long) jsonObject.get("completed_planets");

        calculate();
    }//constructor

    private void calculate() {

        if (shots == 0 || hits == 0) {

            accuracy = 0;
        }
        else {

            accuracy = ((double) hits / (double) shots) * 100;
        }

        if (kills == 0 || deaths == 0) {

            KD = 0;
        }
        else {

            KD = ((double) kills / (double) deaths);
        }

        if (successful_missions == 0 || missions == 0) {

            missionsPercentage = 0;
        }
        else {

            missionsPercentage = ((double) successful_missions / (double) missions) * 100;
        }

        if (successful_defend_events == 0 || defend_events == 0){

            defendPercentage = 0;
        }
        else {

            defendPercentage = ((double) successful_defend_events / (double) defend_events) * 100;
        }

        if (successful_attack_events == 0 || attack_events == 0) {

            attackPercentage = 0;
        }
        else {

            attackPercentage = ((double) successful_attack_events / (double) attack_events) * 100;
        }

        if (kills == 0 || accidentals == 0) {

            setAccidentalKills(0);
        }
        else {

            setAccidentalKills(((double) accidentals / (double) kills) * 100);
        }
    }

    public long getPlayers() {

        return players;
    }

    public void setPlayers(long players) {

        this.players = players;
    }

    public long getTotal_unique_players() {

        return total_unique_players;
    }

    public void setTotal_unique_players(long total_unique_players) {

        this.total_unique_players = total_unique_players;
    }

    public long getTotal_mission_difficulty() {

        return total_mission_difficulty;
    }

    public void setTotal_mission_difficulty(long total_mission_difficulty) {

        this.total_mission_difficulty = total_mission_difficulty;
    }

    public long getCompleted_planets() {

        return completed_planets;
    }

    public void setCompleted_planets(long completed_planets) {

        this.completed_planets = completed_planets;
    }

    public double getAccuracy() {

        return accuracy;
    }

    public double getKD() {

        return KD;
    }

    public double missionsPercentage() {

        return missionsPercentage;
    }

    public double defendPercentage() {

        return defendPercentage;
    }

    public double attackPercentage() {

        return attackPercentage;
    }

    public long getSeason() {

        return season;
    }

    public void setSeason(long season) {

        this.season = season;
    }

    public long getEnemy() {

        return enemy;
    }

    public void setEnemy(int enemy) {

        this.enemy = enemy;
    }

    public long getMissions() {

        return missions;
    }

    public void setMissions(long missions) {

        this.missions = missions;
    }

    public long getSuccessful_missions() {

        return successful_missions;
    }

    public void setSuccessful_missions(long successful_missions) {

        this.successful_missions = successful_missions;
    }

    public long getDefend_events() {

        return defend_events;
    }

    public void setDefend_events(int defend_events) {

        this.defend_events = defend_events;
    }

    public long getSuccessful_defend_events() {

        return successful_defend_events;
    }

    public void setSuccessful_defend_events(int successful_defend_events) {

        this.successful_defend_events = successful_defend_events;
    }

    public long getAttack_events() {

        return attack_events;
    }

    public void setAttack_events(int attack_events) {

        this.attack_events = attack_events;
    }

    public long getSuccessful_attack_events() {

        return successful_attack_events;
    }

    public void setSuccessful_attack_events(int successful_attack_events) {

        this.successful_attack_events = successful_attack_events;
    }

    public long getDeaths() {

        return deaths;
    }

    public void setDeaths(long deaths) {

        this.deaths = deaths;
    }

    public long getKills() {

        return kills;
    }

    public void setKills(long kills) {

        this.kills = kills;
    }

    public long getAccidentals() {

        return accidentals;
    }

    public void setAccidentals(long accidentals) {

        this.accidentals = accidentals;
    }

    public long getShots() {

        return shots;
    }

    public void setShots(long shots) {

        this.shots = shots;
    }

    public long getHits() {

        return hits;
    }

    public void setHits(long hits) {

        this.hits = hits;
    }

    /**
     * @return the accidentalKills
     */
    public double getAccidentalKills() {

        return accidentalKills;
    }

    /**
     * @param accidentalKills the accidentalKills to set
     */
    public void setAccidentalKills(double accidentalKills) {

        this.accidentalKills = accidentalKills;
    }

    @Override
    public String toString() {

        return "Statistics [season=" + season + ", enemy=" + enemy
                + ", missions=" + missions + ", successful_missions="
                + successful_missions + ", defend_events=" + defend_events
                + ", successful_defend_events=" + successful_defend_events
                + ", attack_events=" + attack_events
                + ", successful_attack_events=" + successful_attack_events
                + ", deaths=" + deaths + ", kills=" + kills + ", accidentals="
                + accidentals + ", shots=" + shots + ", hits=" + hits
                + ", players=" + players + ", total_unique_players="
                + total_unique_players + ", total_mission_difficulty="
                + total_mission_difficulty + ", completed_planets="
                + completed_planets + ", accuracy=" + accuracy + ", KD=" + KD
                + ", missionsPercentage=" + missionsPercentage
                + ", defendPercentage=" + defendPercentage
                + ", attackPercentage=" + attackPercentage
                + ", accidentalKills=" + accidentalKills + "]";
    }//tostring

}//class