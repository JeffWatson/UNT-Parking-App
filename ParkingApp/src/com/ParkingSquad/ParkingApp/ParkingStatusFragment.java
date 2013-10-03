package com.ParkingSquad.ParkingApp;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

/**
 * Author: Jeff Watson
 * Date: 9/19/13
 * Time: 3:23 PM
 */
public class ParkingStatusFragment extends Fragment {

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        super.onCreateView(inflater, container, savedInstanceState);

        View view = inflater.inflate(R.layout.status_layout, container, false);

        return view;
    }
}
