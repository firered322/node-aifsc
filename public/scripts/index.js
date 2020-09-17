const ROOT_URL = "http://localhost:3000"

async function handleFormSubmit() {
  const email = document.getElementById("inputEmail").value;
  const password = document.getElementById("inputPassword").value;

  const reqBody = {
    email,
    password,
  };

  // prep request
  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  };

  let loginResponse = await fetch(`${ROOT_URL}/auth/login`, requestOptions);
  loginResponse = await loginResponse.json();
  console.log(loginResponse);
}
