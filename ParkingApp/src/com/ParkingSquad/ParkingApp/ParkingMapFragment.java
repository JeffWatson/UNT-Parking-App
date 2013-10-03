package com.ParkingSquad.ParkingApp;

import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.app.AlertDialog;
import android.widget.Toast;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.GoogleMap.OnInfoWindowClickListener;

/**
 * Author: Jeff Watson
 * Date: 9/17/13
 * Time: 3:01 PM
 */

public class ParkingMapFragment extends SupportMapFragment {
    private static final LatLng DENTON_PARKING_GARAGE = new LatLng(33.208666,-97.145877);
    private GoogleMap googleMap;

    double DPG_lat = DENTON_PARKING_GARAGE.latitude;            // save the latitude coordinate into a double   KS
    double DPG_lng = DENTON_PARKING_GARAGE.longitude;           // save the longitude coordinate into a double  KS

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = super.onCreateView(inflater, container, savedInstanceState);

        // get the map
        googleMap = getMap();

        // Create a marker that shows the parking garage on the map
        MarkerOptions mOptions = new MarkerOptions();
        mOptions.position(DENTON_PARKING_GARAGE);
        mOptions.title("UNT Parking Garage");                               // give a Title and snippet to the garage marker     KS
        mOptions.snippet("Tap to get directions from current location");


        // add the marker to the map and zoom to that location.
        Marker garageMarker = googleMap.addMarker(mOptions);
        garageMarker.showInfoWindow();                                      // Shows the info window automagically :)    KS

        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(DENTON_PARKING_GARAGE, 15));


        // add in the listener for the Info Window click
        googleMap.setOnInfoWindowClickListener (new OnInfoWindowClickListener() {

            @Override
            public void onInfoWindowClick (Marker tempMarker) {

                // create an alert dialog for user to turn on GPS
                AlertDialog.Builder builder1 = new AlertDialog.Builder (getActivity());                                     // create an alert dialog builder   KS
                builder1.setMessage ("Make sure to turn on GPS to get directions from your current location.");             // give user a message      KS

                builder1.setPositiveButton (R.string.positive, new DialogInterface.OnClickListener() {                      // Positive button          KS
                    public void onClick (DialogInterface choice, int chosenButton) {

                        String mapsURL = String.format ("http://maps.google.com/maps?f=d&daddr=%f,%f", DPG_lat, DPG_lng);   // object oriented way to put coordinates into map app  KS
                        Intent OpenGoogleMapsApp = new Intent(Intent.ACTION_VIEW, Uri.parse(mapsURL));                      // startup intent to open google maps app       KS
                        startActivity(OpenGoogleMapsApp);
                    }
                });

                builder1.setNegativeButton(R.string.negative, new DialogInterface.OnClickListener() {                       // Negative button          KS
                    public void onClick(DialogInterface choice, int choseButton) {
                              // do nothing        KS
                    }
                });

                AlertDialog GPS_alert = builder1.create();                   // Instantiate the alert dialog box    KS
                GPS_alert.show();                                            // actually show the alert     KS

        }
        });


        googleMap.setMyLocationEnabled(false);        // enable or disable my location layer for map to access user's location. KS
                                                      //  true  or false

        return view;
    }




}
