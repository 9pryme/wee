create table if not exists organizations (
  code text primary key,
  name text not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index organizations_code_idx on organizations(code);
create index organizations_name_idx on organizations(name); 