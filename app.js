const firebaseConfig = {
    apiKey: "AIzaSyC6Fx-I8PBuaRgqM2OCo1Kmb2uT29Zo1pc",
    authDomain: "recipe-website-eb458.firebaseapp.com",
    databaseURL: "https://recipe-website-eb458-default-rtdb.firebaseio.com",
    projectId: "recipe-website-eb458",
    storageBucket: "recipe-website-eb458.appspot.com",
    messagingSenderId: "431942970218",
    appId: "1:431942970218:web:efdcaef28f84fb68d99313"
  };
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.database();
  
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const viewSavedMeals = document.getElementById('viewSavedMeals');
  const viewGroceryList = document.getElementById('viewGroceryList');
  const getMealBtn = document.getElementById('getMeal');
  const mainContent = document.getElementById('mainContent');
  const mealContainer = document.getElementById('mealContainer');
  const savedMealsContainer = document.getElementById('savedMealsContainer');
  const welcomeText = document.getElementById('welcomeText');
  const authSection = document.getElementById('authSection');
  const groceryModal = document.getElementById('groceryModal');
  const groceryListItems = document.getElementById('groceryListItems');
  const modalOverlay = document.getElementById('modalOverlay');
  
  let currentMeal = null;
  let currentUser = null;
  
  function showAuthForm(type) {
    authSection.innerHTML = `
      <input id="email" placeholder="Email" /><br/>
      <input id="password" placeholder="Password" type="password" /><br/>
      <button class="btn" onclick="${type === 'login' ? 'login()' : 'signup()'}">${type === 'login' ? 'Login' : 'Signup'}</button>
    `;
  }
  
  function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, password)
      .then(() => location.reload())
      .catch(err => alert(err.message));
  }
  
  function signup() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => location.reload())
      .catch(err => alert(err.message));
  }
  
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user;
      loginBtn.classList.add('hidden');
      signupBtn.classList.add('hidden');
      logoutBtn.classList.remove('hidden');
      mainContent.classList.remove('hidden');
      viewSavedMeals.classList.remove('hidden');
      viewGroceryList.classList.remove('hidden');
      welcomeText.classList.add('hidden');
      authSection.innerHTML = '';
      getMealOfTheDay();
    }
  });
  
  logoutBtn.onclick = () => auth.signOut().then(() => location.reload());
  loginBtn.onclick = () => showAuthForm('login');
  signupBtn.onclick = () => showAuthForm('signup');
  
  getMealBtn.onclick = () => {
    mealContainer.innerHTML = '';
    fetchMeal();
  };
  
  viewSavedMeals.onclick = () => {
    savedMealsContainer.innerHTML = '<h3>Saved Meals</h3>';
    db.ref(`users/${currentUser.uid}/savedMeals`).once('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        Object.keys(data).forEach(key => {
          const meal = data[key];
          const div = document.createElement('div');
          div.classList.add('meal-card');
          div.innerHTML = `
            <h4>${meal.strMeal}</h4>
            <img src="${meal.strMealThumb}" alt="Meal Image" />
            <p><strong>Category:</strong> ${meal.strCategory}</p>
            <button class="saved-meal-btn" onclick="deleteSavedMeal('${key}')">Delete</button>
          `;
          savedMealsContainer.appendChild(div);
        });
      } else {
        savedMealsContainer.innerHTML += "<p>No saved meals found.</p>";
      }
    });
  };
  
  viewGroceryList.onclick = () => {
    groceryListItems.innerHTML = '';
    db.ref(`users/${currentUser.uid}/groceryList`).once('value', snapshot => {
      const data = snapshot.val();
      if (data) {
        Object.keys(data).forEach(key => {
          const item = data[key];
          const li = document.createElement('li');
          li.textContent = item;
          
          // Create a delete button for each item
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.classList.add('delete-btn');
          
          // Add delete functionality
          deleteButton.onclick = () => deleteGroceryItem(key);
  
          li.appendChild(deleteButton);
          groceryListItems.appendChild(li);
        });
      } else {
        groceryListItems.innerHTML = '<li>No items in grocery list.</li>';
      }
      toggleGroceryModal();
    });
  };
  
  function deleteGroceryItem(itemId) {
    db.ref(`users/${currentUser.uid}/groceryList/${itemId}`).remove()
      .then(() => {
        alert('Item deleted from grocery list');
        viewGroceryList.onclick();  // Refresh the list after deleting
      })
      .catch(err => {
        console.error("Error deleting item: ", err);
        alert("Failed to delete item.");
      });
  }
  
  function getMealOfTheDay() {
    fetchMeal();
  }
  
  function fetchMeal() {
    fetch('https://www.themealdb.com/api/json/v1/1/random.php')
      .then(res => res.json())
      .then(data => {
        currentMeal = data.meals[0];
        renderMeal(currentMeal, true);
      });
  }
  
  function renderMeal(meal, allowSave) {
    const ingredientsList = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredientsList.push(`${ingredient} - ${measure}`);
      }
    }
  
    const instructions = meal.strInstructions || "No instructions available.";
  
    mealContainer.innerHTML = `
      <div class="meal-card">
        <h3>${meal.strMeal}</h3>
        <img src="${meal.strMealThumb}" alt="Meal Image" />
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <p><a href="${meal.strYoutube}" target="_blank">▶ Watch Video</a></p>
        
        <h4>Ingredients:</h4>
        <ul>
          ${ingredientsList.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        
        <h4>Instructions:</h4>
        <p>${instructions}</p>
  
        ${allowSave ? `
          <button class="btn" onclick="saveMeal()">💾 Save Meal</button>
          <button class="btn" onclick="addToGroceryList()">🛒 Add to Grocery List</button>
        ` : ''}
      </div>`;
  }
  
  function saveMeal() {
    if (currentMeal && currentUser) {
      db.ref(`users/${currentUser.uid}/savedMeals`).push(currentMeal);
      alert("Meal saved!");
    }
  }
  
  function addToGroceryList() {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = currentMeal[`strIngredient${i}`];
      const measure = currentMeal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        ingredients.push(`${ingredient} - ${measure}`);
      }
    }
    ingredients.forEach(item => {
      db.ref(`users/${currentUser.uid}/groceryList`).push(item);
    });
    alert("Added to Grocery List!");
  }
  
  function toggleGroceryModal() {
    groceryModal.classList.toggle('hidden');
    modalOverlay.classList.toggle('hidden');
  }
  