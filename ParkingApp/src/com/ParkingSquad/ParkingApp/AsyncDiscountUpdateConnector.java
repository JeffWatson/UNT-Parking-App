package com.ParkingSquad.ParkingApp;

import android.app.Activity;
import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

/**
 * Author: Jeff Watson
 * Date: 10/17/13
 * Time: 10:50 AM
 */
public class AsyncDiscountUpdateConnector extends AsyncTask{
    private static final String TAG = "AsyncDiscountUpdateConnector";
    private static final String DISCOUNTS_URL = "http://students.cse.unt.edu/~rlb0336/getDiscounts.php";

    private ParkingActivity parentActivity;
    private String response;

    public AsyncDiscountUpdateConnector(ParkingActivity a) {
        parentActivity = a;
    }

    @Override
    protected Object doInBackground(Object... params) {
        String msg = "";
        try {
            Log.i(TAG, "Made it to the async task!!");

            HttpURLConnection connection;
            URL url;
//            String response = null;
//            String parameters = "user="+ username +"&reg_id="+ regid;

            url = new URL(DISCOUNTS_URL);
            connection = (HttpURLConnection) url.openConnection();
//            connection.setDoOutput(true);
//            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            connection.setRequestMethod("GET");

//            request = new OutputStreamWriter(connection.getOutputStream());
//            request.write(parameters);
//            request.flush();
//            request.close();
            String line = "";
            InputStreamReader isr = new InputStreamReader(connection.getInputStream());
            BufferedReader reader = new BufferedReader(isr);
            StringBuilder sb = new StringBuilder();
            while ((line = reader.readLine()) != null)
            {
                sb.append(line + "\n");
            }
            // Response from server after login process will be stored in response variable.
            response = sb.toString();
            Log.i(TAG, response);

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
            //Toast.makeText(context, "Message from Server: \n" + response, Toast.LENGTH_SHORT).show();

            // Save the regid - no need to register again.
//            setRegistrationId(ctx, regid);
        } catch (IOException ex) {
            msg = "Error: " + ex.toString();
            Log.e(TAG, "Error registering", ex);
        }
        return msg;
    }

    public String getResponse() {
        return response;
    }

    @Override
    protected void onPostExecute(Object o) {
        Log.i(TAG, response);

        parentActivity.displayResponse(response);
    }
}
