# Aim Trainer Leaderboard Enhancement - TODO

## Task: Add monthly/weekly leaderboards with auto-sync every 5 minutes

### Steps to Complete:

- [x] 1. Update firebase-auth.js to add new leaderboard functions
      - Add function to sync high scores to Firebase every 5 minutes
      - Add functions to get weekly/monthly/alltime leaderboards
      - Add function to store only top score per user (1 per person)
      
- [x] 2. Update index.html
      - Add leaderboard type tabs (All-Time, Weekly, Monthly)
      - Add CSS for new tabs
      - Update leaderboard display logic to show top 5 only
      - Update leaderboard loading to support different time periods

- [x] 3. Testing
      - Test that leaderboards show top 5 only
      - Test that weekly/monthly tabs work correctly
      - Test auto-sync functionality

### Notes:
- Current system stores all scores in single collection
- New system will have separate collections: leaderboard_alltime, leaderboard_weekly, leaderboard_monthly
- Auto-sync runs every 5 minutes (300000ms)
- Only 1 score per person shown on leaderboard

### Implementation Complete!
The following changes were made:
1. Added `syncHighScoresToFirebase()` - syncs user's high scores to Firebase every 5 minutes
2. Added `getAllTimeLeaderboard()`, `getWeeklyLeaderboard()`, `getMonthlyLeaderboard()` functions
3. Updated index.html with new tab UI for All-Time/Weekly/Monthly
4. Added `switchLeaderboardPeriod()` function to handle tab switching
5. Updated leaderboard to show top 5 scores only

