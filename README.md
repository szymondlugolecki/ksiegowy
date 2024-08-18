# Księgowy
Simple accounting app for households.

## Tech stack
 - Next.js 14 (/pages dir) & Turbopack
 - Supabase
 - Typescript
 - react-hook-form
 - DrizzleORM
 - shadcn/ui & TailwindCSS

## TODO
 - [ ] Page with household stats
   - [ ] Graphic visualizations
   - [ ] Dates range
   - [ ] Household members comparison
 - [ ] Possibility to scan a receipt & auto add it to expenses
 - [ ] Make login page design appealing
 - [ ] Smoother form submissions (fix toasts disappearing, etc.)
 - [ ] "Pending users" list for households (now invitation code is enough to join)
 - [ ] Shopping list
 - [ ] Possibility to extract household data into a file (CSV, XLSX, etc.)
 - [ ] Possibility to delete a household
 - [ ] Error page
 - [ ] Managing users (kicking out)

## Already done
 - [X] Auth
 - [X] Managing households
   - [X] Creating a household
   - [X] Joining a household
   - [X] Switching the active one
- [X] Expenses
  - [X] List of expenses in a household
  - [X] Adding new expenses
  

# Next.js + Turbopack

This example allows you to get started with `next dev --turbo` quicky.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-turbopack&project-name=with-turbopack&repository-name=with-turbopack)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example with-turbopack with-turbopack-app
```

```bash
yarn create next-app --example with-turbopack with-turbopack-app
```

```bash
pnpm create next-app --example with-turbopack with-turbopack-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).


Connecting Supabase:
```sql
-- Purge ALL
DROP TABLE if exists users cascade;
DROP FUNCTION if exists handle_new_user() cascade;

DROP TABLE if exists profiles cascade;
DROP TABLE if exists households cascade;
DROP TABLE if exists profiles_to_households cascade;
DROP TABLE if exists expenses cascade;

DROP SCHEMA if exists drizzle cascade;
```

```sql
-- This is necessary to connect Supabase with Drizzle
-- See this for more info:
-- https://github.com/supabase/supabase/issues/19883#issuecomment-2094656180
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url, created_at, last_sign_in_at)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email, new.raw_user_meta_data->>'avatar_url', new.created_at, new.last_sign_in_at);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```