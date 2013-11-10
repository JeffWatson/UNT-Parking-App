package com.ParkingSquad.ParkingApp;

import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.provider.Settings;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.app.AlertDialog;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.GoogleMap.OnInfoWindowClickListener;

import java.util.ArrayList;
import java.util.List;

/**
 * Author: Jeff Watson
 * Date: 9/17/13
 * Time: 3:01 PM
 */


public class ParkingMapFragment extends SupportMapFragment {
    private static final LatLng DENTON = new LatLng(33.211763,-97.14779);
    private GoogleMap googleMap;
    public Context mapContext;

    List<Marker> PromoMarkers = new ArrayList<Marker>();


    public void setPromotionLocations (double x, double y, String z) {

        LatLng positionOnMap = new LatLng(x, y);

        // Create a marker that shows the locations on the map
        final Marker myMarker = googleMap.addMarker(new MarkerOptions().position(positionOnMap)
                .title(z)
                .snippet("Tap to get directions from current location."));  // give a Title and snippet to the garage marker     KS

        // add the marker to the map and zoom to that location.
        PromoMarkers.add (myMarker);
        //myMarker.showInfoWindow();                                      // Shows the info window automagically :)    KS


        // add in the listener for the Info Window click
        googleMap.setOnInfoWindowClickListener (new OnInfoWindowClickListener() {

            @Override
            public void onInfoWindowClick (final Marker myMarker) {

                // create an alert dialog for user to turn on GPS
                AlertDialog.Builder builder1 = new AlertDialog.Builder (getActivity());                                     // create an alert dialog builder   KS
                builder1.setTitle ("GPS is turned off");
                builder1.setMessage ("Make sure to turn on GPS to get directions from your current location.");             // give user a message      KS

                builder1.setPositiveButton (R.string.positive, new DialogInterface.OnClickListener() {                      // Positive button          KS
                    public void onClick (DialogInterface choice, int chosenButton) {
                    Intent OpenLocationSettings = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                    startActivity (OpenLocationSettings);
                    }
                });

                builder1.setNegativeButton(R.string.negative, new DialogInterface.OnClickListener() {                       // Negative button          KS
                    public void onClick(DialogInterface choice, int choseButton) {
                        // do nothing        KS
                    }
                });

                AlertDialog GPS_alert = builder1.create();                   // Instantiate the alert dialog box    KS

                if (!ParkingActivity.getGPSstatus (mapContext)) {            // if gps is not on, show the alert dialog to the user   KS
                    GPS_alert.show();                                            // actually show the alert     KS
                }
                else {                                                                                           // else just pull it up in the map application  KS
                    String mapsURL = String.format ("http://maps.google.com/maps?f=d&daddr=%f,%f",
                            myMarker.getPosition().latitude, myMarker.getPosition().longitude);                 // object oriented way to put coordinates into map app  KS
                    Intent OpenGoogleMapsApp = new Intent(Intent.ACTION_VIEW, Uri.parse(mapsURL));                      // startup intent to open google maps app       KS
                    startActivity (OpenGoogleMapsApp);
                }

            }
        });
    }



    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = super.onCreateView(inflater, container, savedInstanceState);

        // get the map
        googleMap = getMap();
        googleMap.setPadding(100,100,100,0);                      // set map padding for the map view     KS
        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(DENTON, (float) 14.50));   // moved the camera to focus on UNT campus

        googleMap.setMyLocationEnabled(false);        // enable or disable my location layer for map to access user's location. KS
                                                      //  true  or false


        /*
            Get the Promotions stored in the database on the device,
            Iterate through them and set up the Markers.

            JW
         */
        PromotionDataSource datasource = new PromotionDataSource(inflater.getContext());
        datasource.open();
        List<Promotion> promotions = datasource.getAllPromotions();
        datasource.close();

        for(Promotion promo: promotions)
        {
            setPromotionLocations(promo.getLat(), promo.getLon(), promo.getPromotion_vendor());
        }


        return view;

    }

    /**
     *  Moves the map to the location of the supplied promotion
     *
     * @param promo the promotion we want to move to.
     * @return whether or not the map moved
     */
    public void moveMapToPromotion(Promotion promo)
    {
        LatLng newLocation = new LatLng(promo.getLat(),promo.getLon());

        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(newLocation, (float) 14.50));
    }

}