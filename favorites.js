
firebase.auth().onAuthStateChanged(user => {
  const container = document.getElementById("favorites");
  container.innerHTML = "";

  if (user) {
    const favRef = firebase.database().ref("users/" + user.uid + "/favorites");
    favRef.on("value", snapshot => {
      const data = snapshot.val();
      if (data) {
        for (let key in data) {
          container.innerHTML += `<h3>${data[key].strMeal}</h3>`;
        }
      } else {
        container.innerHTML = "<p>No favorites found.</p>";
      }
    });
  } else {
    // Load from localStorage for guest users
    const data = JSON.parse(localStorage.getItem("favorites")) || [];
    if (data.length > 0) {
      data.forEach(recipe => {
        container.innerHTML += `<h3>${recipe.strMeal}</h3>`;
      });
    } else {
      container.innerHTML = "<p>No favorites saved.</p>";
    }
  }
});

// Save to localStorage fallback (to be used in app.js when adding favorites)
function saveFavorite(recipe) {
  const user = firebase.auth().currentUser;
  if (user) {
    const favRef = firebase.database().ref("users/" + user.uid + "/favorites");
    favRef.push(recipe);
  } else {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Recipe saved locally!");
  }
}
