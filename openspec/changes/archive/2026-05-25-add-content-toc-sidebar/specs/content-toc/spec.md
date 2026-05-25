## ADDED Requirements

### Requirement: TOC renders heading navigation links

The system SHALL render a table of contents sidebar listing all h2 and h3 headings from the markdown content. Each link MUST display the heading text with indentation corresponding to its depth (h2 = no indent, h3 = left margin). The TOC SHALL be hidden on mobile viewports and visible on desktop (`md` breakpoint and above). If the content has no headings, the TOC SHALL render nothing.

The TOC SHALL use `position: sticky` so it remains visible as the user scrolls through the article.

#### Scenario: Article with h2 and h3 headings

- **WHEN** viewing a blog post with 3 h2 headings and 2 h3 sub-headings
- **THEN** the TOC displays 5 links with h3 entries indented relative to h2 entries

#### Scenario: Article with no headings

- **WHEN** viewing a blog post containing only plain text with no h2 or h3 headings
- **THEN** the TOC renders nothing and occupies no space

#### Scenario: Mobile viewport

- **WHEN** the viewport width is below the `md` breakpoint
- **THEN** the TOC is not visible

### Requirement: TOC highlights current heading on scroll

The system SHALL track the user's scroll position using IntersectionObserver and highlight the heading currently in view. The highlight style MUST visually distinguish the active link from inactive ones.

#### Scenario: User scrolls through article

- **WHEN** the user scrolls past heading "How are Tokens used during AI training?"
- **THEN** that heading's corresponding TOC link becomes highlighted with a distinct style

#### Scenario: Multiple headings visible

- **WHEN** multiple headings are simultaneously visible in the viewport
- **THEN** the first (topmost) visible heading is highlighted in the TOC

### Requirement: TOC click scrolls to heading

The system SHALL smoothly scroll to the corresponding heading when a TOC link is clicked. The URL hash SHALL be updated to reflect the target heading using `history.replaceState` (no new history entry).

#### Scenario: User clicks TOC link

- **WHEN** the user clicks "How are Tokens used during AI inference and reasoning?" in the TOC
- **THEN** the page smoothly scrolls to that heading and the URL updates to `#how-are-tokens-used-during-ai-inference-and-reasoning`
