const STORAGE_KEY = "trello_data";

const sampleData = [
  { id: "list-1", title: "To Do", cards: [ {id: "c1", text: "Design UI"}, {id:"c2", text:"Setup project"} ] },
  { id: "list-2", title: "In Progress", cards: [ {id: "c3", text: "Build board"} ] },
  { id: "list-3", title: "Done", cards: [] },
];

let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || sampleData;
const board = document.getElementById("board");

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function render() {
  board.innerHTML = "";
  data.forEach(list => {
    const listEl = document.createElement("div");
    listEl.className = "list";

    const title = document.createElement("h2");
    title.innerHTML = `<span>${list.title}</span> <button onclick="deleteList('${list.id}')">✕</button>`;
    listEl.appendChild(title);

    list.cards.forEach(card => {
      const cardEl = document.createElement("div");
      cardEl.className = "card";
      cardEl.textContent = card.text;
      cardEl.draggable = true;
      cardEl.ondragstart = e => {
        e.dataTransfer.setData("text/plain", JSON.stringify({listId:list.id, cardId:card.id}));
      };
      listEl.appendChild(cardEl);
    });

    const addCardBtn = document.createElement("div");
    addCardBtn.className = "add-card";
    addCardBtn.textContent = "+ Add Card";
    addCardBtn.onclick = () => {
      const text = prompt("Card text:");
      if(text){
        list.cards.push({id: "c"+Date.now(), text});
        save();
        render();
      }
    };
    listEl.appendChild(addCardBtn);

    listEl.ondragover = e => e.preventDefault();
    listEl.ondrop = e => {
      e.preventDefault();
      const {listId, cardId} = JSON.parse(e.dataTransfer.getData("text/plain"));
      if(listId===list.id) return;
      const fromList = data.find(l=>l.id===listId);
      const card = fromList.cards.find(c=>c.id===cardId);
      fromList.cards = fromList.cards.filter(c=>c.id!==cardId);
      list.cards.push(card);
      save();
      render();
    };

    board.appendChild(listEl);
  });

  const addListBtn = document.createElement("div");
  addListBtn.className = "add-list";
  addListBtn.textContent = "+ Add List";
  addListBtn.onclick = () => {
    const title = prompt("List title:");
    if(title){
      data.push({id: "l"+Date.now(), title, cards: []});
      save();
      render();
    }
  };
  board.appendChild(addListBtn);
}

function deleteList(id){
  data = data.filter(l=>l.id!==id);
  save();
  render();
}

document.getElementById("resetBtn").onclick = () => {
  data = sampleData; // ✅ reset to initial data
  save();
  render();
};

render();
