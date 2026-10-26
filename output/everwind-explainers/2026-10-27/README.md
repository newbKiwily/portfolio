# EverWind 기능 설명 이미지 — 로컬 보관본

- 생성일: 2026-10-27
- 용도: 추후 포트폴리오 편집 시 선택하여 삽입할 설명용 이미지.
- 범위: Core Features 7장, Troubleshooting 7장, Other Functions 5장.
- 스타일: Pixel Portfolio Explainers 개인 템플릿. 오프화이트 배경, 픽셀 모험가·마법사·궁수, 민트/앰버 패널, 간결한 한국어 레이블.
- 생성 방식: 내장 image_gen. 그림은 실제 게임 스크린샷이 아닌 구현 개념도.
- 캐릭터·몬스터·아이템 외형, 피해 수치와 개수 예시는 설명용 시각 기호이며 실제 게임 에셋·밸런스 수치를 재현한 것이 아님.
- 상태: 사용자 요청에 따라 저장소에 보관. 포트폴리오 본문에는 연결하지 않음.
- 보기: 이 폴더의 `index.html`을 브라우저에서 열면 전체 이미지를 분류별로 찾아볼 수 있음.
- 프롬프트·구현 근거: `generation-plan.json`. 실제 파일·검수 현황은 `manifest.json`.
- 원본 코드: `C:/Users/tlsal/OneDrive/문서/GitHub/EverWind/Everwind`

## 파일과 대응 항목

### Core Features

| 파일 | 현재 포트폴리오 항목 |
| --- | --- |
| [01-content-extension.png](core-features/01-content-extension.png) | 데이터 중심 RPG 콘텐츠 확장 |
| [02-iocp-packet-lifetime.png](core-features/02-iocp-packet-lifetime.png) | IOCP 비동기 세션과 패킷 수명주기 |
| [03-map-multiplayer.png](core-features/03-map-multiplayer.png) | 맵 단위 멀티플레이 동기화 |
| [04-persistence.png](core-features/04-persistence.png) | 재접속 가능한 게임 상태 영속화 |
| [05-combat-state-flow.png](core-features/05-combat-state-flow.png) | 상태 머신 기반 전투 흐름 |
| [06-quest-tutorial-events.png](core-features/06-quest-tutorial-events.png) | 이벤트 기반 퀘스트·튜토리얼 |
| [07-server-timer-refill.png](core-features/07-server-timer-refill.png) | 서버 타이머와 맵별 몬스터 보충 |

### Troubleshooting

| 파일 | 현재 포트폴리오 항목 |
| --- | --- |
| [01-singleton-initialization.png](troubleshooting/01-singleton-initialization.png) | 싱글톤 매니저의 초기화 순서와 씬 수명 분리 |
| [02-singleton-common-base.png](troubleshooting/02-singleton-common-base.png) | 싱글톤 공통 베이스로 서로 다른 매니저 묶기 |
| [03-world-transition-cleanup.png](troubleshooting/03-world-transition-cleanup.png) | 맵 전환 후 이전 월드 상태가 남는 문제 |
| [04-monster-ownership.png](troubleshooting/04-monster-ownership.png) | 몬스터 제어권과 사망 요청 충돌 |
| [05-refill-ground-height.png](troubleshooting/05-refill-ground-height.png) | 몬스터 리필 시 중복 생성과 지형 이탈 |
| [06-animator-overrides.png](troubleshooting/06-animator-overrides.png) | Animator 상태 증가와 클립 교체의 분리 |
| [07-minimap-alignment.png](troubleshooting/07-minimap-alignment.png) | 맵 전환 후 미니맵 좌표가 어긋나는 문제 |

### Other Functions

| 파일 | 현재 포트폴리오 항목 |
| --- | --- |
| [01-main-thread-assembly.png](other-functions/01-main-thread-assembly.png) | Unity 메인 스레드와 지연 데이터 조립 |
| [02-hud-combat-feedback.png](other-functions/02-hud-combat-feedback.png) | UI 이벤트와 HUD·전투 피드백 |
| [03-quest-popup-death-ui.png](other-functions/03-quest-popup-death-ui.png) | 퀘스트 목록·팝업 입력·사망 UI |
| [04-routing-db-boundary.png](other-functions/04-routing-db-boundary.png) | 패킷 라우팅과 DB 접근 경계 |
| [05-map-spawn-definitions.png](other-functions/05-map-spawn-definitions.png) | 맵·몬스터 스폰 기준 |

## 삽입 시 주의

- 항목 제목을 기준으로 매핑한다. 이후 포트폴리오 순서가 바뀌면 번호보다 제목을 우선한다.
- 현재 구현 범위를 표현한다. 서버 권위 판정, DB 비동기 처리, 전체 수신 완료 배리어, 저장 완료 ACK, 자동 미니맵 보정 등 미구현 기능을 추가하지 않는다.
- 최적화 수치나 테스트 성공률을 추정하지 않는다.
- 기존 포트폴리오 파일에는 이 폴더의 경로가 연결되어 있지 않다.
- 사이트에 적용하려면 사용자의 후속 지시를 받은 뒤 선택한 이미지만 정식 assets 경로로 복사한다.
