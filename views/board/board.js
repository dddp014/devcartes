//메뉴바 이동

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
        window.location.href = "/";
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
    const postList = document.querySelector(".post-list");

    // 기존 목록을 초기화
    postList.innerHTML = "";

    // 새로운 게시물 목록 생성
    data.data.forEach((post) => {
      // 테이블 행 생성
      const row = document.createElement("tr");

      // 제목 열 생성
      const titleTd = document.createElement("td");
      const titleLink = document.createElement("a");
      titleLink.setAttribute("href", `#`);
      titleLink.setAttribute("onclick", `getPostContents(${post.boardId})`);
      titleLink.textContent = post.title;
      titleTd.appendChild(titleLink);

      // 작성자 열 생성
      const writerTd = document.createElement("td");
      writerTd.textContent = post.nickname;

      // 작성일자 열 생성
      const dateTd = document.createElement("td");
      dateTd.textContent = post.createdAt.substr(0, 10);

      // 행에 열 추가
      row.appendChild(titleTd);
      row.appendChild(writerTd);
      row.appendChild(dateTd);

      // 목록에 행 추가
      postList.appendChild(row);
    });

    // 페이지네이션 다음/이전 버튼 활성/비활성화
    isvisibleNextPrevBtn(totalPage, page);
  } catch (error) {
    console.error("게시물 목록을 불러오는데 실패했습니다.", error);
  }
}

function isvisibleNextPrevBtn(totalPage, currentPage) {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  // 처음 페이지에서는 이전 버튼을 비활성화
  prevBtn.style.display = currentPage === 1 ? "none" : "block";

  // 마지막 페이지에서는 다음 버튼을 비활성화
  nextBtn.style.display = currentPage === totalPage ? "none" : "block";
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
    localStorage.removeItem("search");
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
  // const params = new URLSearchParams(window.location.search);
  // let currentPage = parseInt(params.get("page"));
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
          response.json().then((data) => {
            alert("게시물 작성 완료");
            getPostContents(data.data.boardId);
            document.getElementById("write-post-container").style.display =
              "none";
          });
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
          outWritePost();
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
  try {
    const res = await fetch(`/boards/${id}`);
    const data = await res.json();
    const currentNick = localStorage.getItem("nickname");
    if (currentNick == data.data[0].nickname) {
      isvisiblePostBtn(1);
    } else {
      isvisiblePostBtn(2);
    }
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
        <img class="board-like-img" src="/img/heart-red.png" alt="hear-red" />
      </div>
      `;
    } else {
      islikediv.innerHTML = `
      <div class="post-islike" id="post-islike" onclick="postLike()">
        <img class="board-like-img" src="/img/heart-black.png" alt="hear-black" />
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
    localStorage.setItem("boardId", id);
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
      localStorage.removeItem("boardId");
    } else if (response.status == 401) {
      alert("로그인 후 이용 가능합니다.");
      window.location.href = "/login";
      localStorage.removeItem("boardId");
    } else if (response.status == 404) {
      alert("해당 게시글이 존재하지 않습니다.");
      window.location.href = "/board/?page=1";
      localStorage.removeItem("boardId");
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
        alert("게시글 삭제 완료");
        // document.querySelector("#post-list-container").style.display = "block";
        // document.querySelector("#write-po st-container").style.display = "none";
        localStorage.removeItem("postState");
        displayFirst();
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
      response.json().then((data) => {
        // 댓글이 성공적으로 등록된 후, 페이지에 바로 추가하기 위해 호출
        addCommentToPage(data.comment);
        contents.value = "";
      });
      getPostContents(boardId); // 포스트 콘텐츠를 갱신 (필요한 경우)
    } else {
      response.json().then((data) => {
        alert(data.error);
      });
    }
  });
}

function addCommentToPage(comment) {
  const commentsContainer = document.getElementById("post-comments");
  const commentDiv = document.createElement("div");
  commentDiv.className = "comment-container"; // CSS 클래스 할당
  commentDiv.textContent = comment.contents; // 서버로부터 받은 댓글 내용
  commentsContainer.appendChild(commentDiv); // 댓글 컨테이너에 댓글 div 추가
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
      // console.log(response);
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
  } else if (num == 2) {
    document.getElementById("post-modify-btn").style.display = "none";
    document.getElementById("post-delete-btn").style.display = "none";
  }
}

function gotoPostlist() {
  window.location.href = "/board/?page=1";
}

document
  .querySelector(".post-modify-btn")
  .addEventListener("click", postModify);
document
  .querySelector(".post-delete-btn")
  .addEventListener("click", postDelete);
document
  .querySelector("#post-comment-btn")
  .addEventListener("click", registComment);
document
  .querySelector(".post-golist-btn")
  .addEventListener("click", gotoPostlist);

//Header 공통코드
document.querySelector("#login").addEventListener("click", gotoLogin);
document.querySelector("#logout").addEventListener("click", logout);
document.querySelector("#userpage").addEventListener("click", gotoUserpage);
document.querySelector("#board").addEventListener("click", gotoBoard);

function gotoUserpage() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      if (data.status) {
        const currentUser = data.data.userId;
        window.location.href = `/userpage?user=${currentUser}`;
      } else {
        alert("잘못 된 접근입니다. 로그인 후 이용해주세요.");
        window.location.href = "/login";
      }
    });
}
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
        window.location.href = "/";
      }
    });
  }
}

function gotoLogin() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      if (data.status) {
        alert("잘못 된 접근입니다. 이미 로그인 되어 있습니다.");
      } else {
        window.location.href = "/login";
      }
    });
}

function gotoBoard() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      if (data.status) {
        window.location.href = "/board/?page=1";
      } else {
        alert("잘못 된 접근입니다. 로그인 후 이용해주세요.");
        window.location.href = "/login";
      }
    });
}

//각각 페이지 실행 시 올바른 접근인지 체크
function authcheck() {
  fetch("/auth/status")
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      if (data.status) {
        return;
      } else {
        alert("잘못 된 접근입니다. 로그인 후 이용해주세요.");
        window.location.href = "/login";
      }
    });
}
///헤더 공통코드 끝

function init() {
  authcheck();
  isVisibleBtns();
  displayFirst();
  ismycontents();
}

init();
