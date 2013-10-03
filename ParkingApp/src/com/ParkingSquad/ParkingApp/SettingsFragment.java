package com.ParkingSquad.ParkingApp;

import android.content.Context;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ExpandableListView;
import android.widget.SimpleExpandableListAdapter;

import java.util.*;

/**
 * Author: Jeff Watson
 * Date: 9/19/13
 * Time: 3:31 PM
 */
public class SettingsFragment extends Fragment {
    private static final String TAG = "SettingsFragment";
    private Context context;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        super.onCreateView(inflater, container, savedInstanceState);

        context = inflater.getContext();
        View view = inflater.inflate(R.layout.settings_layout, container, false);

        ArrayList<Map<String, String>> groupData = new ArrayList<Map<String, String>>();
        ArrayList<ArrayList<Map<String, String>>> childData = new ArrayList<ArrayList<Map<String, String>>>();

        HashMap<String, String> groupMap = new HashMap<String, String>();
        groupMap.put("Notifications", "Notifications");
        groupData.add(groupMap);

        HashMap<String, String> childMap = new HashMap<String, String>();
        childMap.put("item", "Parking");

        HashMap<String, String> childMap2 = new HashMap<String, String>();
        childMap2.put("item", "Promotions");

        ArrayList<Map<String, String>> childInnerList = new ArrayList<Map<String, String>>();
        childInnerList.add(childMap);
        childInnerList.add(childMap2);

        childData.add(childInnerList);


        try{
            SimpleExpandableListAdapter expListAdapter =
                    new SimpleExpandableListAdapter(
                            context,
                            groupData,              // Creating group List.
                            R.layout.notification_group_item,             // Group item layout XML.
                            new String[] { "Notifications" },  // the key of group item.
                            new int[] { R.id.notification_group_name },    // ID of each group item.-Data under the key goes into this TextView.
                            childData,              // childData describes second-level entries.
                            R.layout.notification_list_item,             // Layout for sub-level entries(second level).
                            new String[] {"item"},      // Keys in childData maps to display.
                            new int[] { R.id.notification_type}     // Data under the keys above go into these TextViews.
                    );
            //setListAdapter( expListAdapter );       // setting the adapter in the list.

            ExpandableListView expListView = (ExpandableListView) view.findViewById(R.id.expandableListView);
            expListView.setAdapter(expListAdapter);

        } catch (Exception e){
            Log.e(TAG, "Exception setting up Expandable list adapter :(", e);
        }

        return view;
    }
}
