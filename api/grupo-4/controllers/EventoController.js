const Evento = require("../models/Evento");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const axios = require("axios");

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Limite de 10MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Somente imagens são permitidas! (jpeg, jpg, png, gif)'));
        }
    }
}).single('banner');

// Função para gerar imagem via OpenAI
const gerarImagemOpenAI = async (prompt) => {
    try {
        console.log("Prompt recebido:", prompt); // 🔍 Verifica o prompt no console

        const response = await axios.post("https://api.openai.com/v1/images/generations", {
            prompt: prompt,
            n: 1,
            size: "1024x1024"
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        return response.data.data[0].url;
    } catch (error) {
        console.error("Erro ao gerar imagem com OpenAI:", error);
        return null;
    }
};

// Controlador para criar um evento
const postEvento = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ mensagem: "Erro ao fazer upload do arquivo", erro: err.message });
        }

        try {
            const {
                nome,
                data_inicio,
                categoria,
                descricao,
                prompt,
                preco,
                organizador,
                estado,
                cidade,
                endereco,
                numero
            } = req.body;

            const dataInicio = new Date(data_inicio);
            if (isNaN(dataInicio)) {
                return res.status(400).json({ mensagem: "Data de início inválida" });
            }

            let bannerData = null;
            let bannerContentType = null;

            if (req.file) {
                const filePath = path.join(__dirname, "../uploads/", req.file.filename);
                bannerData = fs.readFileSync(filePath);
                bannerContentType = req.file.mimetype;
                
                // Remover o arquivo após o uso
                fs.unlinkSync(filePath);
            } else {
                const imageUrl = await gerarImagemOpenAI(prompt);
                if (imageUrl) {
                    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                    bannerData = Buffer.from(imageResponse.data, 'binary');
                    bannerContentType = "image/png";
                }
            }

            const evento = new Evento({
                nome,
                data_inicio: dataInicio,
                categoria,
                descricao,
                preco,
                organizador,
                estado,
                cidade,
                endereco,
                numero,
                data_cadastro: new Date(),
                banner: bannerData ? { data: bannerData, contentType: bannerContentType } : undefined
            });

            const novoEvento = await evento.save();
            res.status(201).json(novoEvento);
        } catch (error) {
            console.error("Erro ao salvar evento:", error);
            res.status(500).json({ mensagem: "Erro ao salvar evento", erro: error.message });
        }
    });
};

// Controlador para buscar todos os eventos
const getEventos = async (req, res) => {
    try {
        const eventos = await Evento.find();

        const retorno = eventos.map(evento => ({
            _id: evento._id,
            nome: evento.nome,
            descricao: evento.descricao,
            data_inicio: evento.data_inicio,
            preco: evento.preco,
            estado: evento.estado,
            cidade: evento.cidade,
            endereco: evento.endereco,
            numero: evento.numero,
            banner: evento.banner ? {
                data: evento.banner.data.toString('base64'),
                contentType: evento.banner.contentType
            } : null
        }));

        res.setHeader('Content-Type', 'application/json');
        res.json(retorno);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({ mensagem: "Erro ao buscar eventos", erro: error.message });
    }
};

// Controlador para buscar um evento específico
const getEvento = async (req, res) => {
    try {
        const eventoId = req.params.id;
        const evento = await Evento.findById(eventoId).lean(); // Converte para objeto JS simples

        if (!evento) {
            return res.status(404).json({ mensagem: "Evento não encontrado" });
        }

        if (evento.banner && evento.banner.data) {
            evento.banner = {
                contentType: evento.banner.contentType,
                data: evento.banner.data.toString("base64"), // Converte Buffer para string Base64
            };
        }

        res.json(evento);
    } catch (error) {
        console.error("Erro ao buscar evento:", error);
        res.status(500).json({ mensagem: "Erro ao buscar evento", erro: error.message });
    }
};

module.exports = {
    getEventos,
    getEvento,
    postEvento
};
