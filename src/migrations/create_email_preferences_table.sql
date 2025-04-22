create table if not exists email_preferences (
  email text primary key,
  unsubscribed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index email_preferences_email_idx on email_preferences(email); 