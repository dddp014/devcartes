//open api로 테스트
// async function fetchUsers() {
//   const res = await fetch(
//     "https://api.thecatapi.com/v1/images/search?limit=30&api_key=live_OFhz6Cq9zKqH8FTbc7H2SIbYETbvWoV1155zqmiwZEFX5B0fB0k12tnENikJsxC4"
//   );
//   const imageData = await res.json();
//   return imageData;
// }

// 가상 데이터 베이스
userProfileImage = {
  data: [
    { email: "test5555@test.com", url: "./userdata/img1.jpg" },
    { email: "test12525@test.com", url: "./userdata/img2.jpg" },
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

/** 유저 정보 api 요청 */
async function fetchUser() {
  const res = await fetch(`http://localhost:8080/users`);
  const data = await res.json();
  return data;
}

/** 현재 사용자인지 여부 판단 */
async function fetchTrue() {
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

// async function fetchFalse() {
//   try {
//     const response = await fetch(`http://localhost:8080/auth/false`);
//     if (!response.ok) {
//       throw new Errow("사용자가 현재 로그인 상태가 아닙니다.");
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
    const loginTrue = await fetchTrue();
    // const loginFalse = await fetchFalse();

    const login = localStorage.getItem("login");

    if (loginTrue.status === true && login) {
      window.location.href = `/userpage`; //개인 페이지 이동
    } else {
      alert("로그인 창으로 이동합니다.");
      window.location.href = `/login`;
    }
  } catch (error) {
    console.error("401 error");
    alert(error.message); //팝업창으로 수정 예정
    window.location.href = `/login`;
  }
}

/** 다른 사용자 목록 이벤트 핸들러 */
// async function ImgClickHandler() {
//   try {
//     const loginTrue = await fetchTrue();
//     const userData = await fetchUser();
//     const imageData = userProfileImage;

//     // const loginFalse = await fetchFalse();

//     const login = localStorage.getItem("login");

//     const user = userData.data.find((user) => user.email === imageData.email);
//     localStorage.setItem("tempId", user.id);

//     if (loginTrue.status === true && login) {
//       window.location.href = "/userpage"; //개인 페이지로 이동
//     } else {
//       alert("로그인 창으로 이동합니다.");
//       window.location.href = `/login`;
//     }
//   } catch (error) {
//     console.error(error);
//     alert(error.message);
//     window.location.href = `/login`;
//   }
// }

/** 다른 사용자 목록 이벤트 핸들러 */
async function ImgClickHandler(email) {
  try {
    const userData = await fetchUser();
    const user = userData.data.find((user) => user.email === email);
    const login = localStorage.getItem("login");

    if (user && login) {
      // 유저의 데이터가 일치하고, 로그인이 되어있으면 유저 페이지로 이동
      localStorage.setItem("tempId", user.id);
      window.location.href = "/userpage"; // 유저 페이지로 이동
    } else {
      alert("로그인 창으로 이동합니다.");
      window.location.href = `/login`;
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
    window.location.href = `/login`;
  }
}

/** 로그인(유저 가입) 상태에 따라 메뉴 변경 */
// async function updateMenu() {
//   try {
//     const loginTrue = await fetchTrue();
//     const logoutTest = localStorage.getItem("logout");

//     const userpageElem = document.querySelector(".userpage");
//     const loginElem = document.querySelector(".login");

//     //로그아웃 구현 시 login 작동 버튼 예정 // 테스트 o
//     if (logoutTest) {
//       userpageElem.style.display = "block";
//       loginElem.style.display = "none"; //none;
//     } else {
//       userpageElem.style.display = "none"; //none;
//       loginElem.style.display = "block";
//     }
//   } catch (error) {
//     console.error("메뉴가 업데이트 되지 않았습니다.");
//   }
// }

/** 다른 사용자 목록 미리 보기 기능 */
async function getUserImage() {
  try {
    const userElem = document.getElementById("userContent");
    const userData = await fetchUser();
    const imageData = userProfileImage.data;

    userElem.innerHTML = "";
    imageData.forEach((image) => {
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

      const user = userData.data.find((user) => user.email === image.email);
      if (user) {
        console.log(user.id);
        textElem.innerHTML = `안녕하세요! <br>
                이름: ${user.name} <br>
                자기소개: ${user.description}`;
      } else {
        textElem.innerHTML = `사용자 정보가 없습니다.`;
      }

      imageElem.addEventListener("mouseenter", () => {
        textElem.style.display = "block";
      });

      imageElem.addEventListener("mouseleave", () => {
        textElem.style.display = "none";

        // 이미지 클릭 시 이벤트 핸들러 추가
        imageElem.addEventListener("click", () => {
          ImgClickHandler(image.email);

          textElem.addEventListener("click", () => {
            ImgClickHandler(image.email);
          });
        });
      });
    });
  } catch (error) {
    console.error(error);
  }
}

//로그아웃
async function updateMenu() {
  const userpageElem = document.querySelector(".userpage");
  const loginElem = document.querySelector(".login");
  const logoutElem = document.querySelector(".logout");
  const loginTrue = await fetchTrue();
  // const loginFalse = await fetchFalse();

  const login = localStorage.getItem("login");

  if (loginTrue.status === true && login) {
    logoutElem.style.display = "block";
    userpageElem.style.display = "block";
    loginElem.style.display = "none"; //none;
  } else {
    localStorage.removeItem("login");
    userpageElem.style.display = "none"; //none;
    loginElem.style.display = "block";
    logoutElem.style.display = "none";
  }
  // 서버한테 로그아웃 post 요청 (status를 false로)
  // or 로컬 스토리지로 데이터 임시 서장 형태
  //로그아웃 테스트
}

function logOut() {
  const logoutElem = document.querySelector(".logout");

  logoutElem.addEventListener("click", () => {
    localStorage.removeItem("login");
    window.location.href = "/";
  });
}

function init() {
  updateMenu();
  getUserImage();
  logOut();

  const userpageElem = document.querySelector(".userpage");
  const loginElem = document.querySelector(".login");
  // const userElem = document.getElementById("userContent");

  // userElem.addEventListener("click", ImgClickHandler);
  userpageElem.addEventListener("click", menuClickHandler);
  loginElem.addEventListener("click", menuClickHandler);
}

init();
