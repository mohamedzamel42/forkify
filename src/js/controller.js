
import * as model from './model.js'
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
if (module.hot) {
  module.hot.accept
}
const recipeContainer = document.querySelector('.recipe');



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////


const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner()
    
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks); 
    
    await model.loadRecipe(id);
    
    recipeView.render(model.state.recipe);
    
  } catch (err) {
    console.error(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {

  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    
    await model.loadSearchResults(query);
    
    resultsView.render(model.getSearchResultsPage(1))
    
    paginationView.render(model.state.search)
  } catch (err) {
    console.log(err);
  }
};


const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage))
    
  paginationView.render(model.state.search)
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
 
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe =async function (newRecipe) {
  try {
   
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe)
    
    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    
  } catch (err) {
    console.error('🔥', err);
    addRecipeView.renderError(err.message);
  }
}
// ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, showRecipe));

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings)
  searchView.addHandlerSearch(controlSearchResults);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};


init();


  // const id = window.location.hash.slice(1);
    // if (!id) return;
    // renderSpinner(recipeContainer)
    // const res=await fetch( `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`)
  
    // const data = await res.json();  
    // if(!res.ok)throw new Error(`${data.message} ${res.status}`)
    // let { recipe } = data.data;
    // recipe = {
    //         id: recipe.id,
    //         title: recipe.title,
    //         publisher: recipe.publisher,
    //         sourceUrl: recipe.source_url,
    //         image: recipe.image_url,
    //         servings: recipe.servings,
    //         cookingTime: recipe.cooking_time,
    //         ingredients: recipe.ingredients
    //     }
