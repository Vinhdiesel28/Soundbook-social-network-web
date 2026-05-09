USE soundbook_db;

-- SAMPLE DATA 

-- USERS
-- Sample password for all seeded users: 123456
INSERT INTO users (id, email, password_hash, display_name, role) VALUES
(1, 'a@gmail.com', '$2a$10$iVgcZu6nM0VNIiC4LAfRt.ucNQwaelD7wg/ImFXivPlv8kllwiVqK', 'User A', 'USER'),
(2, 'b@gmail.com', '$2a$10$i5sehoEJZD/uGCJuLqr8huXCwXkXLN3pvlMHfHT86GJPTnU6Z7.pe', 'User B', 'USER'),
(3, 'mod@gmail.com', '$2a$10$t5EqmBPkJ.0lQ1bKgdWELefi3Diw0dtA8cdAMBMIjcT5AOzAWJLmK', 'Moderator', 'MODERATOR');

-- USER PROFILES
INSERT INTO user_profiles (user_id, username, bio) VALUES
(1, 'user_a', 'Music lover 🎵'),
(2, 'user_b', 'Book addict 📚'),
(3, 'mod', 'I moderate stuff');

-- ONBOARDING
INSERT INTO user_onboarding (user_id, music_connected, music_dna_ready, book_dna_ready, taste_dna_ready, completed_at) VALUES
(1, 0, 1, 1, 1, NOW()),
(2, 0, 1, 1, 1, NOW()),
(3, 0, 0, 0, 0, NULL);

-- DNA: manual Taste DNA seed data. Vectors are normalized feature maps used by cosine similarity.
INSERT INTO user_music_dna (user_id, built_from, prefs_json, vector_json, confidence) VALUES
(1, 'MANUAL', '{"genres":["Ballad","Indie","Pop"],"moods":["Chill","Buồn"],"artists":["Đen Vâu"],"songs":[],"dislikedGenres":["EDM"]}', '{"genre:ballad":0.1667,"genre:indie":0.1667,"genre:pop":0.1667,"mood:chill":0.1,"mood:buon":0.1,"artist:den_vau":0.2}', 0.73),
(2, 'MANUAL', '{"genres":["Ballad","Lo-fi","Acoustic"],"moods":["Chill","Lãng mạn"],"artists":["Taylor Swift"],"songs":[],"dislikedGenres":["Metal"]}', '{"genre:ballad":0.1667,"genre:lo_fi":0.1667,"genre:acoustic":0.1667,"mood:chill":0.1,"mood:lang_man":0.1,"artist:taylor_swift":0.2}', 0.73);

INSERT INTO user_book_dna (user_id, prefs_json, vector_json, confidence) VALUES
(1, '{"genres":["Trinh thám","Fantasy","Tâm lý"],"themes":["Tội phạm","Trưởng thành"],"authors":["Higashino Keigo"],"books":["Conan"],"dislikedGenres":["Self-help"]}', '{"genre:trinh_tham":0.1667,"genre:fantasy":0.1667,"genre:tam_ly":0.1667,"theme:toi_pham":0.1,"theme:truong_thanh":0.1,"author:higashino_keigo":0.15,"book:conan":0.15}', 0.88),
(2, '{"genres":["Trinh thám","Lãng mạn","Fantasy"],"themes":["Tội phạm","Chữa lành"],"authors":["Nguyễn Nhật Ánh"],"books":["Harry Potter"],"dislikedGenres":["Kinh dị"]}', '{"genre:trinh_tham":0.1667,"genre:lang_man":0.1667,"genre:fantasy":0.1667,"theme:toi_pham":0.1,"theme:chua_lanh":0.1,"author:nguyen_nhat_anh":0.15,"book:harry_potter":0.15}', 0.88);

INSERT INTO user_taste_dna (user_id, music_vector_json, book_vector_json, music_confidence, book_confidence, w_music, w_book) VALUES
(1, '{"genre:ballad":0.1667,"genre:indie":0.1667,"genre:pop":0.1667,"mood:chill":0.1,"mood:buon":0.1,"artist:den_vau":0.2}', '{"genre:trinh_tham":0.1667,"genre:fantasy":0.1667,"genre:tam_ly":0.1667,"theme:toi_pham":0.1,"theme:truong_thanh":0.1,"author:higashino_keigo":0.15,"book:conan":0.15}', 0.73, 0.88, 0.50, 0.50),
(2, '{"genre:ballad":0.1667,"genre:lo_fi":0.1667,"genre:acoustic":0.1667,"mood:chill":0.1,"mood:lang_man":0.1,"artist:taylor_swift":0.2}', '{"genre:trinh_tham":0.1667,"genre:lang_man":0.1667,"genre:fantasy":0.1667,"theme:toi_pham":0.1,"theme:chua_lanh":0.1,"author:nguyen_nhat_anh":0.15,"book:harry_potter":0.15}', 0.73, 0.88, 0.50, 0.50);

-- POSTS
INSERT INTO posts (id, user_id, type, caption) VALUES
(1, 1, 'MUSIC_QUICK_NOTE', 'This song is amazing 🔥'),
(2, 2, 'BOOK_REVIEW', 'Great book, must read!');

-- POST MEDIA
INSERT INTO post_media (post_id, media_type, url) VALUES
(1, 'IMAGE', 'https://img.com/song.jpg');

-- COMMENTS
INSERT INTO comments (id, post_id, user_id, content) VALUES
(1, 1, 2, 'Nice taste bro');

INSERT INTO comments (id, post_id, user_id, parent_id, content) VALUES
(2, 1, 1, 1, 'Thanks!');

-- REACTIONS
INSERT INTO reactions (user_id, target_type, target_id, reaction_type) VALUES
(2, 'POST', 1, 'LIKE'),
(1, 'COMMENT', 1, 'HEART');

-- MUSIC COLLECTION
INSERT INTO user_music_collection (user_id, item_type, item_id, title) VALUES
(1, 'TRACK', 'track_123', 'Song A');

-- BOOKSHELVES
INSERT INTO bookshelves (id, code, name) VALUES
(1, 'WILL_READ', 'Want to Read'),
(2, 'READING', 'Reading'),
(3, 'FINISHED', 'Finished'),
(4, 'DROPPED', 'Dropped')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- BOOKSHELF (assumes seed exists)
INSERT INTO user_bookshelf_items (user_id, shelf_id, book_key, book_payload_json) VALUES
(2, 3, 'book_1', '{"title":"Book A"}');

-- FOLLOWS
INSERT INTO follows (follower_id, followee_id) VALUES
(1, 2),
(2, 1);

-- FRIEND REQUEST + FRIENDSHIP
INSERT INTO friend_requests (id, requester_id, receiver_id, status) VALUES
(1, 1, 2, 'ACCEPTED');

INSERT INTO friendships (user_id, friend_id) VALUES
(1, 2),
(2, 1);

-- ROOMS
INSERT INTO rooms (id, host_user_id, name) VALUES
(1, 1, 'Chill Music Room');

INSERT INTO room_members (room_id, user_id, role) VALUES
(1, 1, 'HOST'),
(1, 2, 'MEMBER');

-- ROOM PLAYBACK
INSERT INTO room_playback_state (room_id, track_id, is_playing) VALUES
(1, 'track_123', 1);

-- DM
INSERT INTO dm_threads (id, user1_id, user2_id) VALUES
(1, 1, 2);

INSERT INTO dm_messages (thread_id, sender_id, content_text) VALUES
(1, 1, 'Hello bro'),
(1, 2, 'Hi!');

-- NOTIFICATIONS
INSERT INTO notifications (user_id, type, actor_user_id, target_type, target_id, content) VALUES
(1, 'LIKE', 2, 'POST', 1, 'User B liked your post');

-- REPORTS
INSERT INTO reports (reporter_id, target_type, target_id, reason, description) VALUES
(2, 'POST', 1, 'SPAM', 'Looks like spam content'),
(1, 'USER', 2, 'HARASSMENT', 'User is toxic');