// Get references to the form and the response area
const myForm = document.getElementById("myForm");
const responseArea = document.getElementById("responseArea");

// Add a submit event listener to the form
myForm.addEventListener("submit", function (event) {
    // 1. Prevent the default form submission behavior (page reload)
    event.preventDefault();

    // 2. Collect the form data
    const formData = new FormData(myForm);
    const name = formData.get("name");
    const email = formData.get("email");

    // 3. Dynamically update the content of the response area
    responseArea.innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
    `;

    // Optional: Clear the form fields after submission
    myForm.reset();
});

function sendEmail() {
    const recipient = document.getElementById('recipientEmail').value;
    let subject = "MyAccess Bypass";
    const body = "Thank you for using our service. The process has been successfully completed.";
    
    // Encode subject and body for URL
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    // Construct the mailto URI
    const mailtoUri = `mailto:${recipient}?subject=${encodedSubject}&body=${encodedBody}`;

    // Open the user's default email client
    window.location.href = mailtoUri;
}