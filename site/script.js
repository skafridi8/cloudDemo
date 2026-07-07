const SUPABASE_URL = "https://epohdjzfrmijgiwhvfqg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwb2hkanpmcm1pamdpd2h2ZnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMzU0NTEsImV4cCI6MjA5ODkxMTQ1MX0.2BuwHrdXsOiq3cLgASmAWe-AxaeLaSElaIqrEDBbshA";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("note-form");
const contentInput = document.getElementById("content");
const statusEl = document.getElementById("status");
const notesList = document.getElementById("notes-list");

async function loadNotes() {
  const { data, error } = await supabase
    .from("test_notes")
    .select("id, content, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
    return;
  }

  notesList.innerHTML = "";
  for (const note of data) {
    const li = document.createElement("li");
    li.textContent = note.content;
    notesList.appendChild(li);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = contentInput.value.trim();
  if (!content) return;

  const submitBtn = form.querySelector("button");
  submitBtn.disabled = true;
  statusEl.textContent = "Saving...";

  const { error } = await supabase.from("test_notes").insert({ content });

  submitBtn.disabled = false;

  if (error) {
    statusEl.textContent = `Error: ${error.message}`;
    console.error(error);
    return;
  }

  statusEl.textContent = "Saved!";
  contentInput.value = "";
  loadNotes();
});

loadNotes();
