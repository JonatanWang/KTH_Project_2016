package com.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

/**
 * Created by Teddy on 2016-04-22.
 */


/**
 * the deafult value param should be the recent campaign status
 * */
@RestController
public class PostRequestToArrowheadAPIController {
    final String url = "https://api.helldiversgame.com/0.3/";

    @CrossOrigin
    @RequestMapping("/GetCampaignStatus")
    public @ResponseBody String post_request(@RequestParam(value="action", defaultValue="get_campaign") String name)
    {

        //Url parameters
        String urlParameters = null;
        try {
            urlParameters = "action=" + URLEncoder.encode("get_campaign_status", "UTF-8");
        } catch (UnsupportedEncodingException e) {
            System.out.println("catch in post_requestController");
            e.printStackTrace();
        }
        //url could be final in class
        System.setProperty("javax.net.ssl.trustStore", "arrowheadkeystore");
        PostRequestToArrowheadAPI executePostRequest = new PostRequestToArrowheadAPI(url, urlParameters);
        String result = executePostRequest.fetchData();

        return result;
    }

    @CrossOrigin
    @RequestMapping("/GetSeasonStats")
    public @ResponseBody String getSeasonStats(@RequestParam(value="season", defaultValue="deafult") String season) throws UnsupportedEncodingException {

        //Url parameters
        String urlParameters = (new GetSeasonStatisticsUrlParam(season)).getUrlparams();
        //url could be final in class
        System.setProperty("javax.net.ssl.trustStore", "arrowheadkeystore");
        PostRequestToArrowheadAPI executePostRequest = new PostRequestToArrowheadAPI(url, urlParameters);
        String result = executePostRequest.fetchData();

        return result;
    }

    @CrossOrigin
    @RequestMapping("/GetSnapshots")
    //must find a working default param
    public @ResponseBody String getSnaps(@RequestParam(value="season", defaultValue="deafult") String season,
                                         @RequestParam(value="start", defaultValue="deafult")String start,
                                         @RequestParam(value="end", defaultValue="deafult")String end) throws UnsupportedEncodingException {

        //Url parameters
        SnapshotsUrlParam urlParameters = new SnapshotsUrlParam(season, start, end);
        //url could be final in class
        System.setProperty("javax.net.ssl.trustStore", "arrowheadkeystore");
        PostRequestToArrowheadAPI executePostRequest = new PostRequestToArrowheadAPI(url, urlParameters.getUrlParameters());
        String result = executePostRequest.fetchData();
        return result;
    }

}
