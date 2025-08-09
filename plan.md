Of course. Here is the full and complete feature specification document, finalized with all the decisions from our previous discussions.

---

### **FEATURE: Enhanced Schedule Saving and Management**

### **EXAMPLES:**

This feature introduces a more intuitive and contextual user flow for saving and managing schedules. Below are the key UI states and interactions.

**1. Generating and Saving a New Schedule**

After a user generates a calendar for the first time, a **Contextual Save Bar** appears. This bar provides a clear path to save the schedule without navigating away.

*   **Initial State (After Generation):**
    
    *   A default name like "14/21 Rotation (Mar 4, 2025)" is shown.
    *   The user can tap the name to edit it inline.
    *   The "Save" button is prominent.

*   **Saved State:**
    
    *   Upon tapping "Save," the button immediately changes to "Saved ✔".
    *   The entire bar then fades out after 2-3 seconds, leaving a clean interface.

**2. Managing Saved Schedules**

The "Saved Schedules" modal is redesigned to allow for direct manipulation of each schedule item.

*   **View Mode (Default):** Each item clearly displays its name and details, along with three distinct actions: Edit, Delete, and Load. This is an evolution of the provided screenshot.

    *   **Original Screenshot:**
        

    *   **Proposed View Mode:** The UI will be updated to include an `Edit` icon.
        ```
        +------------------------------------------------------+
        |                                                      |
        |  14/21 Rotation (Mar 4, 2025)         [✏️] [🗑️] [→]  |
        |  📅 Starts: ...   🕒 Modified: ...                   |
        |  [14/21 Rotation]                                    |
        |                                                      |
        +------------------------------------------------------+
        ```

*   **Edit Mode:** Tapping the `Edit` icon transitions the item into an in-place editing state, replacing the action icons with `Confirm` and `Cancel`.
    ```
    +------------------------------------------------------+
    |                                                      |
    | > [ My First Schedule| ]                 [✔️] [✕]  |
    |  📅 Starts: ...   🕒 Modified: ...                   |
    |  [14/21 Rotation]                                    |
    |                                                      |
    +------------------------------------------------------+
    ```

### **DOCUMENTATION:**

The following files will need to be created or modified during development:

*   **CREATE:**
    *   `src/components/ContextualSaveBar.tsx` - A new component for the contextual save UI that appears after generating a new schedule.

*   **MODIFY:**
    *   `src/components/saved-schedules.tsx` - This component will undergo a major refactor to implement the inline editing, deletion confirmation dialog, and updated UI.
    *   `src/components/calendar/CalendarDisplay.tsx` - Will be modified to conditionally render the new `ContextualSaveBar`.
    *   `src/hooks/useScheduleManagement.ts` - Will be updated to add a `renameSchedule` function and ensure schedule lists are sorted correctly.
    *   `src/contexts/UIContext.tsx` - Will be modified to include state for managing which schedule is currently being edited (`editingScheduleId`).

### **OTHER CONSIDERATIONS:**

This section details the specific requirements and decisions to guide the AI implementation and prevent common gotchas.

**1. User Experience & State Management**

*   **"New, Unsaved" State Definition:** A schedule is considered "new and unsaved" when `isCalendarGenerated` is `true` and `currentScheduleId` is `null`. The application **will not** restore this ephemeral state on a page reload; it will start fresh.
*   **Contextual Save Bar Logic:**
    *   The "Save" button saves both the calendar data and the current name in the input field in a single action.
    *   If a user modifies calendar inputs *after* the "Saved ✔" confirmation appears (but before the bar fades), the bar must immediately revert to show an **"Update"** button, and the fade-out timer must be canceled.
    *   The `generateCalendar` function must reset the save state by setting `isSaved` to `false` and `currentScheduleId` to `null`.
*   **Concurrent Editing:** If a user is editing the name of "Schedule A" and clicks the Edit icon on "Schedule B", the changes to "Schedule A" are to be **cancelled and discarded**. "Schedule B" will then immediately enter edit mode.
*   **Loading a Schedule:** Clicking the **Load (Arrow Right)** icon will close the "Saved Schedules" modal and immediately display the selected calendar in the main view.

**2. Technical & Data Architecture**

*   **Data Persistence:** All schedule data will be persisted using the **`localStorage` API**.
*   **Schedule Data Structure:** The data saved for a schedule must be the **fully-generated `MonthData[]` object array**. The metadata (start date, rotation) is saved alongside for display, but the `MonthData[]` is the source of truth for rendering a loaded calendar.
*   **Error Handling:** Errors returned from `renameSchedule` (e.g., 'Schedule not found') must be displayed to the user via a **toast notification** using the existing `ErrorToast` component.

**3. Visual Design & Assets**

*   **Component Choice:** The "Saved Schedules" UI will be a **modal dialog**, not a drawer.
*   **Default Name Format:** The default name format must be `"14/21 Rotation (Mar 4, 2025)"` using the `Mmm d, yyyy` date standard. Localization is not required at this stage. UI should handle long names gracefully with an ellipsis.
*   **Animation Specifics:**
    *   **Contextual Save Bar:** Appearance: `300ms ease-out` slide-down and fade-in. Disappearance: `500ms ease-in` fade-out.
    *   **List Item Deletion:** `300ms ease-in-out` animation, transitioning `opacity` to `0` and `max-height` to `0` for a "collapse and fade" effect.
*   **Styling & Validation:**
    *   **Validation:** An attempt to save an empty or whitespace-only name must be prevented. The input field should receive a subtle red border using the `border-destructive` class/token. The "Save"/"Confirm" button should be disabled.
    *   **Deletion:** The "Delete" button in the confirmation dialog must use the `variant="destructive"` from the `Button` component library for proper styling.