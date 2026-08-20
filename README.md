# Shush

Cofre pessoal de senhas. Cada pessoa só acessa as próprias senhas, criptografadas antes de saírem do navegador — nem o banco de dados guarda o texto original.

Este repositório é o código-fonte, aberto para qualquer pessoa usar ou adaptar. Cada instância roda com seu próprio banco de dados: seus dados nunca ficam acessíveis a mais ninguém, nem a quem roda o mesmo código.

## Como rodar sua própria instância

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e um novo projeto
2. No painel do Supabase, abra o **SQL Editor** e rode o conteúdo de [`supabase-schema.sql`](./supabase-schema.sql) — isso cria a tabela e as regras de segurança (cada usuário só vê os próprios dados)
3. Em **Project Settings → API**, copie a **Project URL** e a chave **anon public**
4. Copie `.env.example` para `.env` e preencha com essas credenciais
5. `npm install`
6. `npm run dev`

## Como funciona a segurança

A senha-mestra nunca é enviada ao servidor. Ela é usada só no navegador para gerar a chave de criptografia (AES-GCM) que cifra e decifra cada senha guardada. O Supabase só armazena texto cifrado — mesmo quem tem acesso ao banco de dados não consegue ler as senhas sem a senha-mestra de cada usuário.
