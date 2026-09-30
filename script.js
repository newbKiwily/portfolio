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
    principles: [
      ["상태 중심 행동 분리", "이동·전투·피격·상호작용처럼 충돌하기 쉬운 행동을 상태 단위로 나눠 전환 규칙을 명확히 했습니다."],
      ["정의 데이터와 진행 상태 분리", "변하지 않는 콘텐츠 정의와 수량·쿨다운·진행도 같은 런타임 상태를 분리해 저장과 확장의 경계를 세웠습니다."],
      ["공통 계약과 다형성", "공통 실행 흐름은 하나의 계약으로 유지하고, 콘텐츠별 차이만 독립적으로 확장하도록 구성했습니다."],
      ["이벤트 기반 결과 전달", "전투·채집·제작의 결과를 이벤트로 전달해 퀘스트와 튜토리얼이 생산 시스템의 내부 구현에 의존하지 않게 했습니다."],
      ["네트워크와 Unity 생명주기 분리", "데이터 수신 시점과 씬·오브젝트 생성 시점을 분리하고, Unity API 작업은 메인 스레드에서 처리했습니다."],
      ["맵 단위 월드 경계", "세션과 게임 월드를 맵 컨텍스트로 구분해 필요한 사용자에게만 상태 변화를 전달하도록 했습니다."],
      ["재접속 가능한 영속 상태", "클라이언트 수명과 무관하게 이어져야 하는 캐릭터 상태를 관계형 데이터로 저장하고 복원했습니다."],
    ],
    coreFeatures: [
      {
        title: "데이터 중심 RPG 콘텐츠 확장",
        summary: "정의 데이터와 실행 상태를 분리해 새로운 스킬·아이템·퀘스트를 독립적으로 추가합니다.",
        keywords: ["Data-driven", "Polymorphism", "Runtime State"],
        why: "온라인 RPG는 스킬·아이템·퀘스트가 계속 늘어나는 장르입니다. 유형별 조건문을 한곳에 쌓거나 변하지 않는 정의와 수량·쿨다운 같은 실행 상태를 섞으면, 콘텐츠 하나를 추가할 때 기존 로직과 저장 데이터까지 함께 수정해야 합니다.",
        how: "콘텐츠의 이름·효과·조건처럼 변하지 않는 정의 데이터와 플레이 중 변화하는 상태를 분리했습니다. 공통 생성·실행·종료 흐름은 동일한 계약으로 처리하고, 콘텐츠별 차이는 개별 동작과 데이터로 확장했습니다. 덕분에 사용하는 쪽은 구체적인 유형을 몰라도 같은 방식으로 콘텐츠를 실행할 수 있습니다.",
      },
      {
        title: "상태 머신 기반 전투 흐름",
        summary: "이동부터 사망까지 행동을 상태로 분리해 전환 규칙과 전투 판정 시점을 명확히 관리합니다.",
        keywords: ["State Machine", "Combat Flow", "Animation Timing"],
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
        keywords: ["Domain Event", "Loose Coupling", "Progress Tracking"],
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
        keywords: ["Main Thread", "Deferred Assembly", "Load Order"],
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
        keywords: ["Map Context", "Ownership", "Lifecycle"],
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
        keywords: ["IOCP", "Object Lifetime", "Packet Framing"],
        why: "비동기 I/O가 완료되기 전에 세션이나 버퍼가 해제되면 완료 통지에서 이미 사라진 메모리에 접근하게 됩니다. TCP는 연속된 바이트 스트림이므로 하나의 패킷이 나뉘거나 여러 패킷이 합쳐져 도착할 수 있어, 수신 횟수와 메시지 개수를 동일하게 볼 수 없습니다.",
        how: "세션·비동기 작업·송수신 버퍼의 소유권을 구분하고 완료 통지를 처리할 때까지 필요한 객체의 수명을 유지했습니다. 수신 바이트는 누적 버퍼에 보관한 뒤 헤더와 길이를 기준으로 완전한 패킷만 분리합니다. 송신은 큐에서 순서대로 처리해 겹친 요청을 직렬화하고, 연결 종료 시 남은 작업과 자원을 정리하는 흐름도 함께 관리했습니다.",
      },
      {
        title: "재접속 가능한 게임 상태 영속화",
        summary: "캐릭터·인벤토리·퀘스트 상태를 관계형 데이터로 저장하고 다음 접속에서 일관되게 복원합니다.",
        keywords: ["Persistence", "Relational Model", "Restore Flow"],
        why: "온라인 RPG의 맵·위치·스탯·인벤토리·퀘스트는 클라이언트가 종료되어도 다음 접속에서 이어져야 합니다. 서로 연결된 상태를 한 번에 다루지 않으면 일부 데이터만 저장되거나 잘못된 순서로 복원되어 플레이 상태가 불일치할 수 있습니다.",
        how: "계정, 캐릭터, 보유 아이템과 진행 정보를 관계형 구조로 나누고 연결 기준을 명확히 했습니다. 로그인 시 기본 캐릭터 정보부터 연관된 플레이 데이터까지 순서대로 읽어 런타임 상태를 구성합니다. 맵 변경과 연결 종료 시에는 현재 상태를 저장 형식으로 변환해 반영하고, 다음 접속에서 동일한 흐름으로 복원되도록 연결했습니다.",
        video: {
          src: "assets/videos/07-relogin-persistence.mp4",
          title: "재접속 가능한 게임 상태 영속화 결과 영상",
        },
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
        keywords: ["Interaction Rule", "Order-independent Recipe", "Feature Unlock"],
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
        keywords: ["State Machine", "Action Lifecycle", "Feedback Sync"],
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
        keywords: ["Mission Data", "Progress Event", "Result UI"],
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
        keywords: ["Terrain Validation", "Overlap Check", "Weighted Spawn"],
        why: "단순한 무작위 좌표에 자원을 생성하면 지형 밖이나 공중에 배치되거나 기존 오브젝트와 겹칠 수 있습니다. 생존 루프에 필요한 자원이 접근할 수 없는 곳에 생성되면 플레이 진행 자체가 막힙니다.",
        how: "월드 범위에서 후보 위치를 만든 뒤 지형과의 실제 접점을 확인하고, 주변 오브젝트와 겹치는 위치는 제외했습니다. 자원별 등장 확률을 반영해 후보를 선택하며, 현재 생성 수에 따라 생성 간격을 조절해 플레이 가능한 공간에 자원이 지속적으로 공급되도록 했습니다.",
        video: {
          src: "assets/gep/videos/04-world-spawn-stability.mp4",
          title: "월드 자원 랜덤 스폰과 배치 안정화 결과 영상",
        },
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
const overviewJumpButton = modal.querySelector("#modal-jump-overview");
const videoModal = document.querySelector("#video-modal");
const videoModalTitle = videoModal.querySelector("#video-modal-title");
const featureVideo = videoModal.querySelector("#feature-video");
const videoModalClose = videoModal.querySelector(".video-modal-close");
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
  detail: modal.querySelector("#modal-detail"),
  outline: modal.querySelector("#modal-outline-list"),
  principles: modal.querySelector("#modal-principle-list"),
  features: modal.querySelector("#modal-feature-list"),
  story: modal.querySelector(".modal-story"),
  notion: modal.querySelector("#modal-notion"),
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
    modalFields.gallery.append(figure);
  });
};

const makeOutlineButton = (label, targetId, summary = "") => {
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
  return button;
};

const buildProjectDetail = (project) => {
  const hasDetail = Boolean(project.principles?.length || project.coreFeatures?.length);
  modalFields.detail.hidden = !hasDetail;
  overviewJumpButton.hidden = !hasDetail;
  modalFields.outline.replaceChildren();
  modalFields.principles.replaceChildren();
  modalFields.features.replaceChildren();
  if (!hasDetail) return;

  const outlineItems = [["03", "Design Principles", "modal-principles"]];

  outlineItems.forEach(([index, label, targetId]) => {
    const item = document.createElement("li");
    const number = document.createElement("span");
    number.textContent = index;
    item.append(number, makeOutlineButton(label, targetId));
    modalFields.outline.append(item);
  });

  const featureOutline = document.createElement("li");
  const featureNumber = document.createElement("span");
  featureNumber.textContent = "04";
  featureOutline.append(featureNumber, makeOutlineButton("Core Features", "modal-features"));
  const nestedList = document.createElement("ol");
  project.coreFeatures.forEach((feature, index) => {
    const targetId = `modal-feature-${index + 1}`;
    const nestedItem = document.createElement("li");
    nestedItem.append(makeOutlineButton(`${String(index + 1).padStart(2, "0")}. ${feature.title}`, targetId, feature.summary));
    nestedList.append(nestedItem);
  });
  featureOutline.append(nestedList);
  modalFields.outline.append(featureOutline);

  project.principles.forEach(([title, copy]) => {
    const item = document.createElement("li");
    const heading = document.createElement("strong");
    const description = document.createElement("p");
    heading.textContent = title;
    description.textContent = copy;
    item.append(heading, description);
    modalFields.principles.append(item);
  });

  project.coreFeatures.forEach((feature, index) => {
    const article = document.createElement("article");
    article.className = "feature-detail";
    article.id = `modal-feature-${index + 1}`;

    const header = document.createElement("header");
    const number = document.createElement("span");
    const title = document.createElement("h4");
    number.textContent = `${String(index + 1).padStart(2, "0")}.`;
    title.textContent = feature.title;
    header.append(number, title);

    const keywords = document.createElement("ul");
    keywords.className = "feature-keywords";
    keywords.setAttribute("aria-label", `${feature.title} 핵심 키워드`);
    feature.keywords.forEach((keyword) => {
      const item = document.createElement("li");
      item.textContent = keyword;
      keywords.append(item);
    });

    const explanation = document.createElement("div");
    explanation.className = "feature-explanation";
    [["WHY", feature.why, null], ["HOW", feature.how, feature.video]].forEach(([label, copy, video]) => {
      const block = document.createElement("section");
      const eyebrow = document.createElement("p");
      const text = document.createElement("p");
      eyebrow.className = "eyebrow";
      eyebrow.textContent = label;
      text.textContent = copy;
      block.append(eyebrow);
      if (video) {
        const videoTrigger = document.createElement("button");
        videoTrigger.type = "button";
        videoTrigger.className = "feature-video-trigger";
        videoTrigger.dataset.videoSrc = video.src;
        videoTrigger.dataset.videoTitle = video.title;
        videoTrigger.textContent = "결과 영상 보기";
        block.append(videoTrigger);
      }
      block.append(text);
      explanation.append(block);
    });

    article.append(header, keywords, explanation);
    modalFields.features.append(article);
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
  if (!target?.classList.contains("feature-detail")) return;

  window.clearTimeout(featureHighlightStartTimer);
  window.clearTimeout(featureHighlightEndTimer);
  modal.querySelectorAll(".feature-detail.is-outline-highlight").forEach((item) => {
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

const closeFeatureVideo = () => {
  featureVideo.pause();
  featureVideo.removeAttribute("src");
  featureVideo.load();
  videoModal.close();
};

modalFields.features.addEventListener("click", (event) => {
  const trigger = event.target.closest(".feature-video-trigger");
  if (!trigger) return;
  videoModalTitle.textContent = trigger.dataset.videoTitle || "결과 영상";
  featureVideo.src = trigger.dataset.videoSrc;
  videoModal.showModal();
  featureVideo.play().catch(() => {});
  videoModalClose.focus();
});

videoModalClose.addEventListener("click", closeFeatureVideo);
videoModal.addEventListener("click", (event) => {
  if (event.target === videoModal) closeFeatureVideo();
});
videoModal.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeFeatureVideo();
});

closeButton.addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});
modal.addEventListener("close", () => document.body.classList.remove("modal-open"));
