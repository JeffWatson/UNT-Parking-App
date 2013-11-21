CREATE TABLE promotions (id INTEGER PRIMARY KEY, start_date text, stop_date text, start_time text, stop_time text, promotion_name text, value text, lat number, lon number, link text);

SELECT * FROM promotions;

INSERT INTO promotions(null, 'start_date','stop_date','start_time','stop_time','promotion_name','value',lat, lon, 'link');

