import { createClient } from "@supabase/supabase-js";
import sendGridMail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const dbClient = createClient(SUPABASE_URL, SUPABASE_KEY);

const controlletByMethod = {
  async POST(req: NextApiRequest, res: NextApiResponse) {
    const email = req.body.email;

    if (!Boolean(email) || !email.includes("@")) {
      res.status(400).json({ message: "Insira um email válido" });
      return;
    }

    const { error } = await dbClient
      .from("newsletter_users")
      .insert({ email: email, optin: true });

    await dbClient.auth.admin.createUser({ email: email });

    try {
      sendGridMail.setApiKey(process.env.SENDGRID_KEY);
      await sendGridMail.send({
        to: "guilhermem.greco@gmail.com",
        from: "guilhermem.greco@gmail.com",
        subject: "Inscrição na newsletter",
        html: "Aqui vai o <strong>Conteúdo</strong>",
      });

      res.status(200).json({ message: "Post request" });
    } catch (error) {
      res.status(400).json({ message: "Erro ao enviar email" });
    }
  },
  async GET(req: NextApiRequest, res: NextApiResponse) {
    const { data, error } = await dbClient.from("newsletter_users").select("*");

    console.log(data);
    console.log(error);

    res.status(200).json({ total: data.length });
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const controller = controlletByMethod[req.method];
  if (!controller) {
    res.status(404).json({ message: "Nada encontrado" });
    return;
  } else {
    controller(req, res);
  }
}
