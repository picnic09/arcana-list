class TriStateCheckbox {
  constructor(id, labelText, storageKey, parentTd) {
    this.id = id;
    this.storageKey = storageKey;

    const wrapper = document.createElement("div");
    wrapper.className = "item";

    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.id = id;

    this.label = document.createElement("label");
    this.label.setAttribute("for", id);
    this.label.textContent = labelText;

    wrapper.appendChild(this.checkbox);
    wrapper.appendChild(this.label);
    parentTd.appendChild(wrapper);

    this.state = 0;
    this.load();
    this.applyState();

    this.checkbox.addEventListener("change", () => {
      this.nextState();
    });
  }

  applyState() {
    if (this.state === 0) {
      this.checkbox.checked = false;
      this.checkbox.indeterminate = false;
    } else if (this.state === 1) {
      this.checkbox.checked = true;
      this.checkbox.indeterminate = false;
    } else if (this.state === 2) {
      this.checkbox.checked = false;
      this.checkbox.indeterminate = true;
    }
  }

  nextState() {
    this.state = (this.state + 1) % 3;
    this.applyState();
    this.save();
  }

  save() {
    const saved = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
    saved[this.id] = this.state;
    localStorage.setItem(this.storageKey, JSON.stringify(saved));
  }

  load() {
    const saved = JSON.parse(localStorage.getItem(this.storageKey) || "{}");
    if (saved[this.id] !== undefined) {
      this.state = saved[this.id];
    }
  }
}

class TriStateManager {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.checkboxes = [];
  }

  addCheckbox(id, labelText, parentTd) {
    const tri = new TriStateCheckbox(id, labelText, this.storageKey, parentTd);
    this.checkboxes.push(tri);
  }
}

// === 実行部 ===
const labels = [
  "女教皇",
  "女帝",
  "皇帝",
  "法王",
  "恋愛",
  "戦車",
  "正義",
  "隠者",
  "運命",
  "剛毅",
  "刑死者",
  "死神",
  "節制",
  "悪魔",
  "塔",
  "星",
  "月",
  "太陽",
  "信念",
  "顧問官",
];

const tbody = document.querySelector("#todo-table tbody");
const manager = new TriStateManager("triStates");

let idx = 0;
for (let r = 0; r < 10; r++) {
  const tr = document.createElement("tr");
  for (let c = 0; c < 2; c++) {
    const td = document.createElement("td");
    if (labels[idx]) {
      manager.addCheckbox(`cb-${r}-${c}`, labels[idx], td);
    }
    tr.appendChild(td);
    idx++;
  }
  tbody.appendChild(tr);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then(() => console.log("Service Worker registered"));
}
