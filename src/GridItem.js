export function GridItem({ item, showCheckbox, checked, onToggle }) {
  return (
    <div
      className={`grid-item ${checked ? "selected" : ""}`}
      onClick={() => onToggle(item)}
    >
      <div className="series">{item.series}</div>
      <div className="character">{item.character}</div>

      <img
        src={`https://images.weserv.nl/?url=${item.image.replace(
          /^https?:\/\//,
          ""
        )}`}
        alt={item.character}
        loading="lazy"
      />

      {showCheckbox && (
        <div className="checkbox">
          <input
            type="checkbox"
            checked={checked}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
