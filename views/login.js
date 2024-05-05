//해야할거
//1. 전역변수 modalOpen()에 인자로 변경
//2. 비밀번호, 이메일 확인 부분 flag 대신 return으로

//Nav 페이지이동
function gotoNetworkpage() {
  window.location.href = "/network";
}

//Email,Pw 입력 값 초기화
function clear() {
  document.getElementById("email").value = "";
  document.getElementById("pw").value = "";
  document.getElementById("setemail").value = "";
  document.getElementById("setpw").value = "";
  document.getElementById("setpwchk").value = "";
  document.getElementById("setname").value = "";
}

//팝업창
const modal = document.querySelector(".modal");
const modalOpenbtn = document.querySelector(".modal_btn");
const modalClosebtn = document.querySelector(".close_btn");

// modalOpen()에 인자로 변경
let modaltextflag;

function modalOpen() {
  changeModalText();
  document.getElementById("modal").style.display = "block";
}

function modalClose() {
  changeModalText();
  document.getElementById("modal").style.display = "none";
  if (modaltextflag == 2) {
    window.location.href = "/network";
  }
}

// 팝업창 텍스트 설정
//1. 등록되어있지 않은 ID 혹은 비밀번호를 입력하였습니다.
//2. 로그인 성공
//3. 비밀번호를 다시 확인해주세요.
//4. 가입완료!
//5. 입력되지않은 내용이 있습니다.
//6. 이미 가입되어있는 ID 입니다.
//7. 올바른 형태의 email 을 입력해주세요.

function changeModalText() {
  if (modaltextflag == 1) {
    document.getElementById("modaltext").innerHTML =
      "등록되어있지 않은 ID 혹은 비밀번호를 입력하였습니다.";
  } else if (modaltextflag == 2) {
    document.getElementById("modaltext").innerHTML = "로그인 성공";
  } else if (modaltextflag == 3) {
    document.getElementById("modaltext").innerHTML =
      "비밀번호를 다시 확인해주세요.";
  } else if (modaltextflag == 4) {
    document.getElementById("modaltext").innerHTML = "가입완료!";
  } else if (modaltextflag == 5) {
    document.getElementById("modaltext").innerHTML =
      "입력되지않은 내용이 있습니다.";
  } else if (modaltextflag == 6) {
    document.getElementById("modaltext").innerHTML =
      "이미 가입되어있는 ID 입니다.";
  } else if (modaltextflag == 7) {
    document.getElementById("modaltext").innerHTML =
      "올바른 형태의 email 을 입력해주세요.";
  }
}

//회원가입 진입
function goCreateAccount() {
  clear();
  document.getElementById("LoginContainer").style.display = "none";
  document.getElementById("createAccountContainer").style.display = "block";
}
//회원가입 취소
function outCreateAccount() {
  clear();
  document.getElementById("LoginContainer").style.display = "block";
  document.getElementById("createAccountContainer").style.display = "none";
}

//로그인
function login() {
  const email = document.getElementById("email").value;
  const pw = document.getElementById("pw").value;

  fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: pw,
    }),
  })
    .then((response) => {
      if (response.status == 401) {
        modaltextflag = 1;
        modalOpen();
      } else if (response.status == 200) {
        modaltextflag = 2;
        modalOpen();
        clear();
        console.log(response);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      localStorage.setItem("login", "test");
    });
}

function setAccounttoServer() {
  const pw = document.getElementById("setpw").value;
  const pwchk = document.getElementById("setpwchk").value;
  const name = document.getElementById("setname").value;
  const email = document.getElementById("setemail").value;
  var setaccountflag = 0;
  const emailpattern =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  //email 정규식 확인
  function emailCheck(email) {
    if (emailpattern.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  if (pw != pwchk) {
    modaltextflag = 3;
    setaccountflag = 1;
    modalOpen();
  }
  if (emailCheck(email) == false) {
    modaltextflag = 7;
    setaccountflag = 1;
    modalOpen();
  }

  if (setaccountflag == 0) {
    fetch("http://localhost:8080/auth/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pw,
        name: name,
      }),
    }).then((response) => {
      if (response.status == 201) {
        modaltextflag = 4;
        modalOpen();
        outCreateAccount();
      } else if (response.status == 400) {
        modaltextflag = 5;
        modalOpen();
      } else if (response.status == 409) {
        modaltextflag = 6;
        modalOpen();
      }
    });
  }
}
