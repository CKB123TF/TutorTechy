import styles from '@/styles/legal.module.css';

export default function TermsOfService() {
  return (
    <div className={styles.legalContainer}>
      <h1 className={styles.title}>Terms of Service</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
        <div className={styles.content}>
          <p>By downloading, installing, or using Classics, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our application.</p>
          <p>Last Updated: March 2024</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Service Description</h2>
        <div className={styles.content}>
          <p>Classics is an iOS application that provides:</p>
          <ul className={styles.bulletList}>
            <li>Access to a curated collection of public domain books</li>
            <li>Offline reading capabilities</li>
            <li>Personal annotation features (highlights and notes)</li>
            <li>Customizable reading experience</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Public Domain Content</h2>
        <div className={styles.content}>
          <p>Regarding the books available in Classics:</p>
          <ul className={styles.bulletList}>
            <li>All books are carefully selected from the public domain</li>
            <li>Texts are provided "as is" without any warranty</li>
            <li>We make best efforts to ensure textual accuracy</li>
            <li>Original author attributions are maintained</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>User Rights</h2>
        <div className={styles.content}>
          <p>As a Classics user, you may:</p>
          <ul className={styles.bulletList}>
            <li>Download and read any available books</li>
            <li>Create personal annotations and highlights</li>
            <li>Customize your reading experience</li>
            <li>Use the app for personal, non-commercial purposes</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Intellectual Property</h2>
        <div className={styles.content}>
          <p>The following components are protected by intellectual property rights:</p>
          <ul className={styles.bulletList}>
            <li>The Classics app interface and design</li>
            <li>Our custom typography and themes</li>
            <li>The app's codebase and functionality</li>
            <li>App icons and visual elements</li>
          </ul>
          <p>Your personal annotations and highlights belong to you.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Storage</h2>
        <div className={styles.content}>
          <p>By using Classics, you understand that:</p>
          <ul className={styles.bulletList}>
            <li>All data is stored locally on your device</li>
            <li>No cloud backup is currently available</li>
            <li>Deleting the app will remove all data</li>
            <li>You are responsible for device backups</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Limitations of Use</h2>
        <div className={styles.content}>
          <p>The following activities are prohibited:</p>
          <ul className={styles.bulletList}>
            <li>Redistributing books from the app</li>
            <li>Modifying or reverse engineering the app</li>
            <li>Using the app for commercial purposes</li>
            <li>Attempting to circumvent any app limitations</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Disclaimers</h2>
        <div className={styles.content}>
          <p>Please note that:</p>
          <ul className={styles.bulletList}>
            <li>Public domain texts are provided without warranty</li>
            <li>Reading progress depends on local device storage</li>
            <li>App performance may vary by device</li>
            <li>Features may change with updates</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Changes to Terms</h2>
        <div className={styles.content}>
          <p>We may update these terms to reflect:</p>
          <ul className={styles.bulletList}>
            <li>New app features and functionality</li>
            <li>Changes in our content library</li>
            <li>Updates to storage methods</li>
            <li>Legal or regulatory requirements</li>
          </ul>
          <p>Users will be notified of significant changes through the app.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact</h2>
        <div className={styles.content}>
          <p>For questions about these terms, contact:</p>
          <p>Email: ckb@tutortechy.com</p>
          <p>Response Time: Within 24 hours</p>
        </div>
      </div>
    </div>
  );
}