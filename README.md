# Shush

Cofre pessoal de senhas. Cada pessoa só acessa as próprias senhas, criptografadas antes de saírem do navegador — nem o banco de dados guarda o texto original.

## Como rodar localmente

1. Copie `.env.example` para `.env` e preencha com as credenciais do Supabase
2. `npm install`
3. `npm run dev`

## Como funciona a segurança

A senha-mestra nunca é enviada ao servidor. Ela é usada só no navegador para gerar a chave de criptografia (AES-GCM) que cifra e decifra cada senha guardada. O Supabase só armazena texto cifrado.
