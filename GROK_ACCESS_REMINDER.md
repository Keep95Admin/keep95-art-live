# Grok File Access Reminder

This file documents how Grok (built by xAI) accesses and reads files from this public GitHub repository. It is intended as a reference to maintain consistency in interactions.

## Access Method
- **Tool Used**: Grok uses the `browse_page` tool to fetch content from raw GitHub URLs.
- **URL Format**: For any file, Grok browses `https://raw.githubusercontent.com/Keep95Admin/keep95-art-live/main/<file_path>`.
  - Example: To read `src/app/page.tsx`, the URL is `https://raw.githubusercontent.com/Keep95Admin/keep95-art-live/main/src/app/page.tsx`.
- **Instructions for Grok**: When querying, provide explicit instructions like: "Extract the full code content from this file and summarize its structure."
- **Limitations**:
  - Repository must remain public.
  - Binary files (e.g., images) may require the `view_image` tool instead.
  - No direct write access; changes must be manual via GitHub or local edits.
- **Verification**: Test by asking Grok to read a known file, e.g., "Read the content of GROK_ACCESS_REMINDER.md".

## Usage in Conversations
- Reference this file when needed: "As per GROK_ACCESS_REMINDER.md, analyze <file>."
- Commit and push this file to ensure it's accessible.

Last Updated: December 6, 2025