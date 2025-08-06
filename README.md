# Restaurant Reviews

A modern restaurant review service built with React, TypeScript, and Supabase. Features a sleek dark theme and is optimized for deployment on Vercel.

## Features

- **Restaurant Discovery**: Browse and search restaurants by name, cuisine, or location
- **User Reviews**: Read and write detailed reviews with star ratings
- **Authentication**: Secure user authentication via Supabase Auth
- **Dark Theme**: Modern dark UI with excellent user experience
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Real-time Updates**: Live data updates with Supabase real-time subscriptions

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: CSS with CSS Variables for theming
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd restaurant-reviews
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Setup

Create the following tables in your Supabase database:

#### Restaurants Table
```sql
create table restaurants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  address text not null,
  cuisine_type text not null,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### Profiles Table
```sql
create table profiles (
  id uuid references auth.users primary key,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### Reviews Table
```sql
create table reviews (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

#### Enable Row Level Security (RLS)
```sql
-- Enable RLS
alter table restaurants enable row level security;
alter table profiles enable row level security;
alter table reviews enable row level security;

-- Restaurants policies (public read)
create policy "Restaurants are viewable by everyone" 
  on restaurants for select 
  using (true);

-- Profiles policies
create policy "Users can view all profiles" 
  on profiles for select 
  using (true);

create policy "Users can insert their own profile" 
  on profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- Reviews policies
create policy "Reviews are viewable by everyone" 
  on reviews for select 
  using (true);

create policy "Users can insert their own reviews" 
  on reviews for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews" 
  on reviews for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews" 
  on reviews for delete 
  using (auth.uid() = user_id);
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Building for Production

Build the app for production:
```bash
npm run build
```

### Deployment to Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Deploy!

The app will automatically build and deploy on every push to the main branch.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
