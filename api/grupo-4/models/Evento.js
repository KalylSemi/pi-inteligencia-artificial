const mongoose = require('mongoose')

const EventoSchema = mongoose.Schema({
    nome: String,
    data_inicio: Date,
    categoria: String,
    descricao: String,
    banner: {
        data: Buffer,
        contentType: String
    },
    preco: Number,
    organizador: String,
    estado: String,
    cidade: String,
    endereco: String,
    numero: Number,
    data_cadastro: Date
}, { collection: "Evento"});

const Evento = mongoose.model("Evento", EventoSchema)

module.exports = Evento