import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("ERRO: Faltando string de conexão no arquivo .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("🔗 Conectado ao MongoDB!");

    // Check if an admin already exists
    const existingAdmin = await Admin.findOne({
      email: "gabriel.r.lacerda@gmail.com",
    });

    if (existingAdmin) {
      console.log("⚠️ O admin já existe no banco de dados.");
      // Update password just in case (optional, useful for reset)
      const salt = await bcrypt.genSalt(10);
      existingAdmin.password = await bcrypt.hash("ATK2407$", salt);
      await existingAdmin.save();
      console.log("✅ Senha do admin atualizada com sucesso.");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("ATK2407$", salt);

      const newAdmin = new Admin({
        email: "gabriel.r.lacerda@gmail.com",
        password: hashedPassword,
      });

      await newAdmin.save();
      console.log("✅ Administrador semeado com sucesso!");
    }

    console.log("\n=============================================");
    console.log("Credenciais de Acesso:");
    console.log("Email: gabriel.r.lacerda@gmail.com");
    console.log("Senha: ");
    console.log("=============================================\n");

    mongoose.disconnect();
    console.log("👋 Desconectado.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro no seed:", error);
    process.exit(1);
  }
};

seedAdmin();
