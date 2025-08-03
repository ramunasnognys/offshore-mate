### **Software Specification: Offshore Calendar Mobile UI Refactor**

**Version:** 1.0
**Date:** May 21, 2024
**Author:** AI System Architect

#### **1.0 High-Level Goal**

The primary objective is to refactor the application's core layout to resolve a critical UI bug where mobile navigation buttons are unresponsive on initial load. This will be achieved by architecturally separating fixed-position elements (like the bottom toolbar) from scrollable content, creating a more robust and maintainable UI without relying on `z-index` hacks. A secondary goal is to correct the associated, failing Playwright tests.

#### **2.0 Problem Statement**

**2.1 Primary Issue: Unclickable Navigation Buttons**
On mobile viewports, the left and right arrow buttons for month-to-month navigation are rendered but do not respond to touch events until the user scrolls the page. The root cause is an improper stacking context: the `BottomToolbar` component is a `position: fixed` element rendered within the same parent as the scrollable calendar. Its container invisibly overlaps the navigation buttons, intercepting all touch events intended for them.

**2.2 Secondary Issue: Broken Automated Tests**
The Playwright test suite in `tests/mobile-navigation.spec.ts` is failing and contains invalid tests:
*   **Incorrect Locators:** Tests for the navigation buttons use `aria-label` attributes (`"Next month"`) that do not match the implemented labels (`"Go to next month"`), causing test failures.
*   **Irrelevant Logic:** A test for `z-index` layering is brittle and will be made obsolete by the architectural fix. A test for swipe gestures targets a `.mobile-swipe-container` that does not exist.

#### **3.0 Architectural Solution**

The implementation will refactor the page structure to follow a standard, robust web application layout pattern. This is a superior solution to adjusting `z-index` values as it addresses the root cause of the layout conflict.

1.  **Layout Centralization:** The main page component (`src/app/page.tsx`) will be modified to manage the overall page layout. It will contain a flexbox container that separates a main scrollable content area from the fixed `BottomToolbar`.
2.  **Component Responsibility:** The `CalendarDisplay` component will be simplified, removing its responsibility for rendering toolbars. Its sole focus will be to display the calendar content.
3.  **Content Safe Area:** A `padding-bottom` will be applied to the main scrollable area using CSS to ensure the fixed `BottomToolbar` does not obscure the last rows of the calendar content.
4.  **Test Correction:** The mobile navigation test suite will be updated to use correct locators and to remove tests for non-existent or obsolete functionality.

#### **4.0 Acceptance Criteria**

1.  The left and right month navigation buttons must be immediately clickable after the calendar is generated on mobile, without requiring user scrolling.
2.  The `BottomToolbar` must not overlap any scrollable content. All calendar content must be scrollable and visible above the toolbar.
3.  All existing application functionalities (calendar generation, saving, exporting) must remain fully operational.
4.  The Playwright test suite must pass. The `mobile-navigation.spec.ts` file must be updated and its valid tests must succeed.
5.  The `z-index` of the navigation buttons should not be modified; the fix must be architectural.

---

#### **5.0 Detailed Implementation Instructions**

**Task 5.1: Refactor the Main Page Layout**

*   **File to Modify:** `src/app/page.tsx`
*   **Instructions:**
    1.  Restructure the root element of the `HomeContent` component to be a flex container that fills the viewport's height. Use the classes `flex flex-col h-screen`.
    2.  Inside this container, wrap all primary content (from the "Offshore Mate" heading down to the footer) within a `<main>` HTML element.
    3.  Style this `<main>` element to be the primary scrollable area. It should grow to fill available space and allow vertical scrolling. Use the classes `flex-1 overflow-y-auto`.
    4.  Relocate the `<BottomToolbar />` component from `src/components/calendar/CalendarDisplay.tsx` into this file. Place it as a direct sibling *after* the `<main>` element.
    5.  The logic for the `useExportCalendar` hook must also be moved from `CalendarDisplay` to `HomeContent`, as it now controls the toolbar that triggers the export.
    6.  The `UIProvider` should wrap the `CalendarProvider` in the default export function to ensure all hooks have access to the necessary context.
    7.  The final structure of `HomeContent` should look conceptually like this:
        ```jsx
        <div className="flex flex-col h-screen ...">
          <NotificationManager ... />
          <main className="flex-1 overflow-y-auto ...">
            {/* All main page content, including CalendarDisplay */}
          </main>
          {/* Conditional rendering of the toolbar */}
          {isCalendarGenerated && isMobileView && <BottomToolbar ... />}
        </div>
        ```

**Task 5.2: Simplify the Calendar Display Component**

*   **File to Modify:** `src/components/calendar/CalendarDisplay.tsx`
*   **Instructions:**
    1.  Remove the component imports for `BottomToolbar` and `FloatingActionMenu`.
    2.  Remove the `useExportCalendar` hook and all associated state and handler functions (e.g., `isDownloading`, `exportFormat`, `handleExport`). This logic is now managed by the parent `page.tsx`.
    3.  In the component's return statement, delete the JSX for both `<FloatingActionMenu />` and `<BottomToolbar />`.
    4.  Remove the `pb-40` class from the root `div` element, as the new layout handles the necessary padding via the `<main>` element.

**Task 5.3: Add Supporting CSS for the New Layout**

*   **File to Modify:** `src/app/globals.css`
*   **Instructions:**
    1.  At the top of the file, inside a new `@layer base` block, add a CSS rule to apply padding to the bottom of the main scrollable area. This prevents the fixed toolbar from obscuring the last items in the calendar.
    2.  The rule should target `main.overflow-y-auto`.
    3.  Set the `padding-bottom` using the pre-defined CSS variables for toolbar height and the safe area inset. The value should be: `calc(var(--bottom-toolbar-height) + var(--bottom-toolbar-safe-area) + 1rem)`.
    4.  Add a rule to ensure the `h-screen` flex container works correctly on mobile browsers:
        ```css
        .flex-col.h-screen {
          min-height: -webkit-fill-available;
        }
        ```

**Task 5.4: Correct and Clean Up Automated Tests**

*   **File to Modify:** `tests/mobile-navigation.spec.ts`
*   **Instructions:**
    1.  **Delete the swipe gesture test:** Remove the entire test block titled `'should generate calendar and navigate with swipe gestures'`. It targets a non-existent element and is not part of the required functionality.
    2.  **Correct button locators:** In the test titled `'should navigate with navigation buttons'`, find the locators for `nextButton` and `prevButton`.
        *   Change the `aria-label` from `"Next month"` to `"Go to next month"`.
        *   Change the `aria-label` from `"Previous month"` to `"Go to previous month"`.
    3.  **Delete the z-index test:** Remove the entire test block titled `'should maintain proper z-index layering'`. This test validates an implementation detail that is now obsolete due to the architectural refactor.

#### **6.0 Verification Plan**

1.  **Automated Verification:** Execute the entire Playwright test suite via the command line (`npm run test`). All tests must pass.
2.  **Manual Verification (Mobile Viewport):**
    *   Generate a calendar and confirm the navigation arrow buttons are immediately responsive.
    *   Confirm the `BottomToolbar` is fixed at the bottom of the screen.
    *   Scroll to the end of the calendar and confirm the last week is fully visible above the toolbar.
3.  **Manual Verification (Desktop Viewport):**
    *   Confirm all calendar generation and export functionalities work as expected. The `BottomToolbar` should not be visible.

This specification provides a complete guide for the AI to implement the necessary changes to resolve the identified UI issues in a robust and maintainable manner.