#!/bin/bash

# Replace these variables with your GitHub information
GITHUB_USERNAME="your-username"
REPO_NAME="get-more-views-ai"

# Add the remote origin
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Rename branch to main if not already
git branch -M main

# Push to GitHub
git push -u origin main

echo "Repository pushed to GitHub at: https://github.com/$GITHUB_USERNAME/$REPO_NAME"