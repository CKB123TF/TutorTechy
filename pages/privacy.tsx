import styles from '@/styles/legal.module.css';

export default function PrivacyPolicy() {
  return (
    <div className={styles.legalContainer}>
      <h1 className={styles.title}>Privacy Policy</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Introduction</h2>
        <div className={styles.content}>
          <p>Last Updated: January 2025</p>
          <p>Contact: ckb@tutortechy.com</p>
          <p>This privacy policy explains how AlgernonIQ, an iOS application designed to enhance cognitive abilities through pattern recognition puzzles, collects and uses your information to provide a personalized learning experience.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Information We Collect</h2>
        <div className={styles.content}>
          <h3>Performance Data</h3>
          <ul className={styles.bulletList}>
            <li>Question response patterns and completion times</li>
            <li>Correct and incorrect answers for pattern recognition puzzles</li>
            <li>Your ELO score and performance metrics across different categories</li>
            <li>Streak data and achievement progress</li>
          </ul>

          <h3>Usage Data</h3>
          <ul className={styles.bulletList}>
            <li>Pattern recognition preferences and difficulty levels</li>
            <li>Question types you excel at or need improvement in</li>
            <li>Time spent on different types of puzzles</li>
          </ul>

          <h3>Local Storage</h3>
          <ul className={styles.bulletList}>
            <li>App preferences and settings using NSUserDefaults</li>
            <li>Your current progress and statistics</li>
            <li>Cached puzzle data for offline use</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>How We Use Your Data</h2>
        <div className={styles.content}>
          <h3>Performance Optimization</h3>
          <ul className={styles.bulletList}>
            <li>Calculate and track your ELO score across different cognitive categories</li>
            <li>Generate personalized radar charts showing your strengths and areas for improvement</li>
            <li>Maintain accurate streak counts and achievement tracking</li>
          </ul>

          <h3>Puzzle Generation</h3>
          <ul className={styles.bulletList}>
            <li>Customize puzzle difficulty based on your performance history</li>
            <li>Generate targeted practice exercises for areas needing improvement</li>
            <li>Optimize the learning curve based on your progress</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Storage and Security</h2>
        <div className={styles.content}>
          <p>Your data is primarily stored:</p>
          <ul className={styles.bulletList}>
            <li>Locally on your device using secure iOS storage mechanisms</li>
            <li>In our Supabase database for cross-device synchronization</li>
            <li>With encryption for sensitive data transmission</li>
          </ul>
          <p>We use industry-standard security measures to protect your data, including:</p>
          <ul className={styles.bulletList}>
            <li>Secure HTTPS connections for all data transfers</li>
            <li>Encrypted storage for sensitive information</li>
            <li>Regular security audits and updates</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Rights and Controls</h2>
        <div className={styles.content}>
          <p>You have the right to:</p>
          <ul className={styles.bulletList}>
            <li>View your performance data and statistics at any time through the app</li>
            <li>Delete your account and associated data</li>
            <li>Export your performance history</li>
            <li>Opt out of optional data collection features</li>
          </ul>
          <p>To exercise these rights, you can:</p>
          <ul className={styles.bulletList}>
            <li>Use the in-app settings menu</li>
            <li>Contact us at ckb@tutortechy.com</li>
            <li>Submit a data deletion request through the app</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Updates to This Policy</h2>
        <div className={styles.content}>
          <p>We may update this privacy policy to reflect changes in our data practices or legal requirements. We will notify you of any material changes through the app or via email.</p>
          <p>For questions about this privacy policy or our data practices, please contact us at ckb@tutortechy.com.</p>
        </div>
      </div>
    </div>
  );
}