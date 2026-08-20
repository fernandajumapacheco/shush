-- Tabela principal: guarda senhas, tokens e frases de recuperação
-- O campo senha_cifrada nunca contém texto legível — é sempre o resultado
-- da criptografia feita no navegador antes do envio.
create table senhas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null default 'senha' check (tipo in ('senha', 'token', 'seed')),
  site text,
  login text,
  senha_cifrada text not null,
  salt text not null,
  iv text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security: cada usuário só enxerga e mexe nas próprias linhas.
-- Sem isso, qualquer pessoa autenticada poderia ler os dados cifrados de todo mundo.
alter table senhas enable row level security;

create policy "Usuários veem apenas suas próprias senhas"
  on senhas for select
  using (auth.uid() = user_id);

create policy "Usuários inserem apenas para si mesmos"
  on senhas for insert
  with check (auth.uid() = user_id);

create policy "Usuários atualizam apenas suas próprias senhas"
  on senhas for update
  using (auth.uid() = user_id);

create policy "Usuários excluem apenas suas próprias senhas"
  on senhas for delete
  using (auth.uid() = user_id);
