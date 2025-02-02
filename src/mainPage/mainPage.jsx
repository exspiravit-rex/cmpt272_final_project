import './mainPage.css';
import Map from './mainPageComponents/map';
import List from './mainPageComponents/list';
import Figure from './mainPageComponents/figure';
import FormButton from './mainPageComponents/FormButton';
import InfoHeader from './mainPageComponents/infoheader';
import React, { useRef, useState } from 'react';
import L, { marker } from 'leaflet';

function MainPage() {
  const [incidents, setIncidents] = useState([]);

  const addIncident = (newincident) => {
    setIncidents([...incidents, newincident]);
  };

  const [visibleIncidents, setVisibleIncidents] = useState([]);

  const changeVisibleIncidents = (incidents) => {
    setVisibleIncidents(incidents);
  }
 

  const [showMarker, setShowMarker] = useState(false);

  const [incidentKey, setIncidentKey] = useState(null);

  const mapRef = useRef(null);
  const changeIncident = (key,index) => {
 
    setIncidentKey(key);
    setShowMarker(index);
    if (mapRef.current) {
      const map = mapRef.current;

      const markers = [];
      
      // Loop through all layers on the map
      map.eachLayer((layer) => {
        // Check if the layer is a Marker
        if (layer instanceof L.Marker) {
          markers.push(layer);
        }
      });
      console.log(markers);
      console.log(key);
      console.log(markers[key]);
      markers[key]._icon.src = "/images/map-pin-yellow.png";
      map.flyTo(incidents[key].location, 16);
    }
  }

  const updateIncident = (updatedIncident) => {
    setIncidents((prevIncidents) =>
      prevIncidents.map((incident) =>
        incident === updatedIncident ? updatedIncident : incident
      )
    );
  }
  
  const onDeleteIncident = (toDelete) => {
    setIncidents(prevIncidents =>
      prevIncidents.filter(incident => incident !== toDelete)
    );
    setIncidentKey(null);
    setShowMarker(false);
  }
  

  return (
    <div className="homePage">
      <div className='header'>
        <InfoHeader />
      </div>
      <div className='mapContainer'>
        <Map onMove={changeVisibleIncidents} onMarkerClick={changeIncident} incidents={incidents} mapRef={mapRef}/>
      </div>
      {showMarker && (<div className='figureContainer'><Figure incident={incidents[incidentKey]} onUpdateIncident={updateIncident} onDeleteIncident={onDeleteIncident}/></div>)}
      <div className='listContainer'>
      <List incidents={visibleIncidents} onMoreInfoClick={(index) => changeIncident(index, true)} />
      </div>
      <div className="formContainer">
        <FormButton onIncidentSubmit={addIncident}/>
      </div>
    </div>
  );
}

export default MainPage;
