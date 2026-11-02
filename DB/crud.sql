-- Insert sample records into guides table in fgc.db
INSERT INTO guides (id, url, chara, platform, tag1, tag2, tag3, tag4, tag5) VALUES
	(1, 'https://example.com/ryu-combo-guide', 'Ryu', 'YouTube', 'combo', 'beginner', 'neutral', 'footsies', 'guide'),
	(2, 'https://example.com/chunli-bnb', 'Chun-Li', 'Blog', 'bnb', '', '', '', ''),
	(3, 'https://example.com/juri-setplay', 'Juri', 'Discord', 'setplay', 'okizeme', 'corner', '', '');

-- Read all records
SELECT id, url, chara, platform, tag1, tag2, tag3, tag4, tag5
FROM guides
ORDER BY id;
