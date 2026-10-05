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
        emphasis: ["정의 데이터", "실행 상태", "공통 생성·실행·종료 흐름", "콘텐츠별 차이"],
        why: "온라인 RPG는 스킬·아이템·퀘스트가 계속 늘어나는 장르입니다. 유형별 조건문을 한곳에 쌓거나 변하지 않는 정의와 수량·쿨다운 같은 실행 상태를 섞으면, 콘텐츠 하나를 추가할 때 기존 로직과 저장 데이터까지 함께 수정해야 합니다.",
        how: "콘텐츠의 이름·효과·조건처럼 변하지 않는 정의 데이터와 플레이 중 변화하는 상태를 분리했습니다. 공통 생성·실행·종료 흐름은 동일한 계약으로 처리하고, 콘텐츠별 차이는 개별 동작과 데이터로 확장했습니다. 덕분에 사용하는 쪽은 구체적인 유형을 몰라도 같은 방식으로 콘텐츠를 실행할 수 있습니다.",
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
        title: "분할 수신된 TCP 패킷과 메인 스레드 충돌",
        summary: "분할·병합되는 TCP 데이터와 Unity 스레드 제약을 안정적으로 분리했습니다.",
        emphasis: ["길이와 ID", "헤더", "수신 데이터를 누적", "메인 스레드 작업 큐"],
        problem: "동시 접속과 전투 패킷이 늘어나자 하나의 패킷이 여러 번에 나뉘거나 여러 패킷이 한 번에 도착했습니다. 한 번의 수신을 하나의 메시지로 간주했을 때 길이와 ID 해석이 어긋났고, 수신 스레드에서 UI와 게임 오브젝트를 바로 갱신하면서 간헐적인 누락과 예외도 발생했습니다.",
        solution: "길이와 ID를 포함한 헤더를 기준으로 수신 데이터를 누적하고, 완전한 패킷이 만들어졌을 때만 순서대로 분리했습니다. 네트워크 단계는 해석과 데이터 보관까지만 담당하고, Unity 오브젝트 변경은 메인 스레드 작업 큐로 전달했습니다. 이동처럼 빈도가 높은 패킷은 로그에서 제외해 실제 오류 흐름을 빠르게 추적할 수 있게 했습니다.",
      },
      {
        title: "맵 전환 후 이전 월드 상태가 남는 문제",
        summary: "맵 이동 시 서버 세션·월드 오브젝트·전투 UI를 하나의 흐름으로 초기화했습니다.",
        emphasis: ["상태 전환 절차", "서버 세션", "캐릭터 컨트롤러", "월드 오브젝트·전투 버퍼·타겟 UI"],
        problem: "맵을 옮긴 뒤에도 이전 지역의 몬스터와 다른 플레이어가 남거나, 타겟·HP UI와 공격 상태가 유지되는 현상이 나타났습니다. 서버 세션이 두 맵의 전송 대상에 동시에 포함되는 경우가 있었고, 활성화된 캐릭터 컨트롤러가 순간이동 좌표를 보정해 의도한 스폰 지점에서 벗어나기도 했습니다.",
        solution: "맵 전환을 단순한 화면 교체가 아닌 상태 전환 절차로 정의했습니다. 서버에서는 이전 맵 세션 제거, 새 위치와 맵 정보 갱신, 새 맵 세션 등록 순서를 보장했고, 클라이언트에서는 기존 월드 오브젝트·전투 버퍼·타겟 UI를 함께 정리했습니다. 위치 적용 중에는 캐릭터 컨트롤러를 잠시 비활성화하고, 전환 완료 후 새 맵의 플레이어와 몬스터 목록을 다시 구성했습니다.",
      },
      {
        title: "몬스터 리필 시 중복 생성과 지형 이탈",
        summary: "서버 기준 리필과 증분 전송으로 중복 생성과 지형 이탈 스폰을 줄였습니다.",
        emphasis: ["서버", "인스턴스 ID", "새로 추가된 몬스터", "지면을 탐색"],
        problem: "몬스터가 처치된 뒤 각 클라이언트가 제각각 리젠을 판단하면 사용자마다 몬스터 수와 위치가 달라졌습니다. 서버가 리필할 때 전체 목록을 다시 보내는 방식은 이미 존재하는 몬스터를 중복 생성했고, 무작위 좌표를 그대로 사용하면 경사진 지형에서 공중이나 지면 아래에 스폰되는 경우도 발생했습니다.",
        solution: "리젠 시점과 인스턴스 ID는 서버가 단독으로 결정하도록 권한을 모았습니다. 서버 타이머가 맵별 최대 수량과 현재 수량의 차이만큼 생성하고, 새로 추가된 몬스터만 해당 맵에 전달했습니다. 클라이언트는 같은 인스턴스 ID를 다시 받으면 무시하고, 스폰 지점에서 지면을 탐색해 높이를 보정한 뒤 오브젝트를 배치했습니다.",
      },
      {
        title: "몬스터 제어권과 사망 요청 충돌",
        summary: "몬스터 제어권과 사망 요청을 검증해 클라이언트 간 상태 충돌을 막았습니다.",
        emphasis: ["제어권", "소유자", "보간", "사망 중복 방지", "회전 보정값"],
        problem: "여러 클라이언트가 같은 몬스터의 이동과 공격을 동시에 계산하면서 위치가 흔들리거나 서로 다른 대상을 추적했습니다. HP가 0이 되는 순간에는 여러 사망 요청이 겹쳐 중복 제거와 보상 위험이 생겼고, 모델마다 정면 축이 달라 서버 위치는 같아도 바라보는 방향이 어긋나는 문제도 확인했습니다.",
        solution: "피격자를 기준으로 한 명의 클라이언트에 몬스터 제어권을 부여하고, 나머지는 서버가 전달한 위치를 보간해 표현하도록 역할을 나눴습니다. 서버는 이동·공격·사망 요청이 현재 소유자에게서 왔는지 검증했으며, 클라이언트와 서버 양쪽에 사망 중복 방지를 적용했습니다. 모델별 정면 축 차이는 회전 보정값으로 흡수해 동기화 규칙과 표현 차이를 분리했습니다.",
      },
      {
        title: "맵 전환 후 미니맵 좌표가 어긋나는 문제",
        summary: "맵별 보정 데이터와 이벤트 흐름으로 미니맵을 월드 좌표에 맞췄습니다.",
        emphasis: ["맵 데이터", "변경 이벤트", "보정값 전체", "한 번 더 동기화"],
        problem: "맵별 미니맵 이미지만 교체했을 때 플레이어 표식과 실제 월드 위치가 맞지 않았습니다. 이미지마다 기준 위치·회전·크기가 달랐고, 맵 전환 직후에는 이전 미니맵이 남거나 UI가 월드보다 늦게 준비되어 변경 이벤트를 놓치는 경우도 있었습니다.",
        solution: "미니맵을 단순 이미지가 아니라 이미지·위치·회전·크기 보정값이 묶인 맵 데이터로 관리했습니다. 월드가 바뀌면 로더가 변경 이벤트를 발행하고 UI는 해당 보정값 전체를 적용하도록 분리했습니다. UI가 늦게 초기화되는 상황에는 현재 맵 데이터를 한 번 더 동기화해 초기 로딩과 맵 전환 모두 같은 결과가 나오게 했습니다.",
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

const modal = document.querySelector("#project-modal");
const closeButton = modal.querySelector(".modal-close");
const overviewJumpButton = modal.querySelector("#modal-jump-overview");
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
      article.className = "other-project-card";

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
      article.append(mediaStack, body);
      return article;
    }),
  );
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
      nestedItem.append(makeOutlineButton(`${String(index + 1).padStart(2, "0")}. ${feature.title}`, targetId, feature.summary));
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
      block.append(eyebrow);
      if (media) {
        const resultTrigger = document.createElement("button");
        const mediaType = media.type || "video";
        resultTrigger.type = "button";
        resultTrigger.className = "feature-result-trigger";
        resultTrigger.dataset.mediaType = mediaType;
        resultTrigger.dataset.mediaSrc = media.src;
        resultTrigger.dataset.mediaTitle = media.title;
        resultTrigger.dataset.mediaAlt = media.alt || media.title || "";
        resultTrigger.textContent = mediaType === "image" ? "결과 사진 보기" : "결과 영상 보기";
        block.append(resultTrigger);
      }
      block.append(text);
      explanation.append(block);
    });

    article.append(header, explanation);
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
      block.append(eyebrow, text);
      explanation.append(block);
    });

    article.append(header, explanation);
    modalFields.troubleshooting.append(article);
  });
};

const openProject = (projectId) => {
  const project = projects[projectId];
  if (!project) return;
  const isCollection = Boolean(project.otherProjects?.length);

  modal.classList.toggle("is-collection", isCollection);

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
  modalFields.notion.href = project.notion || "#";
  if (project.notion) {
    modalFields.notion.target = "_blank";
    modalFields.notion.rel = "noreferrer";
  } else {
    modalFields.notion.removeAttribute("target");
    modalFields.notion.removeAttribute("rel");
  }
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

modalFields.features.addEventListener("click", (event) => {
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
});

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
modal.addEventListener("close", () => document.body.classList.remove("modal-open"));
