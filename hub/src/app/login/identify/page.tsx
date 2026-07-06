import { redirect } from 'next/navigation';

// Sign-in + identity switching now live on /login. Keep this path working for
// any old links / the topbar by redirecting.
export default function IdentifyRedirect() {
  redirect('/login');
}
