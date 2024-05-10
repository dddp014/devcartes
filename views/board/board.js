//메뉴바 이동
function goNetwork() {
  window.location.href = "/";
}

function goUserpage() {
  window.location.href = "/userpage";
}

//로그아웃
function logout() {
  if (confirm("정말 로그아웃 하시겠습니까?")) {
    fetch("/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((response) => {
      if (response.status == 401) {
        alert("로그인 후 이용 가능합니다.");
      } else if (response.status == 200) {
        alert("로그아웃 성공");
        window.location.href = "/network";
      }
    });
  }
}

//현재 로그인된 계정의 userId get
function ismycontents() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      const currentNick = data.data.nickname;
      localStorage.setItem("nickname", currentNick);
    });
}

//날짜 표시방식 변경 필요
//게시물 목록 페이지별 조회 및 리스트업
async function getPostList(page) {
  try {
    const res = await fetch(`/boards/?page=${page}`);
    const data = await res.json();
    const listcount = data.data.length;
    const totalPage = data.totalPage;

    for (let i = 0; i < listcount; i++) {
      const postlists = document.querySelector(".post-list");
      // const postlists = document.createElement("div");
      let postTitle = data.data[i].title;
      let postWriter = data.data[i].nickname;
      let boardId = data.data[i].boardId;
      let createdAt = data.data[i].createdAt.substr(0, 10);
      postlists.innerHTML += `
      <div class="post-title-list">
        <li class="title-list"><span class="post-title" id="${boardId}"><a onclick="getPostContents(${boardId})">${postTitle}</a></span><span>${createdAt}</span></li>
        <span>${postWriter}</span>
      </div>
      `;
    }
    //페이지네이션 다음/이전 버튼 활성/비활성화
    if (totalPage == 1) {
      isvisibleNextPrevBtn(3);
    } else if (page == 1) {
      isvisibleNextPrevBtn(1);
    } else if (page == totalPage) {
      isvisibleNextPrevBtn(2);
    } else {
      isvisibleNextPrevBtn(0);
    }
    localStorage.removeItem("search");
  } catch (error) {
    // console.error(error);
  }
}

//페이지네이션 버튼 활성/비활성화 구분
function isvisibleNextPrevBtn(num) {
  if (num == 1) {
    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "block";
  } else if (num == 2) {
    document.getElementById("prev-btn").style.display = "block";
    document.getElementById("next-btn").style.display = "none";
  } else if (num == 0) {
    document.getElementById("prev-btn").style.display = "block";
    document.getElementById("next-btn").style.display = "block";
  } else if (num == 3) {
    document.getElementById("prev-btn").style.display = "none";
    document.getElementById("next-btn").style.display = "none";
  }
}

//현재 data 몇번째 페이지 참조하는지 찾는 함수
function displayFirst() {
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page"));
  getPostList(currentPage);
}

//다음페이지 post 리스트
function getNextPostList() {
  const params = new URLSearchParams(window.location.search);
  const isSearch = localStorage.getItem("search");
  let currentPage = parseInt(params.get("page"));
  currentPage++;
  if (isSearch == "Y") {
    window.location.href = `/board/search/result?page=${currentPage}`;
    getpostSearch(currentPage);
  } else {
    window.location.href = `/board/?page=${currentPage}`;
    getPostList(currentPage);
  }
}

function getPrevPostList() {
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page"));
  currentPage--;
  window.location.href = `/board/?page=${currentPage}`;
  getPostList(currentPage);
}

// 현재페이지

function isVisibleBtns() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      if (data.status) {
        document.getElementById("login").style.display = "none";
        document.getElementById("userpage").style.display = "block";
        document.getElementById("logout").style.display = "block";
      } else {
        document.getElementById("login").style.display = "block";
        document.getElementById("userpage").style.display = "none";
        document.getElementById("logout").style.display = "none";
      }
    });
}

function clear() {
  targets = document.querySelectorAll(".input-box");
  targets.forEach((target) => {
    target.value = "";
  });
}

//리스트에서 작성창으로
function goWritePost() {
  document.getElementById("write-post-container").style.display = "block";
  document.getElementById("post-list-container").style.display = "none";
  document.getElementById("post-container").style.display = "none";
  localStorage.setItem("postState", "new");
  clear();
}

//작성창에서 리스트로
function outWritePost() {
  if (
    confirm("현재 작성중인 내용은 저장되지 않습니다. 정말 되돌아가겠습니까?")
  ) {
    document.getElementById("post-list-container").style.display = "block";
    document.getElementById("write-post-container").style.display = "none";
    localStorage.removeItem("postState");
    clear();
  }
}

async function postSearch() {
  getpostSearch(1);
}

async function getpostSearch(page) {
  const search = document.getElementById("search-box").value;
  const searchtype = document.getElementById("search-type").value;
  const postlists = document.querySelector(".post-list");
  // console.log("검색어", search, "검색타입", searchtype);
  postlists.innerHTML = ``;
  try {
    const res = await fetch(
      `/boards/search/result?option=${searchtype}&keyword=${search}`
    );
    const data = await res.json();
    const listcount = data.data.length;
    const totalPage = data.totalPage;
    // console.log(data);

    for (let i = 0; i < listcount; i++) {
      // const postlists = document.createElement("div");
      let postTitle = data.data[i].title;
      let postWriter = data.data[i].nickname;
      let boardId = data.data[i].boardId;
      let createdAt = data.data[i].createdAt.substr(0, 10);
      postlists.innerHTML += `
      <div class="post-title-list">
        <li class="title-list"><span class="post-title" id="${boardId}"><a onclick="getPostContents(${boardId})">${postTitle}</a></span><span>${createdAt}</span></li>
        <span>${postWriter}</span>
      </div>
      `;
    }
    localStorage.setItem("search", "Y");
    //페이지네이션 다음/이전 버튼 활성/비활성화
    if (totalPage == 1) {
      isvisibleNextPrevBtn(3);
    } else if (page == 1) {
      isvisibleNextPrevBtn(1);
    } else if (page == totalPage) {
      isvisibleNextPrevBtn(2);
    } else {
      isvisibleNextPrevBtn(0);
    }
  } catch (error) {
    // console.error(error);
  }
}

//게시물 등록 // 등록되고나면 clear() 해줘야함
function registPost() {
  if (confirm("작성된 내용을 등록하시겠습니까?")) {
    const poststate = localStorage.getItem("postState");
    const title = document.getElementById("write-post-title").value;
    const contents = document.getElementById("write-post-contents").value;

    if (poststate == "new") {
      fetch("/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          contents: contents,
        }),
      }).then((response) => {
        // console.log(response);
        if (response.status == 201) {
          alert("게시물 작성 완료");
          window.location.href = "/board/?page=1";
        } else if (response.status == 401) {
          alert("로그인 후 이용 가능합니다.");
        } else if (response.status == 403) {
          alert("권한이 없습니다.");
        } else if (response.status == 400) {
          response.json().then((data) => {
            // console.log(data);
            if (data.error == "입력되지 않은 내용이 있습니다.") {
              alert("입력되지 않은 내용이 있습니다.");
            }
            if (data.error == "공백은 제목으로 사용 불가능합니다.") {
              alert("공백은 제목으로 사용 불가능합니다.");
            }
            if (data.error == "공백은 내용으로 사용 불가능합니다.") {
              alert("공백은 내용으로 사용 불가능합니다.");
            }
          });
        }
      });
    } else if (poststate == "modify") {
      const boardId = localStorage.getItem("boardId");
      fetch(`/boards/${boardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          contents: contents,
        }),
      }).then((response) => {
        // console.log(response);
        if (response.status == 201) {
          alert("게시물 수정 완료");
          getPostContents(boardId);
        } else if (response.status == 401) {
          alert("로그인 후 이용 가능합니다.");
        } else if (response.status == 403) {
          alert("권한이 없습니다.");
        } else if (response.status == 404) {
          alert("게시글을 찾을 수 없습니다.");
        } else if (response.status == 400) {
          response.json().then((data) => {
            if (data.error == "입력되지 않은 내용이 있습니다.") {
              alert("입력되지 않은 내용이 있습니다.");
            }
            if (data.error == "공백은 제목으로 사용 불가능합니다.") {
              alert("공백은 제목으로 사용 불가능합니다.");
            }
            if (data.error == "공백은 내용으로 사용 불가능합니다.") {
              alert("공백은 내용으로 사용 불가능합니다.");
            }
          });
        }
      });
    }
  }
}

//게시글 조회 (서버 boardId 기준)
async function getPostContents(id) {
  document.getElementById("post-list-container").style.display = "none";
  document.getElementById("post-container").style.display = "block";
  localStorage.setItem("boardId", id);

  try {
    const res = await fetch(`/boards/${id}`);
    const data = await res.json();
    const currentNick = localStorage.getItem("nickname");

    const title = data.data[0].title;
    const contents = data.data[0].contents;
    const createdAt = data.data[0].createdAt.substr(0, 10); // 앞에거만 잘라써야함
    const commentscount = data.data[0].comments.length;
    const comments = data.data[0].comments;
    const nickname = data.data[0].nickname;
    const islikes = data.data[0].isLikes; // boolean
    const listlikes = data.data[0].listLikes; //array
    const listlikeslength = listlikes.length;
    const likes = data.data[0].likes;
    const listlikesdiv = document.querySelector(".post-like-list");
    const islikediv = document.querySelector(".post-likes");
    const iscommentdiv = document.querySelector(".post-comment");

    document.getElementById("post-title").innerText = title;
    document.getElementById("post-contents").innerText = contents;
    document.getElementById("post-writtentime").innerText = createdAt;
    document.getElementById("post-nickname").innerText = nickname;
    document.getElementById("post-likes").innerText = likes;

    listlikesdiv.innerHTML = ``;
    islikediv.innerHTML = ``;
    iscommentdiv.innerHTML = ``;

    for (let i = 0; i < listlikeslength; i++) {
      listlikesdiv.innerHTML += `
        <span class="islike-user" id="${listlikes[i]}">${listlikes[i]}</span></li>   
      `;
    }

    if (islikes) {
      islikediv.innerHTML = `
      <div class="post-islike" id="post-islike" onclick="postLike()">
      ♥
      </div>
      `;
    } else {
      islikediv.innerHTML = `
      <div class="post-islike" id="post-islike" onclick="postLike()">
      ♡
      </div>
      `;
    }

    for (let j = 0; j < commentscount; j++) {
      iscommentdiv.innerHTML += `
      <div class ="comment-container align-left">
        <div class ="comment-writer">${comments[j].nickname}</div>
        <div class ="comment-createdAt">${comments[j].createdAt.substr(
          0,
          10
        )}</div>
        <div class ="comment-box" id="commnet-box">${comments[j].contents}</div>
        <div class ="comment-delete-btn btn btn-red ${nickname}" id="comment-delete-btn" onclick="deleteComment(${
        comments[j].commentId
      })" style="display: block">삭제</div>
      </div>
      `;
    }
    if (currentNick == data.data[0].nickname) {
      isvisiblePostBtn(1);
    } else {
      isvisiblePostBtn(2);
    }
    document.querySelectorAll(currentNick).style.display = "block";
  } catch (error) {
    // alert("알수없는 오류로 정보를 불러오는데 실패했습니다.");
    // window.location.href = "/board/?page=1";
  }
}

function postLike() {
  const boardId = localStorage.getItem("boardId");
  fetch(`/boards/${boardId}/likes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  }).then((response) => {
    // localStorage.removeItem("boardId");
    if (response.status == 200) {
      getPostContents(boardId);
    } else if (response.status == 401) {
      alert("로그인 후 이용 가능합니다.");
      window.location.href = "/login";
    } else if (response.status == 404) {
      alert("해당 게시글이 존재하지 않습니다.");
      window.location.href = "/board/?page=1";
    }
  });
}

function postDelete() {
  if (confirm("정말로 해당 게시글을 삭제하시겠습니까?")) {
    const boardId = localStorage.getItem("boardId");
    fetch(`/boards/${boardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((response) => {
      if (response.status == 204) {
        outWritePost();
      } else if (response.status == 401) {
        alert("로그인 후 이용 가능합니다.");
        window.location.href = "/login";
      } else if (response.status == 403) {
        alert("권한이 없습니다.");
      } else if (response.status == 404) {
        alert("데이터를 찾을 수 없습니다.");
      }
      localStorage.removeItem("boardId");
    });
  }
}

function postModify() {
  goWritePost();
  const boardId = localStorage.getItem("boardId");
  localStorage.setItem("postState", "modify");

  fetch(`/boards/${boardId}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const title = data.data[0].title;
      const contents = data.data[0].contents;
      document.getElementById("write-post-title").value = title;
      document.getElementById("write-post-contents").value = contents;
    });
}

//댓글 작성
function registComment() {
  const contents = document.getElementById("post-comment-contents").value;
  const boardId = localStorage.getItem("boardId");
  fetch(`/boards/${boardId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: contents,
    }),
  }).then((response) => {
    if (response.status == 201) {
      alert("댓글 작성 완료!");
      getPostContents(boardId);
    } else {
      response.json().then((data) => {
        alert(data.error);
      });
    }
  });
}

function deleteComment(id) {
  if (confirm("정말로 해당 댓글을 삭제하시겠습니까?")) {
    const commentId = id;
    const boardId = localStorage.getItem("boardId");
    fetch(`/boards/${boardId}/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }).then((response) => {
      console.log(response);
      if (response.status == 200) {
        response.json().then((data) => {
          alert(data.message);
        });
        getPostContents(boardId);
      } else {
        response.json().then((data) => {
          alert(data.error);
        });
      }
    });
  }
}

function isvisiblePostBtn(num) {
  if (num == 1) {
    document.getElementById("post-modify-btn").style.display = "block";
    document.getElementById("post-delete-btn").style.display = "block";
    document.getElementById("comment-delete-btn").style.display = "block";
  } else if (num == 2) {
    document.getElementById("post-modify-btn").style.display = "none";
    document.getElementById("post-delete-btn").style.display = "none";
    document.getElementById("comment-delete-btn").style.display = "none";
  }
}

function isvisibleCommentBtn(num) {
  if (num == 1) {
    document.getElementById("comment-delete-btn").style.display = "block";
  } else if (num == 2) {
    document.getElementById("comment-delete-btn").style.display = "none";
  }
}

function gotoPostlist() {
  window.location.href = "/board/?page=1";
}

//eventlistener
document
  .querySelector("#post-comment-btn")
  .addEventListener("click", registComment);
document
  .querySelector(".post-golist-btn")
  .addEventListener("click", gotoPostlist);
document
  .querySelector(".post-modify-btn")
  .addEventListener("click", postModify);
document
  .querySelector(".post-delete-btn")
  .addEventListener("click", postDelete);
document.querySelector("#userpage").addEventListener("click", gotoUserpage);

function gotoUserpage() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      const currentUser = data.data.userId;
      window.location.href = `/userpage?user=${currentUser}`;
    });
}

function init() {
  isVisibleBtns();
  displayFirst();
  ismycontents();
}

init();
