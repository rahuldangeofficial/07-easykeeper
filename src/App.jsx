import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./App.css";
import Note from "./components/Note/Note";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) loadNotes(u.uid);
      else {
        setNotes([]);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  const loadNotes = useCallback(async (uid) => {
    setLoading(true);
    try {
      const q = query(collection(db, "notes"), where("userId", "==", uid));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
      setNotes(list);
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return notes;
    const s = search.toLowerCase();
    return notes.filter((n) => n.content?.toLowerCase().includes(s));
  }, [notes, search]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [noteText]);

  const handleCreate = useCallback(async (e) => {
    e.preventDefault();
    const text = noteText.trim();
    if (!text || !user) return;

    setCreating(true);
    const now = new Date().toLocaleString();
    const newNote = { content: text, dateCreated: now, lastModified: now, userId: user.uid };

    try {
      const docRef = await addDoc(collection(db, "notes"), newNote);
      setNotes((prev) => [{ id: docRef.id, ...newNote }, ...prev]);
      setNoteText("");
    } catch (err) {
      console.error("Create error:", err);
    } finally {
      setCreating(false);
    }
  }, [noteText, user]);

  const handleDelete = useCallback(async (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (err) {
      console.error("Delete error:", err);
      if (user) loadNotes(user.uid);
    }
  }, [user, loadNotes]);

  const handleModify = useCallback(async (id, content) => {
    const text = content.trim();
    if (!text) return;
    const now = new Date().toLocaleString();

    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content: text, lastModified: now } : n))
    );

    try {
      await updateDoc(doc(db, "notes", id), { content: text, lastModified: now });
    } catch (err) {
      console.error("Update error:", err);
      if (user) loadNotes(user.uid);
    }
  }, [user, loadNotes]);

  const signIn = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") console.error(err);
    }
  }, []);

  const signOut = useCallback(async () => {
    await auth.signOut();
    setNotes([]);
  }, []);

  if (authLoading) {
    return null;
  }

  return (
    <>
      <div className={`header-row ${!user ? 'header-row-centered' : ''}`}>
        <div className="brand-section">
          <h1 className="header">EasyKeeper</h1>
          <span className="author">by @rahuldangeofficial</span>
        </div>
        {user ? (
          <button onClick={signOut}>Sign Out</button>
        ) : (
          <button onClick={signIn}>Sign In with Google</button>
        )}
      </div>

      {user && (
        <>
          <div className="container">
            <input
              type="text"
              className="search-input"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="container">
            <form className="create-card" onSubmit={handleCreate}>
              <textarea
                ref={textareaRef}
                className="create-content textarea-autogrow"
                placeholder="Take a note..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                disabled={creating}
              />
              <div className="create-actions">
                <button type="submit" disabled={!noteText.trim() || creating}>
                  {creating ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>

          <div className="container">
            <div className="notes-list">
              {loading ? null : filtered.length === 0 ? (
                search && <p className="empty-state">No notes found</p>
              ) : (
                filtered.map((note) => (
                  <Note
                    key={note.id}
                    id={note.id}
                    content={note.content}
                    dateCreated={note.dateCreated}
                    lastModified={note.lastModified}
                    onDelete={handleDelete}
                    onModify={handleModify}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}

    </>
  );
}

export default App;
