async function handleFormSubmit() {
  // console.log("form submitted");
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

  let loginResponse = await fetch("http://localhost:3000/auth/login", requestOptions);
  loginResponse = await loginResponse.json();
  console.log(loginResponse);
}
