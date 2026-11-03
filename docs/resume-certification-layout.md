# Resume 자격증 행 복원 메모

사용자 요청으로 정보처리기사 행을 화면에서 제거했습니다. 다시 추가해 달라는 요청이 있을 때만 복원합니다.

- 위치: `index.html` Resume 표의 Awards 행 다음, Experience 행 이전.
- 구조: 왼쪽 `Certification` 라벨, 오른쪽 날짜와 자격증명. 기존 Resume 표의 공통 스타일을 사용합니다.
- 기존 표기: `2026.10`, `정보처리기사`. 복원 시 날짜와 문구는 사용자의 최신 요청을 따릅니다.
- 다른 Resume 행이나 Skills 표의 레이아웃은 변경하지 않았습니다.

```html
<article class="resume-group certification-group">
  <p class="resume-label">Certification</p>
  <div class="resume-items">
    <div class="resume-entry">
      <time datetime="2026-10">2026.10</time>
      <h3>정보처리기사</h3>
    </div>
  </div>
</article>
```
