const form = document.querySelector('#validation-form');
const result = document.querySelector('#result');

function show(kind, lines) {
  result.hidden = false;
  result.className = kind;
  result.replaceChildren(...lines.map(line => {
    const item = document.createElement('p');
    item.textContent = line;
    return item;
  }));
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const payload = Object.fromEntries(new FormData(form));
  for (const [key, value] of Object.entries(payload)) {
    if (key !== 'damName' && key !== 'scenarioName') payload[key] = Number(value);
  }
  try {
    const response = await fetch('/api/validate/construction', {
      method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok || !data.is_valid) return show('error', data.errors || ['The validation service rejected this request.']);
    show(data.warnings?.length ? 'warning' : 'success', ['Inputs are valid and ready for a simulation.', ...(data.warnings || [])]);
  } catch {
    show('error', ['Could not reach the local validation service.']);
  }
});
