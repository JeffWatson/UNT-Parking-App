package com.ParkingSquad.ParkingApp;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

public class ParkingActivity extends Activity {
    private static final String TAG = "ParkingActivity";
    /**
     * Called when the activity is first created.
     */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        Toast.makeText(this, "This is a toast message!", Toast.LENGTH_SHORT).show();

        Log.i(TAG, "This is how you use logs!");
    }
}
