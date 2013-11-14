package com.ParkingSquad.ParkingApp;

import android.app.Activity;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.ListFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;

/**
 * Author: Jeff Watson
 * Date: 9/19/13
 * Time: 3:23 PM
 */

public class PromotionStatusFragment extends ListFragment implements AdapterView.OnItemClickListener {
    private static final String TAG = "PromotionStatusFragment";

    private View rootView;
    private static PromotionListAdapter mAdapter;
    private ArrayList<Promotion> mData;
    private PromotionDataSource datasource;
    private ParkingActivity activity;

    public PromotionStatusFragment(ParkingActivity act)
    {
        this.activity = act;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        super.onCreateView(inflater, container, savedInstanceState);

        Log.i(TAG, "PromotionStatusFragment onCreateView");

        datasource = new PromotionDataSource(getActivity().getApplicationContext());
        datasource.open();
        mData = (ArrayList<Promotion>) datasource.getAllPromotions();
        datasource.close();

        mAdapter = new PromotionListAdapter(getActivity().getApplicationContext(), R.layout.promotion_item, mData);

        setListAdapter(mAdapter);

        rootView = inflater.inflate(R.layout.current_promotions_layout, container, false);


        return rootView;
    }

    @Override
    public void onResume()
    {
        super.onResume();
        getListView().setOnItemClickListener(this);
    }

    public void forceReload() {
        Log.i(TAG, "Forcing list view Refresh...");

        datasource.open();
        mData = (ArrayList<Promotion>) datasource.getAllPromotions();
        datasource.close();

        mAdapter = new PromotionListAdapter(getActivity().getApplicationContext(), R.layout.promotion_item, mData);

        setListAdapter(mAdapter);
        mAdapter.notifyDataSetChanged();

        Log.i(TAG, "finished reloading!");
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
//        Log.i(TAG, "click on view " + position);

        //get our promotion
        Promotion promo = (Promotion) parent.getItemAtPosition(position);

        // change the page of the activity and show the new promotion
        activity.changePage(0);
        activity.getMapFragment().moveMapToPromotion(promo);
    }
}
