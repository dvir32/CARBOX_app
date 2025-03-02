import React, { useEffect , useRef} from 'react';
import * as atlas from 'azure-maps-control'
import 'azure-maps-control/dist/atlas.min.css'
import './AzureMap.css';

function AzureMap({ subscriptionKey, stations }) {
  const mapRef = useRef(null);

  useEffect(() => {
    let map;

    if (mapRef.current) { // Check for mapRef here
      const loadMap = () => {
        map = new atlas.Map(mapRef.current, {
          authOptions: {
            authType: atlas.AuthenticationType.subscriptionKey,
            subscriptionKey: subscriptionKey
          },
          center: stations.length > 0 ? [stations[0].location.longitude, stations[0].location.latitude] : [0, 0],
          zoom: 14,
          view: 'Auto'
        });

        map.events.add('ready', () => {
          stations.forEach((element) => { 
            console.log(element)
            const marker = new atlas.HtmlMarker({
              color: 'DodgerBlue',
              text: element.name, 
              position: [element.location.longitude, element.location.latitude]
            });

            const popup = new atlas.Popup({
              pixelOffset: [0, -30]
            });

            map.events.add('click', marker, () => {
              popup.setOptions({
                position: [element.position[0], element.position[1]],
                content: `<div style="padding:10px;">${element.name}<br/>${element.address}</div>`
              });

              popup.open(map);
            });

            map.markers.add(marker);
            map.popups.add(popup);
          });
        });
      };

      loadMap();

      return () => {
        if (map) {
          map.dispose(); // Cleanup map instance on component unmount or dependency change
        }
      };
    }
  }, [subscriptionKey, stations]);

  return (
    <div ref={mapRef} id="map" className='w-full'></div>
  );
}

export default AzureMap;
