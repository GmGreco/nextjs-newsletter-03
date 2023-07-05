import Box from "@src/components/Box/Box";
import Button from "@src/components/Button/Button";
import Image from "@src/components/Image/Image";
import Text from "@src/components/Text/Text";
import { BaseComponent } from "@src/theme/BaseComponent";
import { useState } from "react";

function useForm({ initialValues }) {
  const [values, setValues] = useState(initialValues);
  return {
    values,
    handleChange(e) {
      const { name, value } = e.target;
      setValues({
        ...values,
        [name]: value,
      });
    },
  };
}

export default function NewsletterScreen() {
  const form = useForm({
    initialValues: {
      email: "",
    },
  });
  return (
    <Box
      styleSheet={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("teste");
          if (!form.values.email.includes("@")) {
            alert("Informe um email válido");
          } else {
            alert("Cadastrado com sucesso");
          }
          fetch("/api/newsletter/optin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form.values),
          }).then(async (response) => {
            console.log(await response.json());
          });
        }}
      >
        <Box
          styleSheet={{
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
            padding: "16px",
          }}
        >
          <Image
            src="https://github.com/GmGreco.png"
            alt="Foto de Perfil"
            styleSheet={{
              borderRadius: "100%",
              width: "100px",
              marginBottom: "16px",
            }}
          />
          <Text variant="heading2">Newsletter</Text>

          <NewsletterTextField
            name="email"
            placeholder="Informe seu e-mail"
            value={form.values.email}
            onChange={form.handleChange}
          />
          <Button fullWidth styleSheet={{ marginTop: "16px" }}>
            Cadastrar
          </Button>
        </Box>
      </form>
    </Box>
  );
}

interface NewsletterTextFieldProps {
  placeholder?: string;
  value?: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function NewsletterTextField(props: NewsletterTextFieldProps) {
  return (
    <Box
      styleSheet={{
        maxWidth: "200px",
        width: "100%",
      }}
    >
      <BaseComponent
        as="input"
        {...props}
        styleSheet={{
          border: "1px solid rgb(195, 195, 195)",
          borderRadius: "4px",
          padding: "8px",
          width: "100%",
        }}
      />
    </Box>
  );
}
