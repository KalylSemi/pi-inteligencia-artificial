async function obterEventos() {
    const eventosEndpoint = '/eventos';
    const URLCompleta = `http://localhost:3004${eventosEndpoint}`;

    try {
        // Faz a requisição GET para o servidor
        const eventos = (await axios.get(URLCompleta)).data;

        const eventosContainer = document.querySelector('#eventosContainer');

        eventosContainer.innerHTML = '';

        // Itera sobre os eventos recebidos do servidor
        for (let evento of eventos) {
            let coluna = document.createElement('div');
            coluna.classList.add('col-md-3', 'mb-4');

            let caixa = document.createElement('div');
            caixa.classList.add('conteiner-fluid', 'd-flex', 'justify-content-center');

            let caixaInterna = document.createElement('div');
            caixaInterna.classList.add('caixa', 'd-flex', 'flex-column', 'align-items-center');

            // Adiciona a imagem do evento
            let imagem = document.createElement('img');
            imagem.classList.add('okt-img');
            imagem.src = `data:${evento.banner.contentType};base64,${evento.banner.data}`; // Ajuste aqui
            imagem.alt = evento.nome;

            let titulo = document.createElement('h5');
            titulo.classList.add('mt-0');
            titulo.innerText = evento.nome;

            let botao = document.createElement('button');
            botao.classList.add('btn', 'btn-danger');
            botao.innerText = 'Ver evento';
            botao.onclick = function () {
                window.location.href = `detalhes.html?id=${evento._id}`;
            };

            caixaInterna.appendChild(imagem);
            caixaInterna.appendChild(titulo);
            caixaInterna.appendChild(botao);
            caixa.appendChild(caixaInterna);
            coluna.appendChild(caixa);
            eventosContainer.appendChild(coluna);
        }
    } catch (error) {
        console.error("Erro ao obter os eventos:", error);
        alert("Erro ao carregar os eventos. Tente novamente mais tarde.");
    }
}

window.onload = obterEventos;