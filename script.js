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
    const entering = scene === aboutSection
      ? clamp((viewportHeight * 0.56 - rect.top) / (viewportHeight * 0.42), 0, 1)
      : clamp((viewportHeight - rect.top) / fadeDistance, 0, 1);
    const leaving = clamp(rect.bottom / fadeDistance, 0, 1);
    const reveal = smoothstep(Math.min(entering, leaving));
    const inactiveDim = scene.id === "intro" ? 0.86 : 0.96;
    const dim = 0.08 + (1 - reveal) * (inactiveDim - 0.08);
    const sceneCenter = rect.top + rect.height / 2;
    const isIntroTransition = scene.matches(".hero, .about-section");
    const shift = isIntroTransition ? 0 : clamp((viewportHeight / 2 - sceneCenter) * 0.045, -36, 36);

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
    coreFeatures: [
      {
        title: "데이터 중심 RPG 콘텐츠 확장",
        summary: "정의 데이터와 실행 상태를 분리해 새로운 스킬·아이템·퀘스트를 독립적으로 추가합니다.",
        emphasis: ["정의 데이터", "실행 상태", "공통 생성·실행·종료 흐름", "콘텐츠별 차이"],
        why: "온라인 RPG는 스킬·아이템·퀘스트가 계속 늘어나는 장르입니다. 유형별 조건문을 한곳에 쌓거나 변하지 않는 정의와 수량·쿨다운 같은 실행 상태를 섞으면, 콘텐츠 하나를 추가할 때 기존 로직과 저장 데이터까지 함께 수정해야 합니다.",
        how: "콘텐츠의 이름·효과·조건처럼 변하지 않는 정의 데이터와 플레이 중 변화하는 상태를 분리했습니다. 공통 생성·실행·종료 흐름은 동일한 계약으로 처리하고, 콘텐츠별 차이는 개별 동작과 데이터로 확장했습니다. 덕분에 사용하는 쪽은 구체적인 유형을 몰라도 같은 방식으로 콘텐츠를 실행할 수 있습니다.",
        video: {
          src: "assets/videos/everwind-content-crafting-equipment.mp4",
          title: "콘텐츠 확장 · 제작과 장비 결과 영상",
        },
      },
      {
        title: "상태 머신 기반 전투 흐름",
        summary: "이동부터 사망까지 행동을 상태로 분리해 전환 규칙과 전투 판정 시점을 명확히 관리합니다.",
        emphasis: ["상태", "전환 규칙", "애니메이션의 유효 프레임"],
        why: "이동·추적·공격·피격·사망을 하나의 갱신 흐름에서 처리하면 여러 조건이 동시에 참이 되면서 행동이 충돌할 수 있습니다. 특히 공격 가능 여부와 애니메이션 재생 시점이 섞이면 화면의 동작과 실제 판정이 어긋나고, 어떤 조건에서 잘못 전환됐는지 추적하기 어려워집니다.",
        how: "각 행동을 진입·갱신·종료 단계가 있는 상태로 분리하고, 상태를 바꿀 수 있는 조건과 우선순위를 명시했습니다. 전투 판단은 로직에서 결정하되 실제 타격 판정은 애니메이션의 유효 프레임과 연결했습니다. 피격이나 사망처럼 현재 행동을 중단해야 하는 상황도 정해진 전환 규칙을 거치도록 구성했습니다.",
        video: {
          src: "assets/videos/02-combat-state-flow.mp4",
          title: "상태 머신 기반 전투 흐름 결과 영상",
        },
      },
      {
        title: "이벤트 기반 퀘스트·튜토리얼",
        summary: "전투·채집·제작 결과를 이벤트로 전달해 진행 시스템이 각 기능에 직접 의존하지 않게 합니다.",
        emphasis: ["공통 이벤트", "구독", "목표 정의", "진행 상태"],
        why: "퀘스트와 튜토리얼이 전투·채집·제작 시스템의 내부 상태를 직접 조회하면 새로운 목표를 추가할 때 생산 시스템까지 수정해야 합니다. 같은 행동을 여러 진행 콘텐츠가 관찰할수록 의존 관계가 복잡해지고, 완료 조건을 재사용하기도 어려워집니다.",
        how: "몬스터 처치, 아이템 획득, 제작 완료처럼 의미 있는 플레이 결과를 공통 이벤트로 발행했습니다. 퀘스트와 튜토리얼은 필요한 사건만 구독해 자신의 조건과 비교하고 진행도를 갱신합니다. 변하지 않는 목표 정의와 플레이어별 진행 상태를 분리해 동일한 조건을 재사용하고 저장·복원 흐름에도 연결했습니다.",
        video: {
          src: "assets/videos/03-quest-tutorial-events.mp4",
          title: "이벤트 기반 퀘스트·튜토리얼 결과 영상",
        },
      },
      {
        title: "Unity 메인 스레드와 지연 데이터 조립",
        summary: "네트워크 수신과 화면 반영 시점을 분리해 씬 로딩 순서와 Unity 스레드 제약을 안전하게 처리합니다.",
        emphasis: ["네트워크 응답", "메인 스레드 작업 큐", "수신 시점과 표현 시점"],
        why: "네트워크 응답은 씬과 게임 오브젝트가 준비되기 전에 도착할 수 있으며, 수신 스레드에서는 Unity API를 안전하게 사용할 수 없습니다. 도착 즉시 캐릭터나 UI를 생성하면 로딩 순서에 따라 참조가 누락되거나 같은 데이터를 두 번 반영하는 문제가 생길 수 있습니다.",
        how: "수신 단계에서는 패킷 해석과 순수 데이터 보관까지만 수행하고, 오브젝트 생성과 UI 갱신은 메인 스레드 작업 큐로 전달했습니다. 씬과 필수 객체의 준비 상태를 확인한 뒤 보관된 데이터를 정해진 순서로 조립합니다. 수신 시점과 표현 시점을 분리해 네트워크 속도와 로딩 순서가 달라도 같은 결과를 만들도록 했습니다.",
        video: {
          src: "assets/videos/04-login-world-assembly.mp4",
          title: "Unity 메인 스레드와 지연 데이터 조립 결과 영상",
        },
      },
      {
        title: "맵 단위 멀티플레이 동기화",
        summary: "사용자를 맵 컨텍스트로 구분하고 필요한 대상에게만 입장·이동·퇴장 상태를 전달합니다.",
        emphasis: ["맵 컨텍스트", "갱신 책임", "입장 시 현재 월드 상태", "수명주기"],
        why: "서로 다른 지역의 상태까지 모든 사용자에게 전송하면 불필요한 트래픽과 객체 관리 비용이 커집니다. 또한 로컬 객체와 원격 객체의 갱신 책임이 구분되지 않으면 하나의 상태를 여러 클라이언트가 동시에 변경해 위치나 행동이 충돌할 수 있습니다.",
        how: "접속 세션을 맵 컨텍스트에 등록하고 같은 맵에 있는 사용자에게만 상태 변화를 전달했습니다. 입장 시 현재 월드 상태를 구성하고, 이후 이동과 행동을 갱신하며, 퇴장 시 원격 객체를 정리하는 수명주기를 분리했습니다. 어떤 상태를 누가 결정하고 전달하는지도 명시해 중복 갱신을 줄였습니다.",
        video: {
          src: "assets/videos/05-map-multiplayer-boundary.mp4",
          title: "맵 단위 멀티플레이 동기화 결과 영상",
        },
      },
      {
        title: "IOCP 비동기 세션과 패킷 수명주기",
        summary: "비동기 작업의 메모리 수명과 TCP 패킷 경계를 관리해 안정적인 다중 접속 통신을 구성합니다.",
        emphasis: ["소유권", "누적 버퍼", "헤더와 길이", "송신은 큐"],
        why: "비동기 I/O가 완료되기 전에 세션이나 버퍼가 해제되면 완료 통지에서 이미 사라진 메모리에 접근하게 됩니다. TCP는 연속된 바이트 스트림이므로 하나의 패킷이 나뉘거나 여러 패킷이 합쳐져 도착할 수 있어, 수신 횟수와 메시지 개수를 동일하게 볼 수 없습니다.",
        how: "세션·비동기 작업·송수신 버퍼의 소유권을 구분하고 완료 통지를 처리할 때까지 필요한 객체의 수명을 유지했습니다. 수신 바이트는 누적 버퍼에 보관한 뒤 헤더와 길이를 기준으로 완전한 패킷만 분리합니다. 송신은 큐에서 순서대로 처리해 겹친 요청을 직렬화하고, 연결 종료 시 남은 작업과 자원을 정리하는 흐름도 함께 관리했습니다.",
      },
      {
        title: "재접속 가능한 게임 상태 영속화",
        summary: "캐릭터·인벤토리·퀘스트 상태를 관계형 데이터로 저장하고 다음 접속에서 일관되게 복원합니다.",
        emphasis: ["관계형 구조", "연결 기준", "저장 형식", "복원"],
        why: "온라인 RPG의 맵·위치·스탯·인벤토리·퀘스트는 클라이언트가 종료되어도 다음 접속에서 이어져야 합니다. 서로 연결된 상태를 한 번에 다루지 않으면 일부 데이터만 저장되거나 잘못된 순서로 복원되어 플레이 상태가 불일치할 수 있습니다.",
        how: "계정, 캐릭터, 보유 아이템과 진행 정보를 관계형 구조로 나누고 연결 기준을 명확히 했습니다. 로그인 시 기본 캐릭터 정보부터 연관된 플레이 데이터까지 순서대로 읽어 런타임 상태를 구성합니다. 맵 변경과 연결 종료 시에는 현재 상태를 저장 형식으로 변환해 반영하고, 다음 접속에서 동일한 흐름으로 복원되도록 연결했습니다.",
        video: {
          src: "assets/videos/07-relogin-persistence.mp4",
          title: "재접속 가능한 게임 상태 영속화 결과 영상",
        },
      },
    ],
    troubleshooting: [
      {
        title: "싱글톤 매니저의 초기화 순서와 씬 수명 분리",
        summary: "인스턴스 등록과 실제 초기화를 나누고, 서비스·인게임 초기화 순서를 우선순위로 관리했습니다.",
        emphasis: ["인스턴스 등록", "우선순위", "초기화 단계", "씬 수명", "중복 인스턴스"],
        problem: "매니저의 생성 순서만으로는 초기화 완료를 보장할 수 없었습니다. 로그인 서비스와 인게임 객체의 씬 수명이 달라, 준비되지 않은 참조를 사용하는 위험이 있었습니다.",
        solution: "인스턴스 등록과 초기화를 분리하고 우선순위로 실행 순서를 정했습니다. 서비스는 먼저, 인게임 매니저는 월드 조립 후 준비하며 중복 인스턴스와 파괴된 참조를 정리했습니다.",
      },
      {
        title: "싱글톤 공통 베이스로 서로 다른 매니저 묶기",
        summary: "타입별 인스턴스 접근은 유지하면서 비제네릭 공통 계약으로 매니저들을 함께 관리했습니다.",
        emphasis: ["제네릭", "공통 베이스", "공통 계약", "타입별 접근", "초기화 정책"],
        problem: "서로 다른 제네릭 싱글톤을 하나의 목록으로 초기화하기 어려웠습니다. 매니저를 개별적으로 나열하면 종류가 늘 때마다 초기화 정책까지 수정해야 했습니다.",
        solution: "비제네릭 공통 베이스에 초기화 계약을 두었습니다. 관리자는 공통 계약으로 등록·초기화하고, 제네릭 베이스는 타입별 접근과 인스턴스 수명을 담당하도록 나눴습니다.",
      },
      {
        title: "맵 전환 후 이전 월드 상태가 남는 문제",
        summary: "맵 이동 시 서버 세션·월드 오브젝트·전투 UI를 하나의 흐름으로 초기화했습니다.",
        emphasis: ["상태 전환 절차", "서버 세션", "캐릭터 컨트롤러", "월드 오브젝트·전투 버퍼·타겟 UI"],
        problem: "맵 이동 후 이전 월드 오브젝트·전투 버퍼·타겟 UI가 남았습니다. 서버 세션의 맵 소속과 캐릭터 컨트롤러의 위치 보정도 새 월드 구성과 충돌했습니다.",
        solution: "맵 이동을 상태 전환 절차로 묶었습니다. 이전 맵 소속과 화면 상태를 정리한 뒤 새 월드를 조립하고, 좌표 적용 중에는 캐릭터 컨트롤러를 잠시 비활성화했습니다.",
      },
      {
        title: "몬스터 리필 시 중복 생성과 지형 이탈",
        summary: "서버 기준 리필과 증분 전송으로 중복 생성과 지형 이탈 스폰을 줄였습니다.",
        emphasis: ["서버", "인스턴스 ID", "새로 추가된 몬스터", "지면을 탐색"],
        problem: "클라이언트별 리젠 판단과 전체 목록 재전송으로 몬스터가 중복 생성됐습니다. 무작위 좌표는 경사진 지형의 높이에 맞지 않게 몬스터 스폰 위치가 설정되었습니다.",
        solution: "서버가 부족한 수량만 보충하고 새로 추가된 몬스터만 전송했습니다. 클라이언트는 인스턴스 ID로 중복을 거르고, 지면을 탐색해 스폰 높이를 보정했습니다.",
      },
      {
        title: "몬스터 제어권과 사망 요청 충돌",
        summary: "몬스터 제어권과 사망 요청을 검증해 클라이언트 간 상태 충돌을 막았습니다.",
        emphasis: ["제어권", "소유자", "보간", "사망 중복 방지", "회전 보정값"],
        problem: "여러 클라이언트가 같은 몬스터를 제어해 위치와 공격 대상이 엇갈렸습니다. 중복 사망 요청과 모델별 정면 축 차이도 상태 불일치를 만들었습니다.",
        solution: "한 소유자에게 제어권을 주고 나머지는 보간으로 표현했습니다. 서버의 소유자 검증과 사망 중복 방지로 요청을 제한하고, 모델 차이는 회전 보정값으로 처리했습니다.",
      },
      {
        title: "Animator 상태 증가와 클립 교체의 분리",
        summary: "공통 상태 전이는 유지하고 Animator Override로 상황별 클립만 교체했습니다.",
        emphasis: ["공통 상태 전이", "Animator Override", "키 클립", "애니메이션 세트", "재생 속도", "개체별"],
        problem: "공격·피격마다 Animator 상태를 늘리면 공통 상태 전이까지 반복됐습니다. 같은 행동에서도 클립과 재생 속도는 달라야 했습니다.",
        solution: "개체별 Animator Override로 키 클립만 교체했습니다. 애니메이션 세트가 상황별 표현을 제공하고, 공통 상태 전이와 공격별 재생 속도는 유지했습니다.",
      },
      {
        title: "맵 전환 후 미니맵 좌표가 어긋나는 문제",
        summary: "맵별 보정 데이터와 이벤트 흐름으로 미니맵을 월드 좌표에 맞췄습니다.",
        emphasis: ["맵 데이터", "변경 이벤트", "보정값 전체", "한 번 더 동기화"],
        problem: "이미지만 교체한 미니맵은 월드 좌표와 맞지 않았습니다. UI가 늦게 준비되면 변경 이벤트를 놓쳐 이전 맵 표시가 남았습니다.",
        solution: "맵 데이터에 이미지와 보정값 전체를 묶고 변경 이벤트로 적용했습니다. UI 시작 시 현재 맵을 한 번 더 동기화해 초기 로딩과 맵 이동을 같은 흐름으로 맞췄습니다.",
      },
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
    title: "Little Survival Planet",
    period: "2026.04.28 - 2026.06.09 / 2인 협업 프로젝트",
    overviewTitle: "상호작용과 제작 루프를 중심으로 구성한 Unity 생존·크래프팅 시스템",
    overview: "플레이어 행동 상태, 아이템 상호작용 판정, 제작 해금, 미션 진행, 결과 UI, 랜덤 스폰과 사운드·UI 피드백을 연결해 짧은 플레이 루프가 끝까지 진행되도록 구현한 협업 프로젝트입니다.",
    motivationTitle: "기획부터 플레이 피드백 기반 밸런싱까지 완성한 개발 루프",
    motivation: "기획 단계에서 생존·크래프팅 플레이 흐름을 구성하고, 상호작용·제작·플레이어 상태·미션·월드 스폰·UI 피드백을 실제 게임으로 구현했습니다. 이후 약 20~25명의 플레이어에게 받은 피드백을 바탕으로 자원 획득 속도, 제작 조건과 행동 흐름을 조정하며 밸런싱을 진행했습니다. 이를 통해 기획, 제작, 테스트, 밸런싱과 완성까지 게임 개발의 전체 루프를 경험했습니다.",
    info: [
      ["개발 기간", "2026.04.28 - 2026.06.09"],
      ["구성", "협업 프로젝트 (소프트웨어 2명)"],
      ["담당 작업", "상호작용·제작, 플레이어 상태, 미션·결과 UI, 자원 스폰"],
      ["엔진", "Unity 2022.3.62f3"],
      ["클라이언트", "C#"],
    ],
    principles: [
      ["상태 중심 행동 분리", "이동·낚시·벌목·섭취·요리·수리의 입력, 진행 시간, 애니메이션과 사운드 수명주기를 행동 상태별로 분리했습니다."],
      ["아이템·대상 조합 판정", "현재 아이템의 종류와 상호작용 대상을 함께 확인해 가능한 행동을 한곳에서 일관되게 판정했습니다."],
      ["순서 독립 제작 레시피", "재료를 선택한 순서가 달라도 같은 조합으로 인식하도록 제작 규칙을 구성했습니다."],
      ["제작 결과와 기능 해금 연결", "제작 성공을 낚시 해금, 벌목 효율 개선, 도구 생성처럼 실제 플레이 규칙의 변화로 연결했습니다."],
      ["미션 정의와 진행 상태 분리", "미션 정의 데이터와 플레이 중의 완료 상태를 분리해 슬롯 UI와 결과 화면에서 같은 정보를 재사용했습니다."],
      ["검증 기반 월드 스폰", "지형 판정, 오브젝트 겹침 검사와 가중치 선택을 거쳐 자원이 플레이 가능한 공간에 생성되도록 했습니다."],
    ],
    coreFeatures: [
      {
        title: "아이템·대상 기반 상호작용 판정과 제작 흐름",
        summary: "손에 든 아이템과 바라보는 대상의 조합을 판정해 제작과 기능 해금까지 하나의 흐름으로 연결합니다.",
        emphasis: ["아이템", "대상", "공통 판정 흐름", "선택 순서와 관계없이", "기능 해금·미션 진행·사운드·UI 피드백"],
        why: "플레이어가 손에 든 아이템과 바라보는 대상에 따라 낚시, 요리, 불 피우기, 벌목, 로켓 수리와 제작처럼 서로 다른 행동이 실행되어야 합니다. 이 조건이 입력 처리 곳곳에 흩어지면 새로운 상호작용을 추가할 때 기존 규칙과 충돌하기 쉽습니다.",
        how: "현재 아이템의 종류와 대상이 가진 역할을 함께 확인하는 공통 판정 흐름을 구성했습니다. 제작 재료는 선택 순서와 관계없이 같은 조합으로 비교하며, 제작이 끝나면 사용한 아이템을 정리하고 기능 해금·미션 진행·사운드·UI 피드백을 함께 갱신합니다.",
        video: {
          src: "assets/gep/videos/01-interaction-crafting.mp4",
          title: "아이템·대상 기반 상호작용과 제작 흐름 결과 영상",
        },
      },
      {
        title: "상태 머신으로 나눈 플레이어 행동 처리",
        summary: "이동·낚시·벌목·섭취·요리·수리의 입력과 시간, 애니메이션, 사운드 수명주기를 상태별로 관리합니다.",
        emphasis: ["진입·갱신·종료", "이동과 입력", "행동 완료", "반복 사운드와 임시 상태"],
        why: "각 행동은 입력 가능 여부, 소요 시간, 이동 제한, 애니메이션과 사운드 종료 시점이 다릅니다. 이를 하나의 조건문 흐름에 모으면 행동 중 이동이 끼어들거나 종료된 행동의 사운드가 남는 등 상태 충돌이 발생하기 쉽습니다.",
        how: "현재 행동을 진입·갱신·종료 단계가 있는 상태로 나누고, 시간이 필요한 행동에서는 이동과 입력을 조절했습니다. 행동 완료를 아이템 획득·제작·미션 진행으로 연결하고, 종료 단계에서 반복 사운드와 임시 상태를 정리해 다음 행동으로 안정적으로 전환되도록 했습니다.",
        video: {
          src: "assets/gep/videos/02-player-state-actions.mp4",
          title: "플레이어 행동 상태 전환 결과 영상",
        },
      },
      {
        title: "미션 진행과 결과 화면 구성",
        summary: "제작·낚시·벌목 결과를 미션 진행과 클리어 타임이 포함된 결과 화면으로 연결합니다.",
        emphasis: ["정의 데이터", "완료 상태", "미션 진행", "결과 화면"],
        why: "제작, 낚시와 벌목 같은 핵심 행동은 단순히 실행되는 데서 끝나지 않고 플레이 목표와 클리어 결과로 이어져야 합니다. 미션 정의와 화면 표시가 뒤섞이면 결과 UI가 각 게임 기능의 내부 상태를 직접 찾아야 합니다.",
        how: "미션의 식별 정보·유형·설명은 정의 데이터로 관리하고, 플레이 중 완료 상태는 별도로 갱신했습니다. 각 행동이 끝나는 시점에 미션 진행을 알리며, 결과 화면은 미션 목록과 클리어 시간을 읽어 완료 여부를 한 번에 보여주도록 구성했습니다.",
        video: {
          src: "assets/gep/videos/03-mission-result-ui.mp4",
          title: "미션 진행과 결과 화면 결과 영상",
        },
      },
      {
        title: "월드 자원 랜덤 스폰과 배치 안정화",
        summary: "지형·겹침·가중치를 검증해 자원이 플레이 가능한 공간에 안정적으로 생성되게 합니다.",
        emphasis: ["지형과의 실제 접점", "겹치는 위치", "등장 확률", "생성 간격"],
        why: "단순한 무작위 좌표에 자원을 생성하면 지형 밖이나 공중에 배치되거나 기존 오브젝트와 겹칠 수 있습니다. 생존 루프에 필요한 자원이 접근할 수 없는 곳에 생성되면 플레이 진행 자체가 막힙니다.",
        how: "월드 범위에서 후보 위치를 만든 뒤 지형과의 실제 접점을 확인하고, 주변 오브젝트와 겹치는 위치는 제외했습니다. 자원별 등장 확률을 반영해 후보를 선택하며, 현재 생성 수에 따라 생성 간격을 조절해 플레이 가능한 공간에 자원이 지속적으로 공급되도록 했습니다.",
        video: {
          src: "assets/gep/videos/04-world-spawn-stability.mp4",
          title: "월드 자원 랜덤 스폰과 배치 안정화 결과 영상",
        },
      },
    ],
    troubleshooting: [
      {
        title: "행동 중복 입력으로 보상 흐름이 깨지는 문제",
        summary: "시간이 필요한 행동을 잠가 중간 입력과 보상 중복을 함께 차단했습니다.",
        emphasis: ["상태 전환", "상태 잠금", "이동·줍기·버리기 입력", "한 번만 지급"],
        problem: "낚시·벌목·요리·수리 도중 이동이나 다른 상호작용이 들어오면 행동이 완료되기 전에 상태 전환이 발생했습니다. 남아 있던 타이머와 대상 참조가 다음 행동까지 이어지면서 완료 보상이 반복되거나, 이미 사라진 대상을 참조해 흐름이 중단될 가능성이 있었습니다.",
        solution: "시간이 필요한 행동에 상태 잠금을 적용하고, 행동이 끝날 때까지 다른 상태 전환을 거부했습니다. 잠긴 동안에는 이동·줍기·버리기 입력도 처리하지 않으며, 완료 시 보상과 대상 정리를 끝낸 뒤 잠금을 해제했습니다. 그 결과 하나의 행동이 시작부터 종료까지 온전히 실행되고 보상도 한 번만 지급되도록 규칙을 명확히 했습니다.",
      },
      {
        title: "상호작용 대상 오인과 자기 아이템 선택",
        summary: "부채꼴 후보 탐색과 이중 제외 규칙으로 플레이어가 의도한 대상을 찾았습니다.",
        emphasis: ["단일 Raycast", "전방 부채꼴 범위", "가장 가까운 대상", "현재 들고 있는 아이템", "감지 단계와 제작 판정 단계"],
        problem: "초기의 단일 Raycast 판정은 콜라이더 높이나 시선 각도가 조금만 달라도 눈앞의 오브젝트를 놓쳤습니다. 탐색 범위를 넓힌 뒤에는 플레이어 자식으로 붙어 있던 현재 들고 있는 아이템까지 후보가 되어, 자기 자신을 제작 대상으로 판단하는 반대 문제가 나타났습니다.",
        solution: "상호작용 레이어에 속한 오브젝트 중 전방 부채꼴 범위 안의 후보를 모으고, 거리 기준으로 가장 가까운 대상을 선택했습니다. 현재 들고 있는 아이템과 플레이어의 자식 오브젝트는 후보에서 제외했으며, 감지 단계와 제작 판정 단계 양쪽에서 같은 방어 규칙을 적용해 잘못된 대상이 다시 유입되지 않도록 했습니다.",
      },
      {
        title: "재료 순서에 따라 제작 결과가 달라지는 문제",
        summary: "순서 독립 비교 규칙으로 같은 재료 조합이 동일한 레시피가 되게 했습니다.",
        emphasis: ["나무+철광석", "철광석+나무", "순서 독립 비교 규칙", "동일한 해시", "한 번만 등록"],
        problem: "제작 레시피를 두 재료의 순서가 있는 조합으로 저장하자 나무+철광석은 성공하지만 철광석+나무는 실패했습니다. 같은 재료라도 무엇을 먼저 들었는지에 따라 결과가 달라져 플레이어 기대와 맞지 않았고, 반대 순서의 레시피를 매번 중복 등록해야 했습니다.",
        solution: "두 재료의 앞뒤가 바뀌어도 같은 조합으로 판단하는 순서 독립 비교 규칙을 만들었습니다. 비교 결과뿐 아니라 재료 순서와 관계없이 동일한 해시가 생성되도록 맞춰 자료구조의 탐색 규칙도 일관되게 유지했습니다. 각 레시피를 한 번만 등록해도 양방향 조합이 동작하므로 제작 UX와 레시피 확장성을 함께 개선했습니다.",
      },
      {
        title: "랜덤 자원이 지형 밖과 오브젝트 위에 생성되는 문제",
        summary: "지형·겹침·거리 가중치를 검증해 무작위 스폰을 플레이 가능한 범위로 통제했습니다.",
        emphasis: ["무작위 좌표", "지면 검증", "겹침 검사", "거리 기반 가중치", "생성 간격"],
        problem: "철광석과 식물을 무작위 좌표에 바로 생성하자 공중이나 지형 밖에 배치되고, 기존 자원과 겹쳐 줍기 어려운 경우가 생겼습니다. 로켓 근처에 수리 재료가 몰리면 난이도가 지나치게 낮아지고, 반대로 멀리만 생성되면 수집 시간이 길어져 생존 루프의 균형도 흔들렸습니다.",
        solution: "지정된 월드 범위에서 여러 무작위 좌표를 후보로 만든 뒤 아래 방향으로 지면 검증을 수행하고, 주변 자원과의 겹침 검사를 통과한 위치만 남겼습니다. 후보마다 로켓과의 거리에 따른 거리 기반 가중치를 부여해 랜덤성을 유지하면서 난이도를 조절했습니다. 누적 생성량에 따라 생성 간격도 늘려 시간 흐름에 따른 자원 공급 속도를 통제했습니다.",
      },
      {
        title: "양동이 상태와 월드·인벤토리 표시 불일치",
        summary: "하나의 상태 변경에서 데이터·월드 외형·인벤토리 UI를 함께 동기화했습니다.",
        emphasis: ["내부 상태", "월드 머티리얼", "인벤토리 아이콘", "상태 변경 이벤트", "같은 시점"],
        problem: "양동이의 내부 상태는 물이 찬 상태로 바뀌었지만 월드 머티리얼이나 인벤토리 아이콘이 이전 모습을 유지하는 경우가 있었습니다. 실제로는 나무에 물을 줄 수 있는데 화면에는 빈 양동이로 보이거나, 물을 사용한 뒤에도 찬 아이콘이 남아 플레이어가 현재 상태를 잘못 판단할 수 있었습니다.",
        solution: "채우기와 비우기를 하나의 상태 변경 흐름으로 묶어 내부 상태, 월드 머티리얼, 인벤토리 아이콘을 같은 시점에 갱신했습니다. 상태 적용이 끝나면 상태 변경 이벤트를 발행해 인벤토리 UI가 즉시 현재 이미지를 다시 읽도록 했습니다. 게임 규칙과 두 표현 계층이 하나의 상태를 바라보게 만들어 시각 정보와 실제 동작의 불일치를 제거했습니다.",
      },
    ],
    feature: "",
    challenge: "",
    solution: "",
    tags: [],
    notion: "https://app.notion.com/p/3e4e8789789b811d8a95e6cb5a666e91",
    images: [
      { src: "assets/gep/gep-cover.png", alt: "Little Survival Planet 타이틀 화면", label: "TITLE SCREEN", background: "blur" },
      { src: "assets/gep/gep-gameplay.png", alt: "Little Survival Planet 인게임 화면", label: "GAMEPLAY", background: "blur" },
      { src: "assets/gep/gep-tutorial.png", alt: "Little Survival Planet 튜토리얼 화면", label: "TUTORIAL", background: "blur" },
    ],
  },
  "project-3": {
    type: "Sub Project",
    title: "RPG Field Scene",
    period: "2025.03.01 - 2025.12.01 / 개인 프로젝트",
    overviewTitle: "기초 컴퓨터 그래픽스 이론을 실제 렌더링 기능으로 연결한 DirectX11 필드 씬",
    overview: "Rastertek DirectX11 기본 구조를 분석한 뒤 렌더링 파이프라인, Phong 조명, 멀티 텍스처링, 스킨드 메시 애니메이션과 화면 공간 UI를 RPG 필드 장면에 확장·통합한 그래픽스 실습 프로젝트입니다.",
    motivationTitle: "그래픽스 이론과 셰이더 데이터 흐름을 하나의 장면으로 연결",
    motivation: "행렬 변환과 조명 공식을 학습하는 데 그치지 않고, C++에서 구성한 데이터가 HLSL 셰이더와 GPU 렌더링 결과로 이어지는 과정을 직접 확인하기 위해 개발했습니다. 기존 프레임워크의 실행 흐름을 이해하고 필요한 기능을 단계적으로 확장하며 엔진 내부 동작을 익히는 데 집중했습니다.",
    info: [
      ["개발 기간", "2025.03.01 - 2025.12.01"],
      ["구성", "개인 프로젝트"],
      ["기반", "Rastertek DirectX11 튜토리얼"],
      ["언어 / API", "C++, DirectX11, HLSL"],
      ["외부 라이브러리", "Assimp, DDS Texture Loader"],
      ["구현 범위", "렌더링·조명·텍스처·애니메이션·인터랙션·UI"],
    ],
    coreFeatures: [
      {
        title: "렌더링 파이프라인과 WVP 변환",
        summary: "로컬 좌표를 월드·카메라·클립 공간으로 변환해 오브젝트를 화면에 배치합니다.",
        emphasis: ["World·View·Projection", "World Matrix", "View Matrix", "Projection Matrix", "직교 투영"],
        why: "3D 오브젝트를 의도한 위치와 시점으로 화면에 표현하려면 로컬 좌표가 어떤 공간을 거쳐 변환되는지 이해해야 합니다. 변환 책임이 섞이면 오브젝트 이동, 카메라 회전과 화면 투영 중 어느 단계에서 문제가 생겼는지 추적하기 어렵습니다.",
        how: "오브젝트별 World Matrix로 위치·회전·크기를 구성하고, 카메라의 View Matrix와 화면 비율을 반영한 Projection Matrix를 순서대로 셰이더에 전달했습니다. 정점 셰이더에서 World·View·Projection 변환을 적용했으며, 화면 고정 UI에는 별도의 직교 투영을 사용했습니다.",
      },
      {
        title: "Phong 조명과 HLSL 데이터 바인딩",
        summary: "C++의 조명·카메라 데이터를 셰이더에 전달해 표면의 입체감과 재질감을 계산합니다.",
        emphasis: ["Ambient·Diffuse·Specular", "상수 버퍼", "법선·빛·시선 방향", "텍스처 색상"],
        why: "조명은 단순히 물체를 밝게 만드는 효과가 아니라 표면 법선, 빛 방향과 시선 방향의 관계를 계산해 형태와 재질을 드러내는 과정입니다. CPU 데이터와 셰이더 계산이 분리되어 있어 두 단계의 계약을 함께 이해해야 했습니다.",
        how: "C++에서 행렬, 카메라 위치와 광원 정보를 상수 버퍼로 구성하고 HLSL에 바인딩했습니다. 픽셀 셰이더에서는 법선·빛·시선 방향을 사용해 Ambient·Diffuse·Specular 항을 계산하고 텍스처 색상과 합성했습니다. 노멀맵을 사용할 때는 접선 공간을 구성해 표면 법선을 보정했습니다.",
        media: {
          type: "image",
          src: "assets/rpg-field/phong-lighting.png",
          title: "Phong 조명 결과 사진",
          alt: "여러 광원으로 나무와 건물, 가로등의 명암을 표현한 RPG Field Scene",
        },
      },
      {
        title: "멀티 텍스처링과 환경 표현",
        summary: "Diffuse·Normal·Cube Map을 목적별로 샘플링해 표면과 주변 환경을 함께 표현합니다.",
        emphasis: ["Diffuse Map", "Normal Map", "Cube Map", "텍스처 슬롯", "TextureCube"],
        why: "하나의 텍스처만으로는 표면의 색상, 미세 굴곡과 주변 환경을 모두 표현하기 어렵습니다. 각 텍스처가 어떤 정보를 담고 셰이더의 어느 계산에 쓰이는지 구분할 필요가 있었습니다.",
        how: "Diffuse Map은 기본 색상, Normal Map은 조명 계산용 표면 방향, Cube Map은 스카이박스의 환경 정보로 사용했습니다. 여러 텍스처를 정해진 텍스처 슬롯에 바인딩하고 같은 렌더 패스에서 샘플링했으며, 큐브맵은 방향 벡터를 사용하는 TextureCube 방식으로 처리했습니다.",
        media: {
          type: "image",
          src: "assets/rpg-field/multi-texturing.png",
          title: "멀티 텍스처링 결과 사진",
          alt: "두 텍스처를 조합해 지형 표면을 표현한 멀티 텍스처링 결과",
        },
      },
      {
        title: "스킨드 메시 애니메이션과 인터랙션",
        summary: "모델의 본 계층과 키프레임을 계산하고 레이 판정 결과를 장면 반응으로 연결합니다.",
        emphasis: ["Assimp", "본 계층·키프레임·가중치", "최종 본 행렬", "레이와 AABB", "시각적 피드백"],
        why: "필드 캐릭터가 자연스럽게 움직이려면 정적 메시만 출력하는 것을 넘어 모델 파일의 본 계층과 시간별 키프레임을 해석해야 합니다. 사용자 입력 역시 화면 좌표에서 실제 월드 오브젝트까지 연결되어야 게임 장면의 상호작용으로 기능합니다.",
        how: "Assimp로 메시·재질·본 계층·키프레임·가중치를 읽고 시간에 따라 최종 본 행렬을 계산해 셰이더에 전달했습니다. 화면 좌표에서는 월드 공간 레이를 만들고 오브젝트의 AABB와 교차 여부를 판정했으며, 선택 결과를 조명 색 변화 같은 시각적 피드백으로 연결했습니다.",
        media: {
          type: "video",
          src: "assets/rpg-field/interaction-animation.mp4",
          title: "스킨드 메시 애니메이션과 인터랙션 결과 영상",
        },
      },
      {
        title: "데이터 기반 반복 오브젝트 인스턴스 배치",
        summary: "동일한 나무 모델을 위치 데이터로 반복 생성하고 인스턴스별 변환을 일괄 관리합니다.",
        emphasis: ["위치 목록", "동일한 모델 리소스", "개별 인스턴스", "월드 행렬", "공통 렌더 루프"],
        why: "필드에는 같은 종류의 나무처럼 반복되는 오브젝트가 많이 필요합니다. 오브젝트마다 생성과 렌더링 코드를 따로 작성하면 배치 수가 늘어날수록 중복 코드가 커지고, 위치를 수정하거나 개수를 확장하기도 어려워집니다.",
        how: "나무가 배치될 좌표를 위치 목록으로 분리하고, 목록을 순회하며 동일한 모델 리소스를 사용하는 개별 인스턴스를 생성했습니다. 각 인스턴스에는 자신의 위치만 보관하고 하나의 컨테이너에서 관리합니다. 렌더링 단계에서는 공통 렌더 루프가 인스턴스별 위치로 월드 행렬을 구성해 같은 모델을 여러 장소에 배치하도록 만들었습니다.",
        media: {
          type: "image",
          src: "assets/rpg-field/instancing.png",
          title: "반복 오브젝트 배치 결과 사진",
          alt: "동일한 나무 모델을 여러 위치에 반복 배치한 RPG Field Scene 결과",
        },
      },
    ],
    troubleshooting: [
      {
        title: "월드 행렬 누적으로 공전 궤도와 위치가 틀어지는 문제",
        summary: "이전 프레임의 변환을 계속 곱하지 않고 위치와 회전을 분리해 매 프레임 행렬을 다시 구성했습니다.",
        emphasis: ["World Matrix", "변환 누적", "위치 좌표", "회전·이동", "행렬 재구성"],
        problem: "오브젝트를 공전시키기 위해 기존 World Matrix에 회전과 이동 행렬을 계속 곱하자 변환 누적이 발생했습니다. 프레임이 지날수록 행렬곱의 영향이 겹치면서 오브젝트가 의도한 궤도와 위치를 벗어났고, 배치 정보와 애니메이션용 변환을 하나의 행렬에서 함께 관리한 것이 원인이었습니다.",
        solution: "오브젝트의 고정 위치 좌표를 기존 행렬에서 분리해 보관하고, 갱신 시점마다 필요한 회전·이동을 계산한 뒤 새로운 World Matrix로 덮어쓰도록 변경했습니다. 이전 프레임의 행렬에 다시 곱하지 않고 위치와 동작 변환을 기준값에서 재구성해 누적 오차를 막고 원하는 공전 궤도를 유지했습니다.",
      },
      {
        title: "공통 멀티 텍스처 셰이더의 혼합과 빈 슬롯 처리",
        summary: "텍스처 혼합 기준을 정하고 사용하지 않는 슬롯에도 더미 맵을 바인딩해 셰이더 입력 계약을 유지했습니다.",
        emphasis: ["Color Map", "Bump Map", "Lerp", "텍스처 슬롯", "Dummy Map", "HLSL"],
        problem: "Color Map과 Bump Map을 함께 표현할 때 두 텍셀을 단순히 곱할지 보간할지에 따라 지형 색상이 크게 달라졌습니다. 또한 같은 HLSL 경로를 사용하는 오브젝트 중 일부는 멀티 텍스처를 사용하지 않아 필요한 텍스처 슬롯이 비었고, 오브젝트마다 다른 바인딩 흐름을 만들면 렌더링 분기가 복잡해지는 문제가 있었습니다.",
        solution: "두 표면 정보를 자연스럽게 섞을 수 있도록 Lerp 기반 혼합을 선택하고, 멀티 텍스처를 사용하지 않는 오브젝트에는 Dummy Map을 바인딩했습니다. 모든 오브젝트가 동일한 텍스처 슬롯 계약을 유지한 상태에서 HLSL이 실제 사용 여부만 제어하도록 구성해 렌더링 흐름을 단순화했습니다.",
      },
      {
        title: "FBX 본 데이터로 인해 애니메이션 메시가 뒤틀리는 문제",
        summary: "가져온 본 계층을 로그로 추적해 불필요한 본 정보를 제외하고 최종 본 행렬을 안정화했습니다.",
        emphasis: ["FBX", "Assimp", "본 계층", "가져오기 로그", "불필요한 본 정보", "최종 본 행렬"],
        problem: "FBX 애니메이션은 정상적으로 재생됐지만 인게임에서 캐릭터 메시가 꼬이거나 관절이 비정상적으로 늘어나는 현상이 발생했습니다. 애니메이션 계산식만 확인해서는 원인을 찾기 어려웠고, Assimp가 읽은 FBX 내부 본 계층에 실제 스키닝에 필요하지 않은 보조 정보가 함께 포함되어 최종 본 행렬에 영향을 주고 있었습니다.",
        solution: "가져오기 과정에서 본 이름과 계층 구조를 로그로 출력해 원본 FBX와 비교하고, 스키닝에 사용되지 않는 불필요한 본 정보를 식별했습니다. 해당 정보를 애니메이션 계층 구성에서 제외한 뒤 유효한 부모·자식 관계와 가중치만으로 최종 본 행렬을 계산하도록 수정해 메시 왜곡을 제거했습니다.",
      },
      {
        title: "애니메이션 구조와 기존 렌더링 장치 관리의 충돌",
        summary: "새 프레임워크를 그대로 병합하지 않고 장치 소유권과 생명주기를 기존 구조에 맞게 재정의했습니다.",
        emphasis: ["애니메이션 프레임워크", "장치 소유권", "초기화 순서", "단일 접근 지점", "기존 생명주기"],
        problem: "외부 애니메이션 프레임워크의 내부 구조를 기존 프로젝트에 옮기는 과정에서 렌더링 장치, 카메라와 입력 관리 방식이 서로 달랐습니다. 양쪽 구조를 그대로 유지하면 장치와 컨텍스트의 소유자가 중복되고 초기화·해제 순서가 불명확해져, 애니메이션만 추가하려던 변경이 전체 프레임워크의 생명주기 문제로 번질 수 있었습니다.",
        solution: "새 구조 전체를 복사하는 대신 애니메이션에 필요한 데이터 처리만 기존 프레임워크에 맞춰 이식했습니다. 이미 사용 중인 카메라와 입력 관리 흐름은 유지하고, 렌더링 장치는 하나의 접근 지점에서 소유하도록 정리해 중복 생성을 제거했습니다. 덕분에 기존 갱신·렌더링 순서를 유지하면서 스킨드 메시 기능을 연결했습니다.",
      },
      {
        title: "카메라를 바라보는 빌보드 변환 실패 (미해결)",
        summary: "카메라 정렬 방식과 필요한 구조 변경까지 분석했지만 기존 변환 책임을 분리하지 못해 구현을 완료하지 못했습니다.",
        emphasis: ["Billboard", "카메라 방향", "World Matrix", "행렬곱 순서", "위치·회전·크기 분리", "미해결"],
        problem: "2D 이미지를 3D 공간에 배치한 뒤 항상 카메라를 바라보게 만들려고 했지만, 모델이 이미 고유한 World Matrix에 배치와 회전 상태를 함께 보관하고 있었습니다. 여기에 카메라 방향 회전을 추가하면 행렬곱 순서에 따라 기존 배치가 틀어지거나 행렬이 꼬였고, 카메라 이동과 회전을 모두 따라가는 안정적인 Billboard를 만들지 못했습니다.",
        solutionLabel: "해결 시도와 남은 과제",
        solution: "기존 World Matrix를 계속 수정하는 대신 위치·회전·크기를 별도 값으로 관리하고, 매 프레임 카메라 방향으로 회전 행렬을 만든 뒤 변환 순서에 맞게 새 행렬을 구성하는 방식을 검토했습니다. 화면 고정 배경은 직교 투영 방식으로 우회했지만, 당시에는 기존 모델 구조를 재설계할 시간과 이해가 부족해 3D Billboard 기능은 최종적으로 구현하지 못했습니다. 후속 구현에서는 변환 책임을 분리하고 카메라의 역 View 방향을 기준으로 회전을 재구성하는 것이 남은 과제입니다.",
      },
    ],
    feature: "",
    challenge: "",
    solution: "",
    tags: [],
    notion: "https://app.notion.com/p/3e8e8789789b817c987ccd7dff729e0d",
    images: [
      { src: "assets/rpg-field-scene-01.png", alt: "RPG Field Scene 조작 안내 화면", label: "SCENE GUIDE", background: "blur" },
      { src: "assets/rpg-field-scene-02.png", alt: "RPG Field Scene 모닥불 상호작용 화면", label: "INTERACTION", background: "blur" },
      { src: "assets/rpg-field-scene-03.png", alt: "RPG Field Scene 필드 렌더링 화면", label: "FIELD RENDERING", background: "blur" },
    ],
  },
  "project-4": {
    type: "Other Sub Projects",
    title: "Side Projects",
    period: "",
    tags: [],
    images: [],
    otherProjects: [
      {
        eyebrow: "개인 프로젝트",
        title: "Server Racing",
        genre: "4P 2D Racing Game",
        summary: "서버 기초 이론과 EventAsyncSelected 모델을 사용하여 만들었습니다.",
        image: "assets/side-project-server-racing.png",
        alt: "Server Racing 로고",
        screenshots: [
          { src: "assets/side-project-server-racing-01.png", alt: "Server Racing 서버와 클라이언트 실행 화면" },
          { src: "assets/side-project-server-racing-02.png", alt: "Server Racing 트랙 주행 화면" },
        ],
        info: [["개발 기간", "2025.03 - 2025.06"], ["구성", "개인 프로젝트"], ["엔진/언어", "Unity, C#, C++"]],
        features: [
          {
            title: "패킷 교환 & 파싱",
            media: {
              type: "image",
              src: "assets/server-racing-packet-flow.png",
              alt: "Server Racing 패킷 교환과 파싱 구조 다이어그램",
              zoomable: true,
            },
          },
          {
            title: "위치 동기화",
            media: {
              type: "video",
              src: "assets/videos/server-racing-position-sync.mp4",
              alt: "두 플레이어의 위치가 동기화되는 Server Racing 실행 화면",
            },
          },
        ],
        tech: [],
      },
      {
        eyebrow: "팀 프로젝트",
        title: "Lone Lantern",
        genre: "2D Puzzle Adventure",
        summary: "팀 단위 개발의 첫 완성형 게임으로 다른 게임 분야 역할군과의 협업 경험을 쌓았습니다.",
        image: "assets/side-project-lone-lantern.png",
        alt: "Lone Lantern 로고",
        screenshots: [
          { src: "assets/side-project-lone-lantern-01.png", alt: "Lone Lantern 타이틀 화면" },
          { src: "assets/side-project-lone-lantern-02.png", alt: "Lone Lantern 인게임 화면" },
        ],
        info: [["개발 기간", "2024.03 - 2024.12"], ["구성", "프로그래머 2명, 디자이너 3명, 기획자 1명"], ["엔진/언어", "Unity, C#"]],
        features: [
          {
            title: "Inventory & Item",
            media: { type: "video", src: "assets/videos/lone-lantern-inventory-item.mp4" },
          },
          {
            title: "Lantern System",
            media: { type: "video", src: "assets/videos/lone-lantern-lantern-system.mp4" },
          },
          {
            title: "Dialogue",
            media: { type: "video", src: "assets/videos/lone-lantern-dialogue.mp4" },
          },
        ],
        tech: [],
      },
      {
        eyebrow: "팀 프로젝트",
        title: "홍캠몬스터",
        genre: "2D Mini-game Collection",
        summary: "유니티를 사용하여 만든 첫 게임으로 유니티 툴의 기초를 배울 수 있었습니다.",
        image: "assets/side-project-school-monster.png",
        alt: "홍캠몬스터 로고",
        screenshots: [
          { src: "assets/side-project-school-monster-01.png", alt: "홍캠몬스터 타이틀 화면" },
          { src: "assets/side-project-school-monster-02.png", alt: "홍캠몬스터 뼈 배치 미니게임 화면" },
        ],
        info: [["개발 기간", "2021.03 - 2021.12"], ["구성", "프로그래머 3명, 디자이너 3명"], ["엔진/언어", "Unity, C#"]],
        features: [
          {
            title: "Drag & Drop",
            media: { type: "video", src: "assets/videos/school-monster-drag-drop.mp4" },
          },
        ],
        tech: [],
      },
    ],
  },
};

const everwindDesignDocument = {
  kicker: "EVERWIND / 상세 설계 기록",
  title: "확장되는 RPG를 지탱하는 책임과 데이터의 경계",
  summary: "기능을 많이 붙이는 것보다, 콘텐츠가 늘어날 때 무엇이 바뀌고 무엇은 유지되어야 하는지를 먼저 설계했습니다. 아래 문서는 Unity 클라이언트, C++ IOCP 서버, MariaDB의 기능별 구현과 전체 흐름을 책임 관계 중심으로 설명합니다.",
  keywords: ["확장성", "상태 패턴", "이벤트 기반", "스레드 경계", "맵 컨텍스트", "비동기 수명주기", "영속화"],
  systemFlow: ["Unity Client", "TCP Binary Protocol", "C++ IOCP Server", "Queries", "MariaDB"],
  coreFeatures: [
    {
      title: "데이터 중심 RPG 콘텐츠 확장",
      intent: "새 콘텐츠를 추가하는 작업이 기존 시스템을 수정하는 작업으로 번지지 않게 한다.",
      keywords: ["정의/상태 분리", "공통 계약", "다형성", "데이터 에셋"],
      problem: "스킬·아이템·퀘스트의 정의와 플레이 중 상태가 섞이면 유형별 예외가 관리자에 누적되고, 콘텐츠 하나를 추가할 때 실행 로직·UI·저장 구조를 함께 건드리게 됩니다.",
      decisions: [
        ["정의 데이터", "아이템·레시피·퀘스트의 변하지 않는 규칙은 ScriptableObject로 공유했습니다."],
        ["실행 상태", "수량·쿨다운·장착·진행도는 런타임 객체와 DB 상태로 분리했습니다."],
        ["확장 지점", "공통 수명주기는 계약으로 고정하고 효과·공격 방식·조건 판정만 파생 구현으로 열었습니다."],
      ],
      result: "아이템 12종과 제작 레시피 8종이 같은 데이터·실행 경로를 사용하며, 새 스킬과 퀘스트는 정의 데이터와 유형별 동작을 추가하는 방식으로 확장됩니다.",
      tradeoff: "상속은 초기 확장 지점을 명확히 하지만 조합 축이 늘면 타입 수도 증가합니다. 효과·타깃·비용·조건을 전략 객체로 분리하는 것이 다음 단계입니다.",
      diagram: {
        title: "콘텐츠 정의와 실행 책임 UML",
        groups: [
          { title: "Definition", nodes: ["InventoryItem", "CraftItemRecipe", "Quest"] },
          { title: "Runtime", nodes: ["ItemMediator", "CombatManager", "QuestManager"] },
          { title: "Variant", nodes: ["ConsumeItem", "EquipmentItem", "NormalSkill", "SmashSkill", "Windmill"] },
        ],
        relations: [
          ["ConsumeItem", "inheritance", "InventoryItem", "유형 확장"],
          ["EquipmentItem", "inheritance", "InventoryItem", "유형 확장"],
          ["CombatManager", "aggregation", "Skill", "실행 관리"],
          ["QuestManager", "aggregation", "Quest", "진행 상태"],
          ["CraftItemRecipe", "dependency", "InventoryItem", "재료·결과 정의"],
        ],
      },
    },
    {
      title: "상태 머신 기반 전투 흐름",
      intent: "행동 충돌을 조건문으로 막지 않고, 허용 가능한 상태 전환으로 제한한다.",
      keywords: ["진입/갱신/종료", "전환 규칙", "판정/표현 분리", "인터럽트"],
      problem: "이동·추적·공격·피격·사망을 한 갱신 흐름에서 처리하면 여러 조건이 동시에 참이 되고, 애니메이션과 실제 판정 시점도 쉽게 어긋납니다.",
      decisions: [
        ["상태 수명주기", "모든 행동을 진입·갱신·종료 단계로 통일해 정리 시점을 보장했습니다."],
        ["전환 책임", "PlayerStateContexter가 현재 상태와 우선순위를 관리하고 상태는 자신의 규칙만 담당합니다."],
        ["판정 시점", "CombatManager의 전투 판단과 Animation Event의 유효 프레임을 연결했습니다."],
      ],
      result: "타깃 접근부터 공격·피격·사망까지 전환 경로가 명시되어, 새 행동을 추가해도 Player의 조건문이 연쇄적으로 증가하지 않습니다.",
      tradeoff: "상태 수가 늘수록 전환표와 인터럽트 우선순위를 함께 관리해야 합니다. 디버그 로그와 상태 전이 시각화가 보완 지점입니다.",
      diagram: {
        title: "플레이어 행동 상태 UML",
        groups: [
          { title: "Context", nodes: ["Player", "PlayerStateContexter", "CombatManager", "AnimationContexter"] },
          { title: "State Contract", nodes: ["IState"] },
          { title: "Concrete State", nodes: ["IdleState", "MoveState", "CombatRunState", "AttackState", "DamagedState", "DeadState"] },
        ],
        relations: [
          ["Player", "composition", "PlayerStateContexter", "행동 소유"],
          ["Player", "composition", "CombatManager", "전투 판단"],
          ["PlayerStateContexter", "aggregation", "IState", "현재 상태"],
          ["AttackState", "implementation", "IState", "상태 계약"],
          ["AttackState", "dependency", "CombatManager", "판정 요청"],
          ["PlayerStateContexter", "dependency", "AnimationContexter", "표현 명령"],
        ],
      },
    },
    {
      title: "이벤트 기반 퀘스트·튜토리얼",
      intent: "게임플레이 시스템은 사건만 알리고, 진행 콘텐츠가 그 의미를 해석하게 한다.",
      keywords: ["도메인 이벤트", "생산자/소비자 분리", "진행 상태", "재사용"],
      problem: "퀘스트가 전투·채집·제작 시스템을 직접 조회하면 새 목표를 추가할 때 생산 시스템과 진행 시스템을 함께 수정해야 합니다.",
      decisions: [
        ["사건 발행", "처치·획득·채집·제작·상호작용을 공통 PlayEvents로 발행했습니다."],
        ["조건 해석", "QuestRequirement가 목표 정의를, QuestProgressData가 플레이어별 현재 수치를 담당합니다."],
        ["다중 소비", "QuestManager와 현재 활성화된 튜토리얼 단계가 같은 사건을 각자의 규칙으로 소비합니다."],
      ],
      result: "전투와 제작 코드는 퀘스트 존재를 알지 않고, 기존 사건 범위의 새 콘텐츠는 생산 시스템 수정 없이 정의 데이터로 추가됩니다.",
      tradeoff: "결합도는 낮아졌지만 실행 흐름과 구독 해제를 추적하기 어려워집니다. 타입 안전 이벤트와 구독 수명주기 검증이 필요합니다.",
      diagram: {
        title: "게임 사건 전달 UML",
        groups: [
          { title: "Producer", nodes: ["Enemy", "FieldItem", "CraftUI"] },
          { title: "Event Hub", nodes: ["PlayEvents"] },
          { title: "Consumer", nodes: ["QuestManager", "TutorialGuide", "CraftStep", "QuestUI"] },
          { title: "Progress", nodes: ["Quest", "QuestRequirement", "QuestProgressData"] },
        ],
        relations: [
          ["Enemy", "event", "PlayEvents", "처치"],
          ["FieldItem", "event", "PlayEvents", "획득"],
          ["CraftUI", "event", "PlayEvents", "제작"],
          ["PlayEvents", "event", "QuestManager", "진행 갱신"],
          ["PlayEvents", "event", "CraftStep", "제작 완료 구독"],
          ["CraftStep", "dependency", "TutorialGuide", "단계 전환 요청"],
          ["QuestManager", "aggregation", "QuestProgressData", "플레이어 상태"],
        ],
      },
    },
    {
      title: "Unity 메인 스레드와 지연 데이터 조립",
      intent: "데이터가 도착한 시점과 Unity 오브젝트를 만들 수 있는 시점을 분리한다.",
      keywords: ["스레드 경계", "작업 큐", "DataCenter", "초기화 순서"],
      problem: "소켓 응답은 씬과 GameObject가 준비되기 전에 도착할 수 있고, 수신 스레드에서 Unity API를 직접 호출하면 엔진의 스레드 제약을 위반합니다.",
      decisions: [
        ["수신 스레드", "바이트 수신·패킷 분리·해석 후 메인 스레드 작업을 등록합니다."],
        ["메인 스레드", "GameObject 생성, Transform, UI, 애니메이션 변경은 Dispatcher 작업 큐에서 실행합니다."],
        ["지연 조립", "DataCenter에 상태를 보관하고 SceneLoader와 WorldLoader가 준비된 뒤 순서대로 소비합니다."],
      ],
      result: "로그인 응답의 도착 속도와 씬 로딩 순서가 달라도 사용자·월드·원격 객체를 같은 순서로 구성할 수 있습니다.",
      tradeoff: "데이터 소비 완료와 재접속 중복 반영을 명시적인 상태로 관리해야 하며, 초기화 실패 시 재시도 정책도 필요합니다.",
      diagram: {
        title: "네트워크 수신과 Unity 반영 UML",
        groups: [
          { title: "Receive Thread", nodes: ["NetworkClient", "PacketMethod"] },
          { title: "Boundary", nodes: ["DataCenter", "UnityMainThreadDispatcher"] },
          { title: "Main Thread", nodes: ["SceneLoader", "WorldLoader", "OtherPlayerManager", "EnemySpawner"] },
        ],
        relations: [
          ["NetworkClient", "dependency", "PacketMethod", "역직렬화"],
          ["PacketMethod", "data", "DataCenter", "메인 스레드 작업에서 보관"],
          ["PacketMethod", "event", "UnityMainThreadDispatcher", "작업 등록"],
          ["PacketMethod", "dependency", "SceneLoader", "등록한 작업에서 씬 전환"],
          ["WorldLoader", "dependency", "DataCenter", "준비 후 소비"],
          ["WorldLoader", "dependency", "OtherPlayerManager", "원격 객체 구성"],
        ],
      },
    },
    {
      title: "맵 단위 멀티플레이 동기화",
      intent: "같은 월드를 공유하는 세션만 연결하고 상태의 결정권자를 명확히 한다.",
      keywords: ["맵 컨텍스트", "관심 범위", "원격 객체 수명", "소유권"],
      problem: "모든 상태를 모든 사용자에게 전파하면 트래픽과 객체 관리 비용이 커지고, 동일한 몬스터를 여러 클라이언트가 갱신하면 결과가 충돌합니다.",
      decisions: [
        ["전파 범위", "세션을 MapData에 소속시키고 같은 맵 사용자에게만 입장·이동·전투 이벤트를 전달합니다."],
        ["객체 수명", "입장 패킷으로 원격 객체를 생성하고 퇴장·맵 변경에서 객체와 관련 UI를 함께 정리합니다."],
        ["갱신 책임", "프로토타입에서는 몬스터별 한 클라이언트에 갱신 소유권을 부여하고 서버가 상태를 중계합니다."],
      ],
      result: "맵 전환을 기준으로 이전 월드가 정리되고 새 컨텍스트의 플레이어와 몬스터만 다시 구성됩니다.",
      tradeoff: "클라이언트 소유권은 완성 속도에는 유리하지만 치트 방지와 일관성에 한계가 있습니다. 상용 구조에서는 서버 권위 시뮬레이션으로 이전해야 합니다.",
      diagram: {
        title: "맵 컨텍스트 동기화 UML",
        groups: [
          { title: "Unity Client", nodes: ["NetworkClient", "OtherPlayerManager", "EnemyNetworkSync"] },
          { title: "IOCP Server", nodes: ["IOCPServer", "SessionManager", "MapDataManager", "MapData"] },
          { title: "World Object", nodes: ["Session", "Enemy"] },
        ],
        relations: [
          ["NetworkClient", "data", "IOCPServer", "TCP"],
          ["IOCPServer", "dependency", "SessionManager", "접속 관리"],
          ["SessionManager", "composition", "MapDataManager", "월드 경계"],
          ["MapDataManager", "aggregation", "MapData", "맵 목록"],
          ["MapData", "aggregation", "Session", "같은 맵"],
          ["MapData", "aggregation", "Enemy", "월드 상태"],
        ],
      },
    },
    {
      title: "IOCP 비동기 세션과 패킷 수명주기",
      intent: "I/O 완료가 돌아올 때까지 객체와 버퍼가 살아 있다는 불변식을 코드 구조로 보장한다.",
      keywords: ["소유권", "OVERLAPPED", "패킷 프레이밍", "송신 큐", "종료 경합"],
      problem: "비동기 요청은 함수 반환 뒤에도 세션과 버퍼를 참조합니다. TCP 스트림은 패킷이 분할·병합될 수 있고 연결 종료와 완료 통지가 경쟁할 수도 있습니다.",
      decisions: [
        ["객체 수명", "shared·weak·unique ownership을 역할에 맞게 나눠 완료 전 파괴와 순환 참조를 방지했습니다."],
        ["수신 경계", "누적 버퍼에서 헤더 길이를 검증하고 완전한 패킷만 핸들러로 전달합니다."],
        ["송신 직렬화", "세션별 송신 큐가 버퍼 순서를 보존하고 한 번에 하나의 비동기 송신만 유지합니다."],
      ],
      result: "수신 횟수와 메시지 개수를 분리해 처리하고, 세션·IOContext·버퍼의 수명을 완료 통지 흐름에 맞춰 관리했습니다.",
      tradeoff: "부분 송신, 오류 시 큐 정리, 종료와 완료의 경합을 운영 수준으로 검증하는 테스트가 남아 있습니다.",
      diagram: {
        title: "IOCP 세션 수명 UML",
        groups: [
          { title: "Server", nodes: ["IOCPServer", "SessionManager", "PacketMethod"] },
          { title: "Connection", nodes: ["Session", "IOContext"] },
          { title: "Protocol", nodes: ["PacketHeader"] },
        ],
        relations: [
          ["IOCPServer", "aggregation", "SessionManager", "접속 등록"],
          ["SessionManager", "aggregation", "Session", "공유 수명"],
          ["Session", "dependency", "IOContext", "큐 데이터로 비동기 작업 생성"],
          ["IOContext", "aggregation", "Session", "owner가 공유 수명 유지"],
          ["Session", "dependency", "PacketHeader", "누적 vector 길이 검증"],
          ["Session", "dependency", "IOCPServer", "완전한 패킷"],
          ["IOCPServer", "dependency", "PacketMethod", "요청 라우팅"],
        ],
      },
    },
    {
      title: "재접속 가능한 게임 상태 영속화",
      intent: "런타임 객체의 수명과 무관하게 플레이어의 진행 상태를 다시 조립할 수 있게 한다.",
      keywords: ["관계형 상태", "정의 ID", "복원 순서", "Prepared Statement", "체크포인트"],
      problem: "맵·위치·스탯·인벤토리·장비·퀘스트 진행도는 서로 연결되어 있어 일부만 저장되거나 잘못된 순서로 복원되면 플레이 상태가 불일치합니다.",
      decisions: [
        ["관계 분리", "계정, 캐릭터, 인벤토리, 퀘스트와 조건별 진행도를 역할별 테이블로 나눴습니다."],
        ["복원 흐름", "로그인에서 기본 상태를 조회하고 연관 데이터를 순차 전송한 뒤 DataCenter를 거쳐 런타임 객체로 조립합니다."],
        ["저장 경계", "맵 변경과 연결 종료에서 런타임 상태를 DB 모델로 변환하고 Prepared Statement로 반영합니다."],
      ],
      result: "재로그인 시 저장된 맵·위치·스탯·인벤토리·장비·퀘스트 상태를 동일한 데이터 흐름으로 복원합니다.",
      tradeoff: "종료 시점 중심 저장은 비정상 종료에 취약합니다. 중요 이벤트 체크포인트, 트랜잭션, DB 작업 큐와 커넥션 풀이 다음 개선 순서입니다.",
      diagram: {
        title: "런타임 상태 영속화 UML",
        direction: "TB",
        groups: [
          { title: "Client", nodes: ["DataCenter", "QuestManager", "PlayerStatManager"] },
          { title: "Server", nodes: ["Session", "PacketMethod", "Queries", "DBManager"] },
          { title: "DB Tables", nodes: ["UserAccount", "UserInfo", "Inventory", "UserQuest", "UserQuestProgress"] },
        ],
        relations: [
          ["QuestManager", "dependency", "DataCenter", "퀘스트 진행 복원"],
          ["PlayerStatManager", "dependency", "DataCenter", "스탯 복원"],
          ["PacketMethod", "dependency", "Queries", "조회·저장"],
          ["Queries", "dependency", "DBManager", "Prepared Statement"],
          ["PacketMethod", "dependency", "Session", "조회 결과로 세션 구성"],
          ...["UserAccount", "UserInfo", "Inventory", "UserQuest", "UserQuestProgress"]
            .map((table) => ["Queries", "data", table, "조회·저장 대상"]),
        ],
      },
    },
  ],
  technicalDocs: [
    {
      id: "client",
      label: "CLIENT",
      title: "Unity 클라이언트 시스템 아키텍처",
      summary: "입력·상태 판정·게임 규칙·표현·네트워크 반영을 분리하고, 콘텐츠 정의와 플레이 상태가 섞이지 않도록 경계를 세웠습니다.",
      keywords: ["상태 패턴", "ScriptableObject", "이벤트", "메인 스레드 큐", "씬 수명주기"],
      responsibilities: [
        ["Core", "SingletonManager가 DataCenter·NetworkClient·SceneLoader·WorldLoader의 초기화 순서를 조정합니다."],
        ["Gameplay", "PlayerStateContexter와 CombatManager가 행동 전환과 전투 판단을 분리합니다."],
        ["Content", "아이템·스킬·퀘스트는 정의 데이터와 런타임 진행 상태를 분리합니다."],
        ["Presentation", "AnimationContexter·EffectManager·UIEvents가 판정 결과를 화면 표현으로 변환합니다."],
        ["Network Boundary", "수신 스레드는 데이터를 보관하고 메인 스레드가 오브젝트와 UI를 갱신합니다."],
      ],
      flow: ["입력", "상태 판정", "게임 규칙", "도메인 이벤트", "UI·Animation", "NetworkClient"],
      notes: [
        ["변경 범위", "새 행동은 상태와 전환 조건, 새 스킬은 파생 동작과 정의 데이터가 주된 추가 지점입니다."],
        ["초기화", "로그인 데이터는 DataCenter에 대기시키고 씬과 매니저가 준비된 뒤 월드를 조립합니다."],
        ["한계", "전역 관리자 접근은 빠르지만 숨은 의존성과 초기화 순서를 만들 수 있어 의존성 주입으로 발전할 수 있습니다."],
      ],
      features: [
        {
          title: "코어 초기화와 월드 조립",
          summary: "씬보다 오래 살아야 하는 서비스와 인게임에 종속된 객체를 분리하고, 준비 순서를 한 곳에서 통제했습니다.",
          details: [
            ["설계 의도", "네트워크 응답 속도와 씬 로딩 속도가 달라도 동일한 순서로 월드를 만들 수 있게 합니다."],
            ["구현 방식", "SingletonManager가 DataCenter·NetworkClient·SceneLoader를 먼저 준비하고 WorldLoader가 맵·로컬 플레이어·원격 객체·몬스터를 조립합니다."],
            ["변경 지점", "새 씬 의존 객체는 WorldLoader 단계에 연결하고, 여러 씬에서 유지되는 상태는 DataCenter 경계 안에 둡니다."],
          ],
          diagram: {
            title: "초기화 순서와 월드 생성",
            zoomable: true,
            groups: [
              { title: "Startup", nodes: ["SingletonManager", "SingletonBasest", "SceneLoader"] },
              { title: "World", nodes: ["WorldLoader", "DataCenter", "Player", "OtherPlayerManager", "EnemySpawner"] },
            ],
            relations: [
              ["SingletonManager", "aggregation", "SingletonBasest", "우선순위별 초기화"],
              ["SceneLoader", "dependency", "SingletonManager", "씬 로드 후 인게임 초기화"],
              ["SceneLoader", "dependency", "DataCenter", "맵·스폰·대기 데이터"],
              ["SceneLoader", "dependency", "WorldLoader", "월드 조립 요청"],
              ["WorldLoader", "dependency", "DataCenter", "맵·몬스터 정의 조회"],
              ["WorldLoader", "aggregation", "Player", "로컬 플레이어 생성"],
              ["WorldLoader", "dependency", "OtherPlayerManager", "원격 플레이어 등록"],
              ["WorldLoader", "dependency", "EnemySpawner", "몬스터 등록"],
            ],
          },
        },
        {
          title: "플레이어 상태와 전투",
          summary: "이동·추적·공격·피격·사망을 상태 단위로 나누고 전투 판정과 애니메이션 표현을 분리했습니다.",
          details: [
            ["설계 의도", "행동 충돌을 조건문으로 봉합하지 않고 허용 가능한 상태 전환으로 제한합니다."],
            ["구현 방식", "PlayerStateContexter가 IState의 진입·갱신·종료를 관리하고 CombatManager가 타깃·스킬·쿨다운을 판단합니다."],
            ["변경 지점", "새 행동은 상태 클래스와 전환 조건에, 새 표현은 AnimationSet과 Override 데이터에 추가합니다."],
          ],
          diagram: {
            title: "상태 전환과 전투·표현의 경계",
            direction: "TB",
            zoomable: true,
            groups: [
              { title: "Player Components", nodes: ["Player", "PlayerStateContexter", "CombatManager", "AnimationContexter"] },
              { title: "State Contract", nodes: ["IState", "IdleState", "AttackState"] },
              { title: "Skill Execution", nodes: ["Skill"] },
            ],
            relations: [
              ["Player", "aggregation", "PlayerStateContexter", "행동 전환"],
              ["Player", "aggregation", "CombatManager", "타깃·쿨다운"],
              ["PlayerStateContexter", "aggregation", "IState", "진입·갱신·종료"],
              ["IdleState", "implementation", "IState"],
              ["AttackState", "implementation", "IState"],
              ["PlayerStateContexter", "dependency", "AnimationContexter", "상태 표현"],
              ["CombatManager", "aggregation", "Skill", "현재 시전 스킬"],
            ],
          },
        },
        {
          title: "스킬·아이템·장비·제작",
          summary: "정의 데이터와 플레이 중 상태를 분리해 콘텐츠 추가가 관리자 조건문의 증가로 이어지지 않게 했습니다.",
          details: [
            ["설계 의도", "새 콘텐츠가 공통 실행 흐름을 재사용하면서 유형별 차이만 구현하도록 만듭니다."],
            ["구현 방식", "ScriptableObject가 아이템·레시피 정의를 보관하고, 추상 스킬과 IUsableItem 계약이 실행 수명주기를 통일합니다."],
            ["변경 지점", "새 아이템·스킬은 정의 에셋과 파생 동작을 추가합니다. 인벤토리는 공통 사용 계약으로 실행하고, 장비·제작 UI는 장착 처리와 재료 검증·차감을 담당합니다."],
          ],
          diagram: {
            title: "아이템 사용 계약과 장비·제작 연결",
            direction: "TB",
            zoomable: true,
            groups: [
              { title: "Item Definitions", nodes: ["InventoryItem", "ConsumeItem", "EquipmentItem", "IUsableItem"] },
              { title: "Runtime UI", nodes: ["Inventory", "EquipmentUI", "CraftUI"] },
              { title: "Recipe Definition", nodes: ["CraftItemRecipe"] },
            ],
            relations: [
              ["ConsumeItem", "inheritance", "InventoryItem"],
              ["EquipmentItem", "inheritance", "InventoryItem"],
              ["ConsumeItem", "implementation", "IUsableItem"],
              ["EquipmentItem", "implementation", "IUsableItem"],
              ["Inventory", "dependency", "IUsableItem", "사용 요청"],
              ["EquipmentItem", "dependency", "EquipmentUI", "장착 요청"],
              ["CraftUI", "aggregation", "CraftItemRecipe", "재료·결과 정의"],
              ["CraftUI", "dependency", "Inventory", "수량 검증·차감·결과 지급"],
            ],
          },
        },
        {
          title: "퀘스트·튜토리얼 이벤트",
          summary: "전투·채집·제작 시스템은 사건만 발행하고 퀘스트와 튜토리얼이 각자의 규칙으로 해석합니다.",
          details: [
            ["설계 의도", "진행 콘텐츠가 생산 시스템을 직접 조회하지 않게 해 양쪽의 변경을 분리합니다."],
            ["구현 방식", "PlayEvents가 처치·획득·제작·상호작용을 전달합니다. QuestManager는 목표 진행을 갱신하고, TutorialGuide가 선택한 개별 단계는 해당 사건을 구독해 다음 단계로 전환합니다."],
            ["변경 지점", "기존 사건을 사용하는 목표는 정의 데이터로 추가하고, 새로운 목표 유형만 이벤트 계약과 처리기를 확장합니다."],
          ],
          diagram: {
            title: "플레이 사건과 퀘스트·튜토리얼 소비 구조",
            zoomable: true,
            groups: [
              { title: "Event Producers", nodes: ["FieldItem", "CraftUI"] },
              { title: "Events", nodes: ["PlayEvents"] },
              { title: "Quest", nodes: ["QuestManager", "Quest", "UIEvents"] },
              { title: "Tutorial", nodes: ["TutorialGuide", "ITutorialStep", "CraftStep"] },
            ],
            relations: [
              ["FieldItem", "event", "PlayEvents", "채집 완료"],
              ["CraftUI", "event", "PlayEvents", "제작 완료"],
              ["PlayEvents", "event", "QuestManager", "조건별 진행 갱신"],
              ["QuestManager", "aggregation", "Quest", "목표·보상 정의"],
              ["QuestManager", "event", "UIEvents", "진행 변경 알림"],
              ["TutorialGuide", "aggregation", "ITutorialStep", "현재 단계"],
              ["CraftStep", "implementation", "ITutorialStep"],
              ["PlayEvents", "event", "CraftStep", "제작 완료 구독"],
              ["CraftStep", "dependency", "TutorialGuide", "다음 단계 요청"],
            ],
          },
        },
        {
          title: "네트워크 수신과 Unity 반영",
          summary: "소켓 스레드의 데이터 처리와 Unity 메인 스레드의 GameObject·UI 갱신을 작업 큐로 분리했습니다.",
          details: [
            ["설계 의도", "Unity API의 스레드 제약을 지키면서 네트워크 도착 시점과 객체 생성 시점을 독립시킵니다."],
            ["구현 방식", "수신 스레드는 헤더·본문을 읽고 패킷을 해석한 뒤 Dispatcher에 작업을 등록합니다. 로드 데이터 보관과 원격 객체 갱신은 등록된 메인 스레드 작업에서 수행합니다."],
            ["변경 지점", "새 수신 기능은 순수 데이터 변환과 Unity 반영 작업을 나누어 등록합니다."],
          ],
          diagram: {
            title: "소켓 수신에서 메인 스레드 반영까지",
            zoomable: true,
            groups: [
              { title: "Receive Thread", nodes: ["NetworkClient", "PacketMethod"] },
              { title: "Main Thread Queue", nodes: ["UnityMainThreadDispatcher"] },
              { title: "Main Thread Targets", nodes: ["DataCenter", "WorldLoader", "OtherPlayerManager", "EnemySpawner"] },
            ],
            relations: [
              ["NetworkClient", "dependency", "PacketMethod", "PacketType별 처리"],
              ["PacketMethod", "dependency", "UnityMainThreadDispatcher", "Action 등록"],
              ["PacketMethod", "data", "DataCenter", "큐 안에서 로드 데이터 보관"],
              ["PacketMethod", "dependency", "WorldLoader", "큐 안에서 월드 갱신"],
              ["PacketMethod", "dependency", "OtherPlayerManager", "큐 안에서 원격 상태 반영"],
              ["PacketMethod", "dependency", "EnemySpawner", "큐 안에서 몬스터 조회"],
            ],
          },
        },
        {
          title: "UI 이벤트와 HUD·미니맵·전투 피드백",
          summary: "게임 상태를 판단하는 역할과 화면에 표현하는 역할을 나누고, UI 이벤트와 플레이어 재바인딩으로 상태 변경을 화면에 반영했습니다.",
          emphasis: ["UI 이벤트", "재바인딩", "구독 수명", "쿨다운", "미니맵", "오브젝트 풀", "맵 전환"],
          details: [
            ["설계 의도", "전투·월드 시스템이 개별 화면의 이미지나 버튼을 직접 수정하는 대신 UI 이벤트로 필요한 값과 표현 요청을 전달하도록 했습니다. 다만 체력 표시는 플레이어의 피해 이벤트를 직접 구독하는 구조를 함께 사용합니다."],
            ["구독 수명", "HUD와 스킬 버튼, 적 체력 UI는 활성화 시 이벤트를 구독하고 비활성화 시 해제합니다. 로컬 플레이어 생성 시 이전 피해 이벤트 연결을 끊고 새 플레이어에 재바인딩하며, 초기 쿨다운 상태도 다시 전달합니다."],
            ["체력·쿨다운", "체력은 현재 값과 최대 값의 비율을 게이지에 반영합니다. 스킬 버튼은 자신의 스킬 인덱스에 해당하는 쿨다운 비율과 사용 가능 여부만 받아 채움 이미지와 버튼 활성 상태를 바꾸고, 클릭 시 실행 판단은 전투 시스템에 요청합니다."],
            ["미니맵", "맵별 이미지·위치·회전·크기 보정값을 적용하고, 시작 시 저장된 맵 정보를 조회해 초기 화면을 맞춥니다. 이후 미니맵 변경 이벤트로 맵 이미지를 교체하고 카메라는 LateUpdate에서 플레이어의 수평 위치를 따라갑니다."],
            ["전투 피드백", "피격·성공·저체력 상태에 따라 초상화를 교체하고, 적 체력바와 피해 숫자는 오브젝트 풀에서 재사용합니다. 피해 숫자는 위로 이동하며 투명해진 뒤 풀로 돌아가고, 적 체력바는 사망 시 비활성화됩니다."],
            ["맵 전환·한계", "맵 전환 정리 함수는 체력바의 이전 타깃을 해제하고 활성 피해 숫자를 풀로 돌려보냅니다. 체력바는 부족하면 추가 생성하지만 피해 숫자는 고정 풀을 모두 사용하면 표시를 생략하므로, 동시 타격이 많은 상황의 풀 크기는 별도 조정 지점입니다."],
          ],
          diagram: {
            title: "UI 이벤트와 HUD 갱신 구조",
            groups: [
              { title: "Game State", nodes: ["Player", "CombatManager"] },
              { title: "Event Contract", nodes: ["UIEvents"] },
              { title: "Presentation", nodes: ["DisplayUIManager", "SkillButton", "EnemyHpUIManager"] },
            ],
            relations: [
              ["Player", "event", "DisplayUIManager", "피해 이벤트"],
              ["CombatManager", "event", "UIEvents", "쿨다운 상태"],
              ["UIEvents", "event", "DisplayUIManager", "플레이어·초상화·미니맵"],
              ["UIEvents", "event", "SkillButton", "쿨다운 변경"],
              ["UIEvents", "event", "EnemyHpUIManager", "적 목록·피해 숫자"],
              ["SkillButton", "dependency", "CombatManager", "스킬 실행 요청"],
            ],
          },
        },
        {
          title: "팝업·인벤토리·장비·제작 UI",
          summary: "팝업의 열기·닫기와 화면별 동작을 구분하고, 공통 슬롯의 툴팁·클릭 처리를 재사용해 아이템 UI를 확장했습니다.",
          emphasis: ["팝업 상태", "공통 슬롯", "툴팁", "레시피", "재검증", "UI와 상태 모델"],
          details: [
            ["팝업 관리", "팝업 관리자가 인벤토리·제작·장비·퀘스트·사망 UI를 초기화하고 현재 열린 창을 관리합니다. 인벤토리·제작 창은 팝업 상태를 확인해 중복 열기를 막고, 닫을 때 툴팁과 캐릭터 프리뷰 카메라도 정리합니다."],
            ["공통 슬롯", "기본 슬롯은 아이템 참조와 포인터 진입·이탈에 따른 툴팁을 담당합니다. 버튼 슬롯이 공통 클릭 연결을 추가하고, 인벤토리·장비·제작·퀘스트 슬롯이 각자의 클릭 동작을 구현합니다. 재료 슬롯은 툴팁만 필요한 기본 슬롯을 사용합니다."],
            ["인벤토리·장비", "중첩 가능한 아이템은 기존 슬롯의 수량을 올리고, 사용할 때 공통 사용 계약을 통해 실행한 뒤 수량과 목록을 갱신합니다. 장비 슬롯은 장비 유형에 맞춰 아이콘과 공격·방어 스탯을 반영하고, 해제한 아이템은 인벤토리로 되돌립니다."],
            ["제작 흐름", "레시피로 제작 목록을 만들고, 선택한 결과 아이템과 재료·필요 수량을 표시합니다. 보유 수량으로 제작 버튼을 활성화하며 클릭 시 재검증한 뒤 재료를 차감하고 결과 아이템을 추가합니다. 완료 후 성공 초상화와 제작 완료 이벤트를 전달합니다."],
            ["목록 배치", "인벤토리와 제작 목록은 슬롯 수, 열 수, 셀 크기와 간격으로 콘텐츠 높이를 계산합니다. 포인터가 목록 영역 안에 있을 때만 휠 입력을 세로 스크롤에 반영해 아이템 수가 늘어나도 목록을 탐색할 수 있게 했습니다."],
            ["설계 판단", "공통 슬롯으로 표시·입력 중복을 줄였지만, 현재 인벤토리·장비 UI는 수량과 스탯 변경까지 맡습니다. UI와 상태 모델의 완전한 분리는 아직 되어 있지 않으며, 향후 아이템 상태를 별도 모델로 옮겨 저장·테스트가 화면 수명에 의존하지 않도록 개선할 수 있습니다."],
          ],
          diagram: {
            title: "슬롯 UI의 공통 계약과 확장 구조",
            direction: "TB",
            groups: [
              { title: "Shared UI", nodes: ["Slot", "ButtonSlot"] },
              { title: "Item Views", nodes: ["InventorySlot", "EquipmentSlot", "CraftSlot", "IngredientSlot"] },
              { title: "Quest View", nodes: ["QuestContentUI"] },
            ],
            relations: [
              ["ButtonSlot", "inheritance", "Slot", "클릭 처리 추가"],
              ["InventorySlot", "inheritance", "ButtonSlot", "아이템 사용"],
              ["EquipmentSlot", "inheritance", "ButtonSlot", "장비 해제"],
              ["CraftSlot", "inheritance", "ButtonSlot", "레시피 선택"],
              ["IngredientSlot", "inheritance", "Slot", "재료·툴팁"],
              ["QuestContentUI", "inheritance", "ButtonSlot", "보상 요청"],
            ],
          },
        },
        {
          title: "퀘스트 목록·팝업 입력·사망 UI",
          summary: "퀘스트 진행 상태를 읽기 쉬운 목록으로 보여주고, UI 조작과 카메라 조작이 같은 입력을 중복 소비하지 않도록 구분했습니다.",
          emphasis: ["진행 상태", "보상 요청", "스크롤 영역", "카메라 줌", "Escape", "부활 요청", "전체 재생성"],
          details: [
            ["퀘스트 표시", "진행 변경 이벤트와 창을 다시 여는 시점에 활성 퀘스트 목록을 갱신하고, 보상을 받은 항목은 제외합니다. 각 항목은 이름·설명·조건별 현재/목표 수량·보상·진행 상태를 표시하며 조건 충족 여부는 색상으로 구분합니다."],
            ["보상 요청", "항목 클릭은 완료 상태이며 아직 보상을 받지 않은 경우에만 퀘스트 관리자에 보상을 요청합니다. 화면이 완료 조건을 새로 판단하지 않고 이미 계산된 진행 상태를 읽어 표시와 요청 가능 여부에 사용합니다."],
            ["스크롤·카메라", "포인터가 퀘스트 스크롤 영역 안에 있는지 공유하고, 그 영역에서는 휠을 목록 스크롤에 사용합니다. 카메라 쪽은 이 상태를 확인해 카메라 줌을 건너뛰므로 퀘스트를 읽는 동안 화면 확대·축소가 함께 일어나는 것을 막습니다."],
            ["Escape 처리", "열린 팝업 상태를 공유해 Escape 입력의 종료·UI 닫기 경로를 구분합니다. 이는 팝업이 열리면 이동·전투 입력 전체를 차단하는 방식이 아니라, 현재 UI 상태에 맞는 닫기 동작을 선택하는 처리입니다."],
            ["사망·부활", "사망 화면은 페이드 인과 15초 카운트다운을 표시하고 대기 중에는 부활 버튼을 비활성화합니다. 시간이 지난 뒤 버튼을 활성화하며 클릭 시 창을 닫고 부활 요청 이벤트를 발행합니다."],
            ["현재 한계", "퀘스트 목록은 진행 변경 때 기존 항목을 제거하고 전체 재생성합니다. 현재 규모에서는 단순한 갱신 경로를 얻지만, 목록이 커지면 퀘스트 ID별 항목 재사용과 변경된 텍스트만 갱신하는 방식이 개선 지점입니다."],
          ],
          diagram: {
            title: "퀘스트 표시와 UI 입력 경계",
            groups: [
              { title: "UI State", nodes: ["QuestUI", "PopUpUIManager"] },
              { title: "Shared Contract", nodes: ["UIEvents"] },
              { title: "Input Consumers", nodes: ["CameraMoving", "InputManager"] },
            ],
            relations: [
              ["UIEvents", "event", "QuestUI", "진행 변경"],
              ["QuestUI", "data", "UIEvents", "포인터·스크롤 영역"],
              ["PopUpUIManager", "data", "UIEvents", "팝업 열림 상태"],
              ["CameraMoving", "dependency", "UIEvents", "줌 입력 구분"],
              ["InputManager", "dependency", "UIEvents", "Escape 경로 구분"],
            ],
          },
        },
      ],
      diagram: {
        title: "클라이언트 책임 지도",
        direction: "LR",
        zoomable: true,
        routing: "elk",
        groups: [
          { title: "Lifecycle", nodes: ["SingletonBasest", "SingletonBase", "SingletonManager", "SceneLoader", "WorldLoader"] },
          { title: "Network", nodes: ["NetworkClient", "PacketMethod", "DataCenter", "UnityMainThreadDispatcher", "OtherPlayerManager", "OtherPlayer", "OtherPlayerNetworkSync"] },
          { title: "Player Input", nodes: ["Player", "PlayerStatManager", "InputManager", "CameraMoving", "IDamageable"] },
          { title: "Player States", nodes: ["PlayerStateContexter", "IState", "IdleState", "MoveState", "CombatRunState", "CombatIdleState", "InteractState", "AttackState", "DamagedState", "DeadState"] },
          { title: "Animation Effects", nodes: ["AnimationContexter", "AnimationSet", "OneShotEnd", "EffectManager"] },
          { title: "Combat Skills", nodes: ["CombatManager", "Skill", "AreaSkill", "NormalSkill", "SmashSkill", "Windmill", "AreaTargetDetector"] },
          { title: "Enemy World", nodes: ["EnemySpawner", "Enemy", "EnemyNetworkSync", "Spider", "Skeleton"] },
          { title: "Item Definitions", nodes: ["ItemMediator", "InventoryItem", "IUsableItem", "ConsumeItem", "EquipmentItem", "HPPotion", "PlaceItem", "CraftItemRecipe"] },
          { title: "Gathering", nodes: ["FieldItem", "IObtainable", "Branch", "Rock", "Grass"] },
          { title: "Quest Events", nodes: ["QuestManager", "Quest", "PlayEvents", "UIEvents"] },
          { title: "Tutorial", nodes: ["TutorialGuide", "ITutorialStep", "CameraStep", "MoveStep", "CombatStep", "InteractStep", "CraftStep", "EquipStep"] },
          { title: "UI Panels", nodes: ["PopUpUIManager", "Inventory", "EquipmentUI", "CraftUI", "QuestUI", "DeadUI", "ItemTooltip", "LoginUI", "TextRenderManager", "MapData"] },
          { title: "HUD", nodes: ["DisplayUIManager", "SkillButtonManager", "SkillButton", "EnemyHpUIManager", "EnemyHpUI"] },
          { title: "UI Slots", nodes: ["Slot", "ButtonSlot", "InventorySlot", "EquipmentSlot", "CraftSlot", "IngredientSlot", "QuestContentUI"] },
        ],
        relations: [
          ["SingletonBase", "inheritance", "SingletonBasest"],
          ...["SingletonManager", "SceneLoader", "WorldLoader", "DataCenter", "NetworkClient", "OtherPlayerManager", "InputManager", "EffectManager", "EnemySpawner", "ItemMediator", "QuestManager", "PopUpUIManager", "TextRenderManager"]
            .map((node) => [node, "inheritance", "SingletonBase"]),
          ["SingletonManager", "aggregation", "SingletonBasest", "등록·초기화 순서"],
          ["SceneLoader", "dependency", "DataCenter", "맵 정보"],
          ["WorldLoader", "aggregation", "Player", "생성·초기화"],
          ["WorldLoader", "dependency", "DataCenter", "지연 데이터 조립"],
          ["WorldLoader", "dependency", "OtherPlayerManager", "원격 플레이어 생성"],
          ["WorldLoader", "dependency", "EnemySpawner", "몬스터 등록"],
          ["WorldLoader", "dependency", "CameraMoving", "카메라 타깃"],
          ["NetworkClient", "dependency", "PacketMethod", "패킷 분리·처리"],
          ["PacketMethod", "data", "DataCenter", "수신 상태 보관"],
          ["PacketMethod", "dependency", "UnityMainThreadDispatcher", "메인 스레드 작업"],
          ["PacketMethod", "dependency", "WorldLoader", "입장·맵 전환"],
          ["PacketMethod", "dependency", "OtherPlayerManager", "원격 상태 반영"],
          ["PacketMethod", "dependency", "EnemySpawner", "몬스터 상태 반영"],
          ["OtherPlayerManager", "aggregation", "OtherPlayer"],
          ["OtherPlayer", "composition", "OtherPlayerNetworkSync"],
          ["OtherPlayerNetworkSync", "dependency", "AnimationContexter"],
          ["OtherPlayerNetworkSync", "dependency", "EffectManager"],
          ["Player", "composition", "PlayerStateContexter", "행동"],
          ["Player", "composition", "CombatManager", "전투"],
          ["Player", "composition", "PlayerStatManager", "스탯"],
          ["Player", "dependency", "InputManager"],
          ["Player", "dependency", "NetworkClient", "이동·행동 송신"],
          ["Player", "implementation", "IDamageable"],
          ["PlayerStatManager", "data", "DataCenter"],
          ["PlayerStateContexter", "aggregation", "IState", "상태 전환"],
          ...["IdleState", "MoveState", "CombatRunState", "CombatIdleState", "InteractState", "AttackState", "DamagedState", "DeadState"]
            .map((node) => [node, "implementation", "IState"]),
          ["PlayerStateContexter", "dependency", "AnimationContexter"],
          ["AnimationContexter", "aggregation", "AnimationSet", "표현 데이터"],
          ["CombatManager", "aggregation", "Skill", "스킬 실행"],
          ...["NormalSkill", "SmashSkill", "AreaSkill"].map((node) => [node, "inheritance", "Skill"]),
          ["Windmill", "inheritance", "AreaSkill"],
          ["Windmill", "dependency", "AreaTargetDetector"],
          ["Skill", "dependency", "IDamageable", "피해 적용"],
          ["Windmill", "dependency", "EffectManager"],
          ["EnemySpawner", "aggregation", "Enemy"],
          ["Enemy", "implementation", "IDamageable"],
          ...["Spider", "Skeleton"].map((node) => [node, "inheritance", "Enemy"]),
          ["EnemyNetworkSync", "dependency", "NetworkClient", "제어권·동기화"],
          ["EnemyNetworkSync", "dependency", "OtherPlayerManager"],
          ["ItemMediator", "aggregation", "InventoryItem", "정의 조회"],
          ["ItemMediator", "dependency", "Inventory", "아이템 획득"],
          ...["ConsumeItem", "EquipmentItem"].map((node) => [node, "inheritance", "InventoryItem"]),
          ...["ConsumeItem", "EquipmentItem"].map((node) => [node, "implementation", "IUsableItem"]),
          ...["HPPotion", "PlaceItem"].map((node) => [node, "inheritance", "ConsumeItem"]),
          ["EquipmentItem", "dependency", "EquipmentUI", "장착 요청"],
          ["FieldItem", "implementation", "IObtainable"],
          ...["Branch", "Rock", "Grass"].map((node) => [node, "inheritance", "FieldItem"]),
          ["Branch", "dependency", "ItemMediator"],
          ["PlayEvents", "event", "QuestManager", "처치·채집·제작"],
          ...["CameraStep", "MoveStep", "CombatStep", "InteractStep", "CraftStep", "EquipStep"]
            .map((node) => ["PlayEvents", "event", node, "단계별 진행"]),
          ["QuestManager", "aggregation", "Quest", "조건·보상 정의"],
          ["QuestManager", "dependency", "ItemMediator", "보상 지급"],
          ["QuestManager", "event", "UIEvents", "진행 변경"],
          ["TutorialGuide", "aggregation", "ITutorialStep"],
          ...["CameraStep", "MoveStep", "CombatStep", "InteractStep", "CraftStep", "EquipStep"]
            .map((node) => [node, "implementation", "ITutorialStep"]),
          ["TutorialGuide", "dependency", "TextRenderManager", "안내 문구"],
          ["TutorialGuide", "dependency", "InputManager", "단계별 입력 제한"],
          ...["Inventory", "EquipmentUI", "CraftUI", "QuestUI", "DeadUI", "ItemTooltip"]
            .map((node) => ["PopUpUIManager", "aggregation", node]),
          ["PopUpUIManager", "data", "UIEvents", "팝업 상태"],
          ["PopUpUIManager", "dependency", "CameraMoving", "프리뷰 카메라"],
          ["Inventory", "aggregation", "InventorySlot"],
          ["Inventory", "dependency", "IUsableItem", "아이템 사용"],
          ["EquipmentUI", "aggregation", "EquipmentSlot"],
          ["EquipmentUI", "dependency", "PlayerStatManager", "장비 스탯"],
          ["CraftUI", "aggregation", "CraftItemRecipe"],
          ["CraftUI", "aggregation", "CraftSlot"],
          ["CraftUI", "aggregation", "IngredientSlot"],
          ["CraftUI", "dependency", "Inventory", "재료 검증·차감"],
          ["QuestUI", "aggregation", "QuestContentUI"],
          ["QuestContentUI", "dependency", "QuestManager", "보상 요청"],
          ["ButtonSlot", "inheritance", "Slot"],
          ...["InventorySlot", "EquipmentSlot", "CraftSlot", "QuestContentUI"]
            .map((node) => [node, "inheritance", "ButtonSlot"]),
          ["IngredientSlot", "inheritance", "Slot"],
          ["Slot", "dependency", "ItemTooltip", "공통 툴팁"],
          ["LoginUI", "dependency", "NetworkClient", "로그인·가입"],
          ...["DisplayUIManager", "SkillButton", "EnemyHpUIManager", "QuestUI", "PopUpUIManager"]
            .map((node) => ["UIEvents", "event", node]),
          ["Player", "event", "DisplayUIManager", "체력 변경"],
          ["CombatManager", "event", "UIEvents", "쿨다운"],
          ["DisplayUIManager", "aggregation", "SkillButtonManager"],
          ["SkillButtonManager", "aggregation", "SkillButton"],
          ["SkillButton", "dependency", "CombatManager", "실행 요청"],
          ["EnemyHpUIManager", "aggregation", "EnemyHpUI", "체력바 재사용"],
          ["EnemyHpUI", "dependency", "Enemy"],
          ["DataCenter", "aggregation", "MapData", "미니맵 보정 데이터"],
          ["CameraMoving", "dependency", "UIEvents", "스크롤·줌 구분"],
          ["InputManager", "dependency", "UIEvents", "팝업 닫기 구분"],
        ],
      },
    },
    {
      id: "server",
      label: "SERVER",
      title: "C++ IOCP 서버와 게임 월드",
      summary: "완료 통지 기반 네트워크 위에 세션·패킷·맵·몬스터·타이머를 배치하고, 비동기 객체의 소유권과 공유 상태의 불변식을 관리했습니다.",
      keywords: ["IOCP", "Session", "MapData", "Packet Framing", "Send Queue", "Timer"],
      responsibilities: [
        ["I/O", "IOCPServer가 Accept·Recv·Send 완료를 워커 스레드에서 처리합니다."],
        ["Session", "SessionManager가 연결의 등록·제거와 비동기 작업 수명을 관리합니다."],
        ["Protocol", "누적 버퍼와 헤더 길이 검증으로 분할·병합되는 TCP 스트림을 패킷으로 복원합니다."],
        ["World", "MapDataManager가 맵별 세션과 몬스터를 보유하고 같은 맵에만 이벤트를 전파합니다."],
        ["Schedule", "TimerManager가 몬스터 리필과 지연 작업을 I/O 흐름과 분리합니다."],
      ],
      flow: ["WSARecv 등록", "완료 바이트 누적", "헤더·길이 검증", "패킷 라우팅", "월드 상태 갱신", "맵 단위 전파"],
      notes: [
        ["동시성", "atomic은 단일 상태, mutex는 컨테이너 불변식, condition_variable은 작업 대기에 사용했습니다."],
        ["소유권", "shared ownership은 완료 전 수명을 보장하고 weak ownership은 순환 참조를 끊습니다."],
        ["한계", "부분 송신·오류 큐 정리·종료 경합·가상 클라이언트 부하 테스트가 운영 수준의 남은 검증입니다."],
      ],
      features: [
        {
          title: "IOCP 완료 통지와 세션 수명",
          summary: "I/O 요청 이후에도 커널이 참조하는 세션·OVERLAPPED 컨텍스트·버퍼의 수명을 완료 시점까지 보장합니다.",
          details: [
            ["설계 의도", "연결 종료와 완료 통지가 경쟁해도 해제된 객체에 접근하지 않는 불변식을 만듭니다."],
            ["구현 방식", "SessionManager가 세션을 공유 소유하고 IOContext가 작업과 세션 수명을 묶으며 완료 루틴이 연결 상태를 재확인합니다."],
            ["동시성", "atomic은 단일 상태 전이, mutex는 세션·맵 컨테이너, condition_variable은 작업 대기에 사용합니다."],
          ],
          diagram: {
            title: "완료 통지와 세션 공유 수명",
            zoomable: true,
            groups: [
              { title: "Server", nodes: ["IOCPServer", "SessionManager"] },
              { title: "Async Lifetime", nodes: ["Session", "IOContext"] },
            ],
            relations: [
              ["IOCPServer", "dependency", "SessionManager", "접속 등록·제거"],
              ["SessionManager", "aggregation", "Session", "shared_ptr 보관"],
              ["Session", "dependency", "IOContext", "Recv·Send 작업 생성"],
              ["IOContext", "aggregation", "Session", "owner가 수명 유지"],
              ["IOCPServer", "dependency", "IOContext", "완료 통지에서 owner 조회"],
              ["IOCPServer", "dependency", "Session", "송수신 완료 처리"],
            ],
          },
        },
        {
          title: "TCP 패킷 프레이밍과 송신 큐",
          summary: "바이트 스트림에서 완전한 메시지만 분리하고 세션별 송신 순서와 버퍼 수명을 함께 관리합니다.",
          details: [
            ["설계 의도", "한 번의 recv와 한 패킷이 일치한다는 잘못된 가정을 제거합니다."],
            ["구현 방식", "누적 버퍼의 헤더·길이를 검증해 완성 패킷만 라우팅하고 잔여 바이트를 다음 수신으로 넘깁니다."],
            ["송신 규칙", "세션별 큐에서 한 번에 하나의 비동기 송신만 진행하고 완료 후 다음 버퍼를 이어 보냅니다."],
          ],
          diagram: {
            title: "TCP 누적 수신과 큐 기반 송신",
            zoomable: true,
            groups: [
              { title: "Connection", nodes: ["Session", "IOContext", "PacketHeader"] },
              { title: "Dispatch", nodes: ["IOCPServer", "PacketMethod"] },
            ],
            relations: [
              ["Session", "dependency", "PacketHeader", "누적 vector에서 길이 검증"],
              ["Session", "dependency", "IOCPServer", "완전한 패킷 전달"],
              ["IOCPServer", "dependency", "PacketMethod", "요청 라우팅"],
              ["Session", "dependency", "IOContext", "송신 queue에서 한 건 생성"],
              ["IOCPServer", "dependency", "Session", "완료 후 다음 송신"],
            ],
          },
        },
        {
          title: "맵 단위 세션과 멀티플레이 전파",
          summary: "접속 전체가 아니라 같은 MapData에 속한 플레이어에게만 입장·이동·전투 상태를 전파합니다.",
          details: [
            ["설계 의도", "월드 경계를 명확히 해 불필요한 브로드캐스트와 원격 객체 관리를 줄입니다."],
            ["구현 방식", "MapDataManager가 맵별 Session과 Enemy를 보유하고 PacketMethod가 세션의 현재 맵을 기준으로 대상을 선택합니다."],
            ["확장 방향", "월드 규모가 커지면 맵 단위 경계를 공간 분할과 AOI로 세분화합니다."],
          ],
          diagram: {
            title: "맵 소속과 브로드캐스트 범위",
            zoomable: true,
            groups: [
              { title: "Routing", nodes: ["PacketMethod", "SessionManager"] },
              { title: "Map Scope", nodes: ["MapDataManager", "MapData", "Session"] },
            ],
            relations: [
              ["SessionManager", "composition", "MapDataManager", "unique_ptr"],
              ["MapDataManager", "aggregation", "MapData", "MapId별 등록"],
              ["MapData", "aggregation", "Session", "weak_ptr로 맵 소속 보관"],
              ["PacketMethod", "dependency", "Session", "현재 MapId 확인"],
              ["PacketMethod", "dependency", "MapDataManager", "맵 이동·전파 요청"],
              ["MapData", "dependency", "Session", "같은 맵에 송신"],
            ],
          },
        },
        {
          title: "몬스터 월드와 타이머",
          summary: "몬스터 상태와 주기 작업을 네트워크 I/O 흐름에서 분리해 게임 월드의 시간 기반 작업을 관리합니다.",
          details: [
            ["설계 의도", "주기 이벤트가 워커 스레드를 점유하거나 I/O 완료 처리와 뒤섞이지 않게 합니다."],
            ["구현 방식", "TimerManager가 우선순위 큐와 condition_variable로 단발·반복 작업을 실행하고 맵별 최대 수를 기준으로 몬스터를 보충합니다."],
            ["권위 경계", "현재 일부 몬스터 갱신은 클라이언트 소유이며 운영 구조에서는 AI와 판정을 서버로 이전해야 합니다."],
          ],
          diagram: {
            title: "반복 타이머와 맵별 몬스터 보충",
            zoomable: true,
            groups: [
              { title: "Schedule", nodes: ["TimerManager", "Timer"] },
              { title: "World", nodes: ["MapDataManager", "MapData", "Enemy", "PacketMethod"] },
            ],
            relations: [
              ["TimerManager", "aggregation", "Timer", "우선순위 큐"],
              ["Timer", "dependency", "MapDataManager", "main에서 등록한 반복 콜백"],
              ["MapDataManager", "aggregation", "MapData", "모든 맵 순회"],
              ["MapData", "aggregation", "Enemy", "최대 수까지 생성"],
              ["MapDataManager", "dependency", "PacketMethod", "생성 패킷 구성"],
            ],
          },
        },
        {
          title: "패킷 라우팅과 DB 접근 경계",
          summary: "Packet ID별 게임 요청을 세션·월드·Queries 책임으로 나눠 네트워크 코드가 SQL 세부사항을 직접 갖지 않게 했습니다.",
          details: [
            ["설계 의도", "전송 계층과 게임 규칙, 영속화 변경이 서로 직접 전파되지 않게 합니다."],
            ["구현 방식", "PacketMethod가 사용자·맵 상태를 확인해 처리기를 선택하고 Queries가 Prepared Statement 기반 조회·저장을 담당합니다."],
            ["확장 방향", "DB 작업 큐와 커넥션 풀을 추가해 네트워크 워커가 쿼리 완료를 기다리지 않게 합니다."],
          ],
          diagram: {
            title: "요청 라우팅과 현재의 동기 DB 접근",
            zoomable: true,
            groups: [
              { title: "Transport", nodes: ["Session", "PacketHeader", "IOCPServer"] },
              { title: "Application", nodes: ["PacketMethod"] },
              { title: "Persistence", nodes: ["Queries", "DBManager"] },
            ],
            relations: [
              ["Session", "dependency", "PacketHeader", "메시지 경계 확인"],
              ["Session", "dependency", "IOCPServer", "완성 패킷 전달"],
              ["IOCPServer", "dependency", "PacketMethod", "PacketId별 처리"],
              ["PacketMethod", "aggregation", "Queries", "조회·저장 호출"],
              ["Queries", "dependency", "DBManager", "연결·mutex·Prepared Statement"],
            ],
          },
        },
      ],
      diagram: {
        title: "서버 계층 UML",
        direction: "TB",
        groups: [
          { title: "I/O", nodes: ["IOCPServer", "IOContext", "PacketHeader"] },
          { title: "Session", nodes: ["SessionManager", "Session"] },
          { title: "World", nodes: ["MapDataManager", "MapData", "Enemy", "TimerManager"] },
          { title: "Application", nodes: ["PacketMethod", "Queries"] },
        ],
        relations: [
          ["IOCPServer", "aggregation", "SessionManager", "연결 관리"],
          ["Session", "dependency", "IOContext", "비동기 작업 생성"],
          ["IOContext", "aggregation", "Session", "owner 공유 수명"],
          ["Session", "dependency", "PacketHeader", "수신 메시지 경계"],
          ["SessionManager", "composition", "MapDataManager", "월드 경계"],
          ["MapData", "aggregation", "Session", "브로드캐스트 범위"],
          ["MapData", "aggregation", "Enemy", "게임 상태"],
          ["PacketMethod", "dependency", "Queries", "영속화 경계"],
        ],
      },
    },
    {
      id: "database",
      label: "DATABASE",
      title: "MariaDB 게임 상태 영속화",
      summary: "로그인 확인을 넘어 계정·캐릭터·인벤토리·퀘스트를 관계형 상태로 분리하고, 런타임 객체와 영속 데이터 사이의 변환 경계를 만들었습니다.",
      keywords: ["관계형 모델", "Prepared Statement", "정의 ID", "복원", "트랜잭션"],
      responsibilities: [
        ["UserAccount", "로그인 ID와 인증 정보를 보관하는 사용자 기준입니다."],
        ["UserInfo", "맵·위치·튜토리얼·전투 스탯을 캐릭터 상태로 보관합니다."],
        ["Inventory", "아이템 정의 ID·수량·슬롯·장착 여부를 사용자별 행으로 저장합니다."],
        ["UserQuest", "퀘스트 수락·완료·보상 상태를 관리합니다."],
        ["UserQuestProgress", "퀘스트의 조건별 현재 진행 수치를 분리해 저장합니다."],
        ["MapInfo", "플레이어와 몬스터 스폰 정보 및 맵별 최대 개체 수의 기준입니다."],
      ],
      flow: ["DB 조회", "Session 상태 구성", "패킷 전송", "DataCenter 보관", "런타임 객체 조립", "체크포인트 저장"],
      notes: [
        ["복원", "ScriptableObject의 정의 ID와 DB 진행 상태를 결합해 아이템·퀘스트 런타임 인스턴스를 구성합니다."],
        ["안전성", "Prepared Statement로 쿼리 구조와 값 바인딩을 분리하고, 누락 데이터에는 기본 상태 정책이 필요합니다."],
        ["한계", "여러 테이블을 함께 바꾸는 보상·제작·퀘스트 완료에는 트랜잭션과 주기적 저장, DB 작업 큐가 필요합니다."],
      ],
      features: [
        {
          title: "계정·캐릭터 식별과 로그인 복원",
          summary: "인증 정보와 플레이 상태를 분리하고 로그인 시 캐릭터·맵·기본 스탯을 하나의 복원 흐름으로 구성합니다.",
          details: [
            ["테이블 경계", "UserAccount는 인증 기준, UserInfo는 맵·위치·튜토리얼·전투 스탯을 담당하는 1:1 상태입니다."],
            ["복원 방식", "로그인 성공 후 UserInfo와 MapInfo를 조회해 세션 상태를 만들고 클라이언트 DataCenter로 전달합니다."],
            ["보안 과제", "고정 솔트와 평문 TCP는 운영 수준이 아니므로 사용자별 솔트와 TLS 적용이 필요합니다."],
          ],
          diagram: {
            title: "로그인 조회 대상과 세션 복원",
            zoomable: true,
            groups: [
              { title: "Server Code", nodes: ["PacketMethod", "Queries", "Session"] },
              { title: "DB Tables", nodes: ["UserAccount", "UserInfo", "MapInfo"] },
            ],
            relations: [
              ["PacketMethod", "dependency", "Queries", "로그인 조회"],
              ["Queries", "data", "UserAccount", "인증 데이터"],
              ["Queries", "data", "UserInfo", "캐릭터 상태"],
              ["Queries", "data", "MapInfo", "저장 위치가 NULL이면 스폰 좌표"],
              ["PacketMethod", "dependency", "Session", "UserId·MapId·위치 설정"],
            ],
          },
        },
        {
          title: "인벤토리·장비 상태",
          summary: "아이템 정의 자체가 아니라 사용자별 보유량·슬롯·장착 여부만 행 단위로 저장합니다.",
          details: [
            ["테이블 경계", "Inventory가 UserID와 ItemID를 연결하고 Amount·SlotIndex·IsEquipped를 플레이 상태로 보관합니다."],
            ["복원 방식", "DB의 ItemID와 클라이언트 ScriptableObject 정의를 결합해 런타임 아이템과 슬롯을 재구성합니다."],
            ["설계 판단", "정의 데이터의 중복 저장을 피했지만 클라이언트와 DB가 동일한 정의 ID 계약을 유지해야 합니다."],
          ],
          diagram: {
            title: "인벤토리 행 조회와 장착 상태 저장",
            zoomable: true,
            groups: [
              { title: "Server Code", nodes: ["PacketMethod", "Queries", "DBManager"] },
              { title: "Packet Struct", nodes: ["PKT_INVENTORY_ITEM"] },
              { title: "DB Table", nodes: ["Inventory"] },
            ],
            relations: [
              ["PacketMethod", "dependency", "Queries", "로그인 조회·저장 요청"],
              ["PacketMethod", "dependency", "PKT_INVENTORY_ITEM", "ItemID·수량·슬롯·장착 상태"],
              ["Queries", "dependency", "PKT_INVENTORY_ITEM", "저장 값 읽기"],
              ["Queries", "data", "Inventory", "UserID별 SELECT·REPLACE"],
              ["Queries", "dependency", "DBManager", "연결과 쿼리 잠금"],
            ],
          },
        },
        {
          title: "퀘스트·조건별 진행 상태",
          summary: "퀘스트의 완료 상태와 반복 가능한 조건 진행도를 서로 다른 관계로 분리했습니다.",
          details: [
            ["테이블 경계", "UserQuest는 수락·완료·보상 상태를, UserQuestProgress는 ConditionIndex별 CurrentCount를 저장합니다."],
            ["복원 방식", "퀘스트 정의 ID에 조건별 진행 행을 결합해 QuestProgressData를 다시 구성합니다."],
            ["트랜잭션", "보상 수령은 완료 상태·보상 플래그·인벤토리 지급을 하나의 트랜잭션으로 묶는 것이 다음 단계입니다."],
          ],
          diagram: {
            title: "퀘스트 상태와 조건별 진행 행",
            zoomable: true,
            groups: [
              { title: "Server Code", nodes: ["PacketMethod", "Queries"] },
              { title: "Packet Struct", nodes: ["PKT_QUEST_DATA"] },
              { title: "DB Tables", nodes: ["UserQuest", "UserQuestProgress"] },
            ],
            relations: [
              ["PacketMethod", "dependency", "Queries", "조회·초기화·저장"],
              ["Queries", "dependency", "PKT_QUEST_DATA", "완료·보상·조건별 수량 읽기"],
              ["Queries", "data", "UserQuest", "완료·보상 상태 REPLACE"],
              ["Queries", "data", "UserQuestProgress", "기존 행 DELETE 후 INSERT"],
              ["UserQuest", "data", "UserQuestProgress", "UserID·QuestId로 조회 JOIN"],
            ],
          },
        },
        {
          title: "맵·몬스터 스폰 기준",
          summary: "플레이어의 현재 위치와 월드의 스폰 정의를 MapInfo를 중심으로 연결했습니다.",
          details: [
            ["테이블 경계", "MapInfo는 플레이어·몬스터 스폰 좌표와 최대 개체 수를, Monster는 맵에서 생성할 몬스터 종류를 가리킵니다."],
            ["서버 연결", "서버 시작 시 전체 맵의 스폰 기준을 조회해 MapData를 등록합니다. 맵 진입·이동 시에는 등록된 맵을 조회하고 세션의 현재 맵과 위치를 갱신합니다."],
            ["설계 판단", "정적 월드 정의가 커지면 전용 콘텐츠 데이터와 런타임 스폰 상태를 추가로 분리해야 합니다."],
          ],
          diagram: {
            title: "맵 정의 조회와 서버 월드 등록",
            zoomable: true,
            groups: [
              { title: "DB Tables", nodes: ["MapInfo", "Monster"] },
              { title: "Load Data", nodes: ["Queries", "MapInitialInfo"] },
              { title: "Runtime World", nodes: ["MapData", "MapDataManager"] },
            ],
            relations: [
              ["Queries", "data", "MapInfo", "스폰 좌표·최대 수"],
              ["Queries", "data", "Monster", "MapId로 종류 조회"],
              ["Queries", "dependency", "MapInitialInfo", "맵별 조회 결과 구성"],
              ["MapInitialInfo", "data", "MapData", "main에서 생성자에 전달"],
              ["MapDataManager", "aggregation", "MapData", "main에서 MapId별 등록"],
            ],
          },
        },
        {
          title: "저장 시점과 일관성",
          summary: "맵 이동·연결 종료를 기본 체크포인트로 사용하고 여러 테이블의 변경 경계를 명시했습니다.",
          details: [
            ["현재 구현", "맵 변경 요청과 서버 연결 종료 시 맵·위치를 저장합니다. 클라이언트는 정상 종료 요청 때 인벤토리·스탯·퀘스트 저장 패킷을 보내며, 서버가 각 요청에 대해 DB 행을 갱신합니다."],
            ["문제 인식", "종료 시점 중심 저장은 비정상 종료에 취약하고 여러 테이블이 일부만 반영될 수 있습니다."],
            ["개선 방향", "중요 이벤트 체크포인트, 주기 저장, 트랜잭션, 비동기 DB 작업 큐를 순서대로 추가합니다."],
          ],
          diagram: {
            title: "저장 요청 경로와 테이블별 반영",
            zoomable: true,
            groups: [
              { title: "Server Entry Points", nodes: ["Session", "PacketMethod"] },
              { title: "Persistence", nodes: ["Queries", "DBManager"] },
              { title: "DB Tables", nodes: ["UserInfo", "Inventory", "UserQuest", "UserQuestProgress"] },
            ],
            relations: [
              ["Session", "dependency", "Queries", "Close에서 위치 저장"],
              ["PacketMethod", "dependency", "Queries", "맵 이동·상태 저장 요청"],
              ["Queries", "dependency", "DBManager", "동기 쿼리 실행"],
              ["Queries", "data", "UserInfo", "위치·맵·스탯·튜토리얼"],
              ["Queries", "data", "Inventory", "아이템 행"],
              ["Queries", "data", "UserQuest", "퀘스트 상태"],
              ["Queries", "data", "UserQuestProgress", "조건별 수량"],
            ],
          },
        },
      ],
      diagram: {
        kind: "er",
        source: String.raw`erDiagram
    UserAccount ||--|| UserInfo : has
    UserAccount ||--o{ Inventory : owns
    UserAccount ||--o{ UserQuest : tracks
    UserQuest ||--o{ UserQuestProgress : contains
    MapInfo ||--o{ UserInfo : locates
    MapInfo ||--o{ Monster : spawns

    UserAccount {
        string UserID PK
        string PasswordHash
        string Salt
    }
    UserInfo {
        string UserID PK
        int MapId FK
        float PosX
        float PosY
        float PosZ
        int TutorialStep
        float HP
        int AttackPower
        int DefencePower
    }
    Inventory {
        string UserID FK
        string ItemID
        int Amount
        int SlotIndex
        boolean IsEquipped
    }
    UserQuest {
        string UserID PK
        int QuestId PK
        boolean IsCompleted
        boolean RewardClaimed
    }
    UserQuestProgress {
        string UserID PK
        int QuestId PK
        int ConditionIndex PK
        int CurrentCount
    }
    MapInfo {
        int MapId PK
        float SpawnX
        float SpawnY
        float SpawnZ
        int MaxEnemyCount
    }
    Monster {
        int MonsterId PK
        int MapId FK
    }`,
        entities: [
          { name: "UserAccount", fields: ["PK  UserID", "PasswordHash", "Salt"] },
          { name: "UserInfo", fields: ["PK  UserID", "FK  MapId", "PosX / PosY / PosZ", "TutorialStep", "HP / Attack / Defence"] },
          { name: "MapInfo", fields: ["PK  MapId", "SpawnX / SpawnY / SpawnZ", "MaxEnemyCount"] },
          { name: "Inventory", fields: ["FK  UserID", "ItemID", "Amount", "SlotIndex", "IsEquipped"] },
          { name: "UserQuest", fields: ["PK  UserID + QuestId", "IsCompleted", "RewardClaimed"] },
          { name: "Monster", fields: ["PK  MonsterId", "FK  MapId"] },
          { name: "UserQuestProgress", fields: ["PK  UserID + QuestId", "PK  ConditionIndex", "CurrentCount"] },
        ],
        erRelations: [
          ["UserAccount", "UserInfo", "1", "1", "계정 상태"],
          ["UserAccount", "Inventory", "1", "N", "보유 아이템"],
          ["UserAccount", "UserQuest", "1", "N", "퀘스트 상태"],
          ["UserQuest", "UserQuestProgress", "1", "N", "조건별 진행"],
          ["MapInfo", "UserInfo", "1", "N", "현재 맵"],
          ["MapInfo", "Monster", "1", "N", "스폰 정의"],
        ],
        title: "게임 상태 테이블 ER 다이어그램",
        groups: [
          { title: "Identity", nodes: ["UserAccount", "UserInfo"] },
          { title: "Progress", nodes: ["Inventory", "UserQuest", "UserQuestProgress"] },
          { title: "World", nodes: ["MapInfo", "Monster"] },
          { title: "Access", nodes: ["Queries", "DBManager"] },
        ],
        relations: [
          ["UserAccount", "composition", "UserInfo", "1:1"],
          ["UserAccount", "aggregation", "Inventory", "1:N"],
          ["UserAccount", "aggregation", "UserQuest", "1:N"],
          ["UserQuest", "composition", "UserQuestProgress", "1:N"],
          ["MapInfo", "aggregation", "UserInfo", "현재 맵"],
          ["MapInfo", "aggregation", "Monster", "스폰 정의"],
          ["Queries", "dependency", "DBManager", "Prepared Statement"],
        ],
      },
    },
  ],
};

const everwindProject = projects["project-1"];
const clientDocument = everwindDesignDocument.technicalDocs.find((item) => item.id === "client");
const serverDocument = everwindDesignDocument.technicalDocs.find((item) => item.id === "server");

// Move only the requested topics; keep their verified descriptions and diagrams.
const assemblyTitle = "Unity 메인 스레드와 지연 데이터 조립";
const assemblyFeature = everwindProject.coreFeatures.find((item) => item.title === assemblyTitle);
const assemblyDesign = everwindDesignDocument.coreFeatures.find((item) => item.title === assemblyTitle);
const receiveFeature = clientDocument.features.find((item) => item.title === "네트워크 수신과 Unity 반영");
receiveFeature.title = assemblyTitle;
receiveFeature.summary = assemblyDesign.intent;
receiveFeature.details = [
  ["해결하려는 문제", assemblyDesign.problem],
  ...assemblyDesign.decisions,
  ["구현 결과", assemblyDesign.result],
  ["설계 판단과 다음 단계", assemblyDesign.tradeoff],
];
receiveFeature.media = assemblyFeature.video;
everwindProject.coreFeatures = everwindProject.coreFeatures.filter((item) => item.title !== assemblyTitle);
everwindDesignDocument.coreFeatures = everwindDesignDocument.coreFeatures.filter((item) => item.title !== assemblyTitle);

const contentDesign = everwindDesignDocument.coreFeatures.find((item) => item.title === "데이터 중심 RPG 콘텐츠 확장");
contentDesign.implementationSections = clientDocument.features.filter((item) => ["스킬·아이템·장비·제작", "팝업·인벤토리·장비·제작 UI"].includes(item.title));
clientDocument.features = clientDocument.features.filter((item) => !contentDesign.implementationSections.includes(item));
contentDesign.decisions.push(
  ["호출 측의 경계", "스킬 실행은 Skill, 아이템 사용은 IUsableItem, 튜토리얼 단계는 ITutorialStep으로 요청합니다. 호출 측은 공통 계약을 사용하고, 구체적인 행동은 파생 클래스가 담당합니다."],
  ["확장과 현실적 한계", "새 타입의 등록과 프리팹·데이터 연결은 필요합니다. 튜토리얼 단계표와 스킬별 애니메이션 분기도 남아 있으므로, 모든 콘텐츠를 코드 변경 없이 추가하는 구조는 아닙니다."],
);
contentDesign.implementationSections.push(
  {
    title: "스킬 계약과 단일·범위 공격의 다형성",
    summary: "전투 관리자는 공통 스킬 타입으로 실행을 요청하고, 타격 방식은 파생 스킬이 결정합니다.",
    emphasis: ["공통 스킬 타입", "파생 스킬", "범위 공격", "변경 범위"],
    details: [
      ["공통 경로", "추상 Skill이 실행 계약과 기본 타깃·피해 처리 경로를 제공합니다. CombatManager는 현재 선택된 Skill에 실행을 요청하므로 구체적인 스킬 클래스마다 호출 코드를 복제하지 않습니다."],
      ["파생 책임", "NormalSkill·SmashSkill은 Skill을 상속하고, Windmill은 범위 공격용 중간 베이스 AreaSkill을 상속합니다. 각 파생 스킬은 공격 시작, 타격 시점과 대상 선택의 차이를 구현합니다."],
      ["변경 범위", "새 공격은 파생 스킬과 필요한 프리팹·애니메이션 연결을 추가합니다. 공통 피해 계산은 재사용하지만 스킬 선택·연결 지점과 애니메이션 분기는 함께 확인해야 합니다."],
    ],
    diagram: {
      title: "공통 스킬 계약과 공격 유형 확장",
      direction: "TB",
      zoomable: true,
      groups: [
        { title: "Caller", nodes: ["CombatManager"] },
        { title: "Common Contract", nodes: ["Skill", "AreaSkill"] },
        { title: "Concrete Skills", nodes: ["NormalSkill", "SmashSkill", "Windmill"] },
      ],
      relations: [
        ["CombatManager", "aggregation", "Skill", "선택된 스킬 실행"],
        ["AreaSkill", "inheritance", "Skill"],
        ["NormalSkill", "inheritance", "Skill"],
        ["SmashSkill", "inheritance", "Skill"],
        ["Windmill", "inheritance", "AreaSkill"],
      ],
    },
  },
  {
    title: "튜토리얼 단계 계약과 등록 기반 확장",
    summary: "단계의 진입·갱신·종료는 공통 계약으로 실행하고, 목표 판정과 이벤트 구독은 개별 단계에 둡니다.",
    emphasis: ["공통 계약", "개별 단계", "단계표", "구독 해제"],
    details: [
      ["공통 수명주기", "TutorialGuide는 현재 단계를 ITutorialStep으로 보관합니다. 전환할 때 이전 단계의 종료를 호출하고 새 단계를 진입시키며, 매 프레임 현재 단계만 갱신합니다."],
      ["개별 규칙", "CameraStep·MoveStep·CombatStep·InteractStep·CraftStep·EquipStep이 같은 계약을 구현합니다. 입력이나 플레이 사건을 관찰하는 방식은 각 단계가 맡고, 종료 시 필요한 구독 해제를 수행합니다."],
      ["확장 지점", "새 단계는 구현 클래스와 TutorialStep 열거형·단계표 등록을 추가합니다. 공통 전환 흐름은 재사용하지만 새 단계가 자동 탐색되는 구조는 아니며, 저장된 단계 값과의 호환성도 확인해야 합니다."],
    ],
    diagram: {
      title: "튜토리얼 공통 계약과 단계별 구현",
      direction: "TB",
      zoomable: true,
      groups: [
        { title: "Guide", nodes: ["TutorialGuide", "ITutorialStep"] },
        { title: "Concrete Steps", nodes: ["CameraStep", "MoveStep", "CombatStep", "InteractStep", "CraftStep", "EquipStep"] },
      ],
      relations: [
        ["TutorialGuide", "aggregation", "ITutorialStep", "단계표와 현재 단계"],
        ...["CameraStep", "MoveStep", "CombatStep", "InteractStep", "CraftStep", "EquipStep"].map((step) => [step, "implementation", "ITutorialStep"]),
      ],
    },
  },
);

const timerImplementation = serverDocument.features.find((item) => item.title === "몬스터 월드와 타이머");
serverDocument.features = serverDocument.features.filter((item) => item !== timerImplementation);
const timerTitle = "서버 타이머와 맵별 몬스터 보충";
everwindProject.coreFeatures.push({
  title: timerTitle,
  summary: "시간 기반 작업을 I/O 처리와 분리하고, 주기적으로 부족한 몬스터만 보충합니다.",
  emphasis: ["타이머 전용 스레드", "실행 시각", "우선순위 큐", "10초", "부족한 수량", "신규 인스턴스"],
  why: "몬스터 리필처럼 일정 시간이 지나야 실행할 작업을 네트워크 요청이 올 때만 처리하면, 플레이어 입력 여부에 따라 월드 갱신 시점이 달라집니다. I/O 완료를 처리하는 워커에서 시간을 기다리게 하는 것도 다른 접속의 처리를 지연시킬 수 있어, 시간 작업을 별도로 관리할 필요가 있었습니다.",
  how: "타이머 전용 스레드와 실행 시각 기준 우선순위 큐를 두고, 작업이 없거나 실행 시각 전이면 조건 변수로 대기합니다. 콜백은 큐 잠금을 해제한 뒤 실행하며 반복 작업은 다음 시각을 갱신해 다시 등록합니다. 현재 서버는 10초마다 모든 맵을 확인해 최대 수량 대비 부족한 수량만 생성하고, 신규 인스턴스 패킷만 같은 맵 사용자에게 전달합니다.",
  video: {
    src: "assets/videos/everwind-server-timer-refill.mp4",
    title: "서버 타이머 · 몬스터 처치 후 스폰 로그와 월드 보충",
  },
});
everwindDesignDocument.coreFeatures.push({
  title: timerTitle,
  intent: "접속 이벤트와 무관하게 월드의 주기 작업을 실행하고, 타이머와 게임 규칙의 책임을 나눈다.",
  keywords: ["전용 스레드", "우선순위 큐", "조건 변수", "반복 콜백", "증분 스폰"],
  problem: everwindProject.coreFeatures.at(-1).why,
  decisions: [
    ["시간 기준", "steady_clock의 실행 시각으로 작업을 정렬하고, 단발 작업과 반복 작업을 같은 큐로 관리합니다."],
    ["대기와 실행", "빈 큐에서는 조건 변수로 대기하고 가장 이른 실행 시각까지 wait_until합니다. 새 작업 등록 시 알림을 보내며, 콜백 실행 중에는 큐 잠금을 유지하지 않습니다."],
    ["반복 정책", "반복 작업은 실행 후 기존 예정 시각에 간격을 더해 다시 등록합니다. 긴 콜백이 후속 작업을 늦출 수 있으므로 정밀한 실시간 틱을 보장하는 구조는 아닙니다."],
    ["게임 규칙", "서버 시작 시 10초 간격 몬스터 리필을 등록합니다. 타이머는 호출 시점만 결정하고, 맵 관리자는 부족한 개체 생성과 해당 맵에 신규 스폰 패킷을 전파하는 일을 맡습니다."],
  ],
  result: "클라이언트 입력이 없어도 서버가 맵별 몬스터 수를 보충하며, 전체 목록을 반복 전송하지 않고 새로 생성된 개체만 전달합니다.",
  tradeoff: "콜백은 하나의 타이머 스레드에서 순차 실행됩니다. 종료 함수는 스레드를 깨워 합류하지만, 현재 main의 종료 경로에서 타이머 정리를 명시적으로 연결하는 보완이 필요합니다. 몬스터 이동·공격의 서버 권위 이전도 별도 과제입니다.",
  diagram: timerImplementation.diagram,
});

const coreFeatureOrder = [
  "데이터 중심 RPG 콘텐츠 확장",
  "IOCP 비동기 세션과 패킷 수명주기",
  "맵 단위 멀티플레이 동기화",
  "재접속 가능한 게임 상태 영속화",
  "상태 머신 기반 전투 흐름",
  "이벤트 기반 퀘스트·튜토리얼",
  timerTitle,
];
everwindProject.coreFeatures = coreFeatureOrder.map((title) => {
  const feature = everwindProject.coreFeatures.find((item) => item.title === title);
  feature.keywords = everwindDesignDocument.coreFeatures.find((item) => item.title === title).keywords;
  return feature;
});
everwindDesignDocument.coreFeatures = coreFeatureOrder.map((title) => everwindDesignDocument.coreFeatures.find((item) => item.title === title));
everwindProject.troubleshooting = [0, 1, 2, 4, 3, 5, 6].map((index) => everwindProject.troubleshooting[index]);
const startupImplementation = clientDocument.features.find((item) => item.title === "코어 초기화와 월드 조립");
clientDocument.features = clientDocument.features.filter((item) => item !== startupImplementation);
const mapTransitionImplementation = serverDocument.features.find((item) => item.title === "맵 단위 세션과 멀티플레이 전파");
serverDocument.features = serverDocument.features.filter((item) => item !== mapTransitionImplementation);
const hudImplementation = clientDocument.features.find((item) => item.title === "UI 이벤트와 HUD·미니맵·전투 피드백");
const mapCleanupDetail = hudImplementation.details.find(([label]) => label === "맵 전환·한계");
const minimapDetail = hudImplementation.details.find(([label]) => label === "미니맵");
hudImplementation.title = "UI 이벤트와 HUD·전투 피드백";
hudImplementation.emphasis = hudImplementation.emphasis.filter((keyword) => !["미니맵", "맵 전환"].includes(keyword));
hudImplementation.details = hudImplementation.details.filter(([label]) => !["미니맵", "맵 전환·한계"].includes(label));
clientDocument.notes = clientDocument.notes.filter(([label]) => label !== "초기화");
const combatImplementation = clientDocument.features.find((item) => item.title === "플레이어 상태와 전투");
combatImplementation.details = combatImplementation.details.filter(([label]) => label !== "변경 지점");
const questImplementation = clientDocument.features.find((item) => item.title === "퀘스트·튜토리얼 이벤트");
questImplementation.details = questImplementation.details.filter(([label]) => label !== "변경 지점");

everwindDesignDocument.troubleshooting = [
  {
    keywords: ["등록/초기화 분리", "우선순위", "서비스/인게임", "씬 수명"],
    decisions: [
      ["등록 시점", "SingletonBase의 Awake는 인스턴스를 확정하고 SingletonManager에 등록합니다. 실제 초기화는 별도 Init 계약으로 두어, 등록된 객체가 반드시 준비된 객체라는 가정을 없앴습니다."],
      ["두 초기화 단계", "우선순위가 음수인 매니저는 서비스 목록에, 나머지는 인게임 목록에 넣습니다. 각 목록은 Priority 순으로 정렬해 Init을 호출하고, 서비스 목록은 매니저의 Start에서 먼저 실행합니다."],
      ["월드 이후 준비", "SceneLoader는 씬 로딩을 기다린 뒤 WorldLoader에 맵·플레이어·원격 객체·몬스터 조립을 요청합니다. 그 뒤 인게임 매니저의 초기화를 호출해 월드 참조가 필요한 시스템의 준비 시점을 맞춥니다."],
      ["수명 정리", "IsPersistent인 인스턴스만 DontDestroyOnLoad로 유지하고 중복 인스턴스는 제거합니다. 기존 인스턴스가 파괴될 때 등록 목록과 정적 참조를 해제해 새 씬에서 이전 참조를 사용하지 않게 합니다."],
      ["추가 시스템", startupImplementation.details[2][1]],
    ],
    tradeoff: "우선순위는 실행 순서를 명시하지만 의존 관계를 자동 검증하지는 않습니다. 새 매니저는 등록 시점과 Priority를 확인해야 하며, 향후 의존성 주입과 명시적 부트스트랩으로 개선할 수 있습니다.",
    diagram: startupImplementation.diagram,
  },
  {
    keywords: ["비제네릭 베이스", "공통 계약", "타입별 인스턴스", "타입 키 조회"],
    decisions: [
      ["공통 베이스", "SingletonBasest가 Priority·IsPersistent·Init 계약을 제공합니다. SingletonManager는 이 비제네릭 타입의 목록으로 서로 다른 종류의 매니저를 동일하게 관리합니다."],
      ["타입별 구현", "SingletonBase<T>는 공통 베이스를 상속하면서 T별 정적 인스턴스 접근, 기존 객체 검색·생성, 중복 제거와 파괴 시 해제를 맡습니다. 개별 매니저는 이 제네릭 베이스를 상속합니다."],
      ["등록과 조회", "등록 딕셔너리는 실제 Type을 키로 사용하고 공통 베이스를 값으로 보관합니다. 조회 시 요청한 매니저 타입으로 돌려주므로, 초기화는 공통 계약으로 처리하면서 사용 측의 타입별 접근은 유지합니다."],
    ],
    tradeoff: "접근점이 전역으로 열려 있어 호출 측의 의존성이 드러나지 않는 한계는 남습니다. 공통 베이스를 도입한 것과 결합도를 완전히 제거한 것은 구분했습니다.",
    diagram: {
      title: "싱글톤 공통 계약과 타입별 접근",
      direction: "TB", zoomable: true,
      groups: [
        { title: "Common Base", nodes: ["SingletonBasest", "SingletonBase"] },
        { title: "Concrete Managers", nodes: ["SingletonManager", "DataCenter", "NetworkClient", "SceneLoader"] },
      ],
      relations: [
        ["SingletonBase", "inheritance", "SingletonBasest", "제네릭 인스턴스 관리"],
        ...["SingletonManager", "DataCenter", "NetworkClient", "SceneLoader"].map((name) => [name, "inheritance", "SingletonBase"]),
        ["SingletonManager", "aggregation", "SingletonBasest", "공통 목록과 타입별 등록"],
      ],
    },
  },
  {
    keywords: ["월드 정리", "전투 리셋", "맵 소속", "좌표 적용"],
    decisions: [
      ["서버 소속", "맵 변경 요청에서 이전 맵의 세션을 제거하고 세션의 맵·위치를 바꾼 뒤 새 맵에 등록합니다. 입장 응답에 새 맵의 플레이어와 몬스터 정보를 구성합니다."],
      ["클라이언트 정리", "WorldLoader는 플레이어의 전투 상태와 이동을 리셋하고, 적 체력 UI를 정리합니다. 이전 맵을 제거하고 원격 플레이어·몬스터 등록 목록도 비운 뒤 새 목록을 조립합니다."],
      ["좌표 반영", "새 맵과 원격 객체를 구성한 후 로컬 플레이어를 스폰 좌표로 이동합니다. CharacterController를 잠시 끄고 위치를 반영한 뒤 다시 켜, 이동 컴포넌트가 이전 위치를 기준으로 좌표를 보정하지 않게 합니다."],
      ["표현 자원", mapCleanupDetail[1]],
    ],
    tradeoff: "맵 전환의 정리 순서는 명시했지만, 로딩 실패 시 이전 월드로 복귀하는 절차와 연속 전환 요청의 검증은 별도 보완 과제입니다.",
    implementationSections: [mapTransitionImplementation],
    diagram: {
      title: "맵 전환 시 월드·전투·UI 정리 책임",
      direction: "TB", zoomable: true,
      groups: [
        { title: "Transition", nodes: ["PacketMethod", "WorldLoader"] },
        { title: "Cleanup Targets", nodes: ["Player", "CombatManager", "EnemyHpUIManager", "OtherPlayerManager", "EnemySpawner"] },
      ],
      relations: [
        ["PacketMethod", "dependency", "WorldLoader", "메인 스레드에서 월드 변경"],
        ["WorldLoader", "aggregation", "Player", "기존 로컬 플레이어 이동"],
        ["Player", "aggregation", "CombatManager", "전투 상태 접근"],
        ["WorldLoader", "dependency", "CombatManager", "타깃·공격 버퍼 리셋"],
        ["WorldLoader", "dependency", "EnemyHpUIManager", "표시 자원 정리"],
        ["WorldLoader", "dependency", "OtherPlayerManager", "이전 원격 객체 제거"],
        ["WorldLoader", "dependency", "EnemySpawner", "이전 몬스터 제거"],
      ],
    },
  },
  {
    keywords: ["Owner 검증", "원격 보간", "사망 요청 1회", "회전 보정"],
    decisions: [
      ["제어권 결정", "서버는 공격자를 몬스터의 Owner로 기록해 피해 응답에 전달합니다. 클라이언트의 EnemyNetworkSync는 로컬 사용자 ID와 Owner ID를 비교해 이동·공격 계산 여부를 결정합니다."],
      ["표현 분리", "소유자가 아닌 클라이언트는 받은 위치를 Lerp로, 바라보는 방향을 Slerp로 보간합니다. 몬스터 모델의 정면 축 차이는 Enemy가 제공하는 회전 보정값으로 적용합니다."],
      ["요청 검증", "서버의 이동·공격 처리기는 요청 세션이 현재 Owner인지 확인합니다. 사망 요청은 Owner가 지정되어 있으면 해당 사용자만 허용하고, 서버 맵에서 몬스터를 제거한 뒤 사망 확인 패킷을 전파합니다."],
      ["중복 방지", "클라이언트는 HP와 사망·요청 전송 플래그를 확인해 사망 요청을 한 번만 보냅니다. 서버에서 이미 제거된 인스턴스는 후속 요청에서 조회되지 않아 다시 제거하거나 확인 응답을 생성하지 않습니다."],
    ],
    tradeoff: "이는 클라이언트 소유권을 서버가 검증하는 프로토타입 구조입니다. AI·판정이 완전히 서버 권위로 실행되는 구조나 동시 요청의 완전한 원자성을 보장했다고 설명하지 않았습니다.",
    diagram: {
      title: "서버의 몬스터 소유자 검증과 제거",
      direction: "TB", zoomable: true,
      groups: [
        { title: "Request", nodes: ["PacketMethod", "Session"] },
        { title: "Server World", nodes: ["MapDataManager", "MapData", "Enemy"] },
      ],
      relations: [
        ["PacketMethod", "dependency", "Session", "요청자의 사용자·맵 ID"],
        ["PacketMethod", "dependency", "MapDataManager", "현재 맵 조회"],
        ["MapDataManager", "aggregation", "MapData"],
        ["MapData", "aggregation", "Enemy", "인스턴스 목록"],
        ["PacketMethod", "dependency", "Enemy", "Owner 확인"],
        ["PacketMethod", "dependency", "MapData", "제거 후 같은 맵에 전파"],
      ],
    },
  },
  {
    keywords: ["증분 스폰", "인스턴스 ID", "지면 Raycast", "높이 보정"],
    decisions: [
      ["서버 보충", "맵은 최대 수량에서 현재 수량을 뺀 만큼만 생성하고 새로 만든 목록을 반환합니다. 맵 관리자는 그 목록의 인스턴스 ID·종류·좌표만 스폰 패킷으로 전달합니다. 주기 실행 구조는 Core Feature의 서버 타이머에서 설명합니다."],
      ["준비 전 보관", "로컬 플레이어가 아직 없으면 수신한 몬스터 정보를 DataCenter의 대기 큐에 보관합니다. 준비된 월드를 대상으로만 오브젝트를 생성해 로딩 중 참조 누락을 피합니다."],
      ["중복 필터", "WorldLoader는 EnemySpawner에 같은 인스턴스 ID가 등록되어 있는지 먼저 확인합니다. 이미 존재하거나 정의 테이블에 없는 몬스터 종류면 생성하지 않습니다."],
      ["지형 보정", "서버 좌표보다 위에서 Ground 레이어를 향해 아래로 Raycast합니다. 충돌 지점을 찾으면 y좌표만 지면 높이로 바꾸고 프리팹을 생성한 뒤 인스턴스 ID로 등록합니다."],
    ],
    tradeoff: "지면을 찾지 못하면 현재 코드는 원래 높이를 사용합니다. Ground 레이어 설정과 스폰 반경 검증이 필요하며, 서버 자체가 지형 충돌을 판정하는 구조는 아닙니다.",
    diagram: {
      title: "수신된 몬스터의 중복 검사와 높이 보정",
      direction: "TB", zoomable: true,
      groups: [
        { title: "Spawn Entry", nodes: ["PacketMethod", "WorldLoader"] },
        { title: "Definition And Registry", nodes: ["DataCenter", "EnemySpawner"] },
        { title: "Unity World", nodes: ["Physics", "Enemy"] },
      ],
      relations: [
        ["PacketMethod", "dependency", "WorldLoader", "스폰 정보 반영"],
        ["WorldLoader", "dependency", "DataCenter", "대기 큐·몬스터 정의"],
        ["WorldLoader", "dependency", "EnemySpawner", "인스턴스 ID 중복 검사"],
        ["WorldLoader", "dependency", "Physics", "Ground Raycast"],
        ["WorldLoader", "dependency", "Enemy", "보정 좌표로 생성·초기화"],
        ["EnemySpawner", "aggregation", "Enemy", "ID별 등록"],
      ],
    },
  },
  {
    keywords: ["공통 전이", "개체별 Override", "키 클립", "표현 데이터"],
    decisions: [
      ["컨트롤러 구성", "AnimationContexter는 Animator의 기존 컨트롤러로 개체별 AnimatorOverrideController를 생성해 연결합니다. 공통 전이 구조는 유지하고 클립 교체만 해당 개체에 적용합니다."],
      ["표현 데이터", "AnimationSet은 대기·이동·공격·피격·원샷의 원본 키 클립과 대체 클립을 보관합니다. 일반·전투 여부나 기술 종류에 맞는 클립을 골라 같은 키 위치에 덮어씁니다."],
      ["실행 순서", "클립을 교체한 뒤 isMove Bool이나 toAttack·toDamaged Trigger를 설정합니다. 공격 종류에 따라 SkillSpeed도 함께 변경해 공통 공격 전이와 서로 다른 기술 속도를 연결합니다."],
      ["적용 범위", "상호작용은 isInteract와 상태 직접 재생, 사망은 isDie 파라미터로 처리합니다. 모든 동작을 Override로 대체하지 않고 기존 상태 호출을 사용하는 부분을 구분했습니다."],
    ],
    tradeoff: "현재 공격·피격 클립 선택에는 인덱스 분기가 남아 있습니다. 새 기술은 애니메이션 세트의 클립과 선택 분기를 함께 연결해야 하며, 키 클립 누락 검증도 보완 지점입니다.",
    diagram: {
      title: "행동 판단과 Animator 클립 교체의 경계",
      direction: "TB", zoomable: true,
      groups: [
        { title: "Behaviour", nodes: ["PlayerStateContexter", "AnimationContexter"] },
        { title: "Clip Definition", nodes: ["AnimationSet"] },
        { title: "Unity Animation", nodes: ["Animator", "AnimatorOverrideController"] },
      ],
      relations: [
        ["PlayerStateContexter", "dependency", "AnimationContexter", "결정된 행동의 표현 요청"],
        ["AnimationContexter", "aggregation", "AnimationSet", "키·대체 클립 참조"],
        ["AnimationContexter", "dependency", "AnimatorOverrideController", "개체별 생성·클립 교체"],
        ["AnimationContexter", "dependency", "Animator", "파라미터·재생 속도"],
        ["Animator", "aggregation", "AnimatorOverrideController", "runtime controller"],
      ],
    },
  },
  {
    keywords: ["맵별 보정값", "변경 이벤트", "초기 재동기화", "카메라 추적"],
    decisions: [
      ["묶음 정의", "MapData에 맵 프리팹과 미니맵 이미지·위치·회전·스케일을 함께 저장합니다. 맵마다 다른 이미지 기준을 월드 좌표에 맞추는 보정값으로 관리합니다."],
      ["맵 변경", "WorldLoader는 맵 프리팹을 생성할 때 UIEvents로 이미지와 모든 보정값을 전달합니다. DisplayUIManager가 SpriteRenderer의 이미지와 로컬 위치·회전·스케일을 함께 적용합니다."],
      ["초기 동기화", "HUD의 Start에서는 현재 로그인 맵 ID로 DataCenter의 맵 테이블을 조회하고 같은 적용 함수를 호출합니다. 이벤트보다 UI 준비가 늦더라도 현재 맵 표시를 다시 맞춥니다."],
      ["플레이어 추적", minimapDetail[1]],
    ],
    tradeoff: "이미지별 보정값은 수동으로 설정하며, 현재 표시 대상은 맵 이미지와 플레이어 위치입니다. 자동 캘리브레이션이나 서버 기반 가시성 시스템까지 구현한 것은 아닙니다.",
    diagram: {
      title: "미니맵 보정 데이터와 변경·초기 동기화",
      direction: "TB", zoomable: true,
      groups: [
        { title: "Map Definition", nodes: ["DataCenter", "MapData", "WorldLoader"] },
        { title: "UI Boundary", nodes: ["UIEvents", "DisplayUIManager"] },
        { title: "Presentation", nodes: ["SpriteRenderer", "Player"] },
      ],
      relations: [
        ["DataCenter", "aggregation", "MapData", "맵 테이블"],
        ["WorldLoader", "dependency", "DataCenter", "새 맵 정의 조회"],
        ["WorldLoader", "event", "UIEvents", "이미지·보정값 발행"],
        ["UIEvents", "event", "DisplayUIManager", "맵 변경 구독"],
        ["DisplayUIManager", "dependency", "DataCenter", "Start에서 현재 맵 재조회"],
        ["DisplayUIManager", "dependency", "SpriteRenderer", "이미지와 Transform 적용"],
        ["DisplayUIManager", "dependency", "Player", "LateUpdate 카메라 추적"],
      ],
    },
  },
].map((implementation, index) => {
  const item = everwindProject.troubleshooting[index];
  return {
    ...implementation,
    title: item.title,
    intent: item.summary,
    problem: item.problem,
    result: item.solution,
    problemLabel: "문제 상황",
    resultLabel: "해결 방안",
  };
});
everwindDesignDocument.summary += " 콘텐츠 확장·서버 타이머의 구현은 ‘상세 구현 설명’, 트러블슈팅의 해결 과정은 ‘상세 해결 설명’에서 제공하며, 이 문서에는 중복하지 않았습니다.";
everwindProject.designDocument = everwindDesignDocument;

const modal = document.querySelector("#project-modal");
const closeButton = modal.querySelector(".modal-close");
const overviewJumpButton = modal.querySelector("#modal-jump-overview");
const designOpenButton = modal.querySelector("#modal-open-design");
const designModal = document.querySelector("#design-modal");
const designModalClose = designModal.querySelector(".design-modal-close");
const designToc = designModal.querySelector("#design-toc-list");
const featureDesignModal = document.querySelector("#feature-design-modal");
const featureDesignClose = featureDesignModal.querySelector(".design-modal-close");
const featureDesignTitle = featureDesignModal.querySelector("#feature-design-title");
const featureDesignContent = featureDesignModal.querySelector("#feature-design-content");
const technicalDocumentList = designModal.querySelector("#technical-document-list");
const umlZoomModal = document.querySelector("#uml-zoom-modal");
const umlZoomCanvas = umlZoomModal.querySelector("#uml-zoom-canvas");
const umlZoomViewport = umlZoomModal.querySelector(".uml-zoom-viewport");
const umlZoomScale = umlZoomModal.querySelector("#uml-zoom-scale");
const umlZoomValue = umlZoomModal.querySelector("#uml-zoom-value");
const umlZoomClose = umlZoomModal.querySelector(".design-modal-close");
const designFields = {
  kicker: designModal.querySelector("#design-document-kicker"),
  title: designModal.querySelector("#design-document-title"),
  summary: designModal.querySelector("#design-document-summary"),
  keywords: designModal.querySelector("#design-document-keywords"),
  systemFlow: designModal.querySelector("#design-system-flow"),
};
const videoModal = document.querySelector("#video-modal");
const videoModalTitle = videoModal.querySelector("#video-modal-title");
const featureVideo = videoModal.querySelector("#feature-video");
const featureImage = videoModal.querySelector("#feature-image");
const featureMediaGrid = videoModal.querySelector("#feature-media-grid");
const videoModalClose = videoModal.querySelector(".video-modal-close");
const imageZoomOverlay = videoModal.querySelector("#image-zoom-overlay");
const imageZoomTitle = videoModal.querySelector("#image-zoom-title");
const imageZoomImage = videoModal.querySelector("#image-zoom-image");
const imageZoomClose = videoModal.querySelector(".image-zoom-close");
const modalFields = {
  type: modal.querySelector("#modal-type"),
  title: modal.querySelector("#modal-title"),
  period: modal.querySelector("#modal-period"),
  feature: modal.querySelector("#modal-feature"),
  challenge: modal.querySelector("#modal-challenge"),
  solution: modal.querySelector("#modal-solution"),
  tags: modal.querySelector("#modal-tags"),
  gallerySection: modal.querySelector(".modal-gallery"),
  gallery: modal.querySelector("#modal-gallery-images"),
  otherProjectsSection: modal.querySelector("#modal-other-projects"),
  otherProjects: modal.querySelector("#modal-other-project-list"),
  overview: modal.querySelector("#modal-overview"),
  overviewTitle: modal.querySelector("#modal-overview-title"),
  overviewCopy: modal.querySelector("#modal-overview-copy"),
  motivation: modal.querySelector("#modal-motivation"),
  motivationTitle: modal.querySelector("#modal-motivation-title"),
  motivationCopy: modal.querySelector("#modal-motivation-copy"),
  info: modal.querySelector("#modal-info"),
  detail: modal.querySelector("#modal-detail"),
  outline: modal.querySelector("#modal-outline-list"),
  principles: modal.querySelector("#modal-principle-list"),
  principlesSection: modal.querySelector("#modal-principles"),
  principlesIndex: modal.querySelector("#modal-principles-index"),
  features: modal.querySelector("#modal-feature-list"),
  featuresSection: modal.querySelector("#modal-features"),
  featuresIndex: modal.querySelector("#modal-features-index"),
  troubleshootingSection: modal.querySelector("#modal-troubleshooting"),
  troubleshootingIndex: modal.querySelector("#modal-troubleshooting-index"),
  troubleshooting: modal.querySelector("#modal-troubleshooting-list"),
  story: modal.querySelector(".modal-story"),
  footer: modal.querySelector(".modal-footer"),
};

const buildGallery = (images) => {
  modalFields.gallery.replaceChildren();
  modalFields.gallery.dataset.imageCount = String(images.length);
  images.forEach((image) => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    if (image.background === "blur") {
      figure.classList.add("has-blurred-backdrop");
      figure.style.setProperty("--shot-image", `url("${image.src}")`);
    } else if (image.background) {
      img.style.backgroundColor = image.background;
    }
    figure.append(img);
    if (image.placeholder) {
      const label = document.createElement("span");
      label.className = "shot-placeholder-label";
      label.textContent = "IMAGE PLACEHOLDER";
      figure.append(label);
    }
    modalFields.gallery.append(figure);
  });
};

let activeOtherProjects = [];

const buildOtherProjects = (items = []) => {
  activeOtherProjects = items;
  modalFields.otherProjects.replaceChildren(
    ...items.map((item, index) => {
      const article = document.createElement("article");
      const projectNumber = document.createElement("div");
      article.className = "other-project-card";
      projectNumber.className = "other-project-number";
      projectNumber.setAttribute("aria-hidden", "true");
      projectNumber.textContent = `${String(index + 1).padStart(2, "0")}.`;

      const mediaStack = document.createElement("div");
      mediaStack.className = "other-project-media-stack";
      const mediaItems = [
        { src: item.image, alt: item.alt },
        ...(item.screenshots || []),
      ];
      mediaStack.append(...mediaItems.map((media) => {
        const figure = document.createElement("figure");
        const backdrop = document.createElement("img");
        const image = document.createElement("img");
        backdrop.className = "other-project-image-backdrop";
        backdrop.src = media.src;
        backdrop.alt = "";
        backdrop.setAttribute("aria-hidden", "true");
        image.className = "other-project-image-foreground";
        image.src = media.src;
        image.alt = media.alt;
        figure.append(backdrop, image);
        return figure;
      }));

      const body = document.createElement("div");
      const eyebrow = document.createElement("p");
      const title = document.createElement("h4");
      const genre = document.createElement("p");
      const summary = document.createElement("p");
      const info = document.createElement("dl");
      const tags = document.createElement("ul");
      eyebrow.className = "eyebrow";
      eyebrow.textContent = item.eyebrow || `GAME ${String(index + 1).padStart(2, "0")}`;
      title.textContent = item.title;
      genre.className = "other-project-genre";
      genre.textContent = item.genre;
      summary.className = "other-project-summary";
      summary.textContent = item.summary;
      info.className = "other-project-info";
      info.append(...(item.info || []).flatMap(([label, value]) => {
        const term = document.createElement("dt");
        const description = document.createElement("dd");
        term.textContent = label;
        description.textContent = value;
        return [term, description];
      }));
      const features = item.features || [];
      if (features.length) {
        const featureTerm = document.createElement("dt");
        const featureDescription = document.createElement("dd");
        const featureNames = document.createElement("span");
        featureTerm.textContent = "구현 기능";
        featureDescription.className = "other-project-feature-cell";
        featureNames.textContent = features.map((feature) => feature.title).join(", ");
        featureDescription.append(featureNames);
        if (features.some((feature) => feature.media)) {
          const mediaButton = document.createElement("button");
          mediaButton.type = "button";
          mediaButton.className = "other-project-media-trigger";
          mediaButton.dataset.projectIndex = String(index);
          const mediaFeatures = features.filter((feature) => feature.media);
          mediaButton.textContent = mediaFeatures.every((feature) => feature.media.type === "video")
            ? "영상 보기"
            : "사진/영상 보기";
          featureDescription.append(mediaButton);
        }
        info.append(featureTerm, featureDescription);
      }
      tags.className = "tag-list";
      tags.setAttribute("aria-label", `${item.title} 사용 기술`);
      tags.append(...item.tech.map((tech) => {
        const tag = document.createElement("li");
        tag.textContent = tech;
        return tag;
      }));
      body.append(eyebrow, title, genre, summary, info);
      if (item.tech.length) body.append(tags);
      article.append(projectNumber, mediaStack, body);
      return article;
    }),
  );
};

const makeFeatureKeywords = (keywords = []) => {
  const list = document.createElement("span");
  list.className = "feature-keywords";
  list.setAttribute("role", "list");
  list.setAttribute("aria-label", "구현 키워드");
  list.append(...keywords.map((keyword) => {
    const chip = document.createElement("span");
    chip.setAttribute("role", "listitem");
    chip.textContent = keyword;
    return chip;
  }));
  return list;
};

const makeResultMediaButton = (media) => {
  const button = document.createElement("button");
  const mediaType = media.type || "video";
  button.type = "button";
  button.className = "feature-result-trigger";
  button.dataset.mediaType = mediaType;
  button.dataset.mediaSrc = media.src;
  button.dataset.mediaTitle = media.title;
  button.dataset.mediaAlt = media.alt || media.title || "";
  button.textContent = mediaType === "image" ? "결과 사진 보기" : "결과 영상 보기";
  button.setAttribute("aria-haspopup", "dialog");
  return button;
};

const makeImplementationButton = (index, type = "coreFeatures") => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "feature-implementation-trigger";
  button.dataset.implementationIndex = index;
  button.dataset.implementationType = type;
  button.textContent = type === "troubleshooting" ? "상세 해결 설명" : "상세 구현 설명";
  button.setAttribute("aria-haspopup", "dialog");
  return button;
};

const makeOutlineButton = (label, targetId, summary = "", keywords = []) => {
  const button = document.createElement("button");
  const title = document.createElement("span");
  button.type = "button";
  button.dataset.modalTarget = targetId;
  title.className = "outline-title";
  title.textContent = label;
  button.append(title);
  if (summary) {
    const description = document.createElement("span");
    description.className = "outline-summary";
    description.textContent = summary;
    button.append(description);
  }
  if (keywords.length) button.append(makeFeatureKeywords(keywords));
  return button;
};

const appendEmphasizedText = (target, copy, emphasis = []) => {
  const terms = [...new Set(emphasis)]
    .filter((term) => term && copy.includes(term))
    .sort((left, right) => right.length - left.length);
  if (!terms.length) {
    target.textContent = copy;
    return;
  }

  const escapedTerms = terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escapedTerms.join("|")})`, "g");
  copy.split(pattern).forEach((part) => {
    if (!part) return;
    if (terms.includes(part)) {
      const strong = document.createElement("strong");
      strong.textContent = part;
      target.append(strong);
      return;
    }
    target.append(document.createTextNode(part));
  });
};

const MERMAID_MODULE_URL = "https://cdn.jsdelivr.net/npm/mermaid@11.12.0/dist/mermaid.esm.min.mjs";
const MERMAID_ELK_URL = "https://cdn.jsdelivr.net/npm/@mermaid-js/layout-elk@0.2.0/dist/mermaid-layout-elk.esm.min.mjs";
let mermaidModulePromise;
let mermaidElkPromise;
let mermaidRenderQueue = Promise.resolve();
let mermaidRenderIndex = 0;
let mermaidDiagramObserver;

const loadMermaid = () => {
  if (mermaidModulePromise) return mermaidModulePromise;
  mermaidModulePromise = import(MERMAID_MODULE_URL).then(({ default: mermaid }) => {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: {
        darkMode: true,
        background: "#060a12",
        primaryColor: "#111a2e",
        primaryTextColor: "#edf2ff",
        primaryBorderColor: "#ffb75c",
        secondaryColor: "#17213a",
        secondaryTextColor: "#edf2ff",
        secondaryBorderColor: "#67d3ff",
        tertiaryColor: "#0b1020",
        tertiaryTextColor: "#edf2ff",
        lineColor: "#8ab7d6",
        textColor: "#edf2ff",
        mainBkg: "#111a2e",
        secondBkg: "#17213a",
        classText: "#edf2ff",
        noteBkgColor: "#191f2e",
        noteTextColor: "#ffe18c",
        fontFamily: "Arial, 'Noto Sans KR', sans-serif",
        fontSize: "16px",
        clusterBkg: "#0b1020",
        clusterBorder: "#67d3ff",
      },
      class: { useMaxWidth: false, nodeSpacing: 24, rankSpacing: 35, diagramPadding: 16 },
      flowchart: { nodeSpacing: 24, rankSpacing: 35, curve: "linear" },
      er: { useMaxWidth: false },
    });
    return mermaid;
  }).catch((error) => {
    mermaidModulePromise = undefined;
    throw error;
  });
  return mermaidModulePromise;
};

const makeMermaidIdentifier = (value, fallback) => {
  const identifier = value.replace(/[^A-Za-z0-9_]/g, "");
  return identifier && !/^\d/.test(identifier) ? identifier : fallback;
};

const makeMermaidSource = (diagram) => {
  if (diagram.source) return diagram.source.trim();

  const knownNodes = new Set(diagram.groups.flatMap((group) => group.nodes));
  const externalNodes = [...new Set(diagram.relations.flatMap(([from, , to]) => [from, to]))]
    .filter((node) => !knownNodes.has(node));
  const groups = externalNodes.length
    ? [...diagram.groups, { title: "Shared Contract", nodes: externalNodes }]
    : diagram.groups;
  const lines = ["classDiagram", `direction ${diagram.direction || "LR"}`];

  groups.forEach((group, index) => {
    const identifier = makeMermaidIdentifier(group.title, `Group${index + 1}`);
    const namespace = knownNodes.has(identifier) ? `${identifier}Layer${index + 1}` : identifier;
    lines.push(`namespace ${namespace} {`);
    group.nodes.forEach((node) => lines.push(`  class ${node}`));
    lines.push("}");
  });

  diagram.relations.forEach(([from, type, to, note]) => {
    const label = note ? ` : ${note.replaceAll(":", "·")}` : "";
    if (type === "inheritance") lines.push(`${to} <|-- ${from}${label}`);
    else if (type === "implementation") lines.push(`${to} <|.. ${from}${label}`);
    else if (type === "composition") lines.push(`${from} *-- ${to}${label}`);
    else if (type === "aggregation") lines.push(`${from} o-- ${to}${label}`);
    else if (["dependency", "event", "data"].includes(type)) lines.push(`${from} ..> ${to}${label}`);
    else lines.push(`${from} --> ${to}${label}`);
  });
  if (diagram.routing === "elk") {
    lines.unshift("---", "config:", "  layout: elk", "  elk:", "    mergeEdges: false", "    nodePlacementStrategy: NETWORK_SIMPLEX", "    considerModelOrder: NONE", "    cycleBreakingStrategy: GREEDY", "---");
  }
  return lines.join("\n");
};

const roundMermaidEdges = (diagram) => {
  diagram.querySelectorAll('path[data-edge="true"][data-points]').forEach((path) => {
    const points = JSON.parse(atob(path.dataset.points));
    if (points.length < 2) return;
    points[0] = path.getPointAtLength(0);
    points[points.length - 1] = path.getPointAtLength(path.getTotalLength());
    // Round only the routed corners; staying inside each segment preserves node clearance.
    const commands = [`M${points[0].x},${points[0].y}`];
    for (let index = 1; index < points.length - 1; index += 1) {
      const before = points[index - 1];
      const point = points[index];
      const after = points[index + 1];
      const incoming = Math.hypot(point.x - before.x, point.y - before.y);
      const outgoing = Math.hypot(after.x - point.x, after.y - point.y);
      if (!incoming || !outgoing) continue;
      const radius = Math.min(12, incoming / 3, outgoing / 3);
      const start = { x: point.x + (before.x - point.x) * radius / incoming, y: point.y + (before.y - point.y) * radius / incoming };
      const end = { x: point.x + (after.x - point.x) * radius / outgoing, y: point.y + (after.y - point.y) * radius / outgoing };
      commands.push(`L${start.x},${start.y} Q${point.x},${point.y} ${end.x},${end.y}`);
    }
    const end = points[points.length - 1];
    commands.push(`L${end.x},${end.y}`);
    path.setAttribute("d", commands.join(" "));
  });
};

const straightenMermaidEdges = (diagram) => {
  diagram.querySelectorAll('path[data-edge="true"][data-points]').forEach((path) => {
    const points = JSON.parse(atob(path.dataset.points));
    if (points.length < 2) return;
    // Preserve Mermaid's marker offsets and routing waypoints, without Bezier smoothing.
    points[0] = path.getPointAtLength(0);
    points[points.length - 1] = path.getPointAtLength(path.getTotalLength());
    path.setAttribute("d", points.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" "));
  });
};

const renderMermaidCanvas = async (canvas) => {
  if (!canvas.isConnected || !canvas.closest("dialog")?.open) return;
  if (canvas.dataset.rendered === "true" || canvas.dataset.rendering === "true") return;
  canvas.dataset.rendering = "true";
  canvas.classList.remove("is-render-error");
  canvas.classList.add("is-loading");
  canvas.setAttribute("aria-busy", "true");

  try {
    const mermaid = await loadMermaid();
    if (canvas.dataset.routing === "elk") {
      mermaidElkPromise ||= import(MERMAID_ELK_URL).then(({ default: layouts }) => {
        mermaid.registerLayoutLoaders(layouts);
      }).catch((error) => {
        mermaidElkPromise = undefined;
        throw error;
      });
      await mermaidElkPromise;
    }
    await document.fonts.ready;
    const { svg, bindFunctions } = await mermaid.render(
      `everwind-mermaid-${++mermaidRenderIndex}`,
      canvas.dataset.mermaidSource,
      canvas,
    );
    canvas.innerHTML = svg;
    // Place namespace labels above the outline and include them in the fitted SVG bounds.
    canvas.querySelectorAll(".cluster").forEach((cluster) => {
      const rect = cluster.querySelector(":scope > rect");
      const label = cluster.querySelector(":scope > .cluster-label");
      if (!rect) return;
      rect.style.setProperty("stroke", "#67d3ff", "important");
      rect.style.setProperty("stroke-width", "1.5px", "important");
      if (!label) return;
      // Reuse part of the old internal title space so adjacent namespace labels do not overlap.
      const titleInset = 16;
      rect.setAttribute("y", Number(rect.getAttribute("y")) + titleInset);
      rect.setAttribute("height", Number(rect.getAttribute("height")) - titleInset);
      const labelBounds = label.getBBox();
      const x = Number(rect.getAttribute("x")) + (Number(rect.getAttribute("width")) - labelBounds.width) / 2;
      const y = Number(rect.getAttribute("y")) - labelBounds.height - 8;
      label.setAttribute("transform", `translate(${x}, ${y})`);
    });
    const diagram = canvas.querySelector("svg");
    if (canvas.dataset.routing === "elk") roundMermaidEdges(diagram);
    else straightenMermaidEdges(diagram);
    const bounds = diagram.getBBox();
    const padding = 16;
    diagram.setAttribute("viewBox", `${bounds.x - padding} ${bounds.y - padding} ${bounds.width + padding * 2} ${bounds.height + padding * 2}`);
    diagram.setAttribute("width", bounds.width + padding * 2);
    diagram.setAttribute("height", bounds.height + padding * 2);
    diagram.setAttribute("role", "img");
    diagram.setAttribute("aria-label", canvas.closest("figure").querySelector("figcaption").firstChild.textContent);
    diagram.setAttribute("preserveAspectRatio", "xMidYMid meet");
    bindFunctions?.(canvas);
    canvas.dataset.rendered = "true";
    const zoomTrigger = canvas.closest("figure").querySelector(".uml-zoom-trigger");
    if (zoomTrigger) zoomTrigger.disabled = false;
    canvas.classList.remove("is-loading");
    canvas.removeAttribute("aria-busy");
  } catch (error) {
    canvas.classList.remove("is-loading");
    canvas.classList.add("is-render-error");
    canvas.removeAttribute("aria-busy");
    const message = document.createElement("p");
    const retry = document.createElement("button");
    message.textContent = "다이어그램을 불러오지 못했습니다.";
    retry.type = "button";
    retry.className = "mermaid-retry";
    retry.textContent = "다시 불러오기";
    retry.addEventListener("click", () => queueMermaidRender(canvas));
    canvas.replaceChildren(message, retry);
    console.error("Mermaid diagram render failed", error);
  } finally {
    delete canvas.dataset.rendering;
    canvas.classList.remove("is-loading");
    canvas.removeAttribute("aria-busy");
  }
};

const queueMermaidRender = (canvas) => {
  mermaidRenderQueue = mermaidRenderQueue
    .then(() => renderMermaidCanvas(canvas))
    .catch(() => undefined);
};

const observeMermaidDiagrams = (root = designModal) => {
  mermaidDiagramObserver?.disconnect();
  const canvases = [...root.querySelectorAll(".mermaid-canvas")];
  if (!("IntersectionObserver" in window)) {
    canvases.forEach(queueMermaidRender);
    return;
  }
  mermaidDiagramObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      mermaidDiagramObserver.unobserve(entry.target);
      queueMermaidRender(entry.target);
    });
  }, { root, rootMargin: "420px 0px", threshold: 0.01 });
  canvases.forEach((canvas) => mermaidDiagramObserver.observe(canvas));
};

const makeKeywordList = (keywords = []) => {
  const list = document.createElement("ul");
  list.className = "design-keywords";
  list.append(...keywords.map((keyword) => {
    const item = document.createElement("li");
    item.textContent = keyword;
    return item;
  }));
  return list;
};

const makeSystemFlow = (steps = []) => {
  const flow = document.createElement("div");
  flow.className = "system-flow";
  flow.append(...steps.flatMap((step, index) => {
    const node = document.createElement("span");
    node.className = "system-flow-node";
    node.textContent = step;
    if (index === steps.length - 1) return [node];
    const arrow = document.createElement("span");
    arrow.className = "system-flow-arrow";
    arrow.textContent = "→";
    arrow.setAttribute("aria-hidden", "true");
    return [node, arrow];
  }));
  return flow;
};

const makeUmlDiagram = (diagram) => {
  const figure = document.createElement("figure");
  const caption = document.createElement("figcaption");
  const hint = document.createElement("span");
  const canvas = document.createElement("div");
  const loading = document.createElement("span");
  figure.className = "uml-diagram";
  if (diagram.kind === "er") figure.classList.add("is-er-diagram");
  caption.textContent = diagram.title;
  hint.textContent = diagram.kind === "er" ? "Mermaid ERD · 실제 쿼리 컬럼 기준" : "Mermaid UML · 메서드·속성 제외";
  caption.append(hint);
  canvas.className = "mermaid-canvas";
  canvas.dataset.mermaidSource = makeMermaidSource(diagram);
  if (diagram.routing) canvas.dataset.routing = diagram.routing;
  loading.className = "mermaid-loading";
  loading.textContent = "다이어그램 준비 중";
  canvas.append(loading);
  figure.append(caption, canvas);
  if (diagram.zoomable) {
    const footer = document.createElement("div");
    const trigger = document.createElement("button");
    footer.className = "uml-diagram-actions";
    trigger.className = "uml-zoom-trigger";
    trigger.type = "button";
    trigger.disabled = true;
    trigger.textContent = "확대하기";
    trigger.setAttribute("aria-haspopup", "dialog");
    footer.append(trigger);
    figure.append(footer);
  }
  return figure;
};

let umlZoomIndex = 0;
let umlZoomRenderedScale = 100;
let umlZoomPan = { x: 0, y: 0 };
let umlZoomDrag;

const renderUmlZoomView = () => {
  const diagram = umlZoomCanvas.querySelector("svg");
  if (!diagram) return;
  const scale = Number(umlZoomScale.value) / 100;
  const { width, height } = diagram.viewBox.baseVal;
  diagram.style.setProperty("--uml-width", `${width * scale}px`);
  diagram.style.setProperty("--uml-height", `${height * scale}px`);
  umlZoomCanvas.style.transform = `translate(${umlZoomPan.x}px, ${umlZoomPan.y}px)`;
  umlZoomRenderedScale = Number(umlZoomScale.value);
  umlZoomValue.value = `${umlZoomScale.value}%`;
};

const updateUmlZoomScale = (anchor = { x: umlZoomViewport.clientWidth / 2, y: umlZoomViewport.clientHeight / 2 }) => {
  const ratio = Number(umlZoomScale.value) / umlZoomRenderedScale;
  // Keep the diagram point under the cursor fixed while changing scale.
  umlZoomPan.x = anchor.x - (anchor.x - umlZoomPan.x) * ratio;
  umlZoomPan.y = anchor.y - (anchor.y - umlZoomPan.y) * ratio;
  renderUmlZoomView();
};

const stopUmlZoomDrag = () => {
  if (umlZoomDrag && umlZoomViewport.hasPointerCapture(umlZoomDrag.id)) {
    umlZoomViewport.releasePointerCapture(umlZoomDrag.id);
  }
  umlZoomDrag = undefined;
  umlZoomViewport.classList.remove("is-dragging");
};

const closeUmlZoom = () => {
  stopUmlZoomDrag();
  if (umlZoomModal.open) umlZoomModal.close();
};

const fitUmlZoom = () => {
  const diagram = umlZoomCanvas.querySelector("svg");
  if (!diagram) return;
  const { width, height } = diagram.viewBox.baseVal;
  const scale = Math.min((umlZoomViewport.clientWidth - 32) / width, (umlZoomViewport.clientHeight - 32) / height);
  umlZoomScale.value = String(Math.max(1, Math.min(200, Math.floor(scale * 100))));
  const fittedScale = Number(umlZoomScale.value) / 100;
  umlZoomPan = { x: (umlZoomViewport.clientWidth - width * fittedScale) / 2, y: (umlZoomViewport.clientHeight - height * fittedScale) / 2 };
  renderUmlZoomView();
};

document.addEventListener("click", (event) => {
  const trigger = event.target.closest(".uml-zoom-trigger");
  if (!trigger) return;
  const source = trigger.closest("figure").querySelector(".mermaid-canvas > svg");
  if (!source) return;
  const diagram = source.cloneNode(true);
  // A second inline SVG needs distinct IDs for its styles, nodes and arrow markers.
  const elements = [diagram, ...diagram.querySelectorAll("[id]")];
  const prefix = `uml-zoom-${++umlZoomIndex}-`;
  const ids = new Map(elements.filter((node) => node.id).map((node) => [node.id, prefix + node.id]));
  const orderedIds = [...ids].sort(([left], [right]) => right.length - left.length);
  diagram.querySelectorAll("style").forEach((style) => {
    orderedIds.forEach(([id, replacement]) => {
      style.textContent = style.textContent.replaceAll(`#${id}`, `#${replacement}`);
    });
  });
  [diagram, ...diagram.querySelectorAll("*")].forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      let value = attribute.value.replace(/url\(#([^)]+)\)/g, (match, id) => ids.has(id) ? `url(#${ids.get(id)})` : match);
      if (attribute.name === "id") value = ids.get(value) || value;
      else if (value.startsWith("#") && ids.has(value.slice(1))) value = `#${ids.get(value.slice(1))}`;
      node.setAttribute(attribute.name, value);
    });
  });
  umlZoomModal.querySelector("#uml-zoom-title").textContent = source.getAttribute("aria-label");
  umlZoomCanvas.replaceChildren(diagram);
  umlZoomScale.value = "100";
  umlZoomPan = { x: 0, y: 0 };
  renderUmlZoomView();
  umlZoomModal.showModal();
  fitUmlZoom();
  umlZoomClose.focus();
});

umlZoomScale.addEventListener("input", () => updateUmlZoomScale());
umlZoomViewport.addEventListener("wheel", (event) => {
  if (!umlZoomCanvas.querySelector("svg")) return;
  event.preventDefault();
  const bounds = umlZoomViewport.getBoundingClientRect();
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? umlZoomViewport.clientHeight : 1;
  const delta = Math.max(-240, Math.min(240, event.deltaY * unit));
  const current = Number(umlZoomScale.value);
  let next = Math.round(current * Math.exp(-delta * .0025));
  if (next === current && delta) next += delta < 0 ? 1 : -1;
  umlZoomScale.value = String(Math.max(Number(umlZoomScale.min), Math.min(Number(umlZoomScale.max), next)));
  updateUmlZoomScale({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
}, { passive: false });
umlZoomViewport.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || umlZoomDrag || !umlZoomCanvas.querySelector("svg")) return;
  event.preventDefault();
  umlZoomViewport.focus({ preventScroll: true });
  umlZoomDrag = { id: event.pointerId, x: event.clientX, y: event.clientY, panX: umlZoomPan.x, panY: umlZoomPan.y };
  umlZoomViewport.setPointerCapture(event.pointerId);
  umlZoomViewport.classList.add("is-dragging");
});
umlZoomViewport.addEventListener("pointermove", (event) => {
  if (umlZoomDrag?.id !== event.pointerId) return;
  umlZoomPan = { x: umlZoomDrag.panX + event.clientX - umlZoomDrag.x, y: umlZoomDrag.panY + event.clientY - umlZoomDrag.y };
  renderUmlZoomView();
});
umlZoomViewport.addEventListener("pointerup", (event) => {
  if (umlZoomDrag?.id === event.pointerId) stopUmlZoomDrag();
});
umlZoomViewport.addEventListener("pointercancel", stopUmlZoomDrag);
umlZoomViewport.addEventListener("lostpointercapture", stopUmlZoomDrag);
umlZoomViewport.addEventListener("dragstart", (event) => event.preventDefault());
umlZoomViewport.addEventListener("keydown", (event) => {
  const movement = { ArrowLeft: [40, 0], ArrowRight: [-40, 0], ArrowUp: [0, 40], ArrowDown: [0, -40] }[event.key];
  if (!movement) return;
  event.preventDefault();
  umlZoomPan.x += movement[0];
  umlZoomPan.y += movement[1];
  renderUmlZoomView();
});
umlZoomModal.querySelector("#uml-zoom-fit").addEventListener("click", fitUmlZoom);
umlZoomClose.addEventListener("click", closeUmlZoom);
umlZoomModal.addEventListener("click", (event) => {
  if (event.target === umlZoomModal) closeUmlZoom();
});
umlZoomModal.addEventListener("close", () => umlZoomCanvas.replaceChildren());
umlZoomModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeUmlZoom();
});

const makeDesignTocButton = (number, label, targetId, level = "root") => {
  const item = document.createElement("li");
  const button = document.createElement("button");
  const index = document.createElement("span");
  const title = document.createElement("span");
  if (level === "feature") item.className = "is-nested";
  if (level === "domain") item.className = "is-nested is-domain";
  if (level === "deep") item.className = "is-nested is-deep";
  button.type = "button";
  button.dataset.designTarget = targetId;
  index.textContent = number;
  title.textContent = label;
  button.append(index, title);
  item.append(button);
  return item;
};

const makeDecisionList = (items = [], className = "design-decision-list", emphasis = []) => {
  const list = document.createElement("dl");
  list.className = className;
  list.append(...items.flatMap(([label, copy]) => {
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    appendEmphasizedText(description, copy, emphasis);
    return [term, description];
  }));
  return list;
};

const makeImplementationSection = (feature, number, id) => {
  const section = document.createElement("section");
  const header = document.createElement("header");
  const featureNumber = document.createElement("span");
  const headingGroup = document.createElement("div");
  const heading = document.createElement("h5");
  const copy = document.createElement("p");
  section.className = "technical-feature";
  section.id = id;
  featureNumber.className = "technical-feature-number";
  featureNumber.textContent = number;
  heading.textContent = feature.title;
  headingGroup.append(heading);
  if (feature.summary) {
    appendEmphasizedText(copy, feature.summary, feature.emphasis);
    headingGroup.append(copy);
  }
  header.append(featureNumber, headingGroup);
  section.append(header, makeDecisionList(feature.details, "design-decision-list", feature.emphasis));
  if (feature.media) section.append(makeResultMediaButton(feature.media));
  if (feature.diagram) section.append(makeUmlDiagram(feature.diagram));
  return section;
};

const makeFeatureImplementation = (feature, index) => {
  const article = document.createElement("article");
  const header = document.createElement("header");
  const number = document.createElement("span");
  const headingGroup = document.createElement("div");
  const title = document.createElement("h4");
  const intent = document.createElement("p");
  const context = document.createElement("div");
  const problem = document.createElement("section");
  const problemLabel = document.createElement("p");
  const problemCopy = document.createElement("p");
  const result = document.createElement("section");
  const resultLabel = document.createElement("p");
  const resultCopy = document.createElement("p");
  const tradeoff = document.createElement("aside");
  const tradeoffTitle = document.createElement("strong");
  const tradeoffCopy = document.createElement("p");
  const implementationBlocks = document.createElement("div");
  article.className = "design-feature-card";
  article.id = `design-feature-${index + 1}`;
  number.textContent = String(index + 1).padStart(2, "0");
  title.textContent = feature.title;
  intent.textContent = feature.intent;
  headingGroup.append(title, intent);
  header.append(number, headingGroup);
  problemLabel.className = "eyebrow";
  problemLabel.textContent = feature.problemLabel || "해결하려는 문제";
  problemCopy.textContent = feature.problem;
  problem.append(problemLabel, problemCopy);
  resultLabel.className = "eyebrow";
  resultLabel.textContent = feature.resultLabel || "구현 결과";
  resultCopy.textContent = feature.result;
  result.append(resultLabel, resultCopy);
  context.className = "design-context-grid";
  context.append(problem, result);
  tradeoff.className = "design-tradeoff";
  tradeoffTitle.textContent = "설계 판단과 다음 단계";
  tradeoffCopy.textContent = feature.tradeoff;
  tradeoff.append(tradeoffTitle, tradeoffCopy);
  implementationBlocks.className = "implementation-block-list";
  implementationBlocks.append(
    ...[{
      title: feature.diagram?.title || "구현 구조",
      details: feature.decisions,
      diagram: feature.diagram,
      emphasis: feature.keywords,
    }, ...(feature.implementationSections || [])].map((section, sectionIndex) => makeImplementationSection(
      section,
      `${String(index + 1).padStart(2, "0")}.${sectionIndex + 1}`,
      `design-feature-${index + 1}-detail-${sectionIndex + 1}`,
    )),
  );
  article.append(
    header,
    makeKeywordList(feature.keywords),
    context,
    implementationBlocks,
    tradeoff,
  );
  return article;
};

const buildDesignDocument = (documentData) => {
  designFields.kicker.textContent = documentData.kicker;
  designFields.title.textContent = documentData.title;
  designFields.summary.textContent = documentData.summary;
  designFields.keywords.replaceChildren(...makeKeywordList(documentData.keywords).children);
  designFields.systemFlow.replaceChildren(...makeSystemFlow(documentData.systemFlow).children);
  designToc.replaceChildren(
    makeDesignTocButton("00", "문서 개요", "design-intro"),
    makeDesignTocButton("01", "분야 & 기능별 상세 기술 문서", "design-technical-docs"),
    ...documentData.technicalDocs.flatMap((documentItem, index) => [
      makeDesignTocButton(
        `01-${index + 1}`,
        documentItem.label,
        `design-doc-${documentItem.id}`,
        "domain",
      ),
      ...(documentItem.features || []).map((feature, featureIndex) => makeDesignTocButton(
        `01-${index + 1}.${featureIndex + 1}`,
        feature.title,
        `design-doc-${documentItem.id}-${featureIndex + 1}`,
        "deep",
      )),
    ]),
  );

  technicalDocumentList.replaceChildren(...documentData.technicalDocs.map((documentItem, index) => {
    const article = document.createElement("article");
    const header = document.createElement("header");
    const number = document.createElement("span");
    const headingGroup = document.createElement("div");
    const label = document.createElement("p");
    const title = document.createElement("h4");
    const summary = document.createElement("p");
    const architectureTitle = document.createElement("h5");
    const featureTitle = document.createElement("h5");
    const featureList = document.createElement("div");
    const noteTitle = document.createElement("h5");
    article.className = "technical-document";
    article.id = `design-doc-${documentItem.id}`;
    number.textContent = `01-${index + 1}`;
    label.className = "eyebrow";
    label.textContent = documentItem.label;
    title.textContent = documentItem.title;
    summary.textContent = documentItem.summary;
    headingGroup.append(label, title, summary);
    header.append(number, headingGroup);
    architectureTitle.textContent = documentItem.id === "database" ? "테이블 관계와 영속화 경계" : "분야 전체 구조";
    featureTitle.textContent = "기능별 구현";
    noteTitle.textContent = "공통 설계 판단";
    featureList.className = "technical-feature-list";
    featureList.append(...(documentItem.features || []).map((feature, featureIndex) => makeImplementationSection(
      feature,
      `01-${index + 1}.${featureIndex + 1}`,
      `design-doc-${documentItem.id}-${featureIndex + 1}`,
    )));
    article.append(
      header,
      makeKeywordList(documentItem.keywords),
      architectureTitle,
      makeUmlDiagram(documentItem.diagram),
      featureTitle,
      featureList,
      noteTitle,
      makeDecisionList(documentItem.notes, "technical-note-list"),
    );
    return article;
  }));
};

const buildProjectDetail = (project) => {
  const principles = project.principles || [];
  const coreFeatures = project.coreFeatures || [];
  const troubleshooting = project.troubleshooting || [];
  const hasDetail = Boolean(principles.length || coreFeatures.length || troubleshooting.length);
  modalFields.detail.hidden = !hasDetail;
  overviewJumpButton.hidden = !hasDetail;
  modalFields.outline.replaceChildren();
  modalFields.principles.replaceChildren();
  modalFields.features.replaceChildren();
  modalFields.troubleshooting.replaceChildren();
  modalFields.principlesSection.hidden = principles.length === 0;
  modalFields.featuresSection.hidden = coreFeatures.length === 0;
  modalFields.troubleshootingSection.hidden = troubleshooting.length === 0;
  if (!hasDetail) return;

  let sectionIndex = 3;
  if (principles.length) {
    const index = String(sectionIndex).padStart(2, "0");
    const item = document.createElement("li");
    const number = document.createElement("span");
    number.textContent = index;
    modalFields.principlesIndex.textContent = index;
    item.append(number, makeOutlineButton("Design Principles", "modal-principles"));
    modalFields.outline.append(item);
    sectionIndex += 1;
  }

  if (coreFeatures.length) {
    const index = String(sectionIndex).padStart(2, "0");
    const featureOutline = document.createElement("li");
    const featureNumber = document.createElement("span");
    featureNumber.textContent = index;
    modalFields.featuresIndex.textContent = index;
    featureOutline.append(featureNumber, makeOutlineButton("Core Features", "modal-features"));
    const nestedList = document.createElement("ol");
    coreFeatures.forEach((feature, index) => {
      const targetId = `modal-feature-${index + 1}`;
      const nestedItem = document.createElement("li");
      nestedItem.append(makeOutlineButton(`${String(index + 1).padStart(2, "0")}. ${feature.title}`, targetId, feature.summary, feature.keywords));
      nestedList.append(nestedItem);
    });
    featureOutline.append(nestedList);
    modalFields.outline.append(featureOutline);
    sectionIndex += 1;
  }

  if (troubleshooting.length) {
    const index = String(sectionIndex).padStart(2, "0");
    const troubleshootingOutline = document.createElement("li");
    const troubleshootingNumber = document.createElement("span");
    troubleshootingNumber.textContent = index;
    modalFields.troubleshootingIndex.textContent = index;
    troubleshootingOutline.append(troubleshootingNumber, makeOutlineButton("Troubleshooting", "modal-troubleshooting"));
    const nestedList = document.createElement("ol");
    troubleshooting.forEach((item, index) => {
      const targetId = `modal-troubleshooting-${index + 1}`;
      const nestedItem = document.createElement("li");
      nestedItem.append(makeOutlineButton(`${String(index + 1).padStart(2, "0")}. ${item.title}`, targetId, item.summary));
      nestedList.append(nestedItem);
    });
    troubleshootingOutline.append(nestedList);
    modalFields.outline.append(troubleshootingOutline);
  }

  principles.forEach(([title, copy]) => {
    const item = document.createElement("li");
    const heading = document.createElement("strong");
    const description = document.createElement("p");
    heading.textContent = title;
    description.textContent = copy;
    item.append(heading, description);
    modalFields.principles.append(item);
  });

  coreFeatures.forEach((feature, index) => {
    const article = document.createElement("article");
    article.className = "feature-detail";
    article.id = `modal-feature-${index + 1}`;

    const header = document.createElement("header");
    const number = document.createElement("span");
    const title = document.createElement("h4");
    number.textContent = `${String(index + 1).padStart(2, "0")}.`;
    title.textContent = feature.title;
    header.append(number, title);

    const explanation = document.createElement("div");
    explanation.className = "feature-explanation";
    [["WHY", feature.why, null], ["HOW", feature.how, feature.media || feature.video]].forEach(([label, copy, media]) => {
      const block = document.createElement("section");
      const eyebrow = document.createElement("p");
      const text = document.createElement("p");
      eyebrow.className = "eyebrow";
      eyebrow.textContent = label;
      appendEmphasizedText(text, copy, feature.emphasis);
      const implementationIndex = project.designDocument?.coreFeatures.findIndex((item) => item.title === feature.title) ?? -1;
      if (label === "HOW" && implementationIndex >= 0) {
        const howHeader = document.createElement("div");
        howHeader.className = "feature-how-header";
        howHeader.append(eyebrow, makeImplementationButton(implementationIndex));
        block.append(howHeader);
      } else {
        block.append(eyebrow);
      }
      if (media) block.append(makeResultMediaButton(media));
      block.append(text);
      explanation.append(block);
    });

    article.append(header);
    if (feature.keywords?.length) article.append(makeFeatureKeywords(feature.keywords));
    article.append(explanation);
    modalFields.features.append(article);
  });

  troubleshooting.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "troubleshooting-detail";
    article.id = `modal-troubleshooting-${index + 1}`;

    const header = document.createElement("header");
    const number = document.createElement("span");
    const title = document.createElement("h4");
    number.textContent = `${String(index + 1).padStart(2, "0")}.`;
    title.textContent = item.title;
    header.append(number, title);

    const explanation = document.createElement("div");
    explanation.className = "feature-explanation troubleshooting-explanation";
    [["문제 상황", item.problem], [item.solutionLabel || "해결 방안", item.solution]].forEach(([label, copy]) => {
      const block = document.createElement("section");
      const eyebrow = document.createElement("p");
      const text = document.createElement("p");
      eyebrow.className = "eyebrow";
      eyebrow.textContent = label;
      appendEmphasizedText(text, copy, item.emphasis);
      if (label === "해결 방안" && project.designDocument?.troubleshooting?.[index]) {
        const solutionHeader = document.createElement("div");
        solutionHeader.className = "feature-how-header";
        solutionHeader.append(eyebrow, makeImplementationButton(index, "troubleshooting"));
        block.append(solutionHeader, text);
      } else {
        block.append(eyebrow, text);
      }
      if (label === "해결 방안" && item.media) block.append(makeResultMediaButton(item.media));
      explanation.append(block);
    });

    article.append(header, explanation);
    modalFields.troubleshooting.append(article);
  });
};

let activeProject = null;

const openProject = (projectId) => {
  const project = projects[projectId];
  if (!project) return;
  const isCollection = Boolean(project.otherProjects?.length);
  activeProject = project;

  modal.classList.toggle("is-collection", isCollection);
  modal.classList.toggle("has-design-document", Boolean(project.designDocument));
  designOpenButton.hidden = !project.designDocument;

  modalFields.type.textContent = project.type;
  modalFields.title.textContent = project.title;
  modalFields.period.textContent = project.period;
  modalFields.period.hidden = isCollection;
  modalFields.feature.textContent = project.feature || "";
  modalFields.challenge.textContent = project.challenge || "";
  modalFields.solution.textContent = project.solution || "";
  modalFields.gallerySection.hidden = isCollection;
  modalFields.otherProjectsSection.hidden = !isCollection;
  modalFields.footer.hidden = isCollection;
  buildOtherProjects(project.otherProjects || []);
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
  modalFields.story.hidden = isCollection || !(project.feature || project.challenge || project.solution);
  modalFields.tags.replaceChildren(
    ...(project.tags || []).map((tag) => {
      const item = document.createElement("li");
      item.textContent = tag;
      return item;
    }),
  );
  modalFields.tags.hidden = (project.tags || []).length === 0;
  buildGallery(project.images || []);
  buildProjectDetail(project);

  modal.showModal();
  modal.scrollTop = 0;
  document.body.classList.add("modal-open");
  closeButton.focus();
};

document.querySelectorAll("[data-project-open]").forEach((button) => {
  button.addEventListener("click", () => openProject(button.dataset.projectOpen));
});

let featureHighlightStartTimer;
let featureHighlightEndTimer;

modalFields.outline.addEventListener("click", (event) => {
  const button = event.target.closest("[data-modal-target]");
  if (!button) return;
  const target = modal.querySelector(`#${button.dataset.modalTarget}`);
  target?.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "center" });
  if (!target?.matches(".feature-detail, .troubleshooting-detail")) return;

  window.clearTimeout(featureHighlightStartTimer);
  window.clearTimeout(featureHighlightEndTimer);
  modal.querySelectorAll(".is-outline-highlight").forEach((item) => {
    item.classList.remove("is-outline-highlight");
  });
  featureHighlightStartTimer = window.setTimeout(() => {
    target.classList.add("is-outline-highlight");
    featureHighlightEndTimer = window.setTimeout(() => {
      target.classList.remove("is-outline-highlight");
    }, 1500);
  }, reduceMotion.matches ? 0 : 350);
});

overviewJumpButton.addEventListener("click", () => {
  modalFields.detail.scrollIntoView({ behavior: reduceMotion.matches ? "auto" : "smooth", block: "start" });
});

let designHighlightTimer;
let designScrollFrame;

const setDesignTocActive = (targetId) => {
  const buttons = [...designToc.querySelectorAll("[data-design-target]")];
  buttons.forEach((button) => {
    button.classList.remove("is-active", "is-parent-active");
    button.removeAttribute("aria-current");
  });

  const activeButton = buttons.find((button) => button.dataset.designTarget === targetId);
  if (!activeButton) return;
  activeButton.classList.add("is-active");
  activeButton.setAttribute("aria-current", "location");

  const parentTargets = [];
  const deepDomainMatch = targetId.match(/^design-doc-(client|server|database)-\d+$/);
  if (deepDomainMatch) parentTargets.push(`design-doc-${deepDomainMatch[1]}`);
  if (targetId.startsWith("design-doc-")) parentTargets.push("design-technical-docs");
  parentTargets.forEach((parentTarget) => {
    buttons.find((button) => button.dataset.designTarget === parentTarget)?.classList.add("is-parent-active");
  });

  const tocPanel = designToc.closest(".design-toc");
  if (!tocPanel || !activeButton.offsetParent || tocPanel.scrollHeight <= tocPanel.clientHeight) return;
  const panelRect = tocPanel.getBoundingClientRect();
  const buttonRect = activeButton.getBoundingClientRect();
  if (buttonRect.top < panelRect.top + 8) tocPanel.scrollTop -= panelRect.top + 8 - buttonRect.top;
  else if (buttonRect.bottom > panelRect.bottom - 8) tocPanel.scrollTop += buttonRect.bottom - panelRect.bottom + 8;
};

const updateDesignTocActive = () => {
  designScrollFrame = undefined;
  if (!designModal.open) return;
  const modalRect = designModal.getBoundingClientRect();
  const headerBottom = designModal.querySelector(".design-modal-header").getBoundingClientRect().bottom;
  const activationLine = headerBottom + Math.max(0, modalRect.bottom - headerBottom) * 0.1;
  const buttons = [...designToc.querySelectorAll("[data-design-target]")];
  let activeTarget = buttons[0]?.dataset.designTarget;
  buttons.forEach((button) => {
    const target = designModal.querySelector(`#${button.dataset.designTarget}`);
    if (target && target.getBoundingClientRect().top <= activationLine) activeTarget = button.dataset.designTarget;
  });
  if (activeTarget) setDesignTocActive(activeTarget);
};

const scheduleDesignTocUpdate = () => {
  if (designScrollFrame) return;
  designScrollFrame = window.requestAnimationFrame(updateDesignTocActive);
};

designOpenButton.addEventListener("click", () => {
  if (!activeProject?.designDocument) return;
  buildDesignDocument(activeProject.designDocument);
  designModal.showModal();
  designModal.scrollTop = 0;
  designModalClose.focus();
  window.requestAnimationFrame(() => {
    observeMermaidDiagrams();
    updateDesignTocActive();
  });
});

designToc.addEventListener("click", (event) => {
  const button = event.target.closest("[data-design-target]");
  if (!button) return;
  const target = designModal.querySelector(`#${button.dataset.designTarget}`);
  if (!target) return;
  setDesignTocActive(button.dataset.designTarget);
  const targetDistance = Math.abs(target.getBoundingClientRect().top - designModal.getBoundingClientRect().top);
  const scrollBehavior = reduceMotion.matches || targetDistance > designModal.clientHeight * 1.5 ? "auto" : "smooth";
  target.scrollIntoView({ behavior: scrollBehavior, block: "start" });
  window.clearTimeout(designHighlightTimer);
  designModal.querySelectorAll(".is-design-highlight").forEach((item) => item.classList.remove("is-design-highlight"));
  target.classList.add("is-design-highlight");
  designHighlightTimer = window.setTimeout(() => target.classList.remove("is-design-highlight"), 1500);
});

const closeDesignDocument = () => {
  closeUmlZoom();
  mermaidDiagramObserver?.disconnect();
  if (designScrollFrame) window.cancelAnimationFrame(designScrollFrame);
  designScrollFrame = undefined;
  if (designModal.open) designModal.close();
};

designModalClose.addEventListener("click", closeDesignDocument);
designModal.addEventListener("scroll", scheduleDesignTocUpdate, { passive: true });
designModal.addEventListener("click", (event) => {
  if (event.target === designModal) closeDesignDocument();
});
designModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDesignDocument();
});

const handleImplementationClick = (event) => {
  const trigger = event.target.closest("[data-implementation-index]");
  if (!trigger || !activeProject?.designDocument) return;
  const index = Number(trigger.dataset.implementationIndex);
  const type = trigger.dataset.implementationType || "coreFeatures";
  const feature = activeProject.designDocument[type]?.[index];
  if (!feature) return;
  const explanationTitle = type === "troubleshooting" ? "상세 해결 설명" : "상세 구현 설명";
  featureDesignTitle.textContent = explanationTitle;
  featureDesignClose.setAttribute("aria-label", `${explanationTitle} 닫기`);
  featureDesignModal.querySelector(".project-type").textContent = type === "troubleshooting"
    ? "EVERWIND / TROUBLESHOOTING"
    : "EVERWIND / CORE FEATURE";
  featureDesignContent.replaceChildren(makeFeatureImplementation(feature, index));
  featureDesignModal.showModal();
  featureDesignModal.scrollTop = 0;
  featureDesignClose.focus();
  observeMermaidDiagrams(featureDesignModal);
};
modalFields.features.addEventListener("click", handleImplementationClick);
modalFields.troubleshooting.addEventListener("click", handleImplementationClick);

const closeFeatureImplementation = () => {
  if (featureDesignModal.open) featureDesignModal.close();
};
featureDesignClose.addEventListener("click", closeFeatureImplementation);
featureDesignModal.addEventListener("click", (event) => {
  if (event.target === featureDesignModal) closeFeatureImplementation();
});
featureDesignModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeFeatureImplementation();
});

const closeFeatureMedia = () => {
  featureVideo.pause();
  featureVideo.removeAttribute("src");
  featureVideo.load();
  featureVideo.hidden = true;
  featureImage.removeAttribute("src");
  featureImage.alt = "";
  featureImage.hidden = true;
  featureMediaGrid.querySelectorAll("video").forEach((video) => video.pause());
  featureMediaGrid.replaceChildren();
  featureMediaGrid.hidden = true;
  imageZoomOverlay.hidden = true;
  imageZoomImage.removeAttribute("src");
  imageZoomImage.alt = "";
  videoModal.close();
};

modalFields.otherProjects.addEventListener("click", (event) => {
  const trigger = event.target.closest(".other-project-media-trigger");
  if (!trigger) return;
  const project = activeOtherProjects[Number(trigger.dataset.projectIndex)];
  const mediaItems = (project?.features || []).filter((feature) => feature.media);
  if (!project || mediaItems.length === 0) return;

  featureVideo.pause();
  featureVideo.removeAttribute("src");
  featureVideo.load();
  featureVideo.hidden = true;
  featureImage.removeAttribute("src");
  featureImage.hidden = true;
  featureMediaGrid.replaceChildren(...mediaItems.map((feature) => {
    const figure = document.createElement("figure");
    const media = feature.media;
    let content;
    figure.className = "feature-media-item";

    if (media.type === "video") {
      content = document.createElement("video");
      content.src = media.src;
      content.controls = true;
      content.loop = true;
      content.muted = true;
      content.playsInline = true;
      content.preload = "metadata";
    } else if (media.type === "image") {
      content = document.createElement("img");
      content.src = media.src;
      content.alt = media.alt || `${feature.title} 결과`;
      if (media.zoomable) {
        const zoomTrigger = document.createElement("button");
        zoomTrigger.type = "button";
        zoomTrigger.className = "feature-media-zoom-trigger";
        zoomTrigger.dataset.mediaSrc = media.src;
        zoomTrigger.dataset.mediaAlt = content.alt;
        zoomTrigger.dataset.mediaTitle = feature.title;
        zoomTrigger.setAttribute("aria-label", `${feature.title} 이미지 확대 보기`);
        zoomTrigger.append(content);
        content = zoomTrigger;
      }
    } else {
      content = document.createElement("div");
      content.className = "feature-media-placeholder";
      const placeholderLabel = document.createElement("span");
      placeholderLabel.textContent = "MEDIA PLACEHOLDER";
      content.append(placeholderLabel);
    }

    const caption = document.createElement("figcaption");
    caption.textContent = feature.title;
    figure.append(content, caption);
    return figure;
  }));
  featureMediaGrid.dataset.count = String(mediaItems.length);
  featureMediaGrid.hidden = false;
  videoModalTitle.textContent = `${project.title} 구현 기능`;
  videoModal.showModal();
  featureMediaGrid.querySelectorAll("video").forEach((video) => video.play().catch(() => {}));
  videoModalClose.focus();
});

const closeImageZoom = () => {
  imageZoomOverlay.hidden = true;
  imageZoomImage.removeAttribute("src");
  imageZoomImage.alt = "";
};

featureMediaGrid.addEventListener("click", (event) => {
  const trigger = event.target.closest(".feature-media-zoom-trigger");
  if (!trigger) return;
  imageZoomTitle.textContent = trigger.dataset.mediaTitle || "이미지 확대 보기";
  imageZoomImage.src = trigger.dataset.mediaSrc;
  imageZoomImage.alt = trigger.dataset.mediaAlt || imageZoomTitle.textContent;
  imageZoomOverlay.hidden = false;
  imageZoomClose.focus();
});

imageZoomClose.addEventListener("click", closeImageZoom);
imageZoomOverlay.addEventListener("click", (event) => {
  if (event.target === imageZoomOverlay) closeImageZoom();
});

const handleResultMediaClick = (event) => {
  const trigger = event.target.closest(".feature-result-trigger");
  if (!trigger) return;
  const mediaType = trigger.dataset.mediaType || "video";
  featureMediaGrid.replaceChildren();
  featureMediaGrid.hidden = true;
  videoModalTitle.textContent = trigger.dataset.mediaTitle || (mediaType === "image" ? "결과 사진" : "결과 영상");
  featureVideo.hidden = mediaType !== "video";
  featureImage.hidden = mediaType !== "image";
  if (mediaType === "image") {
    featureImage.src = trigger.dataset.mediaSrc;
    featureImage.alt = trigger.dataset.mediaAlt || videoModalTitle.textContent;
  } else {
    featureVideo.src = trigger.dataset.mediaSrc;
  }
  videoModal.showModal();
  if (mediaType === "video") featureVideo.play().catch(() => {});
  videoModalClose.focus();
};
modalFields.features.addEventListener("click", handleResultMediaClick);
modalFields.troubleshooting.addEventListener("click", handleResultMediaClick);
technicalDocumentList.addEventListener("click", handleResultMediaClick);

videoModalClose.addEventListener("click", closeFeatureMedia);
videoModal.addEventListener("click", (event) => {
  if (event.target === videoModal) closeFeatureMedia();
});
videoModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  if (!imageZoomOverlay.hidden) {
    closeImageZoom();
    return;
  }
  closeFeatureMedia();
});

closeButton.addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});
modal.addEventListener("close", () => {
  closeDesignDocument();
  closeFeatureImplementation();
  activeProject = null;
  document.body.classList.remove("modal-open");
});
