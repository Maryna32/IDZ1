document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    loadSelect(
      "/api/projects",
      ["#nameProject", "#projectName"],
      "name_project"
    ),
    loadSelect("/api/dates", "#date_project", "date_project"),
    loadSelect("/api/chiefs", "#chief", "chief"),
  ]);

  addFormHandler("informationForm", handleInformationForm);
  addFormHandler("timeForm", handleTimeForm);
  addFormHandler("countForm", handleCountForm);
});

async function loadSelect(apiUrl, selector, valueKey) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    const selects = Array.isArray(selector)
      ? selector.map((sel) => document.querySelector(sel))
      : [document.querySelector(selector)];

    selects.forEach((select) => {
      select.innerHTML = "";
      data.forEach((item) => {
        const value = item[valueKey];
        const option = new Option(value, value);
        select.appendChild(option);
      });
    });
  } catch (error) {
    console.error(`Error loading from ${apiUrl}:`, error);
  }
}

function addFormHandler(formId, handler) {
  const form = document.getElementById(formId);
  if (form) form.addEventListener("submit", handler);
}

async function handleInformationForm(e) {
  e.preventDefault();
  const nameProject = document.getElementById("nameProject").value;
  const date = document.getElementById("date_project").value;

  await display(
    `/api/information-for-date?nameProject=${nameProject}&date_project=${date}`,
    "results-information",
    ["FID_Worker", "date_project", "time_start", "time_end", "description"],
    ["ID worker", "Date project", "Date start", "Date end", "Description"],
    (row, key) =>
      ["date_project", "time_start", "time_end"].includes(key)
        ? formatDate(row[key])
        : row[key]
  );
}

async function handleTimeForm(e) {
  e.preventDefault();
  const nameProject = document.getElementById("projectName").value;

  await display(
    `/api/time-for-project?nameProject=${nameProject}`,
    "results-time",
    ["name_project", "total_days", "manager"],
    ["Name project", "Total count days", "Manager"]
  );
}

async function handleCountForm(e) {
  e.preventDefault();
  const chief = document.getElementById("chief").value;

  await display(
    `/api/count-workers?chief=${chief}`,
    "results-count",
    ["chief", "worker_count"],
    ["Chief", "Employee count"]
  );
}

async function display(
  url,
  containerId,
  keys,
  headers,
  formatter = (row, key) => row[key]
) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.length) {
      container.innerHTML = "<h2>Немає даних за обраними параметрами.</h2>";
      return;
    }

    let html = `<h2>Результати</h2><table><thead><tr>`;
    headers.forEach((h) => (html += `<th>${h}</th>`));
    html += `</tr></thead><tbody>`;

    data.forEach((row) => {
      html += "<tr>";
      keys.forEach((key) => {
        html += `<td>${formatter(row, key)}</td>`;
      });
      html += "</tr>";
    });

    html += "</tbody></table>";
    container.innerHTML = html;
  } catch (error) {
    console.error("Fetch error:", error);
    container.innerHTML = "<h2>Помилка при отриманні даних</h2>";
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().split("T")[0];
}
