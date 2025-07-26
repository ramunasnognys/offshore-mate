### **Feature Specification: Add to Calendar**

**Version:** 1.1 (Final)
**Date:** July 20, 2025
**Author:** AI Assistant
**Status:** FINAL


#### **1. Overview & Goal**

This document specifies the requirements for a new "Add to Calendar" feature. The goal is to allow users to export their generated work schedule as a standard iCalendar (`.ics`) file and easily import it into their device's native calendar application (e.g., Apple Calendar, Google Calendar, Outlook). This feature will be implemented as a client-side, one-time import, acknowledging the application's serverless architecture.

#### **2. User Stories**

*   **As a user,** I want to add my generated work schedule to my phone's calendar with a single action so that I can see my work shifts alongside my personal appointments.
*   **As a user,** I want the calendar events to clearly distinguish between work periods, off-duty periods, and travel days.
*   **As a user on any device (iOS, Android, Desktop),** I want to be able to use this feature to add the schedule to my preferred calendar application.

#### **3. Technical Implementation**

**3.1. iCalendar (`.ics`) File Generation**

*   A new utility module will be created at `src/lib/utils/ical-export.ts`. This module will be responsible for converting the application's `MonthData[]` state into a valid iCalendar (RFC 5545) formatted string.
*   The project will add the **`ical-generator`** npm package as a dependency to ensure robust and compliant `.ics` file creation.
*   The generation logic will iterate through the **entire 12-month period** stored in the application state and create distinct, multi-day, all-day events for each contiguous "Work" period and "Off" period.
*   The implementation will strictly adhere to the RFC 5545 standard, ensuring the `DTEND` property for an all-day event is set to the calendar date *following* the last day of the event (e.g., an event ending Oct 14th will have `DTEND;VALUE=DATE:20231015`).

**3.2. Event Data Structure**

Each calendar event generated in the `.ics` file will contain the following information:

*   **Summary (Title):** The event title will be dynamically generated based on the user's `scheduleName`.
    *   *Example:* "Offshore Rig (Work)" or "Offshore Rig (Off Duty)".
*   **Start/End Dates:** Events will be configured as "all-day" events, spanning the full duration of a work or off-duty block.
*   **Description:** The description will be explicit and contained within the relevant period.
    *   **Travel to Work:** The first day of a "Work" event will include travel details. *Example:* "Work Period (Day 1 of 14). Travel to location."
    *   **Travel Home:** The last day of a "Work" event will include travel details. *Example:* "Work Period (Day 14 of 14). Travel home."
    *   "Off" period events will not contain redundant travel information.
*   **Timezone:** Events will use **floating time**. All date-time properties will be of the `VALUE=DATE` type (e.g., `DTSTART;VALUE=DATE:20231001`) and will not include a `TZID`, ensuring they display correctly relative to the device's local time zone.
*   **Location:** This field will be left empty.
*   **Alarms/Alerts:** No alarms will be set by default for V1.

**3.3. Invocation Mechanism**

*   The mechanism will be a single, robust method to ensure universal compatibility.
*   An anchor tag (`<a>`) will be dynamically created with its `href` attribute set to a Base64-encoded `data:` URI of the `.ics` content.
*   The anchor tag will also include a `download` attribute with a dynamically generated filename.
    *   **Primary Action (Mobile):** On iOS and Android, this link will trigger the native import prompt.
    *   **Fallback Action (Desktop/Other):** Browsers that do not trigger an import will respect the `download` attribute and save the file.
*   **Filename Convention:** `schedule-[scheduleName]-[startDate].ics` (e.g., `schedule-offshore-rig-2023-10-01.ics`). The `scheduleName` will be sanitized to be filename-safe.

#### **4. User Interface (UI) & User Experience (UX)**

**4.1. Entry Point**

*   **`BottomToolbar` (Mobile):** "Add to Calendar" will be a **new, standalone button** within the expanded export panel, appearing below the PNG/PDF radio group.
*   **`FloatingActionMenu` (Desktop):** "Add to Calendar" will be a **new button in the list**, styled identically to the existing export options.
*   **Icon:** The **`CalendarPlus`** icon from `lucide-react` will be used in both UIs.
*   **Label:** The label will be "Add to Calendar".

**4.2. User Flow & Feedback**

1.  User generates a schedule.
2.  User clicks the "Export" button.
3.  User selects the "Add to Calendar" option.
4.  The "Add to Calendar" button immediately enters a **disabled state with a spinner icon**.
5.  Once the `.ics` data is ready, the `data:` URI link is programmatically clicked.
6.  Simultaneously, a non-blocking toast notification appears using the existing app notification system, with the message: **"Your schedule is ready. Check your device for a calendar import prompt."**
7.  The button reverts to its normal state.

**4.3. Cross-Platform Handling**

*   The feature will be available on all platforms. The combined `data:` URI and `download` attribute approach provides a functional experience across iOS, Android, and desktop browsers without device-specific logic.

#### **5. Edge Cases & Error Handling**

**5.1. Pre-condition for Feature Availability**

*   The "Add to Calendar" button in both the `BottomToolbar` and `FloatingActionMenu` will be **disabled by default**.
*   It will only become enabled after a schedule has been successfully generated.
*   When disabled, the button will have a tooltip with the message: **"Please generate a schedule first."**

**5.2. Error During `.ics` Generation**

*   If an unexpected error occurs during file generation, the button's loading state will be removed.
*   The application will trigger the existing `ErrorToast` component with the message: **"Failed to create calendar file. Please try again."**

#### **6. Scope & Limitations (V1)**

*   **One-Time Import:** This feature provides a one-time import of the schedule. It is not a calendar subscription. Users must manually delete old events from their calendar and re-import if they generate a new schedule.
*   **No Event Updates:** The application cannot update or delete events once they have been imported into the user's native calendar.
*   **No Configuration:** The V1 implementation will not include user-configurable options for the calendar export (e.g., setting alarms).