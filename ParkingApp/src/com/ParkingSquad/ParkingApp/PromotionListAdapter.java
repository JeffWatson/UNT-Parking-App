package com.ParkingSquad.ParkingApp;

/**
 * Author: Jeff Watson
 * Date: 10/1/13
 * Time: 6:49 PM
 */

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import android.content.Context;
import android.text.format.DateUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

public class PromotionListAdapter extends BaseAdapter{
    @SuppressWarnings("unused")
    private final String TAG = "StatsListAdapter";

    // store the context (as an inflated layout)
    private LayoutInflater inflater;
    private int resource;
    private ArrayList<Promotion> data;
    private Context context;
    //public ImageView iv;

    /**
     * Default constructor. Creates the new Adaptor object to
     * provide a ListView with data.
     * @param context
     * @param resource
     * @param data
     */
    public PromotionListAdapter(Context context, int resource, ArrayList<Promotion> data) {
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

/*        // pull out the object
        ClockPunch item = this.data.get(position);

        // extract the view object
        View viewElement = view.findViewById(R.id.stats_id);
        // cast to the correct type
        TextView tv = (TextView)viewElement;
        // set the value
        tv.setText(Integer.toString(item.getId()));

        // extract the view object
        viewElement = view.findViewById(R.id.stats_start);
        // cast to the correct type
        tv = (TextView)viewElement;
        // set the value
        SimpleDateFormat formatter = new SimpleDateFormat("MMMM dd, yyyy", Locale.getDefault());
        String dateString = formatter.format(new Date(item.getStartTime()));
        tv.setText(dateString);

        // extract the view object
        viewElement = view.findViewById(R.id.stats_stop);
        // cast to the correct type
        tv = (TextView)viewElement;
        // set the value
        //TODO fix this to show HH:mm:ss.SSSZ - not as a date!
        //formatter = new SimpleDateFormat("hh:mm:ss.SSS", Locale.getDefault());
        //dateString = formatter.format(new Date(item.getStopTime()));
        long millis = item.getAccumTime();
        //hhhhhh:mm:ss.sss
        tv.setText(String.format("%d:%02d:%02d.%03d",
                TimeUnit.MILLISECONDS.toHours(millis),
                TimeUnit.MILLISECONDS.toMinutes(millis) -
                        TimeUnit.HOURS.toMinutes(TimeUnit.MILLISECONDS.toHours(millis)),
                TimeUnit.MILLISECONDS.toSeconds(millis) -
                        TimeUnit.MINUTES.toSeconds(TimeUnit.MILLISECONDS.toMinutes(millis)),
                TimeUnit.MILLISECONDS.toMillis(millis) -
                        TimeUnit.SECONDS.toMillis(TimeUnit.MILLISECONDS.toSeconds(millis))));

        // extract the view object
        viewElement = view.findViewById(R.id.stats_rate);
        // cast to the correct type
        tv = (TextView)viewElement;
        // set the value
        tv.setText(Utils.getFormattedRate(item.getPayRate()));*/

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

