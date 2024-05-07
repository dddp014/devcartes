//open api로 테스트
// async function fetchUsers() {
//   const res = await fetch(
//     "https://api.thecatapi.com/v1/images/search?limit=30&api_key=live_OFhz6Cq9zKqH8FTbc7H2SIbYETbvWoV1155zqmiwZEFX5B0fB0k12tnENikJsxC4"
//   );
//   const imageData = await res.json();
//   return imageData;
// }

// 가상 데이터 베이스
// ** userId 변경사항으로 현재 userpage랑 이미지 안맞음 **
userProfileImage = {
  data: [
    { email: "test5555@test.com", url: "./userdata/img1.jpg" },
    { email: "12341234@test.com", url: "./userdata/img2.jpg" }, // 비번 12341234
    { email: "youmin@naver.com", url: "./userdata/img3.jpg" },
    { email: "test@test.com", url: "./userdata/img4.jpg" },
    { email: "test1234@test.com", url: "./userdata/img5.jpg" },
    { email: "wdwd@arr.com", url: "./userdata/img6.jpg" },
    { email: "wewe@wewe.com", url: "./userdata/img7.jpg" },
    { email: "elice10@test.com", url: "./userdata/img8.jpg" },
    { email: "test1234@test.com", url: "./userdata/img9.jpg" },
    { email: "elice1@test.com", url: "./userdata/img10.jpg" },
    { email: "elice@test.com", url: "./userdata/img11.jpg" },
  ],
};

let currentPage = 1;

/** 유저 정보 api 요청 */
async function getUsers(page) {
  try {
    const res = await fetch(`http://localhost:8080/users?page=${page}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("데이터를 불러오는 중에 문제가 발생했습니다.");
  }
}

/** 현재 사용자가 로그인이 되어있을 경우 유저 정보 api 요청*/
async function getLoginStatus() {
  try {
    const response = await fetch(`http://localhost:8080/auth/status`);
    if (!response.ok) {
      throw new Errow("데이터를 가져오는데 문제가 있습니다.");
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("error:", error);
  }
}

/** 현재 사용자가 로그인이 되어있지 않을 경우 유저 정보 api 요청*/
// async function getLoginFalse() {
//   try {
//     const response = await fetch(`http://localhost:8080/auth/false`);
//     if (!response.ok) {
//       throw new Errow("데이터를 가져오는데 문제가 있습니다.");
//     }
//     const data = await response.json();
//     console.log(data);
//     return data;
//   } catch (error) {
//     console.error("error:", error);
//   }
// }

/** 메뉴바 이벤트 핸들러 */
async function menuClickHandler() {
  try {
    const logintrue = await getLoginStatus();

    if (logintrue.status === true) {
      //유저가 로그인 상태이면 개인페이지 이동
      localStorage.setItem("tempId", logintrue.data.userId); //유저 id 로컬스토리지에 저장(개인 페이지용)
      window.location.href = `/userpage`;
    } else {
      alert("로그인 창으로 이동합니다.");
      window.location.href = `/login`;
    }
  } catch (error) {
    console.error(error);
    alert("로그인 창으로 이동합니다."); //팝업창으로 수정 예정
    window.location.href = `/login`;
  }
}

/** 모든 페이지의 데이터를 가져오는 함수 */
async function getAllUserData() {
  try {
    // 첫 번째 페이지의 데이터를 가져옴
    let allData = [];
    let data = await getUsers(currentPage);
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

/** 다른 사용자 목록 이벤트 핸들러 */
async function ImgClickHandler(email) {
  try {
    let allUserData = await getAllUserData();
    const logintrue = await getLoginStatus();
    const user = allUserData.find((user) => user.email === email);

    if (user && logintrue.status === true) {
      // 유저의 데이터가 이미지의 데이터와 일치하고, 로그인이 되어있으면 유저 페이지로 이동
      localStorage.setItem("tempId", user.userId); //유저 id 로컬스토리지에 저장(다른 사용자 페이지용)
      window.location.href = "/userpage";
    } else {
      alert("데이터를 불러오는데 오류가 생겼습니다.");
      window.location.href = "/login";
    }
  } catch (error) {
    console.error(error);
    alert("로그인 창으로 이동합니다.");
    window.location.href = `/login`;
  }
}

/** 이전 페이지로 이동하는 함수 */
async function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
    updateButton();
  }
}

/** 다음 페이지로 이동하는 함수 */
async function nextPage() {
  const data = await getUsers(currentPage);
  totalPages = data.totalPage;
  if (currentPage < totalPages) {
    currentPage++;
    renderPage(currentPage);
    updateButton();
  }
}

/** 페이지에 데이터를 표시하는 함수 */
async function renderPage(page) {
  try {
    const userData = await getUsers(page);
    const userElem = document.getElementById("userContent");
    const imageData = userProfileImage.data;

    userElem.innerHTML = "";
    imageData.forEach((image, index) => {
      const user = userData.data[index];
      if (user) {
        const container = document.createElement("div");
        const imageElem = document.createElement("img");
        const textElem = document.createElement("p");

        imageElem.src = image.url;
        imageElem.alt = "등록된 사진이 없습니다.";
        container.appendChild(imageElem);
        container.appendChild(textElem);
        userElem.appendChild(container);
        textElem.className = "userText";

        textElem.style.display = "none";

        textElem.innerHTML = `안녕하세요! <br>
                  이름: ${user.name} <br>
                  자기소개: ${user.description}`;

        container.addEventListener("mouseenter", () => {
          textElem.style.display = "block";
          imageElem.style.filter = "blur(5px)";
          textElem.style.opacity = "1";
        });

        container.addEventListener("mouseleave", () => {
          textElem.style.display = "none";
          imageElem.style.filter = "blur(0px)";
          textElem.style.opacity = "0";
        });

        container.addEventListener("click", () => {
          ImgClickHandler(user.email);
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
}

/** 페이지에 따라 버튼을 업데이트하는 함수 */
async function updateButton() {
  let data = await getUsers(currentPage);
  let totalPages = data.totalPage;
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");

  if (currentPage === 1) {
    prevButton.disabled = true;
    nextButton.disabled = false;
    prevButton.style.backgroundColor = "rgb(255, 213, 233)";
    nextButton.style.backgroundColor = "rgb(255, 255, 255)";
  } else if (currentPage === totalPages) {
    prevButton.disabled = false;
    nextButton.disabled = true;
    prevButton.style.backgroundColor = "rgb(255, 255, 255)";
    nextButton.style.backgroundColor = "rgb(255, 213, 233)";
  } else {
    prevButton.disabled = false;
    nextButton.disabled = false;
    prevButton.style.backgroundColor = "rgb(255, 255, 255)";
    nextButton.style.backgroundColor = "rgb(255, 255, 255)";
  }
}

//로그아웃
async function updateMenu() {
  const userpageElem = document.querySelector(".userpage");
  const loginElem = document.querySelector(".login");
  const logoutElem = document.querySelector(".logout");
  const logintrue = await getLoginStatus();

  if (logintrue.status === true) {
    logoutElem.style.display = "block";
    userpageElem.style.display = "block";
    loginElem.style.display = "none"; //none;
  } else {
    userpageElem.style.display = "none"; //none;
    loginElem.style.display = "block";
    logoutElem.style.display = "none";
  }
}

function getLogOut() {
  fetch("http://localhost:8080/auth/logout", {
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
      window.location.href = "/board";
    }
  });
}

async function init() {
  updateMenu();
  renderPage(currentPage);

  const userpageElem = document.querySelector(".userpage");
  const loginElem = document.querySelector(".login");
  const logoutElem = document.querySelector(".logout");
  // const userElem = document.getElementById("userContent");

  // userElem.addEventListener("click", ImgClickHandler);

  userpageElem.addEventListener("click", menuClickHandler);
  loginElem.addEventListener("click", menuClickHandler);

  //로그아웃 이벤트리스너 추기
  logoutElem.addEventListener("click", () => {
    getLogOut();
    window.location.href = "/";
  });

  //페이지네이션 관련 이벤트리스너 추가
  document.getElementById("prevButton").addEventListener("click", prevPage);
  document.getElementById("nextButton").addEventListener("click", nextPage);
}

init();
