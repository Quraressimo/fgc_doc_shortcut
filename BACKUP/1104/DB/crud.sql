-- Insert sample records into guides table in fgc.db
INSERT INTO guides (id, url, chara, platform, tag1, tag2, tag3, tag4, tag5) VALUES
	(0, 'https://www.youtube.com/results?search_query=%EC%86%94+%EB%B0%B0%EB%93%9C%EA%B0%80%EC%9D%B4+%EC%BD%A4%EB%B3%B4', '솔 배드가이', 'YOUTUBE', '콤보', '~브론즈', '중거리', '기초', '텐션 50%'),
	(1, 'https://www.youtube.com/results?search_query=%EC%B9%B4%EC%9D%B4+%ED%82%A4%EC%8A%A4%ED%81%AC+%EC%95%95%EB%B0%95', '카이 키스크', 'YOUTUBE', '압박', '구석', '운영', '텐션 50%', ''),
	(2, 'https://www.youtube.com/results?search_query=%EB%B8%8C%EB%A6%BF%EC%A7%80+%EC%85%8B%EC%97%85', '브리짓', 'YOUTUBE', '셋업', '~골드', '구석', '기상', '텐션 100%'),
	(3, 'https://search.dcinside.com/post/q/%EB%82%98%EA%B3%A0%EB%A6%AC%EC%9C%A0%ED%82%A4+%EB%8C%80%EC%B2%98%EB%B2%95', '나고리유키', 'DC', '대처법', '~다이아', '원거리', '뉴트럴', ''),
	(4, 'https://arca.live/b/search?q=%EB%A9%94%EC%9D%B4+%EC%9B%94%EB%B8%8C%EB%A0%88%EC%9D%B4%ED%81%AC', '메이', '아카', '월브레이크', '~투신', '구석', '콤보', '텐션 100%');

INSERT INTO guides (id, url, chara, platform, tag1, tag2, tag3, tag4, tag5) VALUES
	(5, 'https://arca.live/b/fightgame/182500955', '', '아카', '공용', '~다이아', '셋업', '대처법', '기상');