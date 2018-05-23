import axios from "axios";

const postAPI = axios.create({});

const rootEl = document.querySelector('.root');
const templates = {
  postList: document.querySelector("#post-list").content,
  postItem: document.querySelector("#post-item").content,
  postContent: document.querySelector('#post-content').content,
  login: document.querySelector('#login').content,
};

// 중복 코드있으면 함수로 따로 뺴서 사용하는게 좋다
function render(fragment){
  rootEl.textContent = '';
  rootEl.appendChild(fragment);
}

async function indexPage() {
  const res = await postAPI.get("http://localhost:3000/posts");
  const listfragment = document.importNode(templates.postList, true);

  listfragment.querySelector('.post-list__login-btn').addEventListener('click', e=>{
    loginPage()
  })

  res.data.forEach(post => {
    const fragment = document.importNode(templates.postItem, true);
    const pEl = fragment.querySelector(".post-item__title");
    pEl.textContent = post.title;
    pEl.addEventListener('click', e=>{
      postContentPage(post.id);
    });
    listfragment.querySelector(".post-list").appendChild(fragment);
  });
  render(listfragment);
}

async function postContentPage(postId){
  const res = await postAPI.get(`http://localhost:3000/posts/${postId}`);
  const fragment = document.importNode(templates.postContent, true);
  fragment.querySelector('.post-content__title').textContent = res.data.title;
  fragment.querySelector('.post-content__body').textContent = res.data.body;
  fragment.querySelector('.post-content__back-btn').addEventListener('click', e=>{
    indexPage();
   });
 render(fragment);
}

async function loginPage(){
  const fragment = document.importNode(templates.login, true);
  const formEl = fragment.querySelector('.login__form');
  formEl.addEventListener('submit', async e=>{
    const payload = {
      username: e.target.elements.username.value,
      password: e.target.elements.password.value,
    };
    e.preventDefault();
    const res = await postAPI.post('http://localhost:3000/users/login', payload);
    localStorage.setItem('token',res.data.token);
    postAPI.defaults.headers['Authorization'] = res.data.token;
    indexPage();
  })
  render(fragment)
}

indexPage()
