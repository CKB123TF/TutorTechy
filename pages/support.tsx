import styles from '@/styles/legal.module.css';

export default function Support() {
  return (
    <div className={styles.legalContainer}>
      <h1 className={styles.title}>Classics Support</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact Information</h2>
        <div className={styles.content}>
          <p>Email: ckb@tutortechy.com</p>
          <p>Response time: Within 48 hours</p>
          <p>We&apos;re here to help you get the most out of your reading experience with Classics.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.content}>
          <div className={styles.faqItem}>
            <h3>How do I download books for offline reading?</h3>
            <p>All books in Classics are available offline. Tap the download button next to any book in the library. Once downloaded, books are accessible anytime, even without an internet connection.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>How do I customize my reading experience?</h3>
            <p>IN PROGRESS: Tap the &quot;Aa&quot; button while reading to adjust display options including:</p>
            <ul className={styles.bulletList}>
              <li>Font size and family</li>
              <li>Theme choices (light, dark, sepia)</li>
              <li>Line spacing and margins</li>
              <li>Brightness control</li>
            </ul>
          </div>

          <div className={styles.faqItem}>
            <h3>How do I create and manage highlights?</h3>
            <p>To highlight text:</p>
            <ul className={styles.bulletList}>
              <li>Press and hold to select text</li>
              <li>Adjust the selection across pages as needed</li>
              <li>Tap &quot;Highlight&quot; in the popup menu</li>
              <li>Optionally add a note</li>
            </ul>
            <p>Access all highlights in the book&apos;s Annotations tab.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>How do I navigate through a book?</h3>
            <p>Classics offers multiple navigation options:</p>
            <ul className={styles.bulletList}>
              <li>Tap screen edges or swipe to turn pages</li>
              <li>Use the table of contents to jump to chapters</li>
            </ul>
          </div>

          <div className={styles.faqItem}>
            <h3>Will I lose my progress if I delete the app?</h3>
            <p>Since Classics is offline-only:</p>
            <ul className={styles.bulletList}>
              <li>Reading progress, highlights, and notes are stored locally</li>
              <li>Deleting the app removes all data</li>
              <li>Regular device backups are recommended</li>
            </ul>
          </div>

          <div className={styles.faqItem}>
            <h3>How much storage space do books use?</h3>
            <p>Book sizes vary but are typically small:</p>
            <ul className={styles.bulletList}>
              <li>Most books are under 1MB</li>
              <li>Delete downloaded books anytime to free up space</li>
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Bug Reporting</h2>
        <div className={styles.content}>
          <p>To report a bug, please email us with:</p>
          <ul className={styles.bulletList}>
            <li>iOS device model and version</li>
            <li>Classics app version</li>
            <li>Detailed description of the issue</li>
            <li>Steps to reproduce the problem</li>
            <li>Screenshots, if applicable</li>
            <li>Book title if the issue occurs while reading</li>
          </ul>
          <p>This helps us quickly identify and resolve issues.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Feature Requests</h2>
        <div className={styles.content}>
          <p>To suggest features, include:</p>
          <ul className={styles.bulletList}>
            <li>A clear description of the feature</li>
            <li>How it would improve your reading experience</li>
            <li>Any specific use cases</li>
          </ul>
          <p>Email suggestions to ckb@tutortechy.com with the subject &quot;Classics Feature Request&quot;.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Performance Tips</h2>
        <div className={styles.content}>
          <p>For the best reading experience:</p>
          <ul className={styles.bulletList}>
            <li>Keep iOS updated to the latest version</li>
            <li>Maintain adequate free storage space</li>
            <li>Download books on a stable connection</li>
            <li>Close other apps running in the background</li>
          </ul>
        </div>
      </div>
    </div>
  );
}