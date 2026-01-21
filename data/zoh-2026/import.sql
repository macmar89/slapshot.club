-- ZOH 2026 Import Script

-- Create France Team
INSERT INTO teams (id, name, short_name, type, primary_color, secondary_color, created_at, updated_at) 
VALUES ('fq521qu6u08tpdsjc6v607p5', 'Francúzsko', 'FRA', 'national', '#002395', '#ffffff', NOW(), NOW());

-- Create Matches
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('onrmmewe5pxnhajohgmffzvq', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-11T16:40:00.000Z', 'ky7x9r2m5k8l1n3p4q6s0t2v', 'q1w2e3r4t5y6u7i8o9p0a1s2', 'scheduled', 'group_phase', 'B', 'Slovensko vs Fínsko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('ijbc1qcu9b8wt725i4682f1l', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-11T21:10:00.000Z', 'mnbvcxzasdfghjklpoiuytre', 'pl0ok9ij8uh7yg6tf5rd4es3', 'scheduled', 'group_phase', 'B', 'Švédsko vs Taliansko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('drkr9kybfntv34qbtcvnx5dz', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-12T12:10:00.000Z', '1qaz2wsx3edc4rfv5tgb6yhn', 'fq521qu6u08tpdsjc6v607p5', 'scheduled', 'group_phase', 'A', 'Švajčiarsko vs Francúzsko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('rpmxgn65b5v110vqnmuixkhm', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-12T16:40:00.000Z', 'j4h5g6f7d8s9a0p1o2i3u4y5', 'w2e3r4t5y6u7i8o9p0a1s2d3', 'scheduled', 'group_phase', 'A', 'Česko vs Kanada', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('bxznbb28wqqrqubc0rvpuar5', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-12T21:10:00.000Z', 'zaq1xsw2cde3vfr4bgt5nhy6', 'zxcvbnm123456asdfghjkl78', 'scheduled', 'group_phase', 'C', 'Lotyšsko vs USA', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('j116edymx1y2dr80w89c97c5', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-12T21:10:00.000Z', 'laksjdhfgqpwoeirutyznvm1', 'mju7nhy6bgt5vfr4cde3xsw2', 'scheduled', 'group_phase', 'C', 'Nemecko vs Dánsko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('cbwgj19r7tkak17b41bnup53', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-13T12:10:00.000Z', 'pl0ok9ij8uh7yg6tf5rd4es3', 'ky7x9r2m5k8l1n3p4q6s0t2v', 'scheduled', 'group_phase', 'B', 'Taliansko vs Slovensko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('wb36e6lsrvp7y2aj7jx35xgo', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-13T12:10:00.000Z', 'q1w2e3r4t5y6u7i8o9p0a1s2', 'mnbvcxzasdfghjklpoiuytre', 'scheduled', 'group_phase', 'B', 'Fínsko vs Švédsko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('xc4ju54jtzsw2bwe7gvf1tlk', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-13T16:40:00.000Z', 'fq521qu6u08tpdsjc6v607p5', 'j4h5g6f7d8s9a0p1o2i3u4y5', 'scheduled', 'group_phase', 'A', 'Francúzsko vs Česko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('z2kak60oa9dexynh7oxxdve8', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-13T21:10:00.000Z', 'w2e3r4t5y6u7i8o9p0a1s2d3', '1qaz2wsx3edc4rfv5tgb6yhn', 'scheduled', 'group_phase', 'A', 'Kanada vs Švajčiarsko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('rmmaup1nyo2ojbkviddqzhh1', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-14T12:10:00.000Z', 'mnbvcxzasdfghjklpoiuytre', 'ky7x9r2m5k8l1n3p4q6s0t2v', 'scheduled', 'group_phase', 'B', 'Švédsko vs Slovensko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('k37onkcvg5icmxcy36rjsdi7', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-14T12:10:00.000Z', 'laksjdhfgqpwoeirutyznvm1', 'zaq1xsw2cde3vfr4bgt5nhy6', 'scheduled', 'group_phase', 'C', 'Nemecko vs Lotyšsko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('a3gwtfern4xcgu69sd7muq41', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-14T16:40:00.000Z', 'q1w2e3r4t5y6u7i8o9p0a1s2', 'pl0ok9ij8uh7yg6tf5rd4es3', 'scheduled', 'group_phase', 'B', 'Fínsko vs Taliansko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('c7agcbsnzljyys18rqu1yuib', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-14T21:10:00.000Z', 'zxcvbnm123456asdfghjkl78', 'mju7nhy6bgt5vfr4cde3xsw2', 'scheduled', 'group_phase', 'C', 'USA vs Dánsko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('c26sanpeh595vk6uo062egjy', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-15T12:10:00.000Z', '1qaz2wsx3edc4rfv5tgb6yhn', 'j4h5g6f7d8s9a0p1o2i3u4y5', 'scheduled', 'group_phase', 'A', 'Švajčiarsko vs Česko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('cmhztjrgzndj0tpv6g3v0ppo', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-15T16:40:00.000Z', 'w2e3r4t5y6u7i8o9p0a1s2d3', 'fq521qu6u08tpdsjc6v607p5', 'scheduled', 'group_phase', 'A', 'Kanada vs Francúzsko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('z8qukuayssoeze2lcb624z2e', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-15T19:10:00.000Z', 'mju7nhy6bgt5vfr4cde3xsw2', 'zaq1xsw2cde3vfr4bgt5nhy6', 'scheduled', 'group_phase', 'C', 'Dánsko vs Lotyšsko', NOW(), NOW());
INSERT INTO matches (id, competition_id, date, home_team_id, away_team_id, status, stage_type, group_name, display_title, created_at, updated_at)
VALUES ('arpke07sglwu2xulcah3n2fl', 'nuy2mhu5y0bptjed2r4dfwtm', '2026-02-15T21:10:00.000Z', 'zxcvbnm123456asdfghjkl78', 'laksjdhfgqpwoeirutyznvm1', 'scheduled', 'group_phase', 'C', 'USA vs Nemecko', NOW(), NOW());
