// API REST Quarto
const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const Quarto = require("../model/Quarto");

const validaQuarto = [
  check("numero", "Número do quarto é obrigatório").not().isEmpty(),
  check("andar", "Andar do quarto é obrigatório").not().isEmpty(),
  check("tipo", "Tipo do quarto é obrigatório").not().isEmpty(),
];

/*****************************
 * GET /quartos/
 * Listar todos os quartos
 ****************************/
router.get("/", async (req, res) => {
  try {
    const quartos = await Quarto.find();
    res.json({ sucesso: true, quartos: quartos });
  } catch (err) {
    res.status(400).send({
      sucesso: false,
      errors: [{ message: "Não foi possível obter os quartos!" }],
    });
  }
});

/*****************************
 * GET /quartos/:id
 * Listar o quarto pelo id
 ****************************/
router.get("/:id", async (req, res) => {
  try {
    const quarto = await Quarto.findById(req.params.id);
    if (quarto){
        res.json({ sucesso: true, quarto: quarto });
    }
    else {
        res.status(400).send({
            sucesso: false,
            errors: [
              {
                message: `Não foi possível obter o quarto com o id ${req.params.id}`,
              },
            ],
          });
    }
  } catch (err) {
    res.status(400).send({
      sucesso: false,
      errors: [
        {
          message: `Não foi possível obter o quarto com o id ${req.params.id}`,
        },
      ],
    });
  }
});

/*****************************
 * POST /quartos/
 * Inclui uma novo quarto
 ****************************/
router.post("/", validaQuarto, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      sucesso: false,
      errors: errors.array(),
    });
  }

  // Verifica se o quarto já existe
  const { numero } = req.body;
  const quarto = await Quarto.findOne({ numero });
  if (quarto)
    return res.status(200).json({
      sucesso: false,
      errors: [{ message: "Já existe um quarto com o número informado!" }],
    });
  try {
    const quarto = new Quarto(req.body);
    await quarto.save();
    res.send({ sucesso: true, quarto: quarto });
  } catch (err) {
    return res
      .status(400)
      .json({
        sucesso: false,
        errors: [{ message: `Erro ao salvar o quarto: ${err.message}` }],
      });
  }
});

/*****************************
 * DELETE /quartos/:id
 * Apaga o quarto pelo id informado
 ****************************/
router.delete("/:id", async (req, res) => {
  await Quarto.findByIdAndRemove(req.params.id)
    .then((quarto) => {
      res.send({
        sucesso: true,
        message: `Quarto ${quarto.numero} removido com sucesso`,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        sucesso: false,
        errors: [
          {
            message: `Não foi possível apagar o quarto com o id ${req.params.id}`,
          },
        ],
      });
    });
});

/*******************************************
 * PUT /quartos/
 * Altera os dados do quarto informado
 *******************************************/
router.put("/", validaQuarto, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ sucesso: false, errors: errors.array() });
  }

  const dados = req.body;

  await Quarto.findByIdAndUpdate(
    req.body._id,
    {
      $set: dados,
    },
    { new: true }
  )
    .then((quarto) => {
      res.send({
        sucesso: true,
        message: `Quarto ${quarto.numero} alterado com sucesso!`,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        sucesso: false,
        errors: [
          {
            message: `Não foi possível alterar o quarto com o id ${req.params.id}`,
          },
        ],
      });
    });
});

module.exports = router;
