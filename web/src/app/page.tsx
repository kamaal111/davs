import ContactsList from '@/contacts/components/contacts-list';
import ContactsNavigationBar from '@/contacts/components/contacts-navigation-bar';

import styles from './page.module.css';

function Home() {
  return (
    <main className={styles.main}>
      <ContactsNavigationBar />
      <ContactsList />
    </main>
  );
}

export default Home;
