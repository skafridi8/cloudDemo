const SUPABASE_URL = "https://epohdjzfrmijgiwhvfqg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwb2hkanpmcm1pamdpd2h2ZnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMzMzU0NTEsImV4cCI6MjA5ODkxMTQ1MX0.2BuwHrdXsOiq3cLgASmAWe-AxaeLaSElaIqrEDBbshA";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("visit-form");
const statusEl = document.getElementById("status");
const visitsList = document.getElementById("visits-list");

function formatVisitLine(visit) {
  const tasks = ["bathing", "medication", "meals", "mobility"]
    .filter((task) => visit[task])
    .join(", ");
  const when = new Date(visit.visit_time).toLocaleString();
  const taskText = tasks ? ` — ${tasks}` : "";
  const notesText = visit.notes ? ` (${visit.notes})` : "";
  return `${visit.patient_name} — ${when} — carer: ${visit.carer_name}${taskText}${notesText}`;
}

async function loadVisits() {
  const { data, error } = await supabaseClient
    .from("patient_visits")
    .select("id, patient_name, carer_name, visit_time, bathing, medication, meals, mobility, notes")
    .order("visit_time", { ascending: false })
    .limit(20);

  if (error) {
    console.error(error);
    return;
  }

  visitsList.innerHTML = "";
  for (const visit of data) {
    const li = document.createElement("li");
    li.textContent = formatVisitLine(visit);
    visitsList.appendChild(li);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const record = {
    patient_name: document.getElementById("patient_name").value.trim(),
    carer_name: document.getElementById("carer_name").value.trim(),
    visit_time: new Date(document.getElementById("visit_time").value).toISOString(),
    bathing: document.getElementById("bathing").checked,
    medication: document.getElementById("medication").checked,
    meals: document.getElementById("meals").checked,
    mobility: document.getElementById("mobility").checked,
    notes: document.getElementById("notes").value.trim() || null,
  };

  if (!record.patient_name || !record.carer_name) return;

  const submitBtn = form.querySelector("button");
  submitBtn.disabled = true;
  statusEl.textContent = "Saving...";

  const { error } = await supabaseClient.from("patient_visits").insert(record);

  submitBtn.disabled = false;

  if (error) {
    statusEl.textContent = `Error: ${error.message}`;
    console.error(error);
    return;
  }

  statusEl.textContent = "Saved!";
  form.reset();
  loadVisits();
});

loadVisits();
