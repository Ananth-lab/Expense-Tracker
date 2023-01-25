const subBtn = document.querySelector("#signUp-btn");

subBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const uname = document.querySelector("#uname").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;
    if(email == "" || password == "" || uname == ""){
        return alert("Please enter the values")
    }
    const details = {
        username: uname,
        email: email,
        password: password
    }
    axios.post("http://localhost:3000/user/signUp", details)
        .then(() => {
            alert("signin successful. Please login")
            window.location.href = "./login.html";
        })
        .catch(error => {
            const errors = document.querySelector("#error");
            errors.innerHTML = `${error.response.data.error}`;
        })
})