//open api로 테스트
async function fetchUsers() {
  const res = await fetch(
    "https://api.thecatapi.com/v1/images/search?limit=30&api_key=live_OFhz6Cq9zKqH8FTbc7H2SIbYETbvWoV1155zqmiwZEFX5B0fB0k12tnENikJsxC4"
  );
  const imageData = await res.json();
  return imageData;
}

/** 유저 정보 api 요청 */
async function fetchUser() {
  const res = await fetch(`http://localhost:8080/users`);
  const datas = await res.json();
  return datas;
}

/** 현재 사용자인지 여부 판단 */
async function fetchStatus() {
  try {
    const res = await fetch(`http://localhost:8080/auth/status`);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    throw new Error("로그인 후 이용 가능합니다.");
  }
}

/** 메뉴바 이벤트 핸들러 */
async function menuClickHandler() {
  try {
    const checkLogin = await fetchStatus();

    if (checkLogin.status === true) {
      window.location.href = `/userpage`; //개인 페이지 이동
    } else {
      alert("오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("401 error");
    alert(error.message); //팝업창으로 수정 예정
    window.location.href = `/login`;
  }
}

/** 다른 사용자 목록 이벤트 핸들러 */
async function ImgClickHandler() {
  try {
    const checkLogin = await fetchStatus();

    console.log(checkLogin);
    console.log(checkLogin.data);

    if (checkLogin.status === true) {
      window.location.href = "/userpage"; //개인 페이지로 이동
    } else {
      alert("오류가 발생했습니다.");
    }
  } catch (error) {
    console.error("401 error");
    alert(error.message);
    window.location.href = `/login`;
  }
}

/** 로그인(유저 가입) 상태에 따라 메뉴 변경 */
async function updateMenu() {
  try {
    const checkLogin = await fetchStatus();
    if (checkLogin.status === true) {
      document.querySelector(".userpage").style.display = "block";
      document.querySelector(".login").style.display = "none";
    }
  } catch (error) {
    console.log(error);
  }
}

/** 다른 사용자 목록 미리 보기 기능 */
async function getUserImage() {
  try {
    const userElem = document.getElementById("userContent");
    const images = await fetchUsers();
    const userData = await fetchUser();

    userElem.innerHTML = "";
    images.forEach((image, index) => {
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

      if (userData[index] && userData[index].description) {
        textElem.innerHTML = `안녕하세요! <br>
                ${userData[index].description}`;
      } else {
        textElem.innerHTML = `사용자 정보가 없습니다.`;
        // 401 에러로 아직 데이터가 보이지 않음
      }

      imageElem.addEventListener("mouseenter", () => {
        textElem.style.display = "block";
      });

      imageElem.addEventListener("mouseleave", () => {
        textElem.style.display = "none";
      });
    });
    userElem.addEventListener("click", ImgClickHandler); //dblclick
  } catch (error) {
    console.error(error);
  }
}

function init() {
  getUserImage();

  mypageElem = document.querySelector(".userpage");
  loginElem = document.querySelector(".login");

  mypageElem.addEventListener("click", menuClickHandler);
  loginElem.addEventListener("click", menuClickHandler);

  updateMenu();
}

init();
