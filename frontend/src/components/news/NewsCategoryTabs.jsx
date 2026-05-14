function NewsCategoryTabs({ categories = [], activeCategory = '', onChange }) {
  const options = [{ slug: '', name: 'Tất cả' }, ...categories];

  return (
    <div className="flex flex-wrap gap-3">
      {options.map((category) => {
        const isActive = activeCategory === category.slug;
        return (
          <button
            key={category.slug || 'all'}
            type="button"
            className={isActive ? 'btn-primary' : 'btn-secondary'}
            onClick={() => onChange?.(category.slug)}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}

export default NewsCategoryTabs;