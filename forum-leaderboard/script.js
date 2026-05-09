const forumLatest =
  'https://cdn.freecodecamp.org/curriculum/forum-latest/latest.json';
const forumTopicUrl = 'https://forum.freecodecamp.org/t/';
const forumCategoryUrl = 'https://forum.freecodecamp.org/c/';
const avatarUrl = 'https://cdn.freecodecamp.org/curriculum/forum-latest';

const allCategories = {
  299: { category: 'Career Advice', className: 'career' },
  409: { category: 'Project Feedback', className: 'feedback' },
  417: { category: 'freeCodeCamp Support', className: 'support' },
  421: { category: 'JavaScript', className: 'javascript' },
  423: { category: 'HTML - CSS', className: 'html-css' },
  424: { category: 'Python', className: 'python' },
  432: { category: 'You Can Do This!', className: 'motivation' },
  560: { category: 'Back-End Development', className: 'backend' }
};
function timeAgo(timeStamp) {
  const now = new Date();
const past = new Date(timeStamp);
const differenceMin = (now - past) / 60000;
if (differenceMin < 60) {
  return `${Math.floor(differenceMin)}m ago`
} else if (differenceMin < 60 * 24) {
  return `${Math.floor(differenceMin / 60)}h ago`
} else {
  return `${Math.floor((differenceMin / 60) / 24)}d ago`
}
};

function viewCount(num) {
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}k`
  } else {
    return num;
  }
}

function forumCategory(id) {
  if (allCategories.hasOwnProperty(id)) {
    const { category, className } = allCategories[id];
return `<a class="category ${className}" href="${forumCategoryUrl}${className}/${id}">${category}</a>`
  } else {
return `<a class="category general" href="${forumCategoryUrl}general/${id}">General</a>`
  }
}

function avatars(posters, users) {
return posters.map(poster => {
  const user = users.find(({id}) => id === poster.user_id);
  const src = user.avatar_template.replace(`{size}`, `30`);
  const fullSrc = src.startsWith("/") ? `${avatarUrl}${src}` : src;
return `<img src="${fullSrc}" alt="${user.name}">`;
  
}).join("");
};

function showLatestPosts(obj) {
const {users, topic_list} = obj;
const {topics} = topic_list;
document.getElementById("posts-container").innerHTML = topics.map(({id, title, views, posts_count, slug, posters, category_id, bumped_at}) => {
return `<tr>
  <td><a class="post-title" href="${forumTopicUrl}${slug}/${id}">${title}</a>${forumCategory(category_id)}</td>
  <td><div class="avatar-container">${avatars(posters, users)}</div></td>
  <td>${posts_count - 1}</td>
  <td>${viewCount(views)}</td>
  <td>${timeAgo(bumped_at)}</td>
</tr>`

}).join("")
}

async function fetchData() {
  try {
    const response = await fetch(forumLatest);
    const userData = await response.json();
    showLatestPosts(userData);

  } catch(error) {
console.log(error);
  }
}
fetchData()
