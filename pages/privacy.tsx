import styles from '@/styles/legal.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.legalContainer}>
      <h1 className={styles.title}>Privacy Policy</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Introduction</h2>
        <div className={styles.content}>
          <p>Last Updated: March 2024</p>
          <p>Contact: ckb@tutortechy.com</p>
          <p>This privacy policy explains how Classics, an iOS application for reading public domain books, handles your data. We believe in privacy by design - your reading experience is completely offline and private by default.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Privacy Principles</h2>
        <div className={styles.content}>
          <ul className={styles.bulletList}>
            <li>No account required - start reading immediately</li>
            <li>100% offline by default - no internet connection needed</li>
            <li>All data stays on your device</li>
            <li>No tracking or analytics</li>
            <li>No third-party services</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Information We Store Locally</h2>
        <div className={styles.content}>
          <h3>Reading Data</h3>
          <ul className={styles.bulletList}>
            <li>Your downloaded books from our public domain collection</li>
            <li>Reading progress and bookmarks</li>
            <li>Highlights and personal notes</li>
            <li>Font and display preferences</li>
          </ul>

          <h3>Local Storage</h3>
          <ul className={styles.bulletList}>
            <li>App settings using iOS secure storage</li>
            <li>Cached book content for offline reading</li>
            <li>Your reading preferences and themes</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>How We Use Your Data</h2>
        <div className={styles.content}>
          <p>All data processing happens locally on your device to:</p>
          <ul className={styles.bulletList}>
            <li>Remember your place in books</li>
            <li>Save your highlights and notes</li>
            <li>Maintain your reading preferences</li>
            <li>Enable offline access to your library</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Storage and Security</h2>
        <div className={styles.content}>
          <p>Your data is stored:</p>
          <ul className={styles.bulletList}>
            <li>Only on your device using secure iOS storage</li>
            <li>Protected by your device&apos;s built-in security</li>
            <li>Never transmitted to any servers</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Rights and Controls</h2>
        <div className={styles.content}>
          <p>You have complete control over your data:</p>
          <ul className={styles.bulletList}>
            <li>Access your reading data anytime through the app</li>
            <li>Delete books, highlights, and notes at will</li>
            <li>Clear all app data through iOS settings</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Future Updates</h2>
        <div className={styles.content}>
          <p>If we add any online features in the future:</p>
          <ul className={styles.bulletList}>
            <li>They will be strictly opt-in</li>
            <li>We will update this privacy policy</li>
            <li>You will be clearly notified of changes</li>
            <li>Offline mode will always remain available</li>
          </ul>
          <p>For questions about this privacy policy, please contact us at ckb@tutortechy.com.</p>
        </div>
      </div>
    </div>
  );
}