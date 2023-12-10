async function submitForm() {
    var companyName = document.getElementById("companyName").value;
    var userLocation = document.getElementById("userLocation").value;
    var companyEmail = document.getElementById("companyEmail").value;
    var websiteLink = document.getElementById("websiteLink").value;
    var phoneNumber = document.getElementById("phoneNumber").value;
    var ratePerHour = document.getElementById("ratePerHour").value;

    // Validate inputs
    if (!companyName || !userLocation || !companyEmail || !websiteLink || !phoneNumber || !ratePerHour) {
        alert("Please fill in all fields");
        return;
    }

    // Check if the user already exists
    const response = await fetch('http://localhost:5500/checkUser?companyEmail=' + encodeURIComponent(companyEmail), {
        method: 'GET',
    });

    const data = await response.json();

    if (response.ok) {
        if (data.exists) {
            alert("User already exists");
        } else {
            // Send data to the server
            const submitResponse = await fetch('http://localhost:5500/submitForm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `companyName=${encodeURIComponent(companyName)}&userLocation=${encodeURIComponent(userLocation)}&companyEmail=${encodeURIComponent(companyEmail)}&websiteLink=${encodeURIComponent(websiteLink)}&phoneNumber=${encodeURIComponent(phoneNumber)}&ratePerHour=${encodeURIComponent(ratePerHour)}`,
            });

            if (submitResponse.ok) {
                console.log("Form submitted successfully");
                alert("Form submitted successfully!");
            } else {
                console.error("Error submitting form");
                alert("Error submitting form");
            }
        }
    } else {
        console.error("Error checking user existence");
        alert("Error checking user existence");
    }
}
