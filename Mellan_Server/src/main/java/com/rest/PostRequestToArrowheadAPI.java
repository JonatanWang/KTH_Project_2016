package com.rest;
import java.io.*;
import java.net.URL;
import java.net.*;

/**
 * Created by Teddy on 2016-04-22.
 */
public class PostRequestToArrowheadAPI {

        private  String url;
        private String urlParameters;

        public PostRequestToArrowheadAPI(String url, String urlParameters) {
            this.url = url;
            this.urlParameters = urlParameters;
        }

        public  String fetchData()
        {
            HttpURLConnection connection = null;
            try {
                //Create connection
                System.out.println("try");
                URL urlArrowHeadMasterServer = new URL(url);
                connection = (HttpURLConnection)urlArrowHeadMasterServer.openConnection();
                connection.setRequestMethod("POST");
                connection.setRequestProperty("Content-Type",
                        "application/x-www-form-urlencoded");

                connection.setRequestProperty("Content-Length", "" +
                        Integer.toString(urlParameters.getBytes().length));
                connection.setRequestProperty("Content-Language", "en-US");

                connection.setUseCaches (false);
                connection.setDoInput(true);
                connection.setDoOutput(true);

                //Send request
                DataOutputStream wr = new DataOutputStream (
                        connection.getOutputStream ());
                wr.writeBytes (urlParameters);
                wr.flush ();
                wr.close ();

                //Get Response
                InputStream is = connection.getInputStream();
                BufferedReader rd = new BufferedReader(new InputStreamReader(is));
                String line;
                StringBuffer response = new StringBuffer();
                while((line = rd.readLine()) != null) {
                    response.append(line);
                    response.append('\r');
                }
                rd.close();

                return response.toString();

            } catch (Exception e) {

                e.printStackTrace();
                System.out.println("catch");
                return null;

            } finally {
                System.out.println("finally");
                if(connection != null) {
                    connection.disconnect();
                }
            }
        }
}
