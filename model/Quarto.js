const mongoose = require("mongoose");

// Criando o schema Quarto
const quartoSchema = mongoose.Schema(
  {
    numero: { type: Number, unique: true },
    andar: { type: Number },
    tipo: { type: String },
    ocupado: { type: Boolean, default: false },
    data_entrada: { type: Date, default: null },
    data_saida: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("quarto", quartoSchema);
