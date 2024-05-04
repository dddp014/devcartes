const deleteButton = document.getElementById("delete-button");
const confirmButton = document.getElementById("confirm-button");
const plusButton = document.getElementById("plus-button");
const editButton = document.getElementById("edit-button");
const selectElements = document.querySelectorAll(".education-list select");
const inputElements = document.querySelectorAll(".education-list input");
var Editcount = 0;
var nameEdit,
  nameValue,
  Name,
  emailEdit,
  emailValue,
  email,
  descriptionEdit,
  descriptionValue,
  description;
var nameContainer,
  emailContainer,
  descriptionContainer,
  submitEditButton,
  cancelEditButton,
  profile,
  profileEditButton,
  userid;

fetch("http://localhost:8080/auth/status")
  .then((res) => res.json())
  .then((data) => {
    document.querySelector(".Name").innerText = data.data.name;
    document.querySelector(".Email").innerText = data.data.email;
    document.querySelector(".Description").innerText = data.data.description;
    userid = data.data.id;
    // console.log(data.data);
    // console.log(data.data.id);
  });

// 프로필 편집 기능

function editProfile() {
  // 프로필 편집 로직
  //이름 편집 input 생성
  if (Editcount === 0) {
    nameEdit = document.createElement("input");
    nameEdit.setAttribute("type", "text");
    nameEdit.className = "input";
    nameValue = document.querySelector(".Name");
    nameEdit.setAttribute("placeholder", `${nameValue.innerText}`);

    Name = document.createElement("h4");
    Name.className = "_h4";
    Name.innerText = "이름";

    // //이메일 편집 input 생성
    // emailEdit = document.createElement("input");
    // emailEdit.setAttribute("type", "text");
    // emailEdit.className = "input";
    // emailValue = document.querySelector(".Email");
    // emailEdit.setAttribute("placeholder", `${emailValue.innerText}`);

    // email = document.createElement("h4");
    // email.className = "_h4";
    // email.innerText = "이메일 주소";

    //설명 편집 input 생성
    descriptionEdit = document.createElement("input");
    descriptionEdit.setAttribute("type", "text");
    descriptionEdit.className = "input";
    descriptionValue = document.querySelector(".Description");
    descriptionEdit.setAttribute(
      "placeholder",
      `${descriptionValue.innerText}`
    );

    description = document.createElement("h4");
    description.className = "_h4";
    description.innerText = "설명";

    //div에 자식으로 등록
    nameContainer = document.querySelector(".nameContainer");
    // emailContainer = document.querySelector(".emailContainer");
    descriptionContainer = document.querySelector(".descriptionContainer");
    nameContainer.append(Name);
    nameContainer.append(nameEdit);
    // emailContainer.append(email);
    // emailContainer.append(emailEdit);
    descriptionContainer.append(description);
    descriptionContainer.append(descriptionEdit);

    //요소 숨기기
    nameValue.style.display = "none";
    // emailValue.style.display = "none";
    descriptionValue.style.display = "none";

    //submit, cancel 버튼 생성
    submitEditButton = document.createElement("button");
    submitEditButton.innerText = "Submit";
    cancelEditButton = document.createElement("button");
    cancelEditButton.innerText = "Cancel";

    //submit버튼 클릭시 프로필 편집 정보 저장, 서버로 변경점 업데이트
    submitEditButton.onclick = function submitEditProfile() {
      // 편집 값 저장 & 공백시 "없음" 출력
      nameValue.innerText = nameEdit.value;
      if (!nameValue.innerText) nameValue.innerText = "없음";
      // emailValue.innerText = emailEdit.value;
      // if (!emailValue.innerText) emailValue.innerText = "없음";
      descriptionValue.innerText = descriptionEdit.value;
      if (!descriptionValue.innerText) descriptionValue.innerText = "없음";

      //요소 보이기
      nameValue.style.display = "block";
      // emailValue.style.display = "block";
      descriptionValue.style.display = "block";
      profileEditButton.style.display = "block";

      //요소 숨기기
      nameEdit.style.display = "none";
      // emailEdit.style.display = "none";
      descriptionEdit.style.display = "none";
      Name.style.display = "none";
      // email.style.display = "none";
      description.style.display = "none";

      submitEditButton.style.display = "none";
      cancelEditButton.style.display = "none";

      //서버로 name, description 보내기
      fetch(`http://localhost:8080/users/${userid}`, {
        method: "PUT", // HTTP 메서드
        headers: {
          "Content-Type": "application/json", // 컨텐트 타입 설정
          Accept: "application/json", // 서버로부터 JSON 응답을 기대함을 명시
        },
        body: JSON.stringify({
          name: nameEdit.value,
          description: descriptionEdit.value,
        }), // JSON 문자열로 변환하여 데이터 전송
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("네트워크 오류입니다.");
          }
          return res.json(); // 응답을 JSON 형태로 파싱
        })
        .then((data) => {
          console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
          alert("프로필 정보가 성공적으로 등록되었습니다.");
        })
        .catch((error) => {
          console.error("Error:", error); // 에러 처리
          alert("에러가 발생했습니다");
        });
    };

    cancelEditButton.onclick = function cancelEditProfile() {
      //요소 보이기
      nameValue.style.display = "block";
      // emailValue.style.display = "block";
      descriptionValue.style.display = "block";
      profileEditButton.style.display = "block";

      //요소 숨기기
      nameEdit.style.display = "none";
      // emailEdit.style.display = "none";
      descriptionEdit.style.display = "none";
      Name.style.display = "none";
      // email.style.display = "none";
      description.style.display = "none";

      submitEditButton.style.display = "none";
      cancelEditButton.style.display = "none";
    };

    profile = document.querySelector(".profile");
    profile.append(submitEditButton);
    profile.append(cancelEditButton);

    //edit 버튼 숨기기
    profileEditButton = document.querySelector(".profileEditButton");
    profileEditButton.style.display = "none";

    //3번 반복 되므로 여유되면 함수로 압축

    //프로필 이미지 편집 로직
    //   function createImageEditButton() {
    //     var ImageEditForm = document.createElement("form");
    //     ImageEditForm.setAttribute("id", "form");
    //     ImageEditForm.setAttribute("method", "post");
    //     ImageEditForm.setAttribute("enctype", "multipart/form-data");
    //     var ImageEditButton = document.createElement("button");
    //     ImageEditButton.textcontent = "프로필 이미지 변경";
    //     document.querySelcetor("#form").append(ImageEditButton);
    //     ImageEditButton.onclick = function changeImage() {};
    //   }
    // alert("프로필 편집 기능은 개발 중입니다.");

    Editcount = 1; //edit 버튼 다시 누를땐 elment 추가 x, 숨김 요소만 보이기 혹시 다른페이지 돌릴때 0으로 바꿔줘야 하나?
  } else {
    //요소 보이기
    nameEdit.style.display = "";
    // emailEdit.style.display = "";
    descriptionEdit.style.display = "";
    Name.style.display = "";
    // email.style.display = "";
    description.style.display = "";

    submitEditButton.style.display = "";
    cancelEditButton.style.display = "";

    //요소 숨기기
    nameValue.style.display = "none";
    // emailValue.style.display = "none";
    descriptionValue.style.display = "none";
    profileEditButton.style.display = "none";

    //이전 입력값은 회색글씨로 남게하기
    nameEdit.value = "";
    nameEdit.setAttribute("placeholder", `${nameValue.innerText}`);
    // emailEdit.value = "";
    // emailEdit.setAttribute("placeholder", `${emailValue.innerText}`);
    descriptionEdit.value = "";
    descriptionEdit.setAttribute(
      "placeholder",
      `${descriptionValue.innerText}`
    );
  }
}

//학력 추가 기능
function addEducation() {
  const educationList = document.getElementById("educationList");
  const deleteButton = document.getElementById("delete-button");
  const confirmButton = document.getElementById("confirm-button");
  const plusButton = document.getElementById("plus-button");
  const newEducationDiv = document.createElement("div"); // 새로운 div 생성

  if (educationList.style.display === "none") {
    educationList.style.display = "block";
    deleteButton.style.display = "block";
    confirmButton.style.display = "block";
  } else {
    educationList.style.display = "none";
  }

  newEducationDiv.innerHTML = `
    <div>
      <select>
        <option value="">학력 구분 선택</option>
        <option value="elementry">초등학교 졸업</option>
        <option value="middle">중학교 졸업</option>
        <option value="high">고등학교 졸업</option>
        <option value="colleage">대학교,대학원 졸업</option>
      </select>
      <select>
        <option value="">학위 선택</option>
        <option value="재학중">대학(2,3년)</option>
        <option value="학사졸업">대학(4년)</option>
        <option value="석사졸업">대학원(석사)</option>
        <option value="박사졸업">대학원(박사)</option>
      </select>
      <input type="text" placeholder="대학교" />
      <input type="text" placeholder="전공" />
      <select>
        <option value="">졸업여부</option>
        <option value="bachelor">졸업</option>
        <option value="master">재학중</option>
        <option value="master">휴학중</option>
        <option value="phd">수료</option>
        <option value="phd">중퇴</option>
        <option value="phd">자퇴</option>
        <option value="phd">졸업예정</option>
      </select>
      <input type="date" placeholder="입학 년월" />
      <input type="date" placeholder="졸업 년월" />
    </div>
  `;

  educationList.appendChild(newEducationDiv);
  educationList.style.display = "block";
}

function removeEducation(educationId) {
  const educationDiv = document.querySelector(".education-list");
  const confirmButton = document.getElementById("confirm-button");
  const deleteButton = document.getElementById("delete-button");
  const plusButton = document.getElementById("plus-button");
  const editButton = document.getElementById("edit-button");

  educationDiv.style.display = "none";

  plusButton.style.display = "block";
  editButton.style.display = "none";
  deleteButton.style.display = "none";
  confirmButton.style.display = "none";
  fetch(`http://localhost:8080/education/${educationId}`, {
    method: "DELETE",
  })
    .then((response) => {
      // 상태 코드 확인
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message); // 성공 메시지 출력
      alert("학력 정보가 삭제되었습니다.");
      // 추가적인 UI 업데이트 로직
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`학력 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`);
    });
}

// 학력 편집 기능
function editEducation(educationItem) {
  // contentEditable 상태 토글
  const isEditable = educationItem.contentEditable === "true";
  educationItem.contentEditable = isEditable ? "false" : "true";
  if (!isEditable) {
    educationItem.focus(); // 편집 가능 상태가 되면 포커스
  }
}

function confirmEducation() {
  // 각 정보를 가져옵니다.
  // 각 select 요소를 선택합니다.
  const selectElements = document.querySelectorAll(".education-list select");
  const inputElements = document.querySelectorAll(".education-list input");

  // 각 select 요소에서 선택된 값을 저장할 변수를 선언합니다.
  let educationType, degree;
  let schoolName, major;

  // 첫 번째 select 요소에서 선택된 값을 가져옵니다.
  educationType = selectElements[0].value;
  // 두 번째 select 요소에서 선택된 값을 가져옵니다.
  degree = selectElements[1].value;

  schoolName = inputElements[0].value;
  major = inputElements[1].value;

  // 가져온 정보를 활용하여 추가 작업을 수행합니다.
  console.log("학력 구분:", educationType);
  console.log("학위:", degree);
  console.log("학교 이름:", schoolName);
  console.log("전공:", major);

  // 필요에 따라 가져온 정보를 활용하여 추가적인 작업을 수행합니다.

  const postData = {
    schoolName: schoolName,
    major: major,
    schoolState: degree,
  };

  fetch("http://localhost:8080/education", {
    method: "POST", // HTTP 메서드
    headers: {
      "Content-Type": "application/json", // 컨텐트 타입 설정
      Accept: "application/json", // 서버로부터 JSON 응답을 기대함을 명시
    },
    body: JSON.stringify(postData), // JSON 문자열로 변환하여 데이터 전송
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("네트워크 오류입니다.");
      }
      return res.json(); // 응답을 JSON 형태로 파싱
    })
    .then((data) => {
      console.log("Success:", data); // 성공적으로 데이터를 받으면 로그에 출력
      alert("학력 정보가 성공적으로 등록되었습니다.");
    })
    .catch((error) => {
      console.error("Error:", error); // 에러 처리
      alert("학력 정보 등록에 실패하였습니다.");
    });

  // 가져온 정보를 화면에 출력합니다.
  const confirmedInfo = `학력 구분: ${educationType}\n학위: ${degree}\n학교이름: ${schoolName}\n학위: ${major}`;
  alert(confirmedInfo);

  selectElements.forEach((element) => (element.disabled = true));
  inputElements.forEach((element) => (element.disabled = true));

  // 확인 버튼 숨기기, 수정 버튼 보이기
  confirmButton.style.display = "none";
  editButton.style.display = "block";
}

function editEducation() {
  // 입력 필드 및 선택 필드 활성화
  selectElements.forEach((element) => (element.disabled = false));
  inputElements.forEach((element) => (element.disabled = false));

  // 수정 버튼 숨기기, 확인 버튼 보이기
  confirmButton.style.display = "block";
  editButton.style.display = "none";
}

function addAwards() {
  const AwardsList = document.getElementById("awardsList");
  const deleteButton = document.getElementById("awards_delete_button");
  const confirmButton = document.getElementById("awards_confirm_button");
  const plusButton = document.getElementById("awards_plus_button");

  if (AwardsList.style.display === "none") {
    AwardsList.style.display = "block";
  }

  const newAwardDiv = document.createElement("div");
  newAwardDiv.innerHTML = `
        <input type="text" placeholder="수상 내역" />
        <input type="date" placeholder="수상 날짜" />
        <button onclick="removeAward(this)">Remove</button>
    `;

  // awardsList에 생성된 필드 추가
  AwardsList.appendChild(newAwardDiv);
}

function removeAward(button) {
  // 버튼의 부모 요소(입력 필드 컨테이너)를 찾아 제거
  button.parentElement.remove();
}
