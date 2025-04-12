function getMeal() {
  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      document.getElementById('meal').innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" width="300" />
        <p>${meal.strInstructions.substring(0, 300)}...</p>
        <button id="saveMealBtn">Save Recipe</button>`;
      document.getElementById('saveMealBtn').addEventListener('click', () => saveMeal(meal));
    })
    .catch(err => {
      console.error("Fetch error:", err);
      alert("Failed to fetch meal: " + err.message);
    });
}

function saveMeal(meal) {
  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Please login to save recipes.");
    window.location.href = "login.html";
    return;
  }
  firebase.database().ref("users/" + user.uid + "/favorites").push(meal)
    .then(() => alert("Recipe saved!"))
    .catch(err => {
      console.error("Save error:", err);
      alert("Failed to save recipe: " + err.message);
    });
}