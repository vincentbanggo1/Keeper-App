import { useState, type ChangeEvent, type FormEvent } from "react";

type Note = {
  title: string;
  content: string;
};

type CreateAreaProps = {
  onAdd: (note: Note) => Promise<boolean>;
};

function CreateArea({ onAdd }: CreateAreaProps) {
  const [note, setNote] = useState<Note>({ title: "", content: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setNote((previousNote) => {
      return {
        ...previousNote,
        [name]: value,
      };
    });
  }

  async function submitNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (await onAdd(note)) {
        setNote({ title: "", content: "" });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <form onSubmit={submitNote}>
        <input name="title" type="text" value={note.title} onChange={handleChange} placeholder="Title" required/>
        <textarea name="content" value={note.content} onChange={handleChange} placeholder="Content" />
        <button type="submit" disabled={isSubmitting}>➕</button>
      </form>
    </div>
  );
}

export default CreateArea;