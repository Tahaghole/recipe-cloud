firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const favRef = firebase.database().ref("users/" + user.uid + "/favorites");
    favRef.on("value", snapshot => {
      const data = snapshot.val();
      const container = document.getElementById("favorites");
      container.innerHTML = "";
      if (data) {
        for (let key in data) {
          container.innerHTML += `
            <div>
              <h3>${data[key].strMeal}</h3>
              <img src="${data[key].strMealThumb}" width="150" />
              <p>${data[key].strInstructions.substring(0, 100)}...</p>
            </div>`;
        }
      } else {
        container.innerHTML = "<p>No favorites yet.</p>";
      }
    }, err => {
      console.error("Database error:", err);
      alert("Failed to load favorites: " + err.message);
    });
  } else {
    alert("Please login to view favorites.");
    window.location.href = "login.html";
  }
});