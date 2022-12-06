"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".nav-link").show();
  $navLogin.hide();
  $navLogOut.show();
  $navProfile.text(`${currentUser.username}`).show();
}

function navSubmitStoryClick(e){
  e.preventDefault();
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmitStory.on("click", navSubmitStoryClick);


function navMyStories(e){
  $allStoriesList.empty();
  hidePageComponents();
  putOwnStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);

function navFavesClick(e){
$allStoriesList.empty();
hidePageComponents();
putFavesOnPage();
}

$body.on("click", "#nav-faves", navFavesClick);

function navProfileClick(e){
  hidePageComponents();
  $profile.show();
}

$navProfile.on("click", navProfileClick);