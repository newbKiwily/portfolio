# Little Survival Planet 시각 요약 이미지

제작: built-in image_gen. 사용자 제공 픽셀 모험가·마법사·궁수는 캐릭터·스타일 레퍼런스이며, 결과물은 구현 설명용 개념도입니다.

저장 위치: `assets/gep/explainers/`. 각 이미지는 1536×1024 PNG입니다. 원본 게임 스크린샷과 구분하여 표기합니다.

## 공통 생성 프롬프트

Use case: infographic-diagram. Asset type: explanatory summary image for Little Survival Planet programmer portfolio, NOT game screenshot. Use the attached brown-haired red-scarf pixel adventurer as main actor, and the blue wizard and green ranger as small supporting characters; preserve their distinctive pixel designs, no unrelated cast. References are character/style references, not edit targets. Clean off-white #fbfaf5 background, crisp pixel-art objects, contemporary readable Korean sans-serif typography, dark navy text, restrained mint and warm amber diagrams, spacious layout, no dark scene background, no tiny text. Wide landscape approx 1536x1024. Communicate the actual implementation through clear concrete scenes, inputs, outputs, and arrows with few concise labels. 3 or 4 strong visual panels, fill canvas usefully, preserve generous margins, no faux UI frame, no watermark, no decorative paragraphs. Korean text exactly as specified; English code identifiers exact. All mechanisms are illustrative, do not invent implemented behavior.

## craft.png

Title "아이템 조합과 제작". Upper half three large recipe illustrations with the adventurer assembling wood+plant -> fishing rod (label "낚시 해금"), wood+iron -> axe (label "벌목 시간 ×0.6"), iron+iron -> bucket (label "양동이 생성"). Lower half a single obvious arrow flow "보유 아이템 + 대상" → "Comparer" → "CraftManager" → "재료 정리 · 기능 해금". Show order independence as two little rows wood+iron and iron+wood converging to same axe, label "(A, B) = (B, A)". Little mint label "개인 구현: 제작 규칙 · 순서 독립 비교". Actual recipes only. Do not claim physical fishing-rod object creation: it unlocks fishing.

## action-lock.png

Title "행동 잠금과 완료 흐름". Left top red small before panel adventurer chopping a tree while a movement arrow and drop-item arrow interrupt action, label "중간 입력 · 상태 전환". Main large left-to-right four steps: adventurer begins timed work "행동 시작" → padlock with action progress and blocked Z/drop arrow "isStateLocked = true" → apple eaten or tree chopped "완료 처리" → unlocked adventurer "잠금 해제 → Idle". Bottom four small action icons for chopping, eating, cooking, rocket repair, label "벌목 · 섭취 · 요리 · 수리". Bottom thin clearly readable note "범위: 일부 상태 전환 · 줍기/버리기" and "낚시·X/C 공통 차단은 미적용". Do not illustrate all-input blocking or a universal lock.

## spawn.png

Title "검증 기반 랜덤 자원 스폰". Four clear numbered panels with top-down tiny planet terrain, rocket, iron and plant: "01 후보 생성" random candidate dots in circular ground range; "02 지면 · 겹침 검사" downward ray green on ground and red rejected outside land or colliding with existing item, label "Raycast · CheckSphere"; "03 거리 가중치" rocket with near faint dot and far stronger dots, label "가까움 0.1 → 멀어짐 0.8"; "04 유효 후보 선택" weighted candidate lottery yields accessible iron/plant, adventurer walks to it. Clear arrows. Bottom branch "후보 없음 → 이번 생성 취소". Small ownership line "개인: 검증·가중 선택 / 공동: 공급 주기 조정". Do not show retry guarantee, minimum resource guarantee, or equal distribution.

## playtest.png

Title "피드백을 플레이 변화로". Three equal visual case-study columns. Column1 eyebrow "안내", question-mark adventurer unsure of tree or pond -> target-highlight and speech bubble with "Logging" from "Comparer", caption "현재 대상 · 행동 안내". Column2 eyebrow "제작 효과", adventurer chopping tree with stopwatch "7초" -> crafted axe with stopwatch "4.2초", label "도끼 1회 제작: ×0.6", tiny caption "코드 기준 예시". Column3 eyebrow "자원 운용", campfire accepts two fuel icons wood and plant; rocket with distributed candidate dots, label "연료 선택 · 공급 조정". Bottom spacious row with supporting wizard and ranger feedback bubbles: mint "진행 이해 · 목표 달성 가능" and amber "도구 필요성 · 반복 플레이는 과제". These are qualitative feedback, not measured improvement rate. Do not depict completion success-rate percentages.

## target-filter.png

Title "자기 아이템을 대상에서 제외". Two large before/after panels with pixel adventurer holding iron above/near hand, another iron on ground in front. Before red dashed detection fan highlights held iron erroneously with red X, label "자기 아이템이 후보에 포함". After same scene fan excludes held item and player's child objects with a muted barred ring, ground iron green highlight, label "현재 아이템 · Player 자식 제외". Bottom two check gates in series: "탐색 단계: 후보 제외" → "Comparer: 자기 조합 재검사" → valid ground-target crafting icon. Small line "팀원: 전방 탐색 / 개인: 제외 조건 · 재검사". Do not imply collision broadphase optimization or new sensor subsystem.

## recipe-order.png

Title "재료 순서와 무관한 레시피". Main two equally large rows: adventurer holding wood targeting iron, "Wood + Iron"; adventurer holding iron targeting wood, "Iron + Wood". Both converge to same central book "RecipeItemTypeComparer", show two concise tags "대칭 Equals" and "XOR Hash"; then single golden recipe card "(Wood, Iron)" in "Dictionary", then same axe output. Lower large simple visual "등록은 한 번 · 조회는 양방향". Three small mini outcomes fishing unlock / axe / bucket, no nonexistent materials. Mint ownership tag "개인 구현: CraftManager · RecipeItemTypeComparer". Make algorithm visual and readable not long code blocks.

## bucket-sync.png

Title "양동이 상태와 표현 동기화". Upper half before: adventurer at pond holding full bucket but small inventory square empty bucket, warning "상태 ≠ 화면". After: same adventurer full blue-water bucket with inventory icon also full, label "상태 · 월드 · 아이콘 일치". Lower main flow with arrows "Pond / Tree" splits into "Bucket.Fill / Empty" -> "isFilled · ItemSprite · 머티리얼" and parallel event path "PlayerInventory.OnInventoryChanged" -> "InventoryUI". Show water fill at pond and pour on sapling with empty bucket. Small ownership note "개인: 표현 보완 · 갱신 연결 / 팀원 기반: InventoryUI". Crucial: event emitted at Pond/Tree call sites, NOT automatically by Bucket; reflect branching accordingly.

## 검수 후 수정 프롬프트

### target-filter.png

Keep the layout and characters. Replace '같은 조합이면 제외' with '동일한 객체면 제외'. Object reference identity is checked, not ItemType equality. Held iron is 객체 A, candidate iron is 객체 B. Show A ≠ B → 통과. Two distinct iron objects can craft a bucket. Replace the result ingot with an empty metal bucket.

### recipe-order.png

Preserve the main Wood+Iron / Iron+Wood -> axe diagram. Correct only the miniature bucket recipe to TWO SILVER IRON INGOTS -> EMPTY METAL BUCKET, labeled 양동이 생성. Actual recipes: wood+iron -> axe; iron+iron -> bucket; wood+plant -> fishing unlock.

