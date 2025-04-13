
// Example of how to render and save a recipe (modify according to actual recipe rendering logic)
document.addEventListener("DOMContentLoaded", () => {
  const saveButtons = document.querySelectorAll(".save-recipe");

  saveButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const recipe = {
        strMeal: e.target.getAttribute("data-name")
      };
      saveFavorite(recipe);
      alert("Recipe saved!");
    });
  });
});



function getMeal() {
  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(response => response.json())
    .then(data => {
      const meal = data.meals[0];
      document.getElementById('meal').innerHTML = `
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" width="300" />
        <p>${meal.strInstructions.substring(0, 300)}...</p>
        <button onclick='saveMeal(${JSON.stringify(meal)})'>Save Recipe</button>`;
    });
}
function saveMeal(meal) {
  const user = firebase.auth().currentUser;
  if (!user) return alert("Login to save");
  firebase.database().ref("users/" + user.uid + "/favorites").push(meal);
  alert("Recipe saved!");
}
