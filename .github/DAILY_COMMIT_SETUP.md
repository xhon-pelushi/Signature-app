# Daily Commit Setup Instructions

This workflow automatically creates a daily commit to maintain your GitHub contribution streak (green squares).

## Important: Making Commits Count on Contribution Graph

By default, GitHub Actions commits made with `GITHUB_TOKEN` **do not count** toward your contribution graph. To make these commits count, you need to set up a Personal Access Token (PAT).

## Setup Steps

### 1. Create a Personal Access Token (PAT)

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Or visit: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Give it a name like "Daily Commit Bot"
4. Select the `repo` scope (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### 2. Add Secrets to Repository

1. Go to your repository on GitHub
2. Click Settings → Secrets and variables → Actions
3. Add the following secrets:

   - **Secret Name**: `GH_PAT`
     - **Value**: Your Personal Access Token from step 1

   - **Secret Name**: `GIT_USER_NAME` (optional, but recommended)
     - **Value**: Your GitHub username (e.g., "xhon-pelushi")

   - **Secret Name**: `GIT_USER_EMAIL` (optional, but recommended)
     - **Value**: Your GitHub email (the one associated with your account)
     - To find it: GitHub Settings → Emails

### 3. Verify Workflow

1. The workflow runs automatically every day at 00:00 UTC
2. You can also trigger it manually:
   - Go to Actions tab in your repository
   - Select "Daily Contribution Update"
   - Click "Run workflow"

### 4. Test the Workflow

After setting up the secrets, you can test by:
1. Going to the Actions tab
2. Manually triggering the workflow
3. Checking if a commit appears in your repository
4. Verifying the commit shows up on your contribution graph (may take a few minutes)

## Notes

- The workflow updates `contributions.md` file daily
- Commits are made with the message: "📅 Daily contribution update - YYYY-MM-DD"
- If you don't set up the PAT, commits will still be made but won't show on your contribution graph
- The workflow uses UTC timezone (00:00 UTC = midnight UTC)

## Troubleshooting

- **Commits not showing on contribution graph**: Make sure you've set up `GH_PAT`, `GIT_USER_NAME`, and `GIT_USER_EMAIL` secrets
- **Workflow failing**: Check the Actions tab for error messages
- **Permission errors**: Ensure your PAT has `repo` scope

