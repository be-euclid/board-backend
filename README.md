EXAMPLE

사용자 클릭: "/class" 페이지
       ↓
React Router: class.tsx 컴포넌트 렌더링
       ↓
useQuery Hook: API 호출 준비
       ↓
API 클라이언트: GET http://localhost:3001/api/posts/category/class
       ↓
NestJS Controller: PostsController.findByCategory()
       ↓
PostsService: findByCategory('class')
       ↓
TypeORM Repository: SELECT * FROM posts WHERE category_id = 'class'
       ↓
PostgreSQL: 쿼리 실행, 결과 반환
       ↓
백엔드: JSON 형태로 응답 {"posts": [...]}
       ↓
프론트엔드: 데이터를 받아서 화면에 렌더링

| 프론트엔드 페이지 | API 엔드포인트               | 백엔드 컨트롤러 | 데이터베이스 테이블 |
| -----------------| ----------------------------------- | ----------------------- | --------------------- | 
| /class | GET /api/posts/category/class            | PostsController.findByCategory | posts + categories |
