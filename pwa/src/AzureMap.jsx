
import React, { useEffect , useRef} from 'react';
import * as atlas from 'azure-maps-control'
import 'azure-maps-control/dist/atlas.min.css'
import './AzureMap.css';

function AzureMap({subscriptionKey, dealers}) {
  const mapRef = useRef(null)

  useEffect(() => {
    let map;
    console.log(dealers)
    const loadMap = () => {
      

      map = new atlas.Map(mapRef.current, {
        authOptions:{
          authType: atlas.AuthenticationType.subscriptionKey,
          subscriptionKey: subscriptionKey
        },
        center: dealers.length > 0 ? [dealers[0].position[0], dealers[0].position[1]] : [0,0],
        zoom: 10, 
        view: 'Auto'
      })

      map.events.add('ready', () => {
        
        dealers.forEach((element) => { 
          console.log(element)
          const marker = new atlas.HtmlMarker({
            color: 'DodgerBlue',
            text:'D', 
            position: [element.position[0], element.position[1]]
          })

          const popup = new atlas.Popup({
            pixelOffset: [0, -30]
          })

          map.events.add('click', marker, () =>{
            popup.setOptions({
              position: [element.position[0], element.position[1]],
              content: `<div style="padding:10px;">${element.name}<br></br>${element.address} </div>`

            })

            popup.open(map)
          })

          map.markers.add(marker)
          map.popups.add(popup)
          
        });
      })
    }
    if (!mapRef.current) return
    loadMap()

    return () => {
      if(map){
        map.dispose()
      }
    }


  }),[subscriptionKey, dealers]

  return (
        <div ref={mapRef} id="map" className='w-full'></div>         
        );
  
}

export default AzureMap; 


