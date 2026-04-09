# WILD WILD - FMV 웹게임

## 프로젝트 개요

웹 브라우저에서 플레이하는 FMV(Full Motion Video) 게임. 동영상 재생 위에 UI 오버레이로 선택지 분기, QTE(Quick Time Event), 핫스팟 터치 등 인터랙션을 제공한다.

## 기술스택

- React 19 + TypeScript + Vite 8
- XState 5 (게임 상태 관리)
- PixiJS 8 (파티클/애니메이션 효과)
- pnpm (패키지 매니저)

## 개발 방향

- MVP 단계에서는 mp4 직접 재생, 상용에서는 HLS 전환
- PC: 영화관 스크린 UI, 모바일: 가로 전체화면 자동 전환
- 게임 요소: 선택지 분기, QTE 타이밍 이벤트, 사물 터치 핫스팟
- 좌표 측정용 Dev Overlay 내장 (`?dev` 파라미터 또는 개발 모드)
- 모든 게임 내 텍스트는 한글

## 실행

```
pnpm dev        # 개발 서버 (내부망 접속 가능)
pnpm build      # 프로덕션 빌드
pnpm preview    # 빌드 결과 미리보기
```

## Git Commit 규칙

- 한글로 작성
- 불필요한 문구 없이 변경사항만 목록으로 작성
- 예시:
  ```
  - QTE 시스템 구현
  - 선택지 오버레이 한글화
  - 모바일 전체화면 가로모드 대응
  ```
