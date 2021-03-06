package com.ParkingSquad.ParkingApp;

/**
 * Author: Jeff Watson
 * Date: 10/1/13
 * Time: 6:49 PM
 */

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import android.app.Activity;
import android.content.Context;
import android.text.format.DateUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.*;

public class PromotionListAdapter extends ArrayAdapter {
    private final String TAG = "StatsListAdapter";

    // store the context (as an inflated layout)
    private LayoutInflater inflater;
    private int resource;
    private List<Promotion> data;
    private Context context;

    /**
     * Default constructor. Creates the new Adaptor object to
     * provide a ListView with data.
     * @param context
     * @param resource
     * @param data
     */
    public PromotionListAdapter(Context context, int resource, List data){
        super(context, resource, data);

        this.inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        this.resource = resource;
        this.data = data;
        this.context = context;
    }

    public int getCount() {

        return this.data.size();
    }

    public Object getItem(int position) {

        return this.data.get(position);
    }

    public long getItemId(int position) {

        return position;
    }

    public View getView(int position, View convertView, ViewGroup parent) {
        // reuse a given view, or inflate a new one from the xml
        View view;

        if (convertView == null) {
            view = this.inflater.inflate(resource, parent, false);
        } else {
            view = convertView;
        }

        // bind the data to the view object
        return this.bindData(view, position);
    }

    /**
     * Bind the provided data to the view.
     * This is the only method not required by base adapter.
     */
    public View bindData(View view, int position) {
        // make sure it's worth drawing the view
        if (this.data.get(position) == null) {
            return view;
        }

        Promotion item = this.data.get(position);

        TextView mTV = (TextView) view.findViewById(R.id.promotion_vendor);
        mTV.setText(item.getPromotion_name());

        mTV = (TextView) view.findViewById(R.id.promotion_value);
        mTV.setText(item.getPromotion_value());

        mTV = (TextView) view.findViewById(R.id.promotion_timestamp);
        // format the saved resource string.
        String running = context.getResources().getString(R.string.running_string);
        running = String.format(running, item.getStart_date(), item.getStop_date(), item.getStart_time(), item.getStop_time());
        mTV.setText(running);

        // return the final view object
        return view;
    }

    public void add(Promotion p) {

        this.data.add(p);
    }

    public void remove(Promotion p) {

        this.data.remove(p);
    }
}

