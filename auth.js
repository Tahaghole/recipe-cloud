
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => alert("User Registered"))
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("Login Success");
      window.location.href = "home.html";
    })
    .catch(err => alert(err.message));
}

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      alert("Google Login Success");
      window.location.href = "home.html";
    })
    .catch(error => alert(error.message));
}

function logout() {
  firebase.auth().signOut().then(() => {
    alert("Logged out");
    window.location.href = "login.html";
  });
}
