USE soundbook_db;

-- SAMPLE DATA 

-- USERS
INSERT INTO users (id, email, password_hash, display_name, role) VALUES
(1, 'a@gmail.com', 'hash1', 'User A', 'USER'),
(2, 'b@gmail.com', 'hash2', 'User B', 'USER'),
(3, 'mod@gmail.com', 'hash3', 'Moderator', 'MODERATOR');

-- USER PROFILES
INSERT INTO user_profiles (user_id, username, bio) VALUES
(1, 'user_a', 'Music lover 🎵'),
(2, 'user_b', 'Book addict 📚'),
(3, 'mod', 'I moderate stuff');

-- ONBOARDING
INSERT INTO user_onboarding (user_id, music_connected, taste_dna_ready) VALUES
(1, 1, 1),
(2, 0, 1),
(3, 0, 0);

-- OAUTH
INSERT INTO oauth_accounts (id, user_id, provider, provider_user_id) VALUES
(1, 1, 'SPOTIFY', 'spotify_user_1');

INSERT INTO oauth_tokens (oauth_account_id, access_token, expires_at) VALUES
(1, 'token123', NOW() + INTERVAL 1 DAY);

-- DNA
INSERT INTO user_music_dna (user_id, built_from, prefs_json, vector_json) VALUES
(1, 'SPOTIFY', '{"genres":["pop","rock"]}', '{"v":[0.8,0.2]}');

INSERT INTO user_book_dna (user_id, prefs_json, vector_json) VALUES
(2, '{"genres":["fiction"]}', '{"v":[0.6]}');

INSERT INTO user_taste_dna (user_id, music_vector_json, book_vector_json) VALUES
(1, '{"v":[0.8]}', '{"v":[0.2]}'),
(2, '{"v":[0.3]}', '{"v":[0.7]}');

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
(4, 'DROPPED', 'Dropped');

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