async function buscarCEP(cep) {
    try {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.erro) {
            alert("CEP não encontrado!");
            document.querySelector("#estado").value = "";
            document.querySelector("#cidade").value = "";
            document.querySelector("#endereco").value = "";
        } else {
            document.querySelector("#estado").value = data.uf;
            document.querySelector("#cidade").value = data.localidade;
            document.querySelector("#endereco").value = data.logradouro;
        }
    } catch (error) {
        console.error("Erro ao buscar o CEP:", error);
        alert("Erro ao buscar o CEP. Tente novamente.");
        document.querySelector("#estado").value = "";
        document.querySelector("#cidade").value = "";
        document.querySelector("#endereco").value = "";
    }
}

document.getElementById("cep").addEventListener("blur", function () {
    const cep = this.value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (cep.length === 8) { // Verifica se o CEP tem 8 dígitos
        buscarCEP(cep);
    } else {
        alert("CEP inválido! Digite um CEP com 8 dígitos.");
    }
});

const postEvent = async (event) => {
    event.preventDefault();

    const eventosEndpoint = '/eventos';
    const URLCompleta = `http://localhost:3004${eventosEndpoint}`;

    const token = localStorage.getItem('token');
    if (!token) {
        exibirAlerta('warning', 'Você precisa estar logado para criar um evento');
        return;
    }

    let organizador;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        organizador = payload.login || payload.nome_empresa || "Organizador desconhecido";
    } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        exibirAlerta('error', 'Token inválido. Faça login novamente.');
        return;
    }

    // Pegando os campos do formulário
    const formData = new FormData();
    formData.append('nome', document.querySelector('#nomeEvento').value);
    formData.append('data_inicio', document.querySelector('#dataInicio').value);
    formData.append('categoria', document.querySelector('#categoria').value);
    formData.append('descricao', document.querySelector('#descricao').value);
    formData.append('prompt', document.querySelector('#imagemPrompt').value);
    formData.append('banner', document.querySelector('#banner').files[0]); // Arquivo
    formData.append('preco', parseFloat(document.querySelector('#precoIngresso').value));
    formData.append('estado', document.querySelector('#estado').value);
    formData.append('cidade', document.querySelector('#cidade').value);
    formData.append('endereco', document.querySelector('#endereco').value);
    formData.append('numero', document.querySelector('#numero').value);
    formData.append('organizador', organizador);

    try {
        const response = await axios.post(URLCompleta, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });

        exibirAlerta('success', 'Evento cadastrado com sucesso!');
    } catch (error) {
        console.error("Erro ao cadastrar evento:", error);
        exibirAlerta('error', 'Erro ao cadastrar evento');
    }
};

// Função para exibir alertas
function exibirAlerta(tipo, mensagem) {
    Swal.fire({
        icon: tipo,
        title: mensagem,
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        position: 'top-end',
    });
}

const formularioEvento = document.querySelector('#formEvento');
formularioEvento.addEventListener('submit', postEvent);

document.addEventListener("DOMContentLoaded", () => {
    const promptInput = document.querySelector("#imagemPrompt");
    const fileInput = document.querySelector("#banner");

    // Desativar um campo quando o outro for preenchido
    promptInput.addEventListener("input", () => {
        fileInput.disabled = promptInput.value.trim().length > 0;
    });

    fileInput.addEventListener("change", () => {
        promptInput.disabled = fileInput.files.length > 0;
    });
});