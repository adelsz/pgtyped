import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>Typesafety</>,
    imageUrl: 'img/typesafety.svg',
    description: (
      <>
        Pgtyped generates TS types for parameters and results of SQL queries of
        any complexity.
      </>
    ),
  },
  {
    title: <>Parse SQL and TS files</>,
    imageUrl: 'img/multifile.svg',
    description: (
      <>
        Queries can be written in SQL files together with useful parameter
        annotations. In Typescript files, queries can be defined using a{' '}
        <code>sql</code> template string literal.
      </>
    ),
  },
  {
    title: <>Prevent SQL injections</>,
    imageUrl: 'img/integrity.svg',
    description: (
      <>
        PgTyped prevents SQL injections by separately sending queries and
        parameters to the DB for execution. This allows parameter substitution
        to be safely done by the PostgreSQL server
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`PgTyped - Typesafe SQL in Typescript`}
      description="Typesafe SQL in Typescript"
    >
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
