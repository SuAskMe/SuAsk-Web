# CLAUDE.md

## Frontend UI Conventions

- Status-bearing cards must show explicit text badges for important states, not only subtle color strips, tab context, hover states, or action labels.
- For question cards and similar list cards, make states such as `已回答`、`未回答`、`已置顶`、`已删除` distinguishable at a glance with readable badges plus consistent color, border, or background accents.
- Avoid conflicting state signals. Deleted items should prioritize `已删除`; do not visually emphasize `已置顶` on deleted cards unless the UI explicitly requires both states.
