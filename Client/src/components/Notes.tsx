import { useState, type FormEvent } from 'react'

type NoteProps = {
  id: number
  title: string
  content: string
  onDelete: (id: number) => Promise<void>
  onUpdate: (id: number, note: { title: string; content: string }) => Promise<boolean>
}

function Note({ id, title, content, onDelete, onUpdate }: NoteProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState({ title, content })

  function startEditing() {
    setDraft({ title, content })
    setIsEditing(true)
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (await onUpdate(id, draft)) {
      setIsEditing(false)
    }
  }

  return (
    <div className="note">
      {isEditing ? (
        <form className="note-edit-form" onSubmit={saveEdit}>
          <input
            aria-label="Note title"
            className="note-edit-input"
            value={draft.title}
            onChange={(event) => setDraft((previous) => ({ ...previous, title: event.target.value }))}
          />
          <textarea
            aria-label="Note content"
            className="note-edit-content"
            value={draft.content}
            onChange={(event) => setDraft((previous) => ({ ...previous, content: event.target.value }))}
          />
          <div className="note-actions">
            <button className="note-action-text note-save" type="submit">Save</button>
            <button className="note-action-text" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <h1>{title}</h1>
          <p>{content}</p>
          <div className="note-actions">
            <button type="button" aria-label="Edit note" onClick={startEditing}>✏️</button>
            <button type="button" aria-label="Delete note" onClick={() => void onDelete(id)}>🗑️</button>
          </div>
        </>
      )}
    </div>
  )
}

export default Note;