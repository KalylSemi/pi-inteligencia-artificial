// Função para obter os eventos
async function obterEventos() {
    const eventosEndpoint = '/eventos';
    const URLCompleta = `http://localhost:3004${eventosEndpoint}`;

    try {
        const eventos = (await axios.get(URLCompleta)).data;
        eventos.reverse();
        const ultimosEventos = eventos.slice(0, 4);

        const eventosContainer = document.querySelector('#eventosContainer');
        eventosContainer.innerHTML = '';

        for (let evento of ultimosEventos) {
            let coluna = document.createElement('div');
            coluna.classList.add('col-md-3', 'mb-4');

            let caixa = document.createElement('div');
            caixa.classList.add('conteiner-fluid', 'd-flex', 'justify-content-center');

            let caixaInterna = document.createElement('div');
            caixaInterna.classList.add('caixa', 'd-flex', 'flex-column', 'align-items-center');

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

// Função para obter os eventos com estado "SP"
async function obterEventosSP() {
    const eventosEndpoint = '/eventos';
    const URLCompleta = `http://localhost:3004${eventosEndpoint}`;

    try {
        // Faz a requisição GET para o servidor
        const eventos = (await axios.get(URLCompleta)).data;

        const eventosSP = eventos.filter(evento => evento.estado === 'SP').reverse();

        const ultimosEventosSP = eventosSP.slice(0, 4);

        const eventosContainerSP = document.querySelector('#eventosContainerSP');

        eventosContainerSP.innerHTML = '';

        // Itera sobre os eventos recebidos do servidor (somente os 4 mais recentes)
        for (let evento of ultimosEventosSP) {
            let coluna = document.createElement('div');
            coluna.classList.add('col-md-3', 'mb-4');

            let caixa = document.createElement('div');
            caixa.classList.add('conteiner-fluid', 'd-flex', 'justify-content-center');

            let caixaInterna = document.createElement('div');
            caixaInterna.classList.add('caixa', 'd-flex', 'flex-column', 'align-items-center');

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
            eventosContainerSP.appendChild(coluna);
        }
    } catch (error) {
        console.error("Erro ao obter os eventos com estado SP:", error);
        alert("Erro ao carregar os eventos com estado SP. Tente novamente mais tarde.");
    }
}

async function obterOrganizadores() {
    const organizadoresEndpoint = '/organizadores'; // Endpoint para buscar organizadores
    const URLCompleta = `http://localhost:3004${organizadoresEndpoint}`; // URL completa da API

    try {
        const organizadores = (await axios.get(URLCompleta)).data;

        const organizadoresContainer = document.querySelector('#organizadoresContainer');
        organizadoresContainer.innerHTML = '';

        for (let organizador of organizadores) {
            const logoUrl = organizador.url_logo || 'img/default-logo.png';
            const bannerUrl = organizador.url_banner || 'img/default-banner.jpg';

            if (!organizador.url_logo || !organizador.url_banner) {
                console.warn(`Organizador ${organizador.nome} sem logo ou banner.`);
            }

            const coluna = document.createElement('div');
            coluna.className = 'col-md-3 mb-4';

            const conteiner = document.createElement('div');
            conteiner.className = 'conteiner-fluid d-flex justify-content-center';

            const caixa = document.createElement('div');
            caixa.className = 'caixa-org d-flex flex-column align-items-center';

            const logo = document.createElement('img');
            logo.className = 'company';
            logo.src = bannerUrl;
            logo.alt = organizador.nome;

            const imgCompany = document.createElement('div');
            imgCompany.className = 'img-company';

            const foto = document.createElement('img');
            foto.className = 'company-photo';
            foto.src = logoUrl;
            foto.alt = organizador.nome;

            imgCompany.appendChild(foto);

            const nome = document.createElement('h5');
            nome.className = 'mt-2';
            nome.textContent = organizador.nome;

            caixa.appendChild(logo);
            caixa.appendChild(imgCompany);
            caixa.appendChild(nome);
            conteiner.appendChild(caixa);
            coluna.appendChild(conteiner);
            organizadoresContainer.appendChild(coluna);
        }
    } catch (error) {
        console.error("Erro ao obter os organizadores:", error);
        alert("Erro ao carregar os organizadores. Tente novamente mais tarde.");
    }
}

window.onload = function () {
    obterEventos();
    obterEventosSP();
    obterOrganizadores();
};