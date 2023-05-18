import { DBConfigArgs, getEnvDBConfig } from './config';

describe('getEnvDBConfig', () => {
  const env = {
    ...process.env,
  };

  beforeEach(() => {
    // Default PG
    process.env.PGHOST = 'pg_host';
    process.env.PGUSER = 'pg_user';
    process.env.PGPASSWORD = 'pg_password';
    process.env.PGDATABASE = 'pg_db_name';
    process.env.PGPORT = '1111';
    process.env.PGURI = 'pg_uri';

    // Custom
    process.env.URI_ENV = 'host_from_env';
    process.env.HOST_ENV = 'host_from_env';
    process.env.USER_ENV = 'user_from_env';
    process.env.PASSWORD_ENV = 'password_from_env';
    process.env.DB_NAME_ENV = 'db_name_from_env';
    process.env.PORT_ENV = '2222';
    process.env.URI_ENV = 'uri_from_env';
  });

  afterEach(() => {
    process.env = env;
  });

  test('Parses template ENV', () => {
    const dbConfig: Partial<DBConfigArgs> = {
      host: '{{HOST_ENV}}',
      user: '{{USER_ENV}}',
      password: '{{PASSWORD_ENV}}',
      dbName: '{{DB_NAME_ENV}}',
      port: '{{PORT_ENV}}',
      uri: '{{URI_ENV}}',
    };
    const parsedConfig = getEnvDBConfig(dbConfig);

    expect(parsedConfig).toEqual({
      host: 'host_from_env',
      user: 'user_from_env',
      password: 'password_from_env',
      dbName: 'db_name_from_env',
      port: 2222,
      uri: 'uri_from_env',
    });
  });

  test('Parses default ENV', () => {
    const dbConfig: Partial<DBConfigArgs> = {};
    const parsedConfig = getEnvDBConfig(dbConfig);

    expect(parsedConfig).toEqual({
      host: 'pg_host',
      user: 'pg_user',
      password: 'pg_password',
      dbName: 'pg_db_name',
      port: 1111,
      uri: 'pg_uri',
    });
  });

  test('Parses default ENV with invalid templates', () => {
    // All invalid templates
    const dbConfig: Partial<DBConfigArgs> = {
      host: '{{{HOST_ENV}}',
      user: '{{USER_ENV}}}',
      password: 'invalid',
      dbName: '',
      port: '1234',
      uri: '_',
    };
    const parsedConfig = getEnvDBConfig(dbConfig);

    expect(parsedConfig).toEqual({
      host: undefined,
      user: undefined,
      password: 'pg_password',
      dbName: 'pg_db_name',
      port: 1111,
      uri: 'pg_uri',
    });
  });
});
