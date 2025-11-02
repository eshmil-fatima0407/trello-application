const STORAGE_KEY = "trello_data";

const sampleData = [
  { id: "list-1", title: "To Do", cards: [ {id:"c1", text:"Design UI"}, {id:"c2", text:"Setup Project"} ] },
  { id: "list-2", title: "In Progress", cards: [ {id:"c3", text:"Develop Board"} ] },
  { id: "list-3", title: "Done", cards: [ {id:"c4", text:"Plan Structure"} ] },
];

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || sampleData;
const board = document.getElementById("board");

// Save data
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Render board
function render() {
  board.innerHTML = "";
  data.forEach(list => {
    const listEl = document.createElement("div");
    listEl.className = "list";
    listEl.id = list.id;

    // List header
    const title = document.createElement("h2");
    title.innerHTML = `<span>${list.title}</span> <button onclick="deleteList('${list.id}')">✕</button>`;
    listEl.appendChild(title);

    // Cards
    list.cards.forEach(card => {
      const cardEl = document.createElement("div");
      cardEl.className = "card";
      cardEl.textContent = card.text;
      cardEl.draggable = true;

      // Drag start
      cardEl.ondragstart = e => {
        e.dataTransfer.setData("text/plain", JSON.stringify({listId:list.id, cardId:card.id}));
      };
      listEl.appendChild(cardEl);
    });

    // Add card button
    const addCardBtn = document.createElement("div");
    addCardBtn.className = "add-card";
    addCardBtn.textContent = "+ Add Card";
    addCardBtn.onclick = () => {
      const text = prompt("Enter card text:");
      if (text) {
        list.cards.push({id: "c"+Date.now(), text});
        save();
        render();
      }
    };
    listEl.appendChild(addCardBtn);

    // Dragover & Drop
    listEl.ondragover = e => e.preventDefault();
    listEl.ondrop = e => {
      e.preventDefault();
      const { listId, cardId } = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (listId === list.id) return;
      const fromList = data.find(l => l.id === listId);
      const card = fromList.cards.find(c => c.id === cardId);
      fromList.cards = fromList.cards.filter(c => c.id !== cardId);
      list.cards.push(card);
      save();
      render();
    };

    board.appendChild(listEl);
  });

  // Add list button
  const addListBtn = document.createElement("div");
  addListBtn.className = "add-list";
  addListBtn.textContent = "+ Add List";
  addListBtn.onclick = () => {
    const title = prompt("Enter list title:");
    if (title) {
      data.push({id: "l"+Date.now(), title, cards: []});
      save();
      render();
    }
  };
  board.appendChild(addListBtn);
}

// Delete list
function deleteList(id) {
  data = data.filter(l => l.id !== id);
  save();
  render();
}

// Reset board
document.getElementById("resetBtn").onclick = () => {
  if (confirm("Reset the board to default?")) {
    data = JSON.parse(JSON.stringify(sampleData));
    save();
    render();
  }
};

// Initial render
render();
