const navLinks = [...document.querySelectorAll(".main-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveLink = () => {
  const current = sections.reduce((active, section) => {
    const rect = section.getBoundingClientRect();
    return rect.top <= 140 ? section : active;
  }, sections[0]);

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
  });
};

document.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

const worldScenes = [...document.querySelectorAll(".hero, .about-section, .skills-section, .projects-section")];
const aboutSection = document.querySelector(".about-section");
const resumePanel = document.querySelector(".profile-resume");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let worldFrame = 0;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const smoothstep = (value) => value * value * (3 - 2 * value);

const updateWorldScenes = () => {
  worldFrame = 0;

  if (reduceMotion.matches) {
    worldScenes.forEach((scene) => {
      scene.style.setProperty("--world-dim", ".08");
      scene.style.setProperty("--world-shift", "0px");
    });
    aboutSection.style.setProperty("--resume-dim", "0");
    return;
  }

  const viewportHeight = window.innerHeight;
  const fadeDistance = viewportHeight * 0.72;

  worldScenes.forEach((scene) => {
    const rect = scene.getBoundingClientRect();
    const entering = clamp((viewportHeight - rect.top) / fadeDistance, 0, 1);
    const leaving = clamp(rect.bottom / fadeDistance, 0, 1);
    const reveal = smoothstep(Math.min(entering, leaving));
    const inactiveDim = scene.id === "intro" ? 0.86 : 0.96;
    const dim = 0.08 + (1 - reveal) * (inactiveDim - 0.08);
    const sceneCenter = rect.top + rect.height / 2;
    const shift = clamp((viewportHeight / 2 - sceneCenter) * 0.045, -36, 36);

    scene.style.setProperty("--world-dim", dim.toFixed(3));
    scene.style.setProperty("--world-shift", `${shift.toFixed(1)}px`);
  });

  const resumeRect = resumePanel.getBoundingClientRect();
  const aboutRect = aboutSection.getBoundingClientRect();
  const resumeEntry = clamp(
    (viewportHeight - resumeRect.top - viewportHeight * 0.12) / (viewportHeight * 0.55),
    0,
    1,
  );
  const resumeReveal = smoothstep(resumeEntry);
  const resumeDim = 0.06 + (1 - resumeReveal) * 0.88;
  const resumeFadeTop = Math.max(0, resumeRect.top - aboutRect.top);
  aboutSection.style.setProperty("--resume-dim", resumeDim.toFixed(3));
  aboutSection.style.setProperty("--resume-fade-top", `${resumeFadeTop.toFixed(1)}px`);
};

const requestWorldUpdate = () => {
  if (worldFrame) return;
  worldFrame = window.requestAnimationFrame(updateWorldScenes);
};

document.addEventListener("scroll", requestWorldUpdate, { passive: true });
window.addEventListener("resize", requestWorldUpdate);
reduceMotion.addEventListener("change", requestWorldUpdate);
updateWorldScenes();

// 이미지 경로와 텍스트만 교체하면 프로젝트 상세 팝업을 그대로 재사용할 수 있습니다.
const projects = {
  "project-1": {
    type: "Main Project",
    title: "EverWind",
    period: "2025.09.01 - 2026.06.01 / 개인 프로젝트",
    overviewTitle: "콘텐츠 확장성을 고려한 온라인 액션 RPG 시스템 아키텍처",
    overview: "전투·스킬·아이템·제작·퀘스트·튜토리얼을 확장 가능한 구조로 설계하고, Unity 클라이언트에서 C++ IOCP 서버와 MySQL 영속화까지 이어지는 전체 데이터 흐름을 구현한 멀티플레이 RPG 프로젝트입니다.",
    motivationTitle: "클라이언트·서버·데이터베이스 지식을 하나의 MMORPG 흐름으로 연결",
    motivation: "학교에서 배운 클라이언트, 서버, 데이터베이스 지식을 바탕으로 각 영역을 하나의 시스템으로 융합하고, MMORPG 전반의 내부 시스템과 데이터 흐름을 직접 실습하기 위해 개발했습니다.",
    info: [
      ["개발 기간", "2025.09.01 - 2026.06.01"],
      ["구성", "개인 프로젝트"],
      ["엔진", "Unity 2022.3.20f1"],
      ["서버", "C++20, WinSock2 IOCP"],
      ["데이터베이스", "MySQL / MariaDB"],
      ["통신", "TCP 커스텀 바이너리 프로토콜"],
    ],
    feature: "",
    challenge: "",
    solution: "",
    tags: [],
    notion: "https://app.notion.com/p/3dfe8789789b81b6a85ae3bb0f99b11e",
    images: [
      { src: "assets/everwind-login.png", alt: "EverWind 로그인 화면", label: "LOGIN SCREEN" },
      { src: "assets/everwind-combat.png", alt: "EverWind 전투 화면", label: "COMBAT" },
      { src: "assets/everwind-equipment.png", alt: "EverWind 장비 화면", label: "EQUIPMENT" },
    ],
  },
  "project-2": {
    type: "Team Project",
    title: "프로젝트 이름 02",
    period: "2026.00 - 2026.00 / 3인 팀",
    feature: "로그인, 플레이 데이터 저장, 랭킹과 클라이언트 연동처럼 서버 중심 기능을 간단히 소개합니다.",
    challenge: "요청 순서와 예외 상황에 따라 데이터가 다르게 저장되는 정합성 문제가 발생했습니다. 재현이 어렵다는 점도 함께 해결해야 했습니다.",
    solution: "요청 단위를 명확히 정의하고 검증 계층과 로그를 추가했습니다. 실패 지점을 추적할 수 있게 만들고 저장 규칙을 한곳에서 관리했습니다.",
    tags: ["Node.js", "REST API", "MySQL"],
    images: [
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 2 대표 인게임 이미지 자리", label: "MAIN SCREEN" },
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 2 인게임 이미지 두 번째 자리", label: "GAMEPLAY 01" },
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 2 인게임 이미지 세 번째 자리", label: "GAMEPLAY 02" },
    ],
  },
  "project-3": {
    type: "Tool Project",
    title: "프로젝트 이름 03",
    period: "2026.00 - 2026.00 / 개인",
    feature: "반복되는 콘텐츠 데이터 생성과 유효성 검사를 자동화한 에디터 도구의 핵심 기능을 소개합니다.",
    challenge: "작업자가 입력 실수를 발견하지 못한 채 빌드 단계까지 진행하는 문제가 있었고, 데이터가 늘수록 수동 확인 시간이 길어졌습니다.",
    solution: "입력 단계에서 즉시 검증하고 오류 위치를 안내하도록 제작 흐름을 바꿨습니다. 공통 규칙은 재사용 가능한 검증 모듈로 분리했습니다.",
    tags: ["Editor Tool", "Automation", "Workflow"],
    images: [
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 3 대표 도구 이미지 자리", label: "TOOL SCREEN" },
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 3 도구 이미지 두 번째 자리", label: "WORKFLOW 01" },
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 3 도구 이미지 세 번째 자리", label: "WORKFLOW 02" },
    ],
  },
  "project-4": {
    type: "Network Project",
    title: "프로젝트 이름 04",
    period: "2026.00 - 2026.00 / 2인 팀",
    feature: "멀티플레이 환경의 상태 동기화, 패킷 처리와 연결 상태 관리 등 네트워크 핵심 기능을 소개합니다.",
    challenge: "지연과 패킷 순서 차이로 클라이언트마다 서로 다른 상태가 보이는 문제가 발생했습니다.",
    solution: "서버 권한 범위를 명확히 정하고 메시지 처리 순서와 보정 규칙을 통합해 상태 차이를 줄였습니다.",
    tags: ["C++", "Network", "Protocol"],
    images: [
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 4 대표 인게임 이미지 자리", label: "MAIN SCREEN" },
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 4 네트워크 테스트 이미지 자리", label: "NETWORK TEST" },
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 4 플레이 이미지 자리", label: "GAMEPLAY" },
    ],
  },
  "project-5": {
    type: "Graphics Project",
    title: "프로젝트 이름 05",
    period: "2026.00 - 2026.00 / 개인",
    feature: "렌더링 파이프라인을 직접 구성하며 구현한 조명, 머티리얼과 후처리 기능을 소개합니다.",
    challenge: "렌더링 단계가 늘면서 상태 전환 순서에 따라 화면 결과가 달라지고 원인을 찾기 어려웠습니다.",
    solution: "패스별 입력과 출력을 구조화하고 디버그 뷰를 추가해 각 렌더링 단계의 결과를 개별 검증했습니다.",
    tags: ["DirectX11", "HLSL", "Rendering"],
    images: [
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 5 대표 렌더링 이미지 자리", label: "RENDER RESULT" },
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 5 조명 이미지 자리", label: "LIGHTING" },
      { src: "assets/pixel-sunset-sky.png", alt: "프로젝트 5 디버그 이미지 자리", label: "DEBUG VIEW" },
    ],
  },
};

const modal = document.querySelector("#project-modal");
const closeButton = modal.querySelector(".modal-close");
const modalFields = {
  type: modal.querySelector("#modal-type"),
  title: modal.querySelector("#modal-title"),
  period: modal.querySelector("#modal-period"),
  feature: modal.querySelector("#modal-feature"),
  challenge: modal.querySelector("#modal-challenge"),
  solution: modal.querySelector("#modal-solution"),
  tags: modal.querySelector("#modal-tags"),
  gallery: modal.querySelector("#modal-gallery-images"),
  overview: modal.querySelector("#modal-overview"),
  overviewTitle: modal.querySelector("#modal-overview-title"),
  overviewCopy: modal.querySelector("#modal-overview-copy"),
  motivation: modal.querySelector("#modal-motivation"),
  motivationTitle: modal.querySelector("#modal-motivation-title"),
  motivationCopy: modal.querySelector("#modal-motivation-copy"),
  info: modal.querySelector("#modal-info"),
  story: modal.querySelector(".modal-story"),
  notion: modal.querySelector("#modal-notion"),
};

const buildGallery = (images) => {
  modalFields.gallery.replaceChildren();
  images.forEach((image) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    figure.append(img);
    modalFields.gallery.append(figure);
  });
};

const openProject = (projectId) => {
  const project = projects[projectId];
  if (!project) return;

  modalFields.type.textContent = project.type;
  modalFields.title.textContent = project.title;
  modalFields.period.textContent = project.period;
  modalFields.feature.textContent = project.feature;
  modalFields.challenge.textContent = project.challenge;
  modalFields.solution.textContent = project.solution;
  const hasOverview = Boolean(project.overviewTitle || project.overview || project.info?.length);
  modalFields.overview.hidden = !hasOverview;
  modalFields.overviewTitle.textContent = project.overviewTitle || "";
  modalFields.overviewCopy.textContent = project.overview || "";
  const hasMotivation = Boolean(project.motivationTitle || project.motivation);
  modalFields.motivation.hidden = !hasMotivation;
  modalFields.motivationTitle.textContent = project.motivationTitle || "";
  modalFields.motivationCopy.textContent = project.motivation || "";
  modalFields.info.replaceChildren(
    ...(project.info || []).flatMap(([label, value]) => {
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = label;
      description.textContent = value;
      return [term, description];
    }),
  );
  modalFields.story.hidden = !(project.feature || project.challenge || project.solution);
  modalFields.notion.href = project.notion || "#";
  if (project.notion) {
    modalFields.notion.target = "_blank";
    modalFields.notion.rel = "noreferrer";
  } else {
    modalFields.notion.removeAttribute("target");
    modalFields.notion.removeAttribute("rel");
  }
  modalFields.tags.replaceChildren(
    ...project.tags.map((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      return item;
    }),
  );
  modalFields.tags.hidden = project.tags.length === 0;
  buildGallery(project.images);

  modal.showModal();
  document.body.classList.add("modal-open");
  closeButton.focus();
};

document.querySelectorAll("[data-project-open]").forEach((button) => {
  button.addEventListener("click", () => openProject(button.dataset.projectOpen));
});

closeButton.addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});
modal.addEventListener("close", () => document.body.classList.remove("modal-open"));
