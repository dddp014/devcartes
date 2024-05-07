//전역변수 삭제 작업중, 이름관련 엘리멘트들 함수화 하는 과정에서 const {nameEdit, nameValue}가 제대로 작동하지 않는 문제 발생
//수정필요
var Editcount = 0;

// var nameEdit,
//    nameValue,
// Name,
var emailEdit,
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
  profileEditButton;

function createNameInputElement() {
  const nameEdit = document.createElement("input");
  nameEdit.type = "text";
  nameEdit.className = "input";
  nameEdit.Id = "nameinput";
  const nameValue = document.querySelector(".Name");
  nameEdit.placeholder = `${nameValue.innerText}`;
  return { nameEdit: nameEdit, nameValue: nameValue };
}

function createNameh4Element() {
  const Name = document.createElement("h4");
  Name.className = "_h4";
  Name.Id = "nameh4";
  Name.innerText = "이름";
  return { Name };
}

function submitEditProfile() {
  const { nameEdit, nameValue } = createNameInputElement();
  const { Name } = createNameh4Element();
  // 편집 값 저장 & 공백시 "없음" 출력
  nameValue.innerText = nameEdit.value;
  console.log(nameValue);
  console.log(nameEdit);
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
  fetch("http://localhost:8080/users/mypage", {
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
}
function cancelEditProfile() {
  const { nameEdit, nameValue } = createNameInputElement();
  const { Name } = createNameh4Element();
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
}
//네트워크 페이지에서 담아보낼값 아래 localStorage 처럼 사용하면됨
// let massId = localStorage.getItem("tempId"); // 작동되는거확인 Ok
// massId 값 아래 중 하나 선택해서 하드코딩하고 참조되는값 바뀌는것 확인 Ok
// 'ZttKLSVoI4' , 'TU639YT3DO' , 'aaf0b6b7-5ba8-4638-9afd-c38d3d459790'

let massId = localStorage.getItem("tempId");

// mypage/project post 테스트
// fetch("http://localhost:8080/mypage/project", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     title: "테스트프로젝트타이틀",
//     startDate: "2024-04-29",
//     endDate: "2024-05-12",
//     details: "프로젝트 post 테스트입니다.",
//   }),
// })
//   .then((res) => {
//     console.log("res ", res);
//     res.json();
//   })
//   .then((data) => {
//     console.log("data ", data);
//   });

// mypage/project get 테스트
// fetch("http://localhost:8080/auth/status")
//   .then((res) => res.json())
//   .then((data) => {
//     console.log(data);
//   });

// edit, 추가, 수정 등 내 페이지일때만 버튼 활성화되게 해당 div 나 button 에 editBtns이라는 class 할당해서 일괄 display 설정
function isVisibleBtns() {
  fetch("http://localhost:8080/auth/status")
    .then((res) => res.json())
    .then((data) => {
      targets = document.querySelectorAll(".editBtns");
      targets.forEach((target) => {
        if (data.data.userId == massId) {
          target.style.display = "block";
        } else {
          target.style.display = "none";
        }
      });
    });
}
//userpage 에 표시될 유저 data 받아오기 및 표시
//본인 userpage 던 타 userpage던 아래 코드로 바로 표시가능(구분방법 massId)
function getUserData() {
  fetch(`http://localhost:8080/users/${massId}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      //학력, 수강이력 등 정보는 각각 data.education , data.awards 등으로 변수 정해서 해결할것
      document.querySelector(".Name").innerText = data.user.name;
      document.querySelector(".Email").innerText = data.user.email;
      document.querySelector(".Description").innerText = data.user.description;
    });
}

// 프로필 편집 기능
function editProfile() {
  // 프로필 편집 로직
  //이름 편집 input 생성
  if (Editcount === 0) {
    // nameEdit = document.createElement("input");
    // nameEdit.setAttribute("type", "text");
    // nameEdit.className = "input";
    // nameValue = document.querySelector(".Name");
    // nameEdit.setAttribute("placeholder", `${nameValue.innerText}`);
    // createNameInputElement();
    const { nameEdit, nameValue } = createNameInputElement();
    const { Name } = createNameh4Element();
    // Name = document.createElement("h4");
    // Name.className = "_h4";
    // Name.innerText = "이름";

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
    emailContainer = document.querySelector(".emailContainer");
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

    //edit 버튼 숨기기
    profileEditButton = document.querySelector(".profileEditButton");
    profileEditButton.style.display = "none";

    //submit, cancel 버튼 생성
    submitEditButton = document.createElement("button");
    submitEditButton.innerText = "Submit";
    submitEditButton.id = "submitEditButton";
    cancelEditButton = document.createElement("button");
    cancelEditButton.innerText = "Cancel";
    cancelEditButton.id = "cancelEditButton";
    // submitEditButton = document.getElementById("#submitEditButton");
    // cancelEditButton = document.getElementById("#cancelEditButton");
    profile = document.querySelector(".profile");
    profile.append(submitEditButton);
    profile.append(cancelEditButton);

    //submit버튼 클릭시 프로필 편집 정보 저장, 서버로 변경점 업데이트
    submitEditButton.onclick = submitEditProfile;

    cancelEditButton.onclick = cancelEditProfile;
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
    // const { nameEdit, nameValue } = createNameInputElement();
    // const { Name } = createNameh4Element();
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
  const confirmButton = document.getElementById("education_confirm_button");
  const newEducationDiv = document.createElement("div"); // 새로운 div 생성

  if (educationList.style.display === "none") {
    educationList.style.display = "block";
    confirmButton.style.display = "block";
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
      <button id = "education_delete_button" onclick="deleteEducation(this)">Remove</button>
    </div>
  `;

  educationList.appendChild(newEducationDiv);
  educationList.style.display = "block";
}

function addAwards() {
  const AwardsList = document.getElementById("awardsList");
  const confirmButton = document.getElementById("awards_confirm_button");
  const plusButton = document.getElementById("awards_plus_button");

  if (AwardsList.style.display === "none") {
    AwardsList.style.display = "block";
  }
  confirmButton.style.display = "block";
  plusButton.style.display = "block";

  const newAwardDiv = document.createElement("div");
  newAwardDiv.innerHTML = `
        <input type="text" placeholder="수상 내역" />
        <input type="date" placeholder="수상 날짜" />
        <input type="text" placeholder="부가 설명" />
        <button id = "awards_delete_button" onclick="deleteAward(this)">Remove</button>
    `;

  // awardsList에 생성된 필드 추가
  AwardsList.appendChild(newAwardDiv);
}

function addProject() {
  const projectList = document.getElementById("projectList");
  const confirmButton = document.getElementById("project_confirm_button");
  const plusButton = document.getElementById("project_plus_button");

  if (projectList.style.display === "none") {
    projectList.style.display = "block";
  }
  confirmButton.style.display = "block";
  plusButton.style.display = "block";

  const newProjectDiv = document.createElement("div");
  newProjectDiv.innerHTML = `
        <input type="text" placeholder="프로젝트 이름" />
        <input type="date" placeholder="프로젝트 진행 날짜" />
        <input type="text" placeholder="프로젝트 설명" />
        <button id = "project_delete_button" onclick="deleteProject(this)">Remove</button>
    `;

  // awardsList에 생성된 필드 추가
  projectList.appendChild(newProjectDiv);
}

function addCertificate() {
  const certificateList = document.getElementById("certificateList");
  const confirmButton = document.getElementById("certificate_confirm_button");
  const plusButton = document.getElementById("certificate_plus_button");

  if (certificateList.style.display === "none") {
    certificateList.style.display = "block";
  }
  confirmButton.style.display = "block";
  plusButton.style.display = "block";

  const newCertificateDiv = document.createElement("div");
  newCertificateDiv.innerHTML = `
        <input type="text" placeholder="자격증 이름" />
        <input type="date" placeholder="자격증 취득 날짜" />
        <button id = "certificate_delete_button" onclick="deleteCertificate(this)">Remove</button>
    `;

  // awardsList에 생성된 필드 추가
  certificateList.appendChild(newCertificateDiv);
}

function deleteEducation(button, educationId) {
  const plusButton = document.getElementById("education_plus_button");

  fetch(`http://localhost:8080/mypage/education/${educationId}`, {
    method: "DELETE",
  })
    .then((response) => {
      // 상태 코드 확인
      if (!response.ok) {
        throw new Error(`에러!! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      alert("학력 정보가 삭제되었습니다.");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`학력 정보 삭제에 실패하였습니다. (에러 코드: ${error.message})`);
    });

  button.parentElement.remove();

  plusButton.style.display = "block";
}

function deleteAward(button, awardId) {
  // 버튼의 부모 요소(입력 필드 컨테이너)를 찾아 제거
  button.parentElement.remove();

  fetch(`http://localhost:8080/mypage/award/${awardId}`, {
    method: "DELETE",
    headers: {
      Authorization: "...", // 인증이 필요하다면 추가
    },
  })
    .then((response) => response.json())
    .then((data) => console.log("수상 내역이 삭제되었습니다.:", data))
    .catch((error) => console.error("Error:", error));
}

function deleteProject(button, projectId) {
  // 버튼의 부모 요소(입력 필드 컨테이너)를 찾아 제거
  button.parentElement.remove();

  fetch(`http://localhost:8080/mypage/project/${projectId}`, {
    method: "DELETE",
    headers: {
      Authorization: "...", // 인증이 필요하다면 추가
    },
  })
    .then((response) => response.json())
    .then((data) => console.log("프로젝트 내역이 삭제되었습니다.:", data))
    .catch((error) => console.error("Error:", error));
}

function deleteCertificate(button, certificateId) {
  // 버튼의 부모 요소(입력 필드 컨테이너)를 찾아 제거
  button.parentElement.remove();

  fetch(`http://localhost:8080/mypage/certificate/${certificateId}`, {
    method: "DELETE",
    headers: {
      Authorization: "...", // 인증이 필요하다면 추가
    },
  })
    .then((response) => response.json())
    .then((data) => console.log("자격증 내역이 삭제되었습니다.:", data))
    .catch((error) => console.error("Error:", error));
}
// 학력 편집 기능
// function editEducation(educationItem) {
//   // contentEditable 상태 토글
//   const isEditable = educationItem.contentEditable === "true";
//   educationItem.contentEditable = isEditable ? "false" : "true";
//   if (!isEditable) {
//     educationItem.focus(); // 편집 가능 상태가 되면 포커스
//   }
// }

function editEducation(educationId, updateEducation) {
  const selectElements = document.querySelectorAll(".education-list select");
  const inputElements = document.querySelectorAll(".education-list input");
  const confirmButton = document.getElementById("education_confirm_button");
  const editButton = document.getElementById("education_edit_button");
  // 입력 필드 및 선택 필드 활성화
  selectElements.forEach((element) => (element.disabled = false));
  inputElements.forEach((element) => (element.disabled = false));

  // 수정 버튼 숨기기, 확인 버튼 보이기
  confirmButton.style.display = "block";
  editButton.style.display = "none";

  fetch(`http://localhost:8080/mypage/education/${educationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "...",
    },
    body: JSON.stringify(updateEducation),
  })
    .then((response) => response.json())
    .then((data) => console.log(" 학력이 업데이트 되었습니다:", data))
    .catch((error) => console.error("에러:", error));
}

function editAwards(awardId, updateAward) {
  const selectElements = document.querySelectorAll(".awards-list select");
  const inputElements = document.querySelectorAll(".awards-list input");
  const confirmButton = document.getElementById("awards_confirm_button");
  const editButton = document.getElementById("awards_edit_button");
  // 입력 필드 및 선택 필드 활성화
  selectElements.forEach((element) => (element.disabled = false));
  inputElements.forEach((element) => (element.disabled = false));

  // 수정 버튼 숨기기, 확인 버튼 보이기
  confirmButton.style.display = "block";
  editButton.style.display = "none";

  fetch(`http://localhost:8080/mypage/award/${awardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "...",
    },
    body: JSON.stringify(updateAward),
  })
    .then((response) => response.json())
    .then((data) => console.log("수상 이력이 업데이트 되었습니다:", data))
    .catch((error) => console.error("에러:", error));
}

function editProject(projectId, updateProject) {
  const selectElements = document.querySelectorAll(".project-list select");
  const inputElements = document.querySelectorAll(".project-list input");
  const confirmButton = document.getElementById("project_confirm_button");
  const editButton = document.getElementById("project_edit_button");
  // 입력 필드 및 선택 필드 활성화
  selectElements.forEach((element) => (element.disabled = false));
  inputElements.forEach((element) => (element.disabled = false));

  // 수정 버튼 숨기기, 확인 버튼 보이기
  confirmButton.style.display = "block";
  editButton.style.display = "none";

  fetch(`http://localhost:8080/mypage/project/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "...",
    },
    body: JSON.stringify(updateProject),
  })
    .then((response) => response.json())
    .then((data) => console.log("프로젝트 이력이 업데이트 되었습니다:", data))
    .catch((error) => console.error("에러:", error));
}

function editCertificate(certificateId, updateCertificate) {
  const selectElements = document.querySelectorAll(".certificate-list select");
  const inputElements = document.querySelectorAll(".certificate-list input");
  const confirmButton = document.getElementById("certificate_confirm_button");
  const editButton = document.getElementById("certificate_edit_button");
  // 입력 필드 및 선택 필드 활성화
  selectElements.forEach((element) => (element.disabled = false));
  inputElements.forEach((element) => (element.disabled = false));

  // 수정 버튼 숨기기, 확인 버튼 보이기
  confirmButton.style.display = "block";
  editButton.style.display = "none";

  fetch(`http://localhost:8080/mypage/certificate /${certificateId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "...",
    },
    body: JSON.stringify(updateCertificate),
  })
    .then((response) => response.json())
    .then((data) => console.log("자격증 이력이 업데이트 되었습니다:", data))
    .catch((error) => console.error("에러:", error));
}

function confirmEducation() {
  // 각 정보를 가져옵니다.
  const editButton = document.getElementById("education_edit_button");
  const confirmButton = document.getElementById("education_confirm_button");

  confirmButton.style.display = "none";
  editButton.style.display = "block";

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

  fetch(`http://localhost:8080/mypage/education`, {
    method: "POST", // HTTP 메서드
    headers: {
      "Content-Type": "application/json", // 컨텐트 타입 설정
      // Accept: "application/json", // 서버로부터 JSON 응답을 기대함을 명시
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
}

function confirmAwards() {
  const editButton = document.getElementById("awards_edit_button");
  const confirmButton = document.getElementById("awards_confirm_button");

  confirmButton.style.display = "none";
  editButton.style.display = "block";

  // 각 select 요소를 선택합니다.
  const inputElements = document.querySelectorAll(".awards-list input");
  const selectElements = document.querySelectorAll(".awards-list select");

  // 각 요소에서 선택된 값을 저장할 변수를 선언합니다.
  const awardDate = selectElements.value;
  const awardName = inputElements[0].value;
  const awardDetail = inputElements[1].value;

  // 가져온 정보를 화면에 출력합니다.
  console.log("수상 내용:", awardName);
  console.log("수상 날짜:", awardDate);
  console.log("부가 설명:", awardDetail);

  const awardsData = {
    title: awardName,
    acqdate: awardDate,
    details: awardDetail,
  };

  fetch("http://localhost:8080/mypage/award", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "...",
    },
    body: JSON.stringify(awardsData),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("네트워크 오류입니다.");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Success:", data);
      alert("수상 정보가 성공적으로 등록되었습니다.");
      alert(confirmedInfo);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("수상 정보 등록에 실패하였습니다.");
    });

  selectElements.forEach((element) => (element.disabled = true));
  inputElements.forEach((element) => (element.disabled = true));
}

function confirmProject() {
  const editButton = document.getElementById("project_edit_button");
  const confirmButton = document.getElementById("project_confirm_button");

  confirmButton.style.display = "none";
  editButton.style.display = "block";

  // 각 select 요소를 선택합니다.
  const inputElements = document.querySelectorAll(".project-list input");
  const selectElements = document.querySelectorAll(".project-list select");

  // 각 요소에서 선택된 값을 저장할 변수를 선언합니다.
  const projectDate = selectElements.value;
  const projectName = inputElements[0].value;
  const projectDetail = inputElements[1].value;

  // 가져온 정보를 화면에 출력합니다.
  console.log("프로젝트 내용:", projectName);
  console.log("프로젝트 진행 날짜:", projectDate);
  console.log("프로젝트 설명:", projectDetail);

  const projectData = {
    title: projectName,
    acqdate: projectDate,
    details: projectDetail,
  };

  fetch("http://localhost:8080/mypage/project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "...",
    },
    body: JSON.stringify(projectData),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("네트워크 오류입니다.");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Success:", data);
      const confirmedInfo = `프로젝트 이름: ${projectName}\n프로젝트 진행 날짜: ${projectDate}\n프로젝트 설명: ${projectDetail}`;
      alert("프로젝트 정보가 성공적으로 등록되었습니다.");
      alert(confirmedInfo);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("프로젝트 정보 등록에 실패하였습니다.");
    });

  const confirmedInfo = `프로젝트 이름: ${projectName}\n프로젝트 진행 날짜: ${projectDate}\n프로젝트 설명: ${projectDetail}`;
  alert(confirmedInfo);

  selectElements.forEach((element) => (element.disabled = true));
  inputElements.forEach((element) => (element.disabled = true));
}

function confirmCertificate() {
  const editButton = document.getElementById("certificate_edit_button");
  const confirmButton = document.getElementById("certificate_confirm_button");

  confirmButton.style.display = "none";
  editButton.style.display = "block";

  // 각 select 요소를 선택합니다.
  const inputElements = document.querySelectorAll(".certificate-list input");
  const selectElements = document.querySelectorAll(".certificate-list select");

  // 각 요소에서 선택된 값을 저장할 변수를 선언합니다.
  const certificateDate = selectElements.value;
  const certificateName = inputElements[0].value;

  // 가져온 정보를 화면에 출력합니다.
  console.log("자격증 이름:", certificateName);
  console.log("자격증 취득 날짜:", certificateDate);

  const certificateData = {
    title: certificateName,
    acqdate: certificateDate,
  };

  fetch("http://localhost:8080/mypage/certificate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "...",
    },
    body: JSON.stringify(certificateData),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("네트워크 오류입니다.");
      }
      return res.json();
    })
    .then((data) => {
      console.log("Success:", data);
      const confirmedInfo = `자격증 이름: ${certificateName}\n자격증 취득 날짜: ${certificateDate}`;
      alert("certificate 정보가 성공적으로 등록되었습니다.");
      alert(confirmedInfo);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("자격증 정보 등록에 실패하였습니다.");
    });

  const confirmedInfo = `자격증 이름: ${certificateName}\n자격증 취득 날짜: ${certificateDate}`;
  alert(confirmedInfo);

  selectElements.forEach((element) => (element.disabled = true));
  inputElements.forEach((element) => (element.disabled = true));
}

getUserData();
isVisibleBtns();
