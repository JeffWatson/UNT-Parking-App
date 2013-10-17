package com.ParkingSquad.ParkingApp;

import android.os.AsyncTask;
import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * User: Kyle
 * Date: 10/17/13
 * Time: 12:04 PM
 * Adapted code from Jeff's discount updater for the weather
 */
public class AsyncWeatherUpdate extends AsyncTask {

    private static final String TAG = "AsyncWeatherUpdate";
    private static final String WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?id=4685907";

    private ParkingActivity parentActivity;
    private String jSonWeather;

    public AsyncWeatherUpdate (ParkingActivity weather) {
        parentActivity = weather;
    }

    @Override
    protected Object doInBackground(Object... params) {
        String msg = "";
        try {
            Log.i(TAG, "Made it to the async task!!");

            HttpURLConnection connection;
            URL openWeather;

            openWeather = new URL(WEATHER_URL);
            connection = (HttpURLConnection) openWeather.openConnection();
            connection.setRequestMethod("GET");

            String line;
            InputStreamReader isr = new InputStreamReader(connection.getInputStream());
            BufferedReader reader = new BufferedReader(isr);
            StringBuilder sb = new StringBuilder();
            while ((line = reader.readLine()) != null)
            {
                sb.append(line + "\n");
            }
            // Response from server after login process will be stored in jSonWeather variable.
            jSonWeather = sb.toString();
            Log.i(TAG, jSonWeather);

            isr.close();
            reader.close();
            // You can perform UI operations here
                    /*parentActivity.runOnUiThread(new Runnable(){

                        @Override
                        public void run() {
                            Toast.makeText(context, "Message to server: " + parameters + "\nMessage from Server: \n" + response, Toast.LENGTH_SHORT).show();

                            //try {
                            //Flight f = (Flight) objects.get("flight");
                            //Weather oWeather = (Weather) objects.get("oWeather");
                            //Weather dWeather = (Weather) objects.get("dWeather");

                            //View v = (View) lv.getChildAt(position);
                            //TextView mTv = (TextView) v.findViewById(R.id.arrival_time);
                            //String oldText = mTv.getText().toString();
                            //if(!oldText.equals(f.getDestinationScheduled()))
                            //{
                            //    mTv.setBackgroundColor(R.color.red);
                            //}
                            //mTv.setText(f.getDestinationScheduled());
                            //} catch (Exception e) {
                            //    Log.i(TAG, "Error updating in Asynctask.", e);
                            //}
                        }
                    }); */

            }

        catch (IOException ex) {
            msg = "Error: " + ex.toString();
            Log.e(TAG, "Error registering", ex);
        }
        return msg;
    }

    public String getResponse() {
        return jSonWeather;
    }

    @Override
    protected void onPostExecute(Object o) {
        Log.i(TAG, jSonWeather);

        parentActivity.displayResponse(jSonWeather);
    }

}
