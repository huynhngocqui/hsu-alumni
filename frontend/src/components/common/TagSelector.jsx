/**
 * TagSelector — inline tag chip picker.
 * Props:
 *   allTags      — string[] — full list of available tags
 *   selected     — string[] — currently selected tag names
 *   onChange     — (string[]) => void
 *   maxSelect    — optional max number selectable
 */
function TagSelector({ allTags = [], selected = [], onChange, maxSelect }) {
  function toggle(tag) {
    if (selected.includes(tag)) {
      onChange(selected.filter((t) => t !== tag));
    } else {
      if (maxSelect && selected.length >= maxSelect) return;
      onChange([...selected, tag]);
    }
  }

  if (!allTags.length) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Chọn lĩnh vực quan tâm">
      {allTags.map((tag) => {
        const active = selected.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            aria-pressed={active}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active
                ? 'bg-brand text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}

export default TagSelector;
