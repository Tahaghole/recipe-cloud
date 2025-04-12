function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters.");
    return;
  }
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("User Registered");
      window.location.href = "login.html";
    })
    .catch(err => {
      console.error("Signup error:", err);
      alert("Signup failed: " + err.message);
    });
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  if (!email || !password) {
    alert("Email and password are required.");
    return;
  }
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login Success");
      window.location.href = "home.html";
    })
    .catch(err => {
      console.error("Login error:", err);
      alert("Login failed: " + err.message);
    });
}

function logout() {
  firebase.auth().signOut()
    .then(() => {
      alert("Logged out");
      window.location.href = "login.html";
    })
    .catch(err => {
      console.error("Logout error:", err);
      alert("Logout failed: " + err.message);
    });
}