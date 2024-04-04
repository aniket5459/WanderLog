/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { useCities } from '../context/CitiesContext';
import { useGeolocation } from '../hooks/useGeoLocation';
import Button from '../components/Button';
import { useUrlPosition } from '../hooks/useUrlPosition';


function Map() {
    const { cities } = useCities();
    const [mapPosition, setMapPosition] = useState([40, 0])
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        isLoading: isLoadingPosition,
        position: geolocationPosition,
        getPosition
    } = useGeolocation();

    const [mapLat, mapLng] = useUrlPosition();


    const flagemojiToPNG = (flag) => {

        let countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt()).map(char => String.fromCharCode(char - 127397).toLowerCase()).join('')
        return (<img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt='flag' />)
    }

    // const mapLat = searchParams.get("lat");
    // const mapLng = searchParams.get("lng");

    useEffect(
        function () {
            if (mapLat && mapLng) setMapPosition([mapLat, mapLng])
        }, [mapLat, mapLng]);



    useEffect(
        function () {
            if (
                geolocationPosition &&
                geolocationPosition.lat &&
                geolocationPosition.lng
            )
                setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
        },
        [geolocationPosition]
    );


    return (
        <div className={styles.mapContainer} >
            {
                !geolocationPosition.lat &&
                !geolocationPosition.lng && (<Button type='position' onClick={getPosition}>
                    {isLoadingPosition ? "Loading..." : "Use your Position"}
                </Button>)}
            <MapContainer
                center={mapPosition}

                zoom={6}
                scrollWheelZoom={true}
                className={styles.map}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {cities.map((city) => (
                    <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                        <Popup>
                            <span>{flagemojiToPNG(city.emoji)}</span><span>{city.cityName}</span>
                        </Popup>
                    </Marker>
                ))}

                <ChangeCenter position={mapPosition} />
                <DetectClick />
            </MapContainer>
        </div>)
}

function ChangeCenter({ position }) {
    const map = useMap();
    map.setView(position);
    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
    })
}

export default Map;