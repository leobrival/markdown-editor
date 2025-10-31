---
description: "Task list for Markdown Editor MVP implementation"
---

# Tasks: Markdown Editor MVP

**Input**: Design documents from `/specs/001-create-markdown-editor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/

**Tests**: No tests requested in specification - tasks focus on implementation only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Web application structure from plan.md: `src/components/`, `src/lib/`, `src/types/`, `src/styles/`, `public/`
- Paths shown below follow the implementation plan structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create GitHub repository and initialize with git (link to markdown-editor remote repository)
- [ ] T002 Initialize Vite project with React + TypeScript using `npm create vite@latest markdown-editor -- --template react-ts`
- [ ] T003 [P] Install and configure Shadcn/ui with Vite following https://ui.shadcn.com/docs/installation/vite in `src/`
- [ ] T004 [P] Configure Vite for GitHub Pages deployment in `vite.config.ts` (set base path for repository)
- [ ] T005 [P] Setup GitHub Actions workflow for automated deployment to GitHub Pages in `.github/workflows/deploy.yml`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Setup markdown rendering utility with remark/remark-react in `src/lib/markdown.ts`
- [ ] T007 Create GitHub-compatible CSS styling file in `src/styles/markdown-preview.css`
- [ ] T008 Create base types and interfaces in `src/types/index.ts` (Document, EditorState, FormattingAction, MarkdownPreview)
- [ ] T009 Create file operations utility functions in `src/lib/file.ts` (download/upload helpers)
- [ ] T010 Create formatting utilities in `src/lib/format.ts` (text formatting functions for toolbar)
- [ ] T011 Setup global styling in `src/styles/globals.css` with Tailwind configuration
- [ ] T012 Create main App component structure in `src/App.tsx` with routing/layout setup
- [ ] T013 Create HTML template in `public/index.html` with proper meta tags and webpack entry point
- [ ] T014 Configure environment variables and build scripts in package.json

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Edit Markdown with GitHub-Style Live Preview (Priority: P1) 🎯 MVP

**Goal**: Users can edit markdown content and see real-time GitHub-style preview in split-view

**Independent Test**:
1. Open editor → type "# Hello World" → preview shows H1 with GitHub styling
2. Type markdown content with multiple elements → preview updates within 500ms
3. Preview styling matches GitHub's default markdown rendering
4. Verify syntax highlighting in code blocks

### Implementation for User Story 1

- [ ] T015 [P] [US1] Create Editor component in `src/components/Editor.tsx` with textarea/contenteditable and value/onChange props
- [ ] T016 [P] [US1] Create Preview component in `src/components/Preview.tsx` with markdown-to-HTML rendering and GitHub CSS classes
- [ ] T017 [US1] Create Layout component in `src/components/Layout.tsx` implementing split-view grid (editor left, preview right)
- [ ] T018 [US1] Integrate Editor and Preview in Layout with state management for markdown content in `src/components/Layout.tsx`
- [ ] T019 [US1] Add markdown rendering with GitHub Flavored Markdown support in `src/lib/markdown.ts` (headers, bold, italic, lists, links, code blocks, tables)
- [ ] T020 [US1] Implement real-time preview update with debouncing (500ms) in Editor onChange handler
- [ ] T021 [US1] Apply GitHub markdown CSS styling to preview pane in `src/components/Preview.tsx`
- [ ] T022 [US1] Add syntax highlighting for code blocks using highlight.js in `src/lib/markdown.ts`
- [ ] T023 [US1] Create App.tsx component rendering full editor layout with Editor, Preview, and Toolbar
- [ ] T024 [US1] Add error handling for markdown rendering failures with user-friendly messages
- [ ] T025 [US1] Test complete user story: write markdown → see live preview → verify GitHub-style rendering

**Checkpoint**: User Story 1 (MVP) should be fully functional and testable independently

---

## Phase 4: User Story 2 - Format Text with Shadcn Toolbar Buttons (Priority: P2)

**Goal**: Users can format text using toolbar buttons instead of typing markdown syntax

**Independent Test**:
1. Select text → click Bold button → text wrapped with ** → preview shows bold
2. Select text → click H1 button → # added → preview shows heading
3. Click Bullet List button → - inserted → preview shows list item
4. Toolbar buttons display with Shadcn styling

### Implementation for User Story 2

- [ ] T026 [P] [US2] Create FormattingAction configuration array in `src/lib/format.ts` with bold, italic, header, list, link, code, table, checkbox actions
- [ ] T027 [US2] Create Toolbar component in `src/components/Toolbar.tsx` with Shadcn Button components for each formatting action
- [ ] T028 [US2] Implement text wrapping/insertion logic in `src/lib/format.ts` for each FormattingAction
- [ ] T029 [US2] Add Editor.getSelectedText() and Editor.insertAtCursor() methods in `src/components/Editor.tsx`
- [ ] T030 [US2] Connect Toolbar onFormat callback to apply formatting via Editor methods
- [ ] T031 [US2] Add tooltip UI to Toolbar buttons with keyboard shortcuts (e.g., Ctrl+B for bold)
- [ ] T032 [US2] Implement Bold action in `src/lib/format.ts` (wraps selected text with **)
- [ ] T033 [P] [US2] Implement Italic action in `src/lib/format.ts` (wraps selected text with *)
- [ ] T034 [P] [US2] Implement Header action in `src/lib/format.ts` (adds # to line start)
- [ ] T035 [P] [US2] Implement Bullet List action in `src/lib/format.ts` (adds - to line start)
- [ ] T036 [P] [US2] Implement Link action in `src/lib/format.ts` (wraps as [text](url))
- [ ] T037 [P] [US2] Implement Code Block action in `src/lib/format.ts` (wraps with triple backticks)
- [ ] T038 [P] [US2] Implement Table action in `src/lib/format.ts` (inserts basic table template)
- [ ] T039 [P] [US2] Implement Checkbox action in `src/lib/format.ts` (creates - [ ] task item)
- [ ] T040 [US2] Integrate Toolbar into Layout component in `src/components/Layout.tsx`
- [ ] T041 [US2] Test complete user story: select text → use toolbar → verify markdown applied and preview updated

**Checkpoint**: User Stories 1 AND 2 should both work independently and together

---

## Phase 5: User Story 3 - Save and Load Markdown Files (Priority: P3)

**Goal**: Users can download markdown to files and upload files back into the editor

**Independent Test**:
1. Write markdown → click Download → file saved as .md
2. Clear editor → click Upload → select saved file → content restored
3. File operations complete without data loss
4. Verify filename handling and error messages

### Implementation for User Story 3

- [ ] T042 [P] [US3] Create FileOperations component in `src/components/FileOperations.tsx` with Download and Upload buttons
- [ ] T043 [US3] Implement downloadMarkdown function in `src/lib/file.ts` to export content as .md file using browser Blob API
- [ ] T044 [US3] Implement uploadMarkdown function in `src/lib/file.ts` to read selected file using File API
- [ ] T045 [US3] Add file validation in upload (check for .md extension or text/plain MIME type)
- [ ] T046 [US3] Add error handling for failed file operations with user-friendly error messages
- [ ] T047 [US3] Create hidden file input element in FileOperations component for upload
- [ ] T048 [US3] Wire Download button to call downloadMarkdown with current editor content and filename
- [ ] T049 [US3] Wire Upload button to trigger file input dialog and call uploadMarkdown
- [ ] T050 [US3] Update Editor with uploaded content and refresh Preview
- [ ] T051 [US3] Display filename after successful upload/download
- [ ] T052 [US3] Integrate FileOperations component into Layout in `src/components/Layout.tsx`
- [ ] T053 [US3] Test complete user story: create content → download → upload in new session → verify restoration

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T054 [P] Add keyboard shortcuts for formatting (Ctrl/Cmd+B = Bold, Ctrl/Cmd+I = Italic, etc.) in Editor component
- [ ] T055 [P] Add local storage persistence to save editor state between sessions in `src/lib/file.ts`
- [ ] T056 Implement auto-save feature (save to localStorage every 30 seconds)
- [ ] T057 [P] Add responsive design for mobile (stack editor and preview vertically on small screens)
- [ ] T058 [P] Create Clear button to reset editor to blank document in FileOperations component
- [ ] T059 Add dark mode toggle in App component with localStorage persistence
- [ ] T060 Implement undo/redo functionality for editor changes in Editor component
- [ ] T061 [P] Add document character/word count display in toolbar or status bar
- [ ] T062 Create README.md with setup, usage, and deployment instructions
- [ ] T063 Optimize markdown rendering performance for large documents (>500KB) with debouncing
- [ ] T064 Add unit tests for markdown utility functions in `tests/unit/markdown.test.ts`
- [ ] T065 Add integration tests for Editor component in `tests/integration/Editor.test.tsx`
- [ ] T066 Add integration tests for Preview component in `tests/integration/Preview.test.tsx`
- [ ] T067 Add e2e tests with Playwright for complete user flows in `tests/e2e/editor.spec.ts`
- [ ] T068 [P] Test GitHub Pages deployment: build project, manually deploy with `npx gh-pages -d dist`, verify site loads at https://username.github.io/markdown-editor/
- [ ] T069 Validate all acceptance scenarios from quickstart.md work correctly
- [ ] T070 Final code cleanup and documentation of components

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - MVP**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 component exports but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independently testable

### Within Each Phase

- Components before integration
- Utilities before components that use them
- Types defined before implementation
- Core functionality before polish features
- Foundation complete before any user story work

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (ESLint, Tailwind, build config)
- All Foundational tasks can run in parallel:
  - T006 (markdown utility)
  - T007 (GitHub CSS)
  - T009 (file utility)
  - T010 (format utility)
  - T011 (global styles)
- Once Foundational phase completes, all user stories can start in parallel:
  - Team member A: User Story 1 (T015-T025)
  - Team member B: User Story 2 (T026-T041)
  - Team member C: User Story 3 (T042-T053)
- Within User Story 2: Tasks T032-T039 (action implementations) can run in parallel
- Polish phase has multiple tasks marked [P] that can run in parallel

---

## Parallel Example: User Story 1

```bash
# After Foundational phase completes, launch US1 tasks:
Task T015: Create Editor component in src/components/Editor.tsx
Task T016: Create Preview component in src/components/Preview.tsx
(T015 and T016 can run in parallel - different files, no dependencies)

# After Editor and Preview components complete:
Task T017: Create Layout combining them
Task T018: Integrate with state management
Task T019: Add markdown rendering
Task T020: Implement real-time preview updates
Task T021: Apply GitHub styling
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Estimated Completion**: 8-12 hours

1. Complete Phase 1: Setup (1-2 hours)
2. Complete Phase 2: Foundational (2-3 hours) - CRITICAL
3. Complete Phase 3: User Story 1 (5-7 hours)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Open editor → type markdown → see live preview
   - Verify GitHub-style rendering
   - Test with various markdown syntax
5. **DEPLOY**: Ship MVP with User Story 1 only

### Incremental Delivery

1. **Release 1.0 (MVP)**: Setup + Foundational + User Story 1 ✅
   - Edit markdown with live preview
   - GitHub-style rendering
   - Deploy to production

2. **Release 1.1 (P2 Feature)**: Add User Story 2
   - Install, commit phase 4 tasks
   - Test independently
   - Deploy update

3. **Release 1.2 (P3 Feature)**: Add User Story 3
   - Install, commit phase 5 tasks
   - Test independently
   - Deploy update

4. **Release 1.3 (Polish)**: Phase 6 improvements
   - Auto-save, undo/redo, dark mode
   - Keyboard shortcuts
   - Better UX
   - Deploy final polish

### Parallel Team Strategy

With 3 developers:

1. **All team**: Complete Phase 1 (Setup) together (1-2 hours)
2. **All team**: Complete Phase 2 (Foundational) together (2-3 hours) - CRITICAL
3. **Parallel work** (5-7 hours each):
   - Developer A: User Story 1 (Tasks T015-T025)
   - Developer B: User Story 2 (Tasks T026-T041)
   - Developer C: User Story 3 (Tasks T042-T053)
4. **All team**: Integration testing and Phase 6 Polish (2-3 hours)
5. **Deploy**: Release with all stories complete

---

## Checkpoints & Validation

### After Phase 1 (Setup)
- [ ] Project structure created with all directories
- [ ] Dependencies installed successfully
- [ ] Build works without errors

### After Phase 2 (Foundational)
- [ ] All utilities created and functional
- [ ] TypeScript types defined correctly
- [ ] GitHub CSS imported and available
- [ ] Ready for user story implementation

### After Phase 3 (User Story 1) - MVP Validation
- [ ] Editor component renders with textarea
- [ ] Preview component renders HTML from markdown
- [ ] Split-view layout displays correctly
- [ ] Type "# Test" → Preview shows H1 heading
- [ ] Type markdown with multiple elements → preview updates within 500ms
- [ ] Code blocks render with syntax highlighting
- [ ] Preview styling matches GitHub's appearance
- **READY TO DEPLOY AS MVP**

### After Phase 4 (User Story 2)
- [ ] Toolbar renders with all buttons
- [ ] Buttons display with Shadcn styling
- [ ] Select text → click Bold → text wrapped with **
- [ ] Select text → click H1 → # added and preview updates
- [ ] All formatting actions work correctly
- [ ] Toolbar buttons have tooltips

### After Phase 5 (User Story 3)
- [ ] Download button saves markdown as .md file
- [ ] Upload button opens file picker
- [ ] Upload reads file content correctly
- [ ] Editor content replaced with uploaded content
- [ ] Error messages display for invalid files
- [ ] File operations work without data loss

### After Phase 6 (Polish)
- [ ] Keyboard shortcuts work (Ctrl+B, Ctrl+I, etc.)
- [ ] Auto-save persists to localStorage
- [ ] Undo/redo works correctly
- [ ] Dark mode toggle functional
- [ ] Mobile responsive design tested
- [ ] Character/word count display accurate
- [ ] All tests pass
- [ ] Deployment to Vercel/Netlify successful

---

## Notes

- [P] tasks = different files, no dependencies on same file
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1 only)
- Can stop and deploy after User Story 1 completes
- Each story adds value without breaking previous stories
- Commit after each task or logical group (e.g., all toolbar buttons)
- Stop at each checkpoint to validate story independently
- Avoid vague tasks - each task should be specific enough for implementation
- Use exact file paths - assists with code navigation
