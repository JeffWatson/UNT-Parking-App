package com.ParkingSquad.ParkingApp;

import android.os.AsyncTask;
import android.util.Log;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

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

            url = new URL(DISCOUNTS_URL);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");

            String line;
            InputStreamReader isr = new InputStreamReader(connection.getInputStream());
            BufferedReader reader = new BufferedReader(isr);
            StringBuilder sb = new StringBuilder();

            while ((line = reader.readLine()) != null)
            {
                sb.append(line);
            }

            // Response from server after login process will be stored in response variable.
            response = sb.toString();
            Log.i(TAG, response);

            isr.close();
            reader.close();
        } catch (IOException ex) {
            msg = "Error: " + ex.toString();
            Log.e(TAG, "Error registering: " + msg, ex);
        }
        return msg;
    }

    public String getResponse() {
        return response;
    }

    @Override
    protected void onPostExecute(Object o) {


        Log.i(TAG, response);
        PromotionDataSource datasource = new PromotionDataSource(parentActivity);

        try {
            JSONArray array = new JSONArray(response);

            JSONObject obj;
            Promotion newPromo;
            datasource.open();

            for(int i = 0; i < array.length(); i++)
            {
                newPromo = new Promotion();
                obj = (JSONObject) array.get(i);
                Log.i(TAG, obj.toString());

                newPromo.setId(obj.getLong("id"));
                newPromo.setLon(obj.getDouble("lon"));
                newPromo.setPromotion_value(obj.getString("promotion_value"));
                newPromo.setStop_time(obj.getString("stop_time"));
                newPromo.setPromotion_vendor(obj.getString("vendor"));
                newPromo.setLink(obj.getString("link"));
                newPromo.setPromotion_name("promotion_name");
                newPromo.setStop_date(obj.getString("stop_date"));
                newPromo.setStart_time(obj.getString("start_time"));
                newPromo.setStart_date(obj.getString("start_date"));
                newPromo.setLat(obj.getDouble("lat"));

                datasource.createOrUpdatePromotion(newPromo);
            }
        } catch (JSONException e) {
            Log.e(TAG, "Caught a JSONException in AsyncDiscountConnector.", e);
        } finally {
            Log.i(TAG, "finished web update :) " + datasource.getAllPromotions().size());

            datasource.close();
        }

        parentActivity.forceReload();
    }
}
