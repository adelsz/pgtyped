/*
  @name GetSingleTour
*/
select
  t.id,
	started_at,
	jsonb_agg(p) as points,
	row_to_json(u) as user
from tours t
left join (
	select
		tour_id,
		time_bucket(:timespanSegment, time) as timestamp,
		avg(lat) as lat,
		avg(lon) as lon,
		avg(altitude) as altitude
	from gpx_track_points
	group by tour_id, timestamp
) p on p.tour_id = t.id
left join (
select
  users.id,
	first_name,
	left(last_name, 1) as last_name_initial
from users
) u on u.id = t.user_id
where t.id = :id
group by t.id, t.started_at, u.*
limit 1;

/*
  @name getAllTours
  @param ids -> (...)
*/
select
  t.id,
	started_at,
	jsonb_agg(p) as points,
	row_to_json(u) as user
from tours t
left join (
	select
		tour_id,
		time_bucket('10 minutes', time) as timestamp,
		avg(lat) as lat,
		avg(lon) as lon,
		avg(altitude) as altitude
	from gpx_track_points
	group by tour_id, timestamp
) p on p.tour_id = t.id
left join (
select
  users.id,
	first_name,
	left(last_name, 1) as last_name_initial
from users
) u on u.id = t.user_id
where (:ids :: bigint[] is null or t.id = ANY(:ids))
and (:startMin :: timestamp is null or t.started_at >= :startMin)
and (:startMax :: timestamp is null or t.started_at <= :startMax)
and (:latMin :: double precision is null or p.lat >= :latMin)
and (:latMax :: double precision is null or p.lat <= :latMax)
and (:lonMin :: double precision is null or p.lon >= :lonMin)
and (:lonMax :: double precision is null or p.lon <= :lonMax)
and (:altitudeMin :: double precision is null or p.altitude >= :altitudeMin)
and (:altitudeMax :: double precision is null or p.altitude <= :altitudeMax)
group by t.id, t.started_at, u.*;
