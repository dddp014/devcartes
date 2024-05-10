// import { importTest } from "./login.js";

/** 네크워크에 띄울 유저 정보 api 요청 */
async function getUsers(page) {
  try {
    const res = await fetch(`/users/?page=${page}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

/** 현재 사용자가 로그인이 되어있을 경우 유저 정보 api 요청*/
async function getLoginStatus() {
  try {
    const response = await fetch(`/auth/status`);
    if (!response.ok) {
      throw new Errow("데이터를 불러오는 중에 문제가 발생했습니다.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

/** 모든 페이지의 데이터를 가져오는 함수 */
async function getAllUser(currentPage) {
  try {
    // 첫 번째 페이지의 데이터를 가져옴
    let allData = [];
    let data = await getUsers(1);
    const totalPages = data.totalPage;
    allData = allData.concat(data.data);

    // 다음 페이지가 있을 경우 반복적으로 데이터를 가져옴
    while (currentPage < totalPages) {
      currentPage++;
      data = await getUsers(currentPage);
      allData = allData.concat(data.data);
    }

    return allData;
  } catch (error) {
    console.error(error);
    alert("데이터를 가져오는 중에 오류가 생겼습니다.");
  }
}

/** Nav바 이벤트 핸들러 (유저페이지) */
//유저가 로그인 상태이면 개인페이지 이동
async function goToUserPage() {
  try {
    const logintrue = await getLoginStatus();

    if (logintrue.status === true) {
      window.location.href = `/userpage?user=${logintrue.data.userId}`;
    } else {
      alert("로그인 창으로 이동합니다.");
      window.location.href = `/login`;
    }
  } catch (error) {
    console.error(error);
    alert("로그인 창으로 이동합니다.");
    window.location.href = `/login`;
  }
}

/** Nav바 이벤트 핸들러 (게시판) */
//유저가 로그인 상태이면 게시판 이동
async function goToBoard() {
  try {
    const logintrue = await getLoginStatus();

    if (logintrue.status === true) {
      window.location.href = `/board/?page=1`;
    } else {
      alert("로그인 창으로 이동합니다.");
      window.location.href = `/login`;
    }
  } catch (error) {
    console.error(error);
    alert("로그인 창으로 이동합니다.");
    window.location.href = `/login`;
  }
}

/** 이전 페이지로 이동하는 함수 */
// 쿼리 스트링으로 주소값 저장 (변경)
async function goPrevPage() {
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page")) || 1;
  if (currentPage > 1) {
    currentPage--;
    const newURL = window.location.pathname + `?page=${currentPage}`;
    window.history.pushState({ path: newURL }, "", newURL); // URL 업데이트
    renderUserCard(currentPage);
    updateButton();
  }
}

/** 다음 페이지로 이동하는 함수 */
// 쿼리 스트링으로 주소값 저장 (변경)
async function goNextPage() {
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page")) || 1;
  const data = await getUsers(currentPage);
  const totalPages = data.totalPage;
  if (currentPage < totalPages) {
    currentPage++;
    const newURL = window.location.pathname + `?page=${currentPage}`;
    window.history.pushState({ path: newURL }, "", newURL); // URL 업데이트
    renderUserCard(currentPage);
    updateButton();
  }
}

/** 메인 페이지에 유저 정보를 띄우는 함수 */
async function renderUserCard() {
  try {
    const params = new URLSearchParams(window.location.search);
    let currentPage = parseInt(params.get("page")) || 1;
    const allUserData = await getAllUser(currentPage);

    const userData = await getUsers(currentPage);
    const container = document.querySelector(".usercard-container");
    container.innerHTML = "";

    const logintrue = await getLoginStatus();

    // 각 유저 데이터마다 카드 생성
    userData.data.forEach(async (user) => {
      const usercard = document.createElement("div");
      const cardinner = document.createElement("div");
      const cardfront = document.createElement("div");
      const cardback = document.createElement("div");
      const userimage = document.createElement("img");
      const title = document.createElement("p");
      const content = document.createElement("p");

      usercard.className = "usercard";
      cardinner.className = "usercard-Inner";
      cardfront.className = "usercard-Front";
      cardback.className = "usercard-Back";
      userimage.className = "userImage";
      title.className = "title";
      content.className = "content";

      userimage.src = user.profileImg;
      userimage.alt = user.profileImg;

      cardfront.appendChild(userimage);

      title.innerHTML = `${user.name}의 포트폴리오`;

      cardfront.appendChild(title);
      cardinner.appendChild(cardfront);

      content.innerHTML = `안녕하세요! <br> <br>
                    제 이름은 ${user.name} 입니다.<br>
                     ${user.description}`;

      cardback.appendChild(content);
      cardinner.appendChild(cardback);
      usercard.appendChild(cardinner);
      container.appendChild(usercard);

      usercard.addEventListener("click", () => {
        if (logintrue.status === true) {
          window.location.href = `/userpage?user=${user.userId}`;
        } else {
          alert("로그인 창으로 이동합니다.");
          window.location.href = "/login";
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
}

/** 페이지에 따라 이전 & 다음 버튼을 업데이트하는 함수 */
async function updateButton() {
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page")) || 1;
  let data = await getUsers(currentPage);
  let totalPages = data.totalPage;
  const prevButton = document.querySelector(".btn-left");
  const nextButton = document.querySelector(".btn-right");

  // 첫 번째 페이지일 경우
  if (currentPage === 1) {
    prevButton.disabled = true;
    nextButton.disabled = false;
    prevButton.style.backgroundColor = "#ff96a993";
    nextButton.style.backgroundColor = "white";
    prevButton.style.color = "black";
    // 마지막 페이지일 경우
  } else if (currentPage === totalPages) {
    prevButton.disabled = false;
    nextButton.disabled = true;
    prevButton.style.backgroundColor = "white";
    nextButton.style.backgroundColor = "#ff96a993";
    nextButton.style.color = "black";
  } else {
    prevButton.disabled = false;
    nextButton.disabled = false;
    prevButton.style.backgroundColor = "white";
    nextButton.style.backgroundColor = "white";
  }
}

/** 로그인 상태에 따라 Nav바를 업데이트하는 함수 */
async function updateMenu() {
  const loginElem = document.querySelector(".user-status-item-left.login");
  const userpageElem = document.querySelector(
    ".user-status-item-left.userpage"
  );
  const logoutElem = document.querySelector(".user-status-item.logout");

  const logintrue = await getLoginStatus();

  if (logintrue.status === true) {
    userpageElem.style.display = "block";
    logoutElem.style.display = "block";
    loginElem.style.display = "none";
  } else {
    userpageElem.style.display = "none";
    logoutElem.style.display = "none";
    loginElem.style.display = "block";
  }
}

/** 로그아웃 함수 */
function getLogOut() {
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
        window.location.href = "/?page=1";
      }
    });
  }
}

/** 초기 화면 1페이지로 이동시키는 함수 */
function displayFirst() {
  const params = new URLSearchParams(window.location.search);
  let currentPage = parseInt(params.get("page")) || 1;

  if (currentPage >= 2) {
    currentPage = 1;

    renderUserCard();
  }
}

async function init() {
  displayFirst();
  updateMenu();
  renderUserCard();

  const loginElem = document.querySelector(".user-status-item-left.login");
  const userpageElem = document.querySelector(
    ".user-status-item-left.userpage"
  );
  const logoutElem = document.querySelector(".user-status-item.logout");
  const boardElem = document.querySelector(".menu-items.board");
  const aboutElem = document.querySelector(".menu-items.aboutUs");

  loginElem.addEventListener("click", () => {
    window.location.href = "/login";
  });
  userpageElem.addEventListener("click", goToUserPage);
  logoutElem.addEventListener("click", () => {
    getLogOut();
    window.location.href = "/?page=1";
  });
  boardElem.addEventListener("click", goToBoard);
  aboutElem.addEventListener("click", () => {
    window.location.href = "/aboutus";
  });

  //페이지네이션 관련 이벤트리스너 추가
  document.querySelector(".btn-left").addEventListener("click", goPrevPage);
  document.querySelector(".btn-right").addEventListener("click", goNextPage);
}

init();
