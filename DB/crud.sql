-- 0번대 = 유튜브
-- 1000번대 = X
-- 2000번대 = 디씨
-- 3000번대 = 아카
-- 9000번대 = 기타

-- Insert sample records into guides table in fgc.db
INSERT INTO guides (id, url, title, chara, platform, tag1, tag2, tag3, tag4, tag5) VALUES
    (0, 'https://youtu.be/QbswI_YaXJY?si=VpWY9m2ZlX0XS-i8', '공통 시스템 가이드', '', 'YouTube', '기초', '~브론즈', '운영', '공용', ''),
	-- 기본캐 스타터 가이드
	(1, 'https://youtu.be/Nvtkod61MH8?si=qdy7OW4nsnAuk40S', '솔 배드가이 스타터 가이드', '솔 배드가이', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(2, 'https://youtu.be/720w-AmzlUg?si=o-XAKijul8RGQtQ2', '카이 키스크 스타터 가이드', '카이 키스크', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(3, 'https://youtu.be/FiofYbmtugg?si=uLB8mL2-iVvQPkXZ', '메이 스타터 가이드', '메이', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(4, 'https://youtu.be/dxkcvU6qDQk?si=Jl-ksLMXYH-Xw3uX', '액슬 로우 스타터 가이드', '액슬 로우', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(5, 'https://youtu.be/R4YMb-fhT1M?si=x90SSLi95kSyWqZc', '치프 자너프 스타터 가이드', '치프 자너프', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(6, 'https://youtu.be/TWAtA9fpWX8?si=mpDjDz7rODk2psrY', '포템킨 스타터 가이드', '포템킨', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(7, 'https://youtu.be/lR4QcxsBaXQ?si=0D4vflSXHFu3evr9', '파우스트 스타터 가이드', '파우스트', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(8, 'https://youtu.be/qD3DNjAo7Yw?si=r6wzmVAIEpkGgqJj', '밀리아 레이지 스타터 가이드', '밀리아 레이지', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(9, 'https://youtu.be/HtVcCRdWgKA?si=KIskhpqgYG_bWbpK', '자토=ONE 스타터 가이드', '자토 ONE', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(10, 'https://youtu.be/EcgPCcYE-Mk?si=NamcI0CV7sUWXSIt', '램리썰 밸런타인 스타터 가이드', '램리썰 밸런타인', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(11, 'https://youtu.be/4Yc8Yi3tyNo?si=EceYGM_A6lKoLVdF', '레오 화이트팽 스타터 가이드', '레오 화이트팽', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(12, 'https://youtu.be/dglw2wuh2zk?si=hXtEP-E3bjjuhsJy', '나고리유키 스타터 가이드', '나고리유키', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(13, 'https://youtu.be/C0XZjad2eRI?si=Zx5eau2ReCmiv3FH', '지오바나 스타터 가이드', '지오바나', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(14, 'https://youtu.be/5s_Pq_go7XU?si=eb8gaxldYQy4lRHQ', '안지 미토 스타터 가이드', '안지 미토', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(15, 'https://youtu.be/yF07o74V7nc', '이노 스타터 가이드', '이노', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	-- 시즌 패스 1 스타터 가이드
	(16, 'https://youtu.be/BTHYTL9af5Y', '골드루이스 디킨슨 스타터 가이드', '골드루이스 디킨슨', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(17, 'https://youtu.be/JF0hQcjqYbM', '잭 오 스타터 가이드', '잭 오', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(18, 'https://youtu.be/1fTfTGS3PMo', '해피 케이오스 스타터 가이드', '해피 케이오스', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(19, 'https://youtu.be/cFTPaZmQJS4', '바이켄 스타터 가이드', '바이켄', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(20, 'https://youtu.be/DfAEQnbjt2c', '테스타먼트 스타터 가이드', '테스타먼트', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	-- 시즌 패스 2 스타터 가이드
	(21, 'https://youtu.be/xs_kL3IaC5U', '브리짓 스타터 가이드', '브리짓', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(22, 'https://youtu.be/WEaM_aNtkLE', '신 키스크 스타터 가이드', '신 키스크', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(23, 'https://youtu.be/d4PXpsqQrSA', '베드맨? 스타터 가이드', '베드맨?', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(24, 'https://youtu.be/d5hHDLCNZLI', '아스카 R# 스타터 가이드', '아스카 R#', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	-- 시즌 패스 3 스타터 가이드
	(25, 'https://youtu.be/vOznZrBtqw8', '죠니 스타터 가이드', '죠니', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(26, 'https://youtu.be/gXdQ33PN8gg', '엘페르트 밸런타인 스타터 가이드', '엘페르트 밸런타인', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(27, 'https://youtu.be/cPLlWDYqkCI', 'A.B.A 스타터 가이드', 'A.B.A', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(28, 'https://youtu.be/ZLSgqrg0tGo', '슬레이어 스타터 가이드', '슬레이어', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	-- 시즌 패스 4 스타터 가이드
	(29, 'https://youtu.be/kUMzx0VZlFE', '퀸 디지 스타터 가이드', '퀸 디지', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(30, 'https://youtu.be/gh0aqa-3xWs', '베놈 스타터 가이드', '베놈', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(31, 'https://youtu.be/0eDuQLvoOeA', '유니카 스타터 가이드', '유니카', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(32, 'https://youtu.be/UT3Q6cAZgYI', '루시 스타터 가이드', '루시', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	-- 시즌 패스 5 스타터 가이드
	(33, 'https://youtu.be/MIJwA7Pu9Ns', '쿠라도베리 잼 스타터 가이드', '쿠라도베리 잼', 'YouTube', '기초', '~브론즈', '운영', '', ''),
	(34, 'https://youtu.be/NdGQ7YGBHOw', '로보카이 스타터 가이드', '로보카이', 'YouTube', '기초', '~브론즈', '운영', '', '');

-- 디씨
INSERT INTO guides (id, url, title, chara, platform, tag1, tag2, tag3, tag4, tag5) VALUES
	(2000, 'https://gall.dcinside.com/guiltygear/534733', '[공략대회] 광물단이 말아주는 잼 공략', '쿠라도베리 잼', 'dcinside', '~다이아', '운영', '기초', '뉴트럴', '콤보');

-- 아카
INSERT INTO guides (id, url, title, chara, platform, tag1, tag2, tag3, tag4, tag5) VALUES
	(3000, 'https://arca.live/b/fightgame/182500955', '개격븽의 격겜학개론) 옵션 셀렉트', '', '아카라이브', '공용', '~다이아', '셋업', '대처법', '기상');

--기타
INSERT INTO guides (id, url, title, chara, platform, tag1, tag2, tag3, tag4, tag5) VALUES
    -- 더스트루프 링크
	(9000, 'https://www.dustloop.com/w/GGST/Sol_Badguy', '솔 배드가이 Dustloop', '솔 배드가이', '기타', '대처법', '~투신', '기초', '', ''),
	(9001, 'https://www.dustloop.com/w/GGST/Ky_Kiske', '카이 키스크 Dustloop', '카이 키스크', '기타', '대처법', '~투신', '기초', '', ''),
	(9002, 'https://www.dustloop.com/w/GGST/May', '메이 Dustloop', '메이', '기타', '대처법', '~투신', '기초', '', ''),
	(9003, 'https://www.dustloop.com/w/GGST/Axl_Low', '액슬 로우 Dustloop', '액슬 로우', '기타', '대처법', '~투신', '기초', '', ''),
	(9004, 'https://www.dustloop.com/w/GGST/Chipp_Zanuff', '치프 자너프 Dustloop', '치프 자너프', '기타', '대처법', '~투신', '기초', '', ''),
	(9005, 'https://www.dustloop.com/w/GGST/Potemkin', '포템킨 Dustloop', '포템킨', '기타', '대처법', '~투신', '기초', '', ''),
	(9006, 'https://www.dustloop.com/w/GGST/Faust', '파우스트 Dustloop', '파우스트', '기타', '대처법', '~투신', '기초', '', ''),
	(9007, 'https://www.dustloop.com/w/GGST/Millia_Rage', '밀리아 레이지 Dustloop', '밀리아 레이지', '기타', '대처법', '~투신', '기초', '', ''),
	(9008, 'https://www.dustloop.com/w/GGST/Zato-1', '자토=ONE Dustloop', '자토 ONE', '기타', '대처법', '~투신', '기초', '', ''),
	(9009, 'https://www.dustloop.com/w/GGST/Ramlethal_Valentine', '램리썰 밸런타인 Dustloop', '램리썰 밸런타인', '기타', '대처법', '~투신', '기초', '', ''),
	(9010, 'https://www.dustloop.com/w/GGST/Leo_Whitefang', '레오 화이트팽 Dustloop', '레오 화이트팽', '기타', '대처법', '~투신', '기초', '', ''),
	(9011, 'https://www.dustloop.com/w/GGST/Nagoriyuki', '나고리유키 Dustloop', '나고리유키', '기타', '대처법', '~투신', '기초', '', ''),
	(9012, 'https://www.dustloop.com/w/GGST/Giovanna', '지오바나 Dustloop', '지오바나', '기타', '대처법', '~투신', '기초', '', ''),
	(9013, 'https://www.dustloop.com/w/GGST/Anji_Mito', '안지 미토 Dustloop', '안지 미토', '기타', '대처법', '~투신', '기초', '', ''),
	(9014, 'https://www.dustloop.com/w/GGST/I-No', '이노 Dustloop', '이노', '기타', '대처법', '~투신', '기초', '', ''),
	(9015, 'https://www.dustloop.com/w/GGST/Goldlewis_Dickinson', '골드루이스 디킨슨 Dustloop', '골드루이스 디킨슨', '기타', '대처법', '~투신', '기초', '', ''),
	(9016, 'https://www.dustloop.com/w/GGST/Jack-O%27', '잭 오 Dustloop', '잭 오', '기타', '대처법', '~투신', '기초', '', ''),
	(9017, 'https://www.dustloop.com/w/GGST/Happy_Chaos', '해피 케이오스 Dustloop', '해피 케이오스', '기타', '대처법', '~투신', '기초', '', ''),
	(9018, 'https://www.dustloop.com/w/GGST/Baiken', '바이켄 Dustloop', '바이켄', '기타', '대처법', '~투신', '기초', '', ''),
	(9019, 'https://www.dustloop.com/w/GGST/Testament', '테스타먼트 Dustloop', '테스타먼트', '기타', '대처법', '~투신', '기초', '', ''),
	(9020, 'https://www.dustloop.com/w/GGST/Bridget', '브리짓 Dustloop', '브리짓', '기타', '대처법', '~투신', '기초', '', ''),
	(9021, 'https://www.dustloop.com/w/GGST/Sin_Kiske', '신 키스크 Dustloop', '신 키스크', '기타', '대처법', '~투신', '기초', '', ''),
	(9022, 'https://www.dustloop.com/w/GGST/Bedman%3F', '베드맨? Dustloop', '베드맨?', '기타', '대처법', '~투신', '기초', '', ''),
	(9023, 'https://www.dustloop.com/w/GGST/Asuka_R%23', '아스카 R# Dustloop', '아스카 R#', '기타', '대처법', '~투신', '기초', '', ''),
	(9024, 'https://www.dustloop.com/w/GGST/Johnny', '죠니 Dustloop', '죠니', '기타', '대처법', '~투신', '기초', '', ''),
	(9025, 'https://www.dustloop.com/w/GGST/Elphelt_Valentine', '엘페르트 밸런타인 Dustloop', '엘페르트 밸런타인', '기타', '대처법', '~투신', '기초', '', ''),
	(9026, 'https://www.dustloop.com/w/GGST/A.B.A', 'A.B.A Dustloop', 'A.B.A', '기타', '대처법', '~투신', '기초', '', ''),
	(9027, 'https://www.dustloop.com/w/GGST/Slayer', '슬레이어 Dustloop', '슬레이어', '기타', '대처법', '~투신', '기초', '', ''),
	(9028, 'https://www.dustloop.com/w/GGST/Queen_Dizzy', '퀸 디지 Dustloop', '퀸 디지', '기타', '대처법', '~투신', '기초', '', ''),
	(9029, 'https://www.dustloop.com/w/GGST/Venom', '베놈 Dustloop', '베놈', '기타', '대처법', '~투신', '기초', '', ''),
	(9030, 'https://www.dustloop.com/w/GGST/Unika', '유니카 Dustloop', '유니카', '기타', '대처법', '~투신', '기초', '', ''),
	(9031, 'https://www.dustloop.com/w/GGST/Lucy', '루시 Dustloop', '루시', '기타', '대처법', '~투신', '기초', '', ''),
	(9032, 'https://www.dustloop.com/w/GGST/Jam_Kuradoberi', '쿠라도베리 잼 Dustloop', '쿠라도베리 잼', '기타', '대처법', '~투신', '기초', '', ''),
	(9033, 'https://www.dustloop.com/w/GGST/Robo-Ky', '로보카이 Dustloop', '로보카이', '기타', '대처법', '~투신', '기초', '', '');