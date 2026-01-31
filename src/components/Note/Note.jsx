import PropTypes from "prop-types";
import { useState, useEffect, useRef, useCallback, memo } from "react";
import "./Note.css";

const Note = memo(function Note({ id, content, dateCreated, lastModified, onDelete, onModify }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(content);
  const textareaRef = useRef(null);

  // Sync content prop
  useEffect(() => {
    if (!editing) setText(content);
  }, [content, editing]);

  // Focus & resize on edit
  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [editing]);

  // Auto-resize while typing
  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [text, editing]);

  const save = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed && trimmed !== content) {
      onModify(id, trimmed);
    } else {
      setText(content);
    }
    setEditing(false);
  }, [id, text, content, onModify]);

  const cancel = useCallback(() => {
    setText(content);
    setEditing(false);
  }, [content]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") cancel();
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) save();
  }, [cancel, save]);

  return (
    <div className="note-card">
      {editing ? (
        <textarea
          ref={textareaRef}
          className="note-content"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <div className="note-content">{content}</div>
      )}

      <div className="note-meta">
        <span>Created: {dateCreated}</span>
        <span>Modified: {lastModified}</span>
      </div>

      <div className="note-actions">
        {editing ? (
          <>
            <button onClick={save}>Save</button>
            <button onClick={cancel}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
        <button className="delete-button" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
    </div>
  );
});

Note.propTypes = {
  id: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  dateCreated: PropTypes.string.isRequired,
  lastModified: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onModify: PropTypes.func.isRequired,
};

export default Note;
