
const formulario = document.getElementById("formulario");
const campoCep = document.getElementById("cep");
const botaoBuscar = document.getElementById("botaoBuscar");
const mensagem = document.getElementById("mensagem");
const resultado = document.getElementById("resultado");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();
    buscarCEP();
});

async function buscarCEP() {
    const cep = campoCep.value.replace(/\D/g, "");

    resultado.hidden = true;
    mensagem.className = "";
    mensagem.textContent = "";

    if (cep.length !== 8) {
        mostrarMensagem("Digite um CEP válido com 8 números.", "erro");
        return;
    }

    botaoBuscar.disabled = true;
    botaoBuscar.textContent = "Buscando...";
    mostrarMensagem("Consultando o endereço...", "carregando");

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cep}/json/`
        );

        if (!resposta.ok) {
            throw new Error("Falha na requisição.");
        }

        const dados = await resposta.json();

        if (dados.erro) {
            throw new Error("CEP não encontrado.");
        }

        document.getElementById("rua").textContent =
            dados.logradouro || "Não informado";

        document.getElementById("bairro").textContent =
            dados.bairro || "Não informado";

        document.getElementById("cidade").textContent =
            dados.localidade || "Não informado";

        document.getElementById("estado").textContent =
            dados.uf || "Não informado";

        document.getElementById("cepEncontrado").textContent =
            dados.cep || cep;

        resultado.hidden = false;
        mostrarMensagem("Endereço encontrado com sucesso!", "sucesso");

    } catch (erro) {
        if (erro.message === "CEP não encontrado.") {
            mostrarMensagem(
                "CEP não encontrado. Confira os números e tente novamente.",
                "erro"
            );
        } else {
            mostrarMensagem(
                "Não foi possível consultar o CEP. Verifique sua internet e tente novamente.",
                "erro"
            );
        }
    } finally {
        botaoBuscar.disabled = false;
        botaoBuscar.textContent = "Buscar";
    }
}

function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = tipo;
}
