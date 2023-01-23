const forgotPasswordSubmit = document.querySelector("#forgot-password-submit-btn");
const resetSubmitBtn = document.querySelector(".reset-submit")


forgotPasswordSubmit.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.querySelector("#email").value;
    const details = {
        email : email
    }
    axios.post("http://35.76.210.189:3000/password/forgotpassword", details)
    .then(res => {
        const a = document.querySelector(".password-reset-link");
        a.href = res.data.link;
        a.style.display = "block";
    })
    .catch(err =>{
        console.log(err)
    })
})
