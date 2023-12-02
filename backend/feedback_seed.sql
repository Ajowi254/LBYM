-- feedback_seed.sql

INSERT INTO feedback (user_id, selected_option, created_at)
VALUES
  (1, 'Peer Referral', NOW()),
  (2, 'Search Engine', NOW()),
  (3, 'Facebook', NOW());
  
