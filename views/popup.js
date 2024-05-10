// <!-- 팝업모달창 div -->
// <div class="modal" id="modal" display="none">
//   <div class="modal_popup">
//     <p id="modaltext"></p>
//     <button type="button" class="modal_btn" onclick="modalClose()">
//       확인
//     </button>
//   </div>
// </div>

function modalOpen(txtNum) {
  changeModalText(txtNum);
  document.getElementById("modal").style.display = "block";
}

function modalClose() {
  document.getElementById("modal").style.display = "none";
  const goTo = localStorage.getItem("goTo");
  if (goTo == "network") {
    window.location.href = "/?page=1";
  } else if (goTo == "login") {
    window.location.href = "/login";
  }
  localStorage.removeItem("goTo");
}

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

const modal = document.querySelector(".modal");
const modalOpenbtn = document.querySelector(".modal_btn");
const modalClosebtn = document.querySelector(".close_btn");
modalClosebtn.addEventListener("click", () => {
  modalClose();
});

export { modalOpen, modalClose, changeModalText };
