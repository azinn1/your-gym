const tbody = document.querySelector('tbody');
const sNome = document.querySelector('#nome_exercicio');
const sGrupoMuscular = document.querySelector('#grupo_muscular');
const sSeries = document.querySelector('#quantidade_series');
const sRepeticoes = document.querySelector('#quantidade_repeticoes');
const btnAdicionar = document.querySelector('#adicionar');

let itens;


async function addNewItem() {
  const item = {
    nome: sNome.value,
    grupoMuscular: sGrupoMuscular.value,
    series: sSeries.value,
    repeticoes: sRepeticoes.value
  };
  console.log(item);
  fetch('http://localhost:8080/exercicios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: item,
  })

  insertItem(item);
  itens.push(item);
  setItensBD();
}


function insertItem(item) {
  let tr = document.createElement('tr');

  tr.innerHTML = `
    <td><span>${item.nome}</span><input type="text" style="display:none;"></td>
    <td><span>${item.grupoMuscular}</span><input type="text" style="display:none;"></td>
    <td><span>${item.series}</span><input type="number" style="display:none;"></td>
    <td><span>${item.repeticoes}</span><input type="number" style="display:none;"></td>
    <td class="acao">
      <button onclick="editItem(this)"><i class='bx bx-edit'></i></button>
      <button onclick="confirmDeleteItem(this)"><i class='bx bx-trash'></i></button>
    </td>
  `;
  tbody.appendChild(tr);
}


function editItem(button) {
  const row = button.closest('tr');
  const inputs = row.querySelectorAll('input[type="text"], input[type="number"]');
  const spans = row.querySelectorAll('span');

  inputs.forEach((input, index) => {
    input.value = spans[index].textContent;
    input.style.display = 'inline-block';
    spans[index].style.display = 'none';
  });

  const editButton = row.querySelector('.bx-edit').parentNode;
  editButton.style.display = 'none';

  const saveButton = document.createElement('button');
  saveButton.innerHTML = '<i class="bx bx-save"></i>';
  saveButton.addEventListener('click', () => {
    inputs.forEach(input => {
      const span = input.previousElementSibling;
      span.textContent = input.value;
      input.style.display = 'none';
      span.style.display = 'inline-block';
    });
    editButton.style.display = 'inline-block';
    saveButton.remove();
    setItensBD();
  });
  row.querySelector('.acao').appendChild(saveButton);
}


function confirmDeleteItem(button) {
  const confirmation = confirm('Tem certeza que deseja excluir este item?');
  if (confirmation) {
    deleteItem(button);
  }
}

// Função para deletar um item
function deleteItem(button) {
  const row = button.closest('tr');
  const index = Array.from(row.parentElement.children).indexOf(row);
  row.remove();
  itens.splice(index, 1);
  setItensBD();
}


function initializePage() {
  itens = getItensBD();
  itens.forEach(item => insertItem(item));
}


btnAdicionar.addEventListener('click', () => {
  if (sNome.value == '' || sGrupoMuscular.value == '' || sSeries.value == '' || sRepeticoes.value == '') {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  addNewItem();
});

// Funções auxiliares para acessar o armazenamento local
const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? [];
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens));


initializePage();
