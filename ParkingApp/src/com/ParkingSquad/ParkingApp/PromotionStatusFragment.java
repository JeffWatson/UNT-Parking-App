package com.ParkingSquad.ParkingApp;

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.support.v4.app.ListFragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import java.util.ArrayList;

/**
 * Author: Jeff Watson
 * Date: 9/19/13
 * Time: 3:23 PM
 */

public class PromotionStatusFragment extends ListFragment {
    private static final String TAG = "PromotionStatusFragment";

    private View rootView;
    private static PromotionListAdapter mAdapter;
    private ArrayList<Promotion> mData;
    private PromotionDataSource datasource;

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

    public void forceReload()
    {
        Log.i(TAG, "Forcing list view Refresh...");

        datasource.open();
        mData = (ArrayList<Promotion>) datasource.getAllPromotions();
        datasource.close();

        mAdapter = new PromotionListAdapter(getActivity().getApplicationContext(), R.layout.promotion_item, mData);

        setListAdapter(mAdapter);
        mAdapter.notifyDataSetChanged();

        Log.i(TAG, "finished reloading!");
    }
}
