package jsontest;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.sql.SQLException;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.json.*;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public class JsonReader {

    private static Database db;
    private static Statistics enemy0;
    private static Statistics enemy1;
    private static Statistics enemy2;
    private static int currentTime;
    private static Calendar c;

    public static void main(String[] args) throws UnsupportedEncodingException, FileNotFoundException, SQLException {

        String encode = "get_campaign_status";
        //+ URLEncoder.encode("get_campaign_status", "UTF-8");
        String urlParameters = "action=" + URLEncoder.encode(encode, "UTF-8");
        String url = "https://api.helldiversgame.com/0.3/";
        System.setProperty("javax.net.ssl.trustStore", "C:/Users/Alican/Desktop/arrowheadkeystore");
        JSONObject response = getCampaignStatus(url, urlParameters);

        //readObject(response);
        readStatistics(response);

        db = new Database(); //connect to db
        //db.insert(enemy0);
        //db.insert(enemy1);
        //db.insert(enemy2);
        //db.update(enemy0);

        schedule();
        /*
		try {

			db.exitConnection();
		} catch (SQLException e) {

			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		System.out.println("Disconnected");
		*/
    }

    /**
     * L�sa och ta ut information fr�n en JSON fil
     *
     * @throws UnsupportedEncodingException
     */
    public static void readJsonFile() throws UnsupportedEncodingException {

        JSONParser parser = new JSONParser();

        try {

            Object obj = parser.parse(new FileReader("test2.json"));
            JSONObject jsonObject = (JSONObject) obj;

            long time = (long) jsonObject.get("time");
            System.out.println(time);

            long error = (long) jsonObject.get("error_code");
            System.out.println(error);

            JSONArray campaign = (JSONArray) jsonObject.get("campaign_status");
            System.out.println(campaign);

            JSONArray seasons = new JSONArray();

            for (int i = 0; i < campaign.size(); i++) {

                seasons.add(campaign.get(i));
            }

            System.out.println(seasons.get(0));
            System.out.println(seasons.get(1));
            System.out.println(seasons.get(2));

            JSONObject season = (JSONObject) seasons.get(0);
            long points = (long) season.get("points_taken");
            //System.out.println(season);
            System.out.println(points);
        } //try
        catch (FileNotFoundException e) {

            e.printStackTrace();
        } catch (IOException e) {

            e.printStackTrace();
        } catch (ParseException e) {

            e.printStackTrace();
        }
    }//main

    /**
     * Post request
     *
     * @param targetURL
     * @param urlParameters
     * @return
     */
    public static JSONObject getCampaignStatus(String targetURL, String urlParameters) {

        URL url;
        HttpURLConnection connection = null;

        try {

            //Create connection
            System.out.println("try");
            url = new URL(targetURL);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type",
                    "application/x-www-form-urlencoded");

            connection.setRequestProperty("Content-Length", "" +
                    Integer.toString(urlParameters.getBytes().length));
            connection.setRequestProperty("Content-Language", "en-US");

            connection.setUseCaches(false);
            connection.setDoInput(true);
            connection.setDoOutput(true);

            //Send request
            DataOutputStream wr = new DataOutputStream(
                    connection.getOutputStream());
            wr.writeBytes(urlParameters);
            wr.flush();
            wr.close();

            //Get Response
            InputStream is = connection.getInputStream();
            BufferedReader rd = new BufferedReader(new InputStreamReader(is));

            JSONParser parser = new JSONParser();
            Object obj = parser.parse(rd);
            JSONObject jsonObject = (JSONObject) obj;

            rd.close();
            return jsonObject;
        } catch (Exception e) {

            e.printStackTrace();
            System.out.println("catch");
            return null;
        } finally {

            System.out.println("finally");

            if (connection != null) {

                connection.disconnect();
            }//if
        }//finally
    }//getCampaignStatus

    /**
     * L�sa JSON och ta ut information fr�n POST responsen.
     *
     * @param jsonObject
     */
    public static void readObject(JSONObject jsonObject) {

        System.out.println("Hela JSON objektet: ");
        System.out.println(jsonObject);

        long time = (long) jsonObject.get("time");
        System.out.println("Time: " + time);

        long error = (long) jsonObject.get("error_code");
        System.out.println("Error Code: " + error);

        JSONArray campaign = (JSONArray) jsonObject.get("campaign_status");
        System.out.println(campaign);

        JSONArray seasons = new JSONArray();

        for (int i = 0; i < campaign.size(); i++) {

            seasons.add(campaign.get(i));
        }
        System.out.println(seasons.get(0));
        System.out.println(seasons.get(1));
        System.out.println(seasons.get(2));

        JSONObject season = (JSONObject) seasons.get(0);
        long points = (long) season.get("points_taken");
        System.out.println("Points taken: " + points);
    }

    public static void readStatistics(JSONObject jsonObject) {

        JSONArray stats = (JSONArray) jsonObject.get("statistics");
        System.out.println(stats);

        enemy0 = new Statistics((JSONObject) stats.get(0));
        System.out.println(enemy0);

        enemy1 = new Statistics((JSONObject) stats.get(1));
        System.out.println(enemy1);

        enemy2 = new Statistics((JSONObject) stats.get(2));
        System.out.println(enemy2);
    }//statistics

    public static void schedule() {

        System.out.println("Scheduler started");
        c = Calendar.getInstance();
        currentTime = c.get(Calendar.DAY_OF_MONTH);

        Runnable runnable = new Runnable() {

            public void run() {

                // task to run goes here,
                if (currentTime == c.get(Calendar.DAY_OF_MONTH)) {

                    //post request
                    //update
                    try {
                        JSONObject response = getCampaignStatus("https://api.helldiversgame.com/0.3/", "action=" +
                                URLEncoder.encode("get_campaign_status", "UTF-8"));
                        readStatistics(response);
                        db.update(enemy0);
                        db.update(enemy1);
                        db.update(enemy2);
                        System.out.println("Updated table.");
                    } catch (UnsupportedEncodingException e) {

                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    } catch (SQLException e) {

                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }//if
                else {

                    //post request
                    //insert
                    c = Calendar.getInstance();
                    currentTime = c.get(Calendar.DAY_OF_MONTH);

                    try {

                        JSONObject response = getCampaignStatus("https://api.helldiversgame.com/0.3/", "action=" +
                                URLEncoder.encode("get_campaign_status", "UTF-8"));
                        readStatistics(response);
                        db.insert(enemy0);
                        db.insert(enemy1);
                        db.insert(enemy2);
                        System.out.println("Inserted table.");
                    } catch (UnsupportedEncodingException e) {

                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    } catch (SQLException e) {

                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }//else

                c = Calendar.getInstance();
                System.out.println("Date: " + c.get(Calendar.DAY_OF_MONTH));
            }//run
        };

        ScheduledExecutorService service = Executors.newSingleThreadScheduledExecutor();
        service.scheduleAtFixedRate(runnable, 0, 10, TimeUnit.SECONDS);
    }//schedule
}//class