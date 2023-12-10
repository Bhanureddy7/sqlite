 function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Assuming you have a field with id 'userLocation'
        const locationField = document.getElementById('userLocation');
        locationField.value = `Latitude: ${latitude}, Longitude: ${longitude}`;
    }

    // Fetch location on page load
    getLocation();