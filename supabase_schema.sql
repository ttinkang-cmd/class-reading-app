-- ========================================================
-- 학급 윤독도서 관리 시스템 Supabase 데이터베이스 스키마
-- Supabase 대시보드 -> SQL Editor에 복사하여 실행하세요.
-- ========================================================

-- 1. 학생 테이블 (기본 1~30번)
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_number INT NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 도서 테이블 (기본 1~30권)
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    book_number INT NOT NULL UNIQUE,
    title VARCHAR(100) NOT NULL,
    cover_emoji VARCHAR(20) DEFAULT '📘',
    cover_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 독서 완료 체크 기록 테이블 (학생 ID, 도서 ID, 완료 여부)
CREATE TABLE IF NOT EXISTS reading_checks (
    id SERIAL PRIMARY KEY,
    student_number INT NOT NULL,
    book_number INT NOT NULL,
    is_completed BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_number, book_number)
);

-- 4. 도서별 느낀 점 (3줄 독서록) 테이블 (한번 제출하면 수정/삭제 불가)
CREATE TABLE IF NOT EXISTS book_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_number INT NOT NULL,
    student_number INT NOT NULL,
    student_name VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. 학급 기본 설정 테이블 (현재 주차 등)
CREATE TABLE IF NOT EXISTS class_settings (
    key VARCHAR(50) PRIMARY KEY,
    value JSONB NOT NULL
);

-- RLS (Row Level Security) 활성화 및 학급 공개 정책
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_settings ENABLE ROW LEVEL SECURITY;

-- 익명(학생/선생님 디벗) 모두 읽기/쓰기 허용 정책
CREATE POLICY "Public Read Students" ON students FOR SELECT USING (true);
CREATE POLICY "Public Read Books" ON books FOR SELECT USING (true);

CREATE POLICY "Public Read Checks" ON reading_checks FOR SELECT USING (true);
CREATE POLICY "Public Insert Checks" ON reading_checks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Checks" ON reading_checks FOR UPDATE USING (true);
CREATE POLICY "Public Delete Checks" ON reading_checks FOR DELETE USING (true);

CREATE POLICY "Public Read Reviews" ON book_reviews FOR SELECT USING (true);
CREATE POLICY "Public Insert Reviews" ON book_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Delete Reviews" ON book_reviews FOR DELETE USING (true);

CREATE POLICY "Public Read Settings" ON class_settings FOR SELECT USING (true);
CREATE POLICY "Public Upsert Settings" ON class_settings FOR ALL USING (true);

-- 기본 샘플 학생 (1~30번)
INSERT INTO students (student_number, name) VALUES
(1, '1번 김도윤'), (2, '2번 이서준'), (3, '3번 박하은'), (4, '4번 최시우'), (5, '5번 정지호'),
(6, '6번 강예은'), (7, '7번 조유준'), (8, '8번 윤서아'), (9, '9번 장민서'), (10, '10번 임채원'),
(11, '11번 한도현'), (12, '12번 오지우'), (13, '13번 서예준'), (14, '14번 신다은'), (15, '15번 권민준'),
(16, '16번 황수아'), (17, '17번 안시후'), (18, '18번 송채린'), (19, '19번 전은우'), (20, '20번 홍지유'),
(21, '21번 류현우'), (22, '22번 고서진'), (23, '23번 문하윤'), (24, '24번 양시안'), (25, '25번 손지원'),
(26, '26번 배주원'), (27, '27번 백은서'), (28, '28번 허우진'), (29, '29번 유소율'), (30, '30번 남태양')
ON CONFLICT (student_number) DO NOTHING;

-- 기본 샘플 도서 (1~30권)
INSERT INTO books (book_number, title, cover_emoji) VALUES
(1, '1권 어린 왕자', '👑'), (2, '2권 마당을 나온 암탉', '🐔'), (3, '3권 샬롯의 거미줄', '🕸️'),
(4, '4권 시간을 파는 상점', '⏳'), (5, '5권 아몬드', '🌰'), (6, '6권 자전거 도둑', '🚲'),
(7, '7권 푸른 사자 와니니', '🦁'), (8, '8권 불량한 자전거 여행', '🗺️'), (9, '9권 욕심쟁이 딸기 아저씨', '🍓'),
(10, '10권 괜찮아, 우리는 친구야', '🤝'), (11, '11권 고양이 해결사 깜냥', '🐱'), (12, '12권 나무 집 시리즈', '🏠'),
(13, '13권 만복이네 떡집', '🍡'), (14, '14권 수상한 아파트', '🏢'), (15, '15권 지각대장 존', '⏰'),
(16, '16권 강아지 똥', '🐕'), (17, '17권 구름빵', '☁️'), (18, '18권 알사탕', '🍬'),
(19, '19권 수박 수영장', '🍉'), (20, '20권 백희나 그림책', '🎨'), (21, '21권 수상한 도서관', '📚'),
(22, '22권 우주로 간 토끼', '🚀'), (23, '23권 비밀의 숲', '🌲'), (24, '24권 미래 탐험대', '🛸'),
(25, '25권 지구를 구하는 아이들', '🌍'), (26, '26권 용기의 별자리', '✨'), (27, '27권 꿈을 찾는 나침반', '🧭'),
(28, '28권 바다의 노래', '🌊'), (29, '29권 바람이 부는 곳', '🍃'), (30, '30권 빛나는 우리들', '🌟')
ON CONFLICT (book_number) DO NOTHING;

-- 기본 주차 설정 (1주차)
INSERT INTO class_settings (key, value) VALUES
('current_week', '1'::jsonb)
ON CONFLICT (key) DO NOTHING;
