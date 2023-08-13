const resetPasswordLinkBtn = document.getElementById("resetPasswordLinkBtn");

async function sendMail() {
  try {
    const email  = document.getElementById("email").value;
    const res = await axios.post("http://13.48.46.130:3001/password/sendMail", {
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