package com.ParkingSquad.ParkingApp;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

/**
 * Author: Jeff Watson
 * Date: 10/3/13
 * Time: 3:17 PM
 */

public class PromotionSQLiteHelper extends SQLiteOpenHelper {

    public static final String TABLE_PROMOTIONS = "promotions";
    public static final String COLUMN_ID = "id";
    public static final String COLUMN_START_DATE = "start_date";
    public static final String COLUMN_STOP_DATE = "stop_date";
    public static final String COLUMN_START_TIME = "start_time";
    public static final String COLUMN_STOP_TIME = "stop_time";
    public static final String COLUMN_PROMOTION_NAME = "promotion_name";
    public static final String COLUMN_VALUE = "value";
    public static final String COLUMN_LAT = "lat";
    public static final String COLUMN_LON = "lon";
    public static final String COLUMN_VENDOR = "vendor";
    public static final String COLUMN_LINK = "link";


    private static final String DATABASE_NAME = "promotions.db";
    private static final int DATABASE_VERSION = 1;

    // Database creation sql statement
    private static final String DATABASE_CREATE = "create table "
            + TABLE_PROMOTIONS + "("
            + COLUMN_ID + " integer primary key autoincrement, "
            + COLUMN_START_DATE + " text, "
            + COLUMN_STOP_DATE + " text, "
            + COLUMN_START_TIME + " text, "
            + COLUMN_STOP_TIME + " text, "
            + COLUMN_PROMOTION_NAME + " text, "
            + COLUMN_VALUE + " text, "
            + COLUMN_LAT + " double, "
            + COLUMN_LON + " double, "
            + COLUMN_VENDOR + " text, "
            + COLUMN_LINK + " text);";

    public PromotionSQLiteHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase database) {
        try
        {
            database.execSQL(DATABASE_CREATE);
        }
        catch(Exception e)
        {
            Log.e("SQL ERROR creating database" , e.toString());
        }
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        Log.w(PromotionSQLiteHelper.class.getName(),
                "Upgrading database from version " + oldVersion + " to "
                        + newVersion + ", which will save all old data");

        /**
         * implement as if(DATABASE_VERSION == *) { }
         *
         */

        onCreate(db);
    }

}
