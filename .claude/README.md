# Claude Code Documentation Automation

This directory contains custom slash commands and hooks for automatically updating project documentation when code changes occur.

## 🚀 Quick Start

To update documentation after making code changes:
```
/update-docs
```

For more advanced analysis:
```
/update-docs-enhanced component
```

## 📁 Structure

```
.claude/
├── commands/           # Slash commands
│   ├── update-docs.md           # Basic documentation updater
│   └── update-docs-enhanced.md  # Advanced updater with deep analysis
├── hooks/             # Event hooks
│   └── track-changes.sh         # Tracks file changes and suggests updates
├── settings.json      # Configuration for hooks and commands
└── README.md         # This file
```

## 🔧 How It Works

### 1. **Change Tracking**
The `track-changes.sh` hook monitors file modifications (Write, Edit, MultiEdit operations) and tracks documentation-worthy changes:
- TypeScript/React files (`.tsx`, `.ts`)
- Package.json changes
- Configuration files
- Components, hooks, and utilities

After 5 significant changes, it suggests running `/update-docs`.

### 2. **Documentation Update Commands**

#### Basic Update (`/update-docs`)
- Analyzes recent git changes
- Extracts information from modified files
- Updates marked sections in documentation files
- Provides a summary of changes

Arguments:
- `README` - Update only README.md
- `CLAUDE` - Update only CLAUDE.md
- `ALL` or none - Update all documentation

#### Enhanced Update (`/update-docs-enhanced`)
- Performs deep code analysis
- Uses specialized agents for different file types
- Generates more comprehensive documentation
- Includes usage examples and API references

Arguments:
- `component` - Focus on React components
- `hook` - Focus on custom hooks
- `feature` - Focus on new features
- `dependency` - Focus on dependency changes
- `all` - Comprehensive analysis

### 3. **Documentation Markers**

The system respects these markers in your documentation files:

```markdown
<!-- AUTO-UPDATE:START -->
This content will be automatically updated
<!-- AUTO-UPDATE:END -->

<!-- AUTO-UPDATE:SKIP -->
This content will never be touched
<!-- AUTO-UPDATE:SKIP:END -->
```

## 🛡️ Safety Features

1. **Preserve Manual Content**: Only updates content within AUTO-UPDATE markers
2. **Change Threshold**: Waits for 5 changes before suggesting updates
3. **Preview Mode**: Shows diffs before applying changes
4. **Backup Creation**: Creates backups before major updates
5. **Validation**: Ensures markdown syntax is valid

## ⚙️ Configuration

Edit `.claude/settings.json` to customize:
- Change threshold for suggestions
- Documentation files to update
- Hook behavior
- Command aliases

## 📝 Best Practices

1. **Add Markers Early**: Add AUTO-UPDATE markers to sections you want automated
2. **Review Updates**: Always review suggested changes before accepting
3. **Manual Sections**: Keep important manual content outside of markers
4. **Regular Updates**: Run updates after completing features or fixes
5. **Commit Docs**: Commit documentation updates separately for clarity

## 🎯 Supported File Types

The system intelligently analyzes:
- **React Components** (`.tsx`): Props, usage, composition
- **TypeScript Files** (`.ts`): Types, interfaces, utilities
- **Hooks** (`use*.ts`): Parameters, returns, usage
- **Contexts**: Providers, consumers, state shape
- **Config Files**: Environment variables, build settings
- **Package.json**: Dependencies, scripts, metadata

## 🚨 Troubleshooting

If documentation updates aren't working:

1. Check hook permissions:
   ```bash
   ls -la .claude/hooks/track-changes.sh
   ```

2. Verify settings.json is valid JSON:
   ```bash
   cat .claude/settings.json | jq .
   ```

3. Check git status for uncommitted changes
4. Ensure AUTO-UPDATE markers are properly placed

## 💡 Tips

- Use `/update-docs-enhanced` for major feature additions
- Run `/update-docs README` for quick README updates
- Add custom markers for project-specific sections
- Combine with git hooks for pre-commit documentation checks

---

Created with the Offshore Mate project to maintain up-to-date documentation automatically.