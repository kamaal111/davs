import SignUpForm from '@/users/components/sign-up-form';

import styles from './page.module.css';

function Home() {
  return (
    <main className={styles.main}>
      <SignUpForm />
    </main>
  );
}

export default Home;
