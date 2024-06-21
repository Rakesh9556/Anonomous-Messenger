import { Html, Head, Font, Preview, Heading, Section, Text, Button, Row } from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  verificationCode: string;
}

export default function VerificationEmail({username, verificationCode} : VerificationEmailProps) {
    return (
        <Html lang="en" dir="ltr">
            <Head>
                <title>Verification Code</title>
                <Font
                fontFamily='Roboto'
                fallbackFontFamily="Verdana"
                webFont={{url:"https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap", format: 'woff2'}}/>
            </Head>
            <Preview>Here&pos;s your verification code: {verificationCode}</Preview>

            <Section>
                <Row>
                    <Heading as="h2">Hello {username},</Heading>
                </Row>

                <Row>
                    <Text>
                      Thank you for registering. Please use the following code to verify your email address:
                    </Text>
                </Row>

                <Row>
                   <Text>{verificationCode}</Text>
                </Row>

                <Row>
                   <Button href="https://example.com" target="_blank">Verify Email</Button>
                </Row>
                
            </Section>

        </Html>
    )
}



