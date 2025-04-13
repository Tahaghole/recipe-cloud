
const supabase = supabase.createClient(
  'https://pikxjxcudgctztmgndbc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpa3hqeGN1ZGdjdHp0bWduZGJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1MDg4NTEsImV4cCI6MjA2MDA4NDg1MX0.N8E0J55RUNmg0mSHaqrzmdO45HD79qMSaWTxXG_sm6s'
);

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { error } = await supabase.auth.signUp({ email, password });
  alert(error ? error.message : "Signup successful!");
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  alert(error ? error.message : "Login successful!");
}

async function logout() {
  await supabase.auth.signOut();
  alert("Logged out");
}

supabase.auth.onAuthStateChange((event, session) => {
  document.getElementById("user-status").innerText = session?.user?.email || "Not logged in";
});

const get_meal_btn = document.getElementById('get_meal');
const meal_container = document.getElementById('meal');

get_meal_btn.addEventListener('click', () => {
  fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    .then(res => res.json())
    .then(res => createMeal(res.meals[0]));
});

function createMeal(meal) {
  const html = `
    <div>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
      <h3>${meal.strMeal}</h3>
      <p><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>
      <p>${meal.strInstructions}</p>
      <button onclick='saveRecipe(${JSON.stringify(meal)})'>💾 Save Recipe</button>
    </div>`;
  meal_container.innerHTML = html;
}

async function saveRecipe(meal) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("Please log in to save recipes.");
  const { error } = await supabase.from("saved_recipes").insert([{
    user_id: user.id,
    meal_id: meal.idMeal,
    name: meal.strMeal,
    category: meal.strCategory,
    area: meal.strArea,
    image: meal.strMealThumb,
    instructions: meal.strInstructions
  }]);
  alert(error ? error.message : "Recipe saved!");
}
