package com.rest;

import java.net.URL;
import java.net.*;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
/**
 * Created by Teddy on 2016-04-29.
 */
public class SnapshotsUrlParam {
    private String season;
    private String start;
    private String end;

    public SnapshotsUrlParam(String season, String start, String end)
    {
        this.season = season;
        this.start = start;
        this.end = end;
    }

    public String getUrlParameters() throws UnsupportedEncodingException {
        String str = "action=" + URLEncoder.encode("get_snapshots", "UTF-8") + "&season=" + URLEncoder.encode(this.season, "UTF-8") +
                "&start=" + URLEncoder.encode(this.start, "UTF-8") + "&end=" + URLEncoder.encode(this.end, "UTF-8");
        return str;
    }
}
