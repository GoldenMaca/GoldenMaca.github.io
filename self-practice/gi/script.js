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
