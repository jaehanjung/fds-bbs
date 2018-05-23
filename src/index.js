import axios from "axios";

const rootEl = document.querySelector('.root');
const templates = {
  postList: document.querySelector("#post-list").content,
  postItem: document.querySelector("#post-item").content
};

async function indexPage() {
  const res = await axios.get("http://localhost:3000/posts");
  const listfragment = document.importNode(templates.postList, true);

  res.data.forEach(post => {
    const fragment = document.importNode(templates.postItem, true);
    const pEl = fragment.querySelector(".post-item__title");
    pEl.textContent = post.title;
    listfragment.querySelector(".post-list").appendChild(fragment);
  });

  rootEl.appendChild(listfragment);
}

indexPage();
