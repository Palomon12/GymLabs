import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ReminderEmailProps {
  nombreCliente: string;
  diasRestantes: number;
}

export const ReminderEmail = ({ nombreCliente = "Cliente", diasRestantes = 3 }: ReminderEmailProps) => {
  // Configuración de estilo similar a nuestro Dashboard (Dark Premium)
  const main = {
    backgroundColor: "#0a0a0a",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };

  const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "560px",
  };

  const heading = {
    fontSize: "24px",
    letterSpacing: "-0.5px",
    lineHeight: "1.3",
    fontWeight: "800",
    color: "#ffffff",
    padding: "17px 0 0",
  };

  const paragraph = {
    margin: "0 0 15px",
    fontSize: "15px",
    lineHeight: "1.4",
    color: "#a0a0a0", // text-muted
  };

  const highlight = {
    color: "#c3f400", // primary green
    fontWeight: "bold",
  };

  const buttonContainer = {
    padding: "27px 0 27px",
  };

  const button = {
    backgroundColor: "#c3f400",
    borderRadius: "8px",
    fontWeight: "bold",
    color: "#121212",
    fontSize: "15px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "12px 24px",
  };

  const hr = {
    borderColor: "#222222",
    margin: "42px 0 26px",
  };

  const footer = {
    color: "#666666",
    fontSize: "12px",
    textAlign: "center" as const,
  };

  const urgencyText = diasRestantes <= 0 ? "ha vencido" : `vence en ${diasRestantes} días`;

  return (
    <Html>
      <Head />
      <Preview>Renueva tu plan de GymLabs - Tu membresía {urgencyText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={{ paddingBottom: '20px' }}>
            <Text style={{ color: "#c3f400", fontSize: "32px", fontWeight: "900", margin: 0, letterSpacing: "-1px" }}>
              GYMLABS
            </Text>
          </Section>
          
          <Heading style={heading}>¡Hola {nombreCliente}! 🏋️‍♂️</Heading>
          
          <Text style={paragraph}>
            Esperamos que estés teniendo excelentes entrenamientos. Te escribimos para recordarte que tu membresía actual <span style={highlight}>{urgencyText}</span>.
          </Text>
          
          <Text style={paragraph}>
            No dejes que tu progreso se detenga. Renueva tu plan ahora para mantener tu acceso sin interrupciones a todas nuestras instalaciones y clases exclusivas.
          </Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href="https://gymlabs.com/renovar">
              Renovar mi Plan Ahora
            </Button>
          </Section>
          
          <Text style={paragraph}>
            Si ya realizaste tu pago, por favor ignora este mensaje o contacta con recepción para actualizar tu estado.
          </Text>
          
          <hr style={hr} />
          <Text style={footer}>
            GymLabs Elite Fitness <br />
            Este es un correo generado automáticamente. No respondas a este mensaje.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReminderEmail;
