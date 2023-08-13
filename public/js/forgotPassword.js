const resetPasswordLinkBtn = document.getElementById("resetPasswordLinkBtn");

async function sendMail() {
  try {
    const email  = document.getElementById("email").value;
<<<<<<< HEAD
<<<<<<< HEAD
    const res = await axios.post("http://13.48.46.130:3001/password/sendMail", {
=======
    const res = await axios.post("http://16.171.110.20:3001/password/sendMail", {
>>>>>>> 1e26855 (ipChanged)
=======
    const res = await axios.post("http://13.48.46.130:3001/password/sendMail", {
>>>>>>> 9b20c26 (finalipAddress)
      email: email,
    });
    alert(res.data.message);
    window.location.href = "/";
  } catch (error) {
    alert(error.response.data.message);
    window.location.reload();
  }
}

resetPasswordLinkBtn.addEventListener("click", sendMail);