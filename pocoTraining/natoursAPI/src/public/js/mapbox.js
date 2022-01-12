const locations = JSON.parse(document.getElementById('map').dataset.locations);
mapboxgl.accessToken =
  'pk.eyJ1IjoiYW50aG9ueWF3YWQiLCJhIjoiY2t5YmV1NGs1MDdrbzJvcXgzZ2o2anJvZiJ9.hnROw0fQM4reOF9FKkHDIQ';

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
});

const bounds = new mapboxgl.latlngBounds();

locations.forEach((loc) => {
  const el = document.createElement('div');
  el.className = 'marker';
  new mapboxgl.Marker({ element: el, anchor: 'bottom' })
    .setLngLat(loc.coordinates)
    .addTo(map);

  bounds.extend(loc.coordinates);
});
