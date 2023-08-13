const resetPasswordBtn = document.getElementById("resetPasswordBtn");

async function updatePassword() {
  try {
    const newPassword =  document.getElementById("newPassword").value;
    const res = await axios.post(
<<<<<<< HEAD
<<<<<<< HEAD
      "http://13.48.46.130:3001/password/resetPassword",
=======
      "http://16.171.110.20:3001/password/resetPassword",
>>>>>>> 1e26855 (ipChanged)
=======
      "http://13.48.46.130:3001/password/resetPassword",
>>>>>>> 9b20c26 (finalipAddress)
      {
        password: newPassword,
      }
    
    );
    alert(res.data.message);
    window.location.href = "/";
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
    window.location.reload();
  }
}

resetPasswordBtn.addEventListener("click", updatePassword);