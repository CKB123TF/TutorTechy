import styles from '@/styles/legal.module.css';

export default function Support() {
  return (
    <div className={styles.legalContainer}>
      <h1 className={styles.title}>AlgernonIQ Support</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Contact Information</h2>
        <div className={styles.content}>
          <p>Email: ckb@tutortechy.com</p>
          <p>Response time: Within 24 hours</p>
          <p>We're here to help you with any questions about your cognitive training journey.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div className={styles.content}>
          <div className={styles.faqItem}>
            <h3>How is my ELO Score Calculated?</h3>
            <p>Your ELO score is calculated based on your performance across different pattern recognition categories. The score adjusts dynamically based on the difficulty of puzzles you solve and your success rate. Higher scores indicate stronger pattern recognition abilities.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>What Do the Radar Charts Show?</h3>
            <p>The radar charts in your statistics view display your performance across different cognitive categories. Each axis represents a different type of pattern recognition skill, helping you identify your strengths and areas for improvement.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>How Does the Difficulty Adjustment Work?</h3>
            <p>AlgernonIQ automatically adjusts puzzle difficulty based on your performance history and current streak. As you improve in specific pattern types, the app generates more challenging variations to help you grow.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>What Are Streaks?</h3>
            <p>Streaks track your consecutive correct answers. Maintaining streaks helps the app understand your mastery level and adjusts the difficulty accordingly. Your current streak is displayed during puzzle solving.</p>
          </div>

          <div className={styles.faqItem}>
            <h3>How Can I Track My Progress?</h3>
            <p>Access your detailed statistics by tapping the "View Stats" button. Here you'll find your:</p>
            <ul className={styles.bulletList}>
              <li>Overall ELO score</li>
              <li>Performance radar chart</li>
              <li>Top strengths</li>
              <li>Areas for improvement</li>
            </ul>
          </div>

          <div className={styles.faqItem}>
            <h3>Can I Use the App Offline?</h3>
            <p>Yes, AlgernonIQ works offline. Your progress syncs automatically when you're back online through our secure Supabase integration.</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Bug Reporting</h2>
        <div className={styles.content}>
          <p>To report a bug, please email us with the following information:</p>
          <ul className={styles.bulletList}>
            <li>Your iOS device model and iOS version</li>
            <li>AlgernonIQ app version</li>
            <li>Detailed description of the issue</li>
            <li>Steps to reproduce the problem</li>
            <li>Screenshots if applicable</li>
            <li>Your current ELO score and puzzle type when the issue occurred</li>
          </ul>
          <p>This information helps us quickly identify and resolve any issues.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Feature Requests</h2>
        <div className={styles.content}>
          <p>We're constantly improving AlgernonIQ. When submitting feature requests, please include:</p>
          <ul className={styles.bulletList}>
            <li>Clear description of the proposed feature</li>
            <li>How it would enhance your learning experience</li>
            <li>Any specific pattern types or cognitive areas it would address</li>
          </ul>
          <p>Email your suggestions to ckb@tutortechy.com with the subject "AlgernonIQ Feature Request".</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Data and Privacy Support</h2>
        <div className={styles.content}>
          <p>For questions about your data or privacy:</p>
          <ul className={styles.bulletList}>
            <li>Data export requests: Email with subject "Data Export Request"</li>
            <li>Account deletion: Use the in-app deletion feature or email us</li>
            <li>Privacy concerns: Contact us with subject "Privacy Inquiry"</li>
          </ul>
          <p>We typically process data-related requests within 48 hours.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Performance Issues</h2>
        <div className={styles.content}>
          <p>If you experience performance issues:</p>
          <ul className={styles.bulletList}>
            <li>Ensure your iOS is updated to the latest version</li>
            <li>Check your available device storage</li>
            <li>Try closing and reopening the app</li>
            <li>If issues persist, contact support with your device details</li>
          </ul>
        </div>
      </div>
    </div>
  );
}