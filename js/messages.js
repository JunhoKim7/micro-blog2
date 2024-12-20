
function getMessage(m) {
  const e = document.createElement("div");
  e.setAttribute("class", "message");
  e.dataset.post_id = m._id;
  e.innerHTML = `
    <hr>
    FROM:  ${m.username}<br>\n    
    WHEN:  ${m.createdAt}<br>\n    
    TEXT:  ${m.text}<br>\n
    LIKES: ${m.likes.length}
  `;


  const b = document.createElement("button");
  b.addEventListener("click", async ()=>{
    //is username in list of likes?
    const like = m.likes.find(like=>like.username===localStorage.username);
    if( like != undefined){
      //found - delete
      await deleteLike(like._id);
      window.location.href = 'messages.html'; //refresh page
    }else{
      //not found - create
      await sendLike(m._id);
      window.location.href = 'messages.html'; //refresh page
    }
  });//end click
  
  const like = m.likes.find(like=>like.username===localStorage.username);
  b.innerText = like != undefined ? "Unlike" : "Like";
  e.appendChild(b);
  return e;
}


  function sortPosts(posts, sortBy) {
    switch (sortBy) {
        case 'recent':
            return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Most recent first
        case 'author':
            return posts.sort((a, b) => a.username.localeCompare(b.username)); // Sort alphabetically by username
        case 'popularity':
            return posts.sort((a, b) => b.likes.length - a.likes.length); // Most liked first
        default:
            return posts;
    }
  };


document.addEventListener("DOMContentLoaded", async () => {
  const messages = await getMessageList();
  
  // Listen for changes in the sort options
  const sortOptions = document.getElementById("sort-options");
  sortOptions.addEventListener("change", async (event) => {
    const sortBy = event.target.value;
    const sortedMessages = sortPosts(messages, sortBy);
    displayMessages(sortedMessages);
  });
  // Initially sort by recent posts
  const sortBy = 'recent';
  const sortedMessages = sortPosts(messages, sortBy);
  displayMessages(sortedMessages);
});

function displayMessages(messages) {
  const output = document.getElementById('output');
  output.innerHTML = ''; // Clear previous messages
  messages.forEach(m => output.appendChild(getMessage(m)));
}