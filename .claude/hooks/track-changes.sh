#!/bin/bash

# Hook script to track file changes and suggest documentation updates
# This script is called after Write, Edit, or MultiEdit operations

# Get the input from stdin (contains tool information)
INPUT=$(cat)

# Extract tool name and file path from the input
TOOL_NAME=$(echo "$INPUT" | grep -o '"tool_name":"[^"]*"' | cut -d'"' -f4)
FILE_PATH=$(echo "$INPUT" | grep -o '"file_path":"[^"]*"' | cut -d'"' -f4)

# Define documentation-worthy file patterns
DOC_WORTHY_PATTERNS=(
    "\.tsx?$"           # TypeScript/React files
    "package\.json$"    # Dependencies
    "\.config\."        # Configuration files  
    "^src/hooks/"       # Custom hooks
    "^src/components/"  # Components
    "^src/contexts/"    # Context providers
    "^src/lib/"         # Utilities
    "^src/app/"         # App routes
)

# Check if the changed file is documentation-worthy
IS_DOC_WORTHY=false
for pattern in "${DOC_WORTHY_PATTERNS[@]}"; do
    if echo "$FILE_PATH" | grep -qE "$pattern"; then
        IS_DOC_WORTHY=true
        break
    fi
done

# Track changes in a temporary file
CHANGE_LOG="/tmp/claude-doc-changes.log"

# If it's a documentation-worthy change, log it
if [ "$IS_DOC_WORTHY" = true ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') | $TOOL_NAME | $FILE_PATH" >> "$CHANGE_LOG"
    
    # Count recent changes
    CHANGE_COUNT=$(tail -20 "$CHANGE_LOG" 2>/dev/null | wc -l)
    
    # If we have accumulated significant changes, suggest documentation update
    if [ "$CHANGE_COUNT" -ge 5 ]; then
        cat <<EOF
{
    "response": "success",
    "message": "📝 You've made $CHANGE_COUNT significant code changes. Consider running '/update-docs' to update your documentation files (README.md, CLAUDE.md, etc.) to reflect these changes.",
    "suggestion": "/update-docs ALL"
}
EOF
        # Reset the log after suggesting
        > "$CHANGE_LOG"
    else
        echo '{"response": "success"}'
    fi
else
    echo '{"response": "success"}'
fi