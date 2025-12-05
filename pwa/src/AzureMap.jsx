import React, { useRef, useEffect } from 'react';
import * as atlas from 'azure-maps-control';
import 'azure-maps-control/dist/atlas.min.css';
import './AzureMap.css';

function AzureMap({ subscriptionKey, stations, userLocation }) {
  const mapRef = useRef(null);
  const userLocationLogged = useRef(false);

  // Log userLocation only once per page load
  useEffect(() => {
    if (!userLocationLogged.current && userLocation) {
      console.log(userLocation);
      userLocationLogged.current = true;
    }
  }, [userLocation]);

  const map = useRef(null);
const ready = useRef(false);

const isNumber = (v) => typeof v === 'number' && Number.isFinite(v);
const isValidCoord = (lat, lng) =>
  isNumber(lat) && lat >= -90 && lat <= 90 && isNumber(lng) && lng >= -180 && lng <= 180;

// Initialize map once
useEffect(() => {
  if (!mapRef.current || map.current) return;

  const defaultCenter = [35, 31]; // [lng, lat] — safe default (Israel-ish)

  map.current = new atlas.Map(mapRef.current, {
    authOptions: {
      authType: atlas.AuthenticationType.subscriptionKey,
      subscriptionKey,
    },
    center: defaultCenter,
    zoom: 8,
    view: 'Auto',
    style: 'road',
  });

  map.current.events.add('ready', () => {
    ready.current = true;
    renderAll(); // draw when ready
  });

  return () => {
    try { map.current?.dispose(); } finally { map.current = null; ready.current = false; }
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [subscriptionKey]);

// Re-render markers/camera when inputs change
useEffect(() => {
  renderAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [stations, userLocation]);

function renderAll() {
  if (!ready.current || !map.current) return;

  // Clear previous
  map.current.markers?.clear();
  map.current.popups?.clear();

  const positions = []; // collect [lng, lat] for camera fit

  // ----- User marker (guard against nulls) -----
  const uLat = userLocation?.latitude;
  const uLng = userLocation?.longitude;
  if (isValidCoord(uLat, uLng)) {
    const userPos = [uLng, uLat]; // [lng, lat]
    const userMarker = new atlas.HtmlMarker({
      color: 'red',
      text: 'You',
      position: userPos,
    });
    map.current.markers.add(userMarker);

    const userPopup = new atlas.Popup({ pixelOffset: [0, -30] });
    userPopup.setOptions({
      position: userPos,
      content: `<div style="padding:10px;">Your Location</div>`,
    });
    map.current.popups.add(userPopup);

    positions.push(userPos);
  }

  // ----- Stations (validate fields) -----
  (stations ?? []).forEach((element) => {
    const lat = element?.location?.latitude;
    const lng = element?.location?.longitude;
    if (!isValidCoord(lat, lng)) return;

    const pos = [lng, lat]; // [lng, lat]
    const marker = new atlas.HtmlMarker({
      color: 'DodgerBlue',
      text: element?.name ?? '',
      position: pos,
    });
    map.current.markers.add(marker);

    const popup = new atlas.Popup({ pixelOffset: [0, -30] });
    map.current.events.add('click', marker, () => {
      popup.setOptions({
        position: pos,
        content: `<div style="padding:10px;">${element?.name ?? ''}<br/>${element?.address ?? ''}</div>`,
      });
      popup.open(map.current);
    });
    map.current.popups.add(popup);

    positions.push(pos);
  });

  // ----- Camera logic -----
  if (positions.length === 0) {
    // no valid points; keep default center/zoom
    return;
  }
  if (positions.length === 1) {
    map.current.setCamera({ center: positions[0], zoom: 14 });
    return;
  }

  // Fit to all points; BoundingBox takes [lat, lng], so convert
  const latLngs = positions.map(([lng, lat]) => [lat, lng]);
  const bounds = new atlas.data.BoundingBox.fromLatLngs(latLngs);
  map.current.setCamera({ bounds, padding: 60 });
}

  return <div ref={mapRef} id="map" className='w-full'></div>;
}

export default AzureMap;
