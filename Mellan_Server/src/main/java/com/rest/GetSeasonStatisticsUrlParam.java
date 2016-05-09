package com.rest;

import java.net.URL;
import java.net.*;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
/**
 * Created by Teddy on 2016-05-02.
 */
public class GetSeasonStatisticsUrlParam {
    private String season;

    public GetSeasonStatisticsUrlParam(String season)
    {
        this.season = season;
    }

    public String getUrlparams() throws UnsupportedEncodingException {
        String str = "action=" + URLEncoder.encode("get_season_statistics", "UTF-8") + "&season=" + URLEncoder.encode(this.season, "UTF-8");
        return str;
    }
}
