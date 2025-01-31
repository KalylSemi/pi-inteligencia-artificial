# Geração de imagens através de Inteligência Artificial

## Como funciona

- No formulário de cadastro do evento, existem duas opções de inserção de imagem: via upload de arquivos e através do prompt para criação de imagens da OpenAI.

![form](/img-readme/form.png)

- Só é possível utilizar apenas uma dessas opções, ou seja, caso seja utilizado a opção de gerar a imagem com IA, o upload de arquivos será bloqueado, e vice-versa.

## Tela Inicial com os dois tipos de imagens disponíveis

![home](/img-readme/home.png)

## Quer realizar o teste? Siga o passo a passo abaixo

- No diretório `/api/grupo-4`, edite o nome do arquivo **.envExample** para **.env** e insira a sua api-key da OpenAI.

- No terminal desse mesmo diretório, digite:

```bash
npm install
```

- Em seguida, digite:

```bash
npm start
```

- Agora, no diretório `/web/grupo-4`, no terminal, digite:

```bash
npm install
```

- Em seguida, digite:

```bash
npm start
```

- Para acessar a interface, vá até o navegador e digite `localhost:8084`

## E pronto! Agora você conseguir usufruir dos recursos da aplicação.