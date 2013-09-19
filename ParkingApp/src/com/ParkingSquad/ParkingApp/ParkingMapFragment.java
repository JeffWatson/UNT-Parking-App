package com.ParkingSquad.ParkingApp;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

/**
 * Author: Jeff Watson
 * Date: 9/17/13
 * Time: 3:01 PM
 */
public class ParkingMapFragment extends SupportMapFragment {
    private static final LatLng DENTON_PARKING_GARAGE = new LatLng(33.208666,-97.145877);
    private GoogleMap googleMap;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = super.onCreateView(inflater, container, savedInstanceState);

        // get the map
        googleMap = getMap();

        // Create a marker that shows the parking garage on the map
        MarkerOptions mOptions = new MarkerOptions();
        mOptions.position(DENTON_PARKING_GARAGE);

        // add the marker to the map and zoom to that location.
        googleMap.addMarker(mOptions);
        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(DENTON_PARKING_GARAGE, 15));

        return view;
    }


}
