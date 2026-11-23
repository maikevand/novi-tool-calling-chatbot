-- Toegevoegd: tabel voor de vacatures uit huiswerk Les 11. Voer dit uit in de SQL Editor van Supabase.
-- RLS staat aan zonder policies, net als bij chats_ai_bot: alleen de server met de secret key kan lezen en schrijven.
create table public.vacatures
(
    id           uuid primary key     default gen_random_uuid(),
    functietitel text        not null,
    bedrijf      text,
    niveau       text        not null check (niveau in ('junior', 'medior', 'senior', 'onbekend')),
    salaris_min  integer,
    salaris_max  integer,
    vaardigheden text[] not null default '{}',
    remote       boolean     not null,
    tekst        text        not null,
    created_at   timestamptz not null default now()
);

alter table public.vacatures enable row level security;
