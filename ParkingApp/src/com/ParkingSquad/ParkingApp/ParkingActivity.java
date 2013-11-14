package com.ParkingSquad.ParkingApp;

import android.content.Context;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;

import android.support.v4.app.Fragment;
import android.support.v4.app.FragmentActivity;
import android.support.v4.app.FragmentManager;
import android.support.v4.app.FragmentPagerAdapter;
import android.support.v4.view.ViewPager;
import android.view.MenuItem;
import android.widget.Toast;

import java.util.Locale;

//import static com.google.android.gms.common.GooglePlayServicesUtil.isGooglePlayServicesAvailable;

public class ParkingActivity extends FragmentActivity {
    private static final String TAG = "ParkingActivity";
    private Context context;

    /**
     * Change the activity's page to the one supplied
     * @param page the page we want to go to
     */
    public void changePage(int page)
    {
        mViewPager.setCurrentItem(page);
    }

    public ParkingMapFragment getMapFragment()
    {
        return mParkingMapFragment;
    }

    public static boolean getGPSstatus (Context parkingContext) {
        LocationManager locationManager = (LocationManager) parkingContext.getSystemService (LOCATION_SERVICE);
        return (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER));
    }

    /**
     * The {@link android.support.v4.view.PagerAdapter} that will provide
     * fragments for each of the sections. We use a
     * {@link android.support.v4.app.FragmentPagerAdapter} derivative, which
     * will keep every loaded fragment in memory. If this becomes too memory
     * intensive, it may be best to switch to a
     * {@link android.support.v4.app.FragmentStatePagerAdapter}.
     */
    SectionsPagerAdapter mSectionsPagerAdapter;

    /**
     * The {@link ViewPager} that will host the section contents.
     */
    ViewPager mViewPager;

    PromotionStatusFragment mPromotionStatusFragment;
    ParkingMapFragment mParkingMapFragment;
    SettingsFragment mSettingsFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        context = this.getApplicationContext();

        mPromotionStatusFragment = new PromotionStatusFragment(this);
        mParkingMapFragment = new ParkingMapFragment();
        mParkingMapFragment.mapContext = context;
        mSettingsFragment = new SettingsFragment();


        // Create the adapter that will return a fragment for each of the three
        // primary sections of the app.
        mSectionsPagerAdapter = new SectionsPagerAdapter(
                getSupportFragmentManager());

        // Set up the ViewPager with the sections adapter.
        mViewPager = (ViewPager) findViewById(R.id.pager);
        mViewPager.setAdapter(mSectionsPagerAdapter);

        mViewPager.setCurrentItem(1);

    }

    @Override
    protected void onResume() {
        super.onResume();

        AsyncDiscountUpdateConnector updater = new AsyncDiscountUpdateConnector(this);
        AsyncWeatherUpdate weatherUpdate = new AsyncWeatherUpdate(this);        // instantiate the weather updater class    KS
        updater.execute(null, null, null);
        weatherUpdate.execute (null, null, null);                               // call it to execute   KS
        //String response = updater.getResponse();

        //Toast.makeText(context, response, Toast.LENGTH_SHORT).show();
    }


    @Override
    public boolean onOptionsItemSelected (MenuItem item) {                           //  This is for the menu of options actually being clicked by the user    KS
        switch (item.getItemId()) {
            case R.id.action_settings:  mViewPager.setCurrentItem(2, true);          //  int 2 is for the page of the settings view-we will need to change it if we add more fragments   KS
                                        return true;
            default: return super.onOptionsItemSelected (item);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }

    /**
     * A {@link FragmentPagerAdapter} that returns a fragment corresponding to
     * one of the sections/tabs/pages.
     */
    public class SectionsPagerAdapter extends FragmentPagerAdapter {

        public SectionsPagerAdapter(FragmentManager fm) {
            super(fm);
        }

        @Override
        public Fragment getItem(int position) {
            // getItem is called to instantiate the fragment for the given page.
            // Return a the applicable Fragment for each section
            switch (position) {
                case 0: // Map Fragment
                    return mParkingMapFragment;

                case 1: // Parking status fragment
                    return mPromotionStatusFragment;

                default: //Settings Fragment
                    return mSettingsFragment;
            }
        }

        @Override
        public int getCount() {
            // Show 3 total pages.
            return 3;
        }

        @Override
        public CharSequence getPageTitle(int position) {
            Locale l = Locale.getDefault();
            switch (position) {
                case 0:
                    return getString(R.string.title_map).toUpperCase(l);
                case 1:
                    return getString(R.string.title_status).toUpperCase(l);
                case 2:
                    return getString(R.string.title_setting).toUpperCase(l);
            }
            return null;
        }
    }

    public void displayResponse(String s) {
        Toast.makeText(context, s, Toast.LENGTH_SHORT).show();
    }

    public void forceReload() {
        Log.i(TAG, "Made it to force reload!");

        mPromotionStatusFragment.forceReload();

    }
}