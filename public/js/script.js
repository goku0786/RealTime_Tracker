const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        position => {
            // Emit an object containing both latitude and longitude
            const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            console.log('Sending location data:', locationData);
            socket.emit('sendLocation', locationData);
        },
        error => {
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );

    socket.on('message', message => {
        console.log(message);
    });

    socket.on('locationMessage', message => {
        console.log(message);
    });


} else {
    alert('Geolocation is not supported by your browser');
}

// Initialize the map with default coordinates
const map = L.map("map").setView([0, 0], 16);

// Add OpenStreetMap tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Store markers by user ID
const markers = {};

// Listen for location data from the server
socket.on('receiveLocation', data => {
    const { id, latitude, longitude } = data;

    map.setView([latitude, longitude]);

    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    }
    else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on('userDisconnected', (id) => {
    console.log("this is id", id)
    if (markers[id]) {
        map.removeLayer(markers[id])
        delete markers[id]

    }
});
