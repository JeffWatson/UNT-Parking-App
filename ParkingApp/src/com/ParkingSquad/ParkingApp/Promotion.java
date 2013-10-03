package com.ParkingSquad.ParkingApp;

/**
 * Author: Jeff Watson
 * Date: 10/1/13
 * Time: 6:50 PM
 */
public class Promotion {
    private long id;                // id in the online database, keep these in sync
    private String start_date;
    private String stop_date;
    private String start_time;
    private String stop_time;

    private String promotion_vendor;
    private String promotion_name;
    private String promotion_value;
    private String link;

    private double lat;
    private double lon;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getStart_date() {
        return start_date;
    }

    public void setStart_date(String start_date) {
        this.start_date = start_date;
    }

    public String getStop_date() {
        return stop_date;
    }

    public void setStop_date(String stop_date) {
        this.stop_date = stop_date;
    }

    public String getStop_time() {
        return stop_time;
    }

    public void setStop_time(String stop_time) {
        this.stop_time = stop_time;
    }

    public String getStart_time() {
        return start_time;
    }

    public void setStart_time(String start_time) {
        this.start_time = start_time;
    }

    public String getPromotion_vendor() {
        return promotion_vendor;
    }

    public void setPromotion_vendor(String promotion_vendor) {
        this.promotion_vendor = promotion_vendor;
    }

    public String getPromotion_name() {
        return promotion_name;
    }

    public void setPromotion_name(String promotion_name) {
        this.promotion_name = promotion_name;
    }

    public String getPromotion_value() {
        return promotion_value;
    }

    public void setPromotion_value(String promotion_value) {
        this.promotion_value = promotion_value;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLon() {
        return lon;
    }

    public void setLon(double lon) {
        this.lon = lon;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Promotion promotion = (Promotion) o;

        if (id != promotion.id) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }
}
