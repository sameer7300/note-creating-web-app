import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";



function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => setNotes(res.data))
            .catch((err) => alert("Error fetching notes: " + err.message));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) {
                    alert("Note deleted!");
                    getNotes(); // Refresh notes after deletion
                }
            })
            .catch((error) => alert("Error deleting note: " + error.message));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { title, content })
            .then((res) => {
                if (res.status === 201) {
                    alert("Note created!");
                    setTitle(""); 
                    setContent("");
                    getNotes(); 
                }
            })
            .catch((err) => alert("Error creating note: " + err.message));
    };

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login"); 
    };

    return (
        <div className="home-container">
            <div className="header">
                <h2>Notes</h2>
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>
            <div>
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <Note note={note} onDelete={deleteNote} key={note.id} />
                    ))
                ) : (
                    <p>No notes available.</p>
                )}
            </div>
            <h2>Create a Note</h2>
            <form onSubmit={createNote} className="note-form">
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="content">Content:</label>
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Home;
