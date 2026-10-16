import { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import CreateArea from './CreateArea'
import Note from './Notes'
import { createNote, deleteNote, getErrorMessage, getNotes, updateNote } from '../api/client.Api'

function App() {
  const [notes, setNotes] = useState<Awaited<ReturnType<typeof getNotes>>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    getNotes()
      .then((loadedNotes) => {
        if (isMounted) setNotes(loadedNotes)
      })
      .catch((requestError: unknown) => {
        if (isMounted) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  async function addNote(note: { title: string; content: string }): Promise<boolean> {
    try {
      const createdNote = await createNote(note)
      setNotes((previousNotes) => [createdNote, ...previousNotes])
      setError('')
      return true
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      return false
    }
  }

  async function removeNote(id: number): Promise<void> {
    try {
      await deleteNote(id)
      setNotes((previousNotes) => previousNotes.filter((note) => note.id !== id))
      setError('')
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  async function saveNote(
    id: number,
    updates: { title: string; content: string },
  ): Promise<boolean> {
    try {
      const updatedNote = await updateNote(id, updates)
      setNotes((previousNotes) =>
        previousNotes.map((note) => (note.id === id ? updatedNote : note)),
      )
      setError('')
      return true
    } catch (requestError) {
      setError(getErrorMessage(requestError))
      return false
    }
  }

  return (
    <>
      <Header />
      <CreateArea onAdd={addNote} />
      {isLoading && <p>Loading notes...</p>}
      {error && <p role="alert">{error}</p>}
      {notes.map((noteItem) => {
        return (
          <Note
            key={noteItem.id}
            id={noteItem.id}
            title={noteItem.title}
            content={noteItem.content}
            onDelete={removeNote}
            onUpdate={saveNote}
          />
        )
      })}
      <Footer />
    </>
  )
}

export default App
