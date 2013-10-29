package com.ParkingSquad.ParkingApp;

import java.util.ArrayList;
import java.util.List;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

/**
 * Author: Jeff Watson
 * Date: 10/3/13
 * Time: 3:16 PM
 */

public class PromotionDataSource {

    private static final String TAG = "PromotionDataSource";
    // Database fields
    private SQLiteDatabase database;
    private PromotionSQLiteHelper dbHelper;
    private String[] allColumns = {PromotionSQLiteHelper.COLUMN_ID, PromotionSQLiteHelper.COLUMN_START_DATE,
            PromotionSQLiteHelper.COLUMN_STOP_DATE, PromotionSQLiteHelper.COLUMN_START_TIME,
            PromotionSQLiteHelper.COLUMN_STOP_TIME, PromotionSQLiteHelper.COLUMN_PROMOTION_NAME,
            PromotionSQLiteHelper.COLUMN_VALUE, PromotionSQLiteHelper.COLUMN_LAT,
            PromotionSQLiteHelper.COLUMN_LON, PromotionSQLiteHelper.COLUMN_VENDOR, PromotionSQLiteHelper.COLUMN_LINK};

    public PromotionDataSource(Context context) {
        dbHelper = new PromotionSQLiteHelper(context);
    }

    public synchronized void open() throws SQLException {
        database = dbHelper.getWritableDatabase();
        Log.i(TAG, "Opening database");
    }

    public synchronized void close() {
        dbHelper.close();
        Log.i(TAG, "Closing database");
    }

    public Promotion createOrUpdatePromotion(Promotion promo) {
        ContentValues values = new ContentValues();
        values.put(PromotionSQLiteHelper.COLUMN_ID, promo.getId());
        values.put(PromotionSQLiteHelper.COLUMN_START_DATE, promo.getStart_date());
        values.put(PromotionSQLiteHelper.COLUMN_STOP_DATE, promo.getStop_date());
        values.put(PromotionSQLiteHelper.COLUMN_START_TIME, promo.getStart_time());
        values.put(PromotionSQLiteHelper.COLUMN_STOP_TIME, promo.getStop_time());
        values.put(PromotionSQLiteHelper.COLUMN_PROMOTION_NAME, promo.getPromotion_name());
        values.put(PromotionSQLiteHelper.COLUMN_VALUE, promo.getPromotion_value());
        values.put(PromotionSQLiteHelper.COLUMN_LAT, promo.getLat());
        values.put(PromotionSQLiteHelper.COLUMN_LON, promo.getLon());
        values.put(PromotionSQLiteHelper.COLUMN_VENDOR, promo.getPromotion_vendor());
        values.put(PromotionSQLiteHelper.COLUMN_LINK, promo.getLink());

        long insertId = database.insertWithOnConflict(PromotionSQLiteHelper.TABLE_PROMOTIONS, null,
                values, SQLiteDatabase.CONFLICT_REPLACE);

        Cursor cursor = database.query(PromotionSQLiteHelper.TABLE_PROMOTIONS,
                allColumns, PromotionSQLiteHelper.COLUMN_ID + " = " + insertId, null,
                null, null, null);
        cursor.moveToFirst();
        Promotion newPromo = cursorToPromotion(cursor);
        cursor.close();


        Log.i(TAG, "Creating Promotion");

        // TODO update the frgament!!!
        //StatsFragment.addPunch(newPromo);
        return newPromo;
    }

    public synchronized void deletePromotion(Promotion promo) {
        long id = promo.getId();
        Log.i(TAG, "Promotion deleted with id: " + id);
        database.delete(PromotionSQLiteHelper.TABLE_PROMOTIONS, PromotionSQLiteHelper.COLUMN_ID
                + " = " + id, null);

        Log.i(TAG, "Deleting promo: " + id);
    }

    public List<Promotion> getAllPromotions() {
        List<Promotion> promos = new ArrayList<Promotion>();

        Cursor cursor = database.query(PromotionSQLiteHelper.TABLE_PROMOTIONS,
                allColumns, null, null, null, null, null);

        cursor.moveToFirst();
        while (!cursor.isAfterLast()) {
            Promotion promo = cursorToPromotion(cursor);
            promos.add(promo);
            cursor.moveToNext();
        }
        // Make sure to close the cursor
        cursor.close();
        return promos;
    }

    private Promotion cursorToPromotion(Cursor cursor) {
        Promotion promo = new Promotion();
        promo.setId(cursor.getInt(0));
        promo.setStart_date(cursor.getString(1));
        promo.setStop_date(cursor.getString(2));
        promo.setStart_time(cursor.getString(3));
        promo.setStop_time(cursor.getString(4));
        promo.setPromotion_name(cursor.getString(5));
        promo.setPromotion_value(cursor.getString(6));
        promo.setLat(cursor.getFloat(7));
        promo.setLon(cursor.getFloat(8));
        promo.setPromotion_vendor(cursor.getString(9));
        promo.setLink(cursor.getString(10));
        return promo;
    }
}
