"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */


function generateStoryMarkup(story, deleteBtn = false) {
  //console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  let star = Boolean(currentUser);

  console.log("Delete button:" + deleteBtn);
  console.log("Star: " + star)

  return $(`
      <li id="${story.storyId}">
        ${deleteBtn ? makeDeleteBtn() : ""}
        ${makeStar(story, currentUser)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putFavesOnPage(){
  $faveStories.empty();

  if(currentUser.favorites.length === 0){
    $faveStories.append("<div>No favorites found</div>");
  }
  else{
    for(let story of currentUser.favorites){
      let $story = generateStoryMarkup(story);
      $faveStories.append($story);
    }
  }
  $faveStories.show();
}



function makeDeleteBtn(){
  return `
    <span class="trash">
    <i class="fas fa-trash"></i>
    </span>
  `;
}

function makeStar(story, user){
let isFave = user.isFave(story);
console.log(isFave);
let star = isFave ? "s" : "r";

return `
  <span class="star">
   <i class="fa${star} fa-star"></i> 
  </span>`;
}

async function deleteStory(e){

let targetId = $(e.target).closest("li").attr("id");

await storyList.removeStory(user, targetId);

putOwnStoriesOnPage();

}

$ownStories.on("click", ".trash", deleteStory);


async function submitNewStory(e){

  e.preventDefault();

  let title = $("#title-input").val();
  let author = $("#author-input").val();
  let url = $("#url-input").val();
  let username = currentUser.username;
  let storyData = { title, author, url, username };

  console.log("Inside submitNewStory function");

  let story = await storyList.addStory(currentUser, storyData);

  let $story = generateStoryMarkup(story);

  $allStoriesList.prepend($story);

  $submitForm.hide();
  $submitForm.trigger("reset");

}

$submitForm.on("submit", submitNewStory);

function putOwnStoriesOnPage(){
  $ownStories.empty();

  if(currentUser.ownStories.length === 0){
    $ownStories.append("<p>No stories found</p>");
  }
  else{
    for(let story of currentUser.ownStories){
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}




async function makeFaves(e){
  let $target = $(e.target);
  let targetId = $target.closest("li").attr("id");
  let story = storyList.stories.find((s) => s.storyId === targetId);

  if($target.hasClass("fas")){
    await currentUser.removeFave(story);
    $target.closest("i").toggleClass("far fa-star");
  }
  else{
    await currentUser.addFave(story);
    $target.closest("i").toggleClass("fas fa-star");
  }
}

$allStoriesList.on("click", ".star", makeFaves);