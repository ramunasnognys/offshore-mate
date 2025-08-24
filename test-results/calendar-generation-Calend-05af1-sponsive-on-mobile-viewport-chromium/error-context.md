# Page snapshot

```yaml
- main:
  - heading "Offshore Mate" [level=1]
  - paragraph: Navigate your offshore schedule with precision
  - button "Start date selection":
    - img
    - heading "Start Date" [level=2]
    - paragraph: When does your rotation begin?
    - button "Date picker input":
      - button "Pick a start date"
  - button "Work rotation pattern selection":
    - img
    - heading "Work Rotation Pattern" [level=2]
    - paragraph: Select your offshore work schedule
    - option "14/14 rotation pattern" [selected]: 14/14 Selected
    - option "14/21 rotation pattern": 14/21 Selected
    - option "28/28 rotation pattern": 28/28
    - option "Custom rotation pattern": Custom
  - button "Saved schedules management":
    - img
    - heading "Saved Schedules" [level=2]
    - paragraph: Manage your saved rotation patterns
    - text: 0 saved
    - img
  - button "Generate Schedule"
  - text: Generate your offshore work schedule based on selected start date and rotation pattern
  - paragraph: Version v.2
- status:
  - img
  - text: Static route
  - button "Hide static indicator":
    - img
- alert
```