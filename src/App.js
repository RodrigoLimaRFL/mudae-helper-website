import { useState } from "react";
import { parseSeriesInput } from "./parser";
import { GridItem } from "./GridItem";
import "./index.css";


const STORAGE_KEY = "series_parser_cache_v1";
const PAGE_SIZE = 50;

export default function App() {
  const [text, setText] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return "";
    try {
      return JSON.parse(cached).text || "";
    } catch {
      return "";
    }
  });

  const [items, setItems] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (!cached) return [];
    try {
      return JSON.parse(cached).items || [];
    } catch {
      return [];
    }
  });

  const [marked, setMarked] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  function toggleMarked(item) {
    setMarked(prev => {
      const exists = prev.find(
        i =>
          i.series === item.series &&
          i.character === item.character
      );

      if (exists) {
        return prev.filter(
          i =>
            !(
              i.series === item.series &&
              i.character === item.character
            )
        );
      }

      return [...prev, item];
    });
  }


  function handleSubmit() {
    const result = parseSeriesInput(text);

    if (result.error) {
      setError(result.error);
      setItems([]);
      return;
    }

    setError("");
    setItems(result.items);
    setPage(0);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        text,
        items: result.items
      })
    );
  }


  const pageItems = items.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  const totalPages = Math.ceil(items.length / PAGE_SIZE);

  return (
    <div className="container">
      <h1>Mudae Character Viewer</h1>

      <textarea
        placeholder="Cole o texto aqui"
        value={text}
        onChange={e => setText(e.target.value)}
      />

      {error && <div className="error">{error}</div>}

      <button onClick={handleSubmit}>Submeter</button>

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            ◀
          </button>
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            ▶
          </button>
        </div>
      )}

      <div className="grid">
        {pageItems.map((item, idx) => (
          <GridItem
            key={idx}
            item={item}
            showCheckbox={true}
            checked={marked.some(
              m =>
                m.series === item.series &&
                m.character === item.character
            )}
            onToggle={toggleMarked}
          />
        ))}
      </div>


      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}>
            ◀
          </button>
          <span>
            Página {page + 1} de {totalPages}
          </span>
          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            ▶
          </button>
        </div>
      )}

      <h1>Personagens Marcados:</h1>

      {marked.length > 0 && (
        <div className="marked-output">
          {marked.map(m => m.character).join(" $ ")}
        </div>
      )}

      <h1>Instruções:</h1>
      <ol>
        <li>Use o comando $mmai-s no Mudae.</li>
        <li>Copie a mensagem que recebeu na DM e cole aqui.</li>
        <li>Marque os personagens que deseja (Pode usar para divorciar, negociar, ...).</li>
      </ol>

    </div>
  );
}
