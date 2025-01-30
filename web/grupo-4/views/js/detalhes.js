document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get("id");

    if (!eventoId) {
        alert("ID do evento não fornecido.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3004/eventos/${eventoId}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar evento: ${response.status}`);
        }

        const evento = await response.json();

        document.getElementById("event-title").textContent = evento.nome;
        document.getElementById("event-banner").src = `data:${evento.banner.contentType};base64,${evento.banner.data}`;
        document.getElementById("event-organizer").textContent = evento.organizador;
        document.getElementById("event-date").textContent =
            new Date(evento.data_inicio).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            });
        document.getElementById("event-address").textContent = evento.endereco;
        document.getElementById("event-location").textContent = `${evento.estado}, ${evento.cidade}`;

        // Adiciona quebras de linha na descrição
        document.getElementById("event-description").innerHTML = evento.descricao.replace(/\n/g, "<br>");
    } catch (error) {
        console.error("Erro:", error.message);
        alert("Erro ao carregar os dados do evento.");
    }
});