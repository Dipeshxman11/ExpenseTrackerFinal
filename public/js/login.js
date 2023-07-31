const signUp = document.getElementById("signUp");
const container = document.getElementById("container");
const signUpBtn = document.getElementById("signUpBtn");


signUp.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});



async function postUserSignUp() {
  const res = axios.post("http://localhost:3000/user/signUp");
}

signUpBtn.addEventListener("click", postUserSignUp);