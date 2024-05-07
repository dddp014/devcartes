//Nav 페이지이동
function init() {
  clear();
}

function gotoNetworkpage() {
  window.location.href = "/network";
}

//Email,Pw 입력 값 초기화
function clear() {
  const target = document.querySelectorAll(".InputBox");
  target.forEach((target) => {
    target.value = "";
  });
}

//팝업창
const modal = document.querySelector(".modal");
const modalOpenbtn = document.querySelector(".modal_btn");
const modalClosebtn = document.querySelector(".close_btn");

function modalOpen(txtNum) {
  changeModalText(txtNum);
  document.getElementById("modal").style.display = "block";
}

function modalClose() {
  document.getElementById("modal").style.display = "none";
  const goTo = localStorage.getItem("goTo");
  if (goTo == "network") {
    window.location.href = "/Network";
  } else if (goTo == "login") {
    window.location.href = "/login";
  }
  localStorage.removeItem("goTo");
}

// 팝업창 텍스트 설정
//1. 등록되어있지 않은 ID 혹은 비밀번호를 입력하였습니다.
//2. 로그인 성공
//3. 비밀번호를 다시 확인해주세요.
//4. 가입완료!
//5. 입력되지않은 내용이 있습니다.
//6. 이미 가입되어있는 ID 입니다.
//7. 올바른 형태의 email 을 입력해주세요.

function changeModalText(txtNum) {
  if (txtNum == 1) {
    document.getElementById("modaltext").innerHTML =
      "등록되어있지 않은 ID 혹은 비밀번호를 입력하였습니다.";
  } else if (txtNum == 2) {
    document.getElementById("modaltext").innerHTML = "로그인 성공";
  } else if (txtNum == 3) {
    document.getElementById("modaltext").innerHTML =
      "비밀번호를 다시 확인해주세요.";
  } else if (txtNum == 4) {
    document.getElementById("modaltext").innerHTML = "가입완료!";
  } else if (txtNum == 5) {
    document.getElementById("modaltext").innerHTML =
      "입력되지않은 내용이 있습니다.";
  } else if (txtNum == 6) {
    document.getElementById("modaltext").innerHTML =
      "이미 가입되어있는 ID 입니다.";
  } else if (txtNum == 7) {
    document.getElementById("modaltext").innerHTML =
      "올바른 형태의 email 을 입력해주세요.";
  } else if (txtNum == 8) {
    document.getElementById("modaltext").innerHTML =
      "비밀번호가 일치하지 않습니다.";
  } else if (txtNum == 9) {
    document.getElementById("modaltext").innerHTML =
      "회원탈퇴가 정상적으로 완료되었습니다.";
  } else if (txtNum == 10) {
    document.getElementById("modaltext").innerHTML =
      "비밀번호 변경 성공! 다시 로그인 해주세요.";
  } else if (txtNum == 11) {
    document.getElementById("modaltext").innerHTML =
      "기존 비밀번호가 일치하지 않습니다.";
  } else if (txtNum == 12) {
    document.getElementById("modaltext").innerHTML =
      "변경하려는 비밀번호가 지금 사용하고 있는 비밀번호와 같습니다.";
  } else if (txtNum == 13) {
    document.getElementById("modaltext").innerHTML =
      "이미 사용중인 닉네임 입니다.";
  }
}

//회원가입 진입
function goCreateAccount() {
  clear();
  document.getElementById("alert-text").style.display = "none";
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
  }).then((response) => {
    if (response.status == 401) {
      modalOpen(1);
    } else if (response.status == 200) {
      modalOpen(2);
      clear();
      localStorage.setItem("goTo", "network");
    }
  });
}

//비밀번호, 비밀번호 확인 같은지 다른지 판단
function passwordCheck(pw, pwchk) {
  if (pw == pwchk) {
    return true;
  } else {
    return false;
  }
}

function passwordCompare() {
  const pw = document.getElementById("setpw").value;
  const pwchk = document.getElementById("setpwchk").value;
  const pwChange = document.getElementById("change-setpw").value;
  const pwChangechk = document.getElementById("change-setpwchk").value;

  passwordCheck(pw, pwchk);

  if (pw == "") {
    document.getElementById("alert-text").style.display = "none";
    document.getElementById("alert-text2").style.display = "none";
  } else if (passwordCheck(pw, pwchk)) {
    document.getElementById("alert-text").style.display = "none";
    document.getElementById("alert-text2").style.display = "none";
  } else {
    document.getElementById("alert-text").style.display = "block";
    document.getElementById("alert-text2").style.display = "block";
  }
}

//회원가입 버튼 동작
function setAccount() {
  const pw = document.getElementById("setpw").value;
  const pwchk = document.getElementById("setpwchk").value;
  const name = document.getElementById("setname").value;
  const email = document.getElementById("setemail").value;
  const nickname = document.getElementById("setNickname").value;
  const emailpattern =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;

  //email 정규식 확인
  function emailCheck(email) {
    if (emailpattern.test(email)) {
      // console.log(emailpattern.test(email));
      return true;
    } else {
      return false;
    }
  }

  if (!passwordCheck(pw, pwchk)) {
    modalOpen(3);
  }
  if (!emailCheck(email)) {
    modalOpen(7);
  }

  if (passwordCheck(pw, pwchk) && emailCheck(email)) {
    fetch("http://localhost:8080/auth/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pw,
        name: name,
        nickname: nickname,
      }),
    }).then((response) => {
      if (response.status == 201) {
        modalOpen(4);
        outCreateAccount();
      } else if (response.status == 400) {
        modalOpen(5);
      } else if (response.status == 409) {
        response.json().then((data) => {
          // console.log(data.error);
          if (data.error == "이미 가입된 이메일입니다.") {
            modalOpen(6);
          }
          if (data.error == "다른 사용자가 닉네임을 사용중입니다.") {
            modalOpen(13);
          }
        });
      }
    });
  }
}

//회원탈퇴
function accountDelete() {
  if (confirm("정말 회원탈퇴를 진행하시겠습니까?")) {
    const pw = document.getElementById("delete-account-pwchk").value;
    fetch("http://localhost:8080/auth", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: pw,
      }),
    }).then((response) => {
      if (response.status == 401) {
        modalOpen(8);
      } else if (response.status == 200) {
        localStorage.setItem("goTo", "login");
        modalOpen(9);
        clear();
      }
    });
  }
}

//비밀번호 변경
function passwordChange() {
  const prevPw = document.getElementById("existed-pw").value;
  const pw = document.getElementById("change-setpw").value;
  // console.log(prevPw, pw);
  fetch("http://localhost:8080/auth", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      password: prevPw,
      newPassword: pw,
    }),
  }).then((response) => {
    // console.log("res : ", response);
    if (response.status == 200) {
      modalOpen(10);
      localStorage.setItem("goTo", "login");
      //변경된 비밀번호로 다시 로그인하게 유도
      fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
    } else if (response.status == 400) {
      modalOpen(5);
    } else if (response.status == 401) {
      modalOpen(11);
    } else if (response.status == 409) {
      modalOpen(12);
    }
  });
}

init();
