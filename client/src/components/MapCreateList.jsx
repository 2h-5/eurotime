import {useNavigate, useSearchParams} from "react-router-dom";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";

import styles from "./Map.module.css";
import {useEffect, useState} from "react";
import {useCities} from "../contexts/CitiesContext";
import {useGeolocation} from "../hooks/useGeolocation";
import {useUrlPosition} from "../hooks/useUrlPosition";

function Map() {
    const {cities} = useCities();
    const [mapPosition, setMapPosition] = useState([40, 0]); 
    const [maps, setMaps] = useState([]); 

    const {
        isLoading: isLoadingPosition,
        position: geoLocationPosition,
        getPosition,
    } = useGeolocation();

    const [mapLat, mapLng] = useUrlPosition(); 
    useEffect(
        function () {
            if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
        },
        [mapLat, mapLng]
    );

    useEffect(
        function () {
            if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
        },
        [mapLat, mapLng]
    );
    setTimeout(() => {
        
        ch()
    }, 1000);

    function ch() {
        console.log("Scheduled Task 2");
        if (undefined != sessionStorage.getItem("search")) {
            console.log(sessionStorage.getItem("search"));
            console.log(sessionStorage.getItem("searchResults"));
            setMaps(JSON.parse(sessionStorage.getItem("searchResults")))
            let baseP = maps[0]
            if (undefined != baseP.Latitude) {
                setMapPosition([baseP.Latitude, baseP.Longitude])
                sessionStorage.removeItem("search")
                sessionStorage.removeItem("searchResults")
            }
        }
        setTimeout(() => {
           
            ch()
        }, 1000);
    }

    return (
        <div className={styles.mapContainer}>
            <MapContainer
                center={mapPosition}
                zoom={6}
                scrollWheelZoom={true}
                className={styles.map}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {maps.map((city) => (
                    <Marker
                        position={[city.Latitude, city.Longitude]}
                        key={city.id}
                    >
                        <Popup>
                            <span>{city.Destination}</span> <span>{city.Region}</span>
                        </Popup>
                    </Marker>
                ))}

                <ChangeCenter position={mapPosition}/>
                <DetectClick/>
            </MapContainer>
        </div>
    );
}

function ChangeCenter({position}) {
    const map = useMap(); 
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: (e) => {
            console.log(e.latlng.lat);
            navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
        },
    });
}

export default Map;
