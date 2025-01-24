import styles from '@/styles/legal.module.css';

export default function TermsOfService() {
  return (
    <div className={styles.legalContainer}>
      <h1 className={styles.title}>Terms of Service</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Acceptance of Terms</h2>
        <div className={styles.content}>
          <p>By downloading, installing, or using AlgernonIQ, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our application.</p>
          <p>Last Updated: March 2024</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Service Description</h2>
        <div className={styles.content}>
          <p>AlgernonIQ is an iOS application designed to enhance cognitive abilities through:</p>
          <ul className={styles.bulletList}>
            <li>Pattern recognition puzzles with adaptive difficulty</li>
            <li>Performance tracking using ELO scoring system</li>
            <li>Statistical analysis of cognitive strengths and areas for improvement</li>
            <li>Personalized learning paths based on user performance</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>User Responsibilities</h2>
        <div className={styles.content}>
          <p>As an AlgernonIQ user, you agree to:</p>
          <ul className={styles.bulletList}>
            <li>Provide accurate information for performance tracking</li>
            <li>Not attempt to manipulate or artificially inflate scores</li>
            <li>Not reverse engineer the puzzle generation algorithms</li>
            <li>Not share or distribute puzzle solutions</li>
            <li>Maintain the security of your account and progress data</li>
            <li>Use the app for its intended purpose of cognitive improvement</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Intellectual Property</h2>
        <div className={styles.content}>
          <p>The following components are protected by intellectual property rights:</p>
          <ul className={styles.bulletList}>
            <li>Pattern recognition algorithms and puzzle generation systems</li>
            <li>Performance tracking and ELO calculation methodologies</li>
            <li>Visual design elements and user interface</li>
            <li>Statistical analysis and radar chart implementations</li>
            <li>All app content, including puzzle designs and explanations</li>
          </ul>
          <p>Users retain rights to their personal performance data and statistics.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Data Usage and Storage</h2>
        <div className={styles.content}>
          <p>By using AlgernonIQ, you agree that we may:</p>
          <ul className={styles.bulletList}>
            <li>Store your performance data locally and in our Supabase database</li>
            <li>Use your anonymized performance patterns to improve puzzle generation</li>
            <li>Track your progress across different cognitive categories</li>
            <li>Maintain streak and achievement records</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Performance Metrics</h2>
        <div className={styles.content}>
          <p>You acknowledge that:</p>
          <ul className={styles.bulletList}>
            <li>ELO scores are calculated based on objective performance metrics</li>
            <li>Difficulty adjustments are automated based on your performance</li>
            <li>Statistics and radar charts reflect actual performance data</li>
            <li>Streaks and achievements are awarded based on verified completion</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Limitations of Use</h2>
        <div className={styles.content}>
          <p>The following activities are prohibited:</p>
          <ul className={styles.bulletList}>
            <li>Automated solving of puzzles</li>
            <li>Manipulation of performance data</li>
            <li>Unauthorized access to puzzle generation systems</li>
            <li>Distribution of copyrighted puzzle content</li>
            <li>Interference with other users' experience</li>
          </ul>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Termination</h2>
        <div className={styles.content}>
          <p>We reserve the right to terminate or suspend access to AlgernonIQ if you:</p>
          <ul className={styles.bulletList}>
            <li>Violate these Terms of Service</li>
            <li>Manipulate performance metrics</li>
            <li>Engage in prohibited activities</li>
            <li>Misuse the application's features</li>
          </ul>
          <p>Users may delete their account and data at any time through the app settings.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Disclaimers</h2>
        <div className={styles.content}>
          <p>AlgernonIQ provides:</p>
          <ul className={styles.bulletList}>
            <li>Pattern recognition training, not medical or diagnostic services</li>
            <li>Performance tracking for personal improvement purposes</li>
            <li>Educational content without therapeutic claims</li>
            <li>Automated difficulty adjustment based on performance algorithms</li>
          </ul>
          <p>Results and improvement rates may vary by individual.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Changes to Terms</h2>
        <div className={styles.content}>
          <p>We may update these terms to reflect:</p>
          <ul className={styles.bulletList}>
            <li>New app features and functionality</li>
            <li>Changes in puzzle generation systems</li>
            <li>Updates to scoring mechanisms</li>
            <li>Modifications to data storage practices</li>
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