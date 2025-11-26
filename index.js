// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration. Prefer shared `window.FIREBASE_CONFIG` when present.
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = window && window.FIREBASE_CONFIG ? window.FIREBASE_CONFIG : {
    apiKey: "AIzaSyA5I4b1hKtsGGwKerUL4bTdF7NZlSxAOEM",
    authDomain: "trackinggps-fb785.firebaseapp.com",
    databaseURL: "https://trackinggps-fb785-default-rtdb.firebaseio.com",
    projectId: "trackinggps-fb785",
    storageBucket: "trackinggps-fb785.firebasestorage.app",
    messagingSenderId: "391940077434",
    appId: "1:391940077434:web:788dde22321ab3f00c08c3",
    measurementId: "G-3093VFRQDF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Mapbox token
mapboxgl.accessToken = 'pk.eyJ1Ijoic3VtaXRoa2FudGgwNyIsImEiOiJjbTNoaHRiMjUwYW0yMmpzOGF2bzl6NzhyIn0.ZKv6URC1WfYRAA91qfp5NA';

// Initialize map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [77.0716, 10.8874],
    zoom: 14
});

// Add Directions control
const directions = new MapboxDirections({
    accessToken: mapboxgl.accessToken,
    unit: 'metric',
    profile: 'mapbox/driving',
    controls: { instructions: false }
});
map.addControl(directions, 'top-left');

// Custom marker
const busIconUrl = 'https://img.icons8.com/ios/452/bus.png';
const marker = new mapboxgl.Marker({ element: createBusMarkerElement(busIconUrl) })
    .setLngLat([0, 0])
    .addTo(map);

function createBusMarkerElement(iconUrl) {
    const el = document.createElement('div');
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.backgroundImage = `url(${iconUrl})`;
    el.style.backgroundSize = 'contain';
    el.style.backgroundPosition = 'center';
    el.style.backgroundRepeat = 'no-repeat';
    return el;
}

let previousRef;

function fetchBusLocation() {
    const busNo = document.getElementById("busNumber").value;
    const message = document.getElementById("message");
    const eta = document.getElementById("eta");

    if (!busNo) {
        alert("Please select a bus number.");
        return;
    }

    if (previousRef) off(previousRef);
    const locationRef = ref(database, `busLocation/${busNo}`);
    previousRef = locationRef;

    onValue(locationRef, (snapshot) => {
        const data = snapshot.val();

        if (data) {
            const { latitude, longitude } = data;
            marker.setLngLat([longitude, latitude]);
            map.setCenter([longitude, latitude]);

            message.textContent = '';
            directions.setOrigin([longitude, latitude]);
            directions.setDestination([77.07614, 11.04151]);
            fetchETA([longitude, latitude], [77.07614, 11.04151]);
        } else {
            message.textContent = 'Bus Location Unavailable';
            eta.textContent = '';
        }
    });
}

function fetchETA(origin, destination) {
    const eta = document.getElementById("eta");

    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?access_token=${mapboxgl.accessToken}&alternatives=false&geometries=geojson&steps=false`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const minutes = Math.round(data.routes[0].duration / 60);
            eta.textContent = `ETA: ${minutes} minutes`;
        })
        .catch(() => {
            eta.textContent = 'Unable to calculate ETA';
        });
}

document.getElementById('fetchLocationButton').addEventListener('click', fetchBusLocation);
