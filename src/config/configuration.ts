import { AppConfig } from './configuration.interface';

const env = process.env.NODE_ENV || 'development';

const configs = {
    development: () => require('./configuration.development').default(),
    production: () => require('./configuration.production').default(),
    test: () => require('./configuration.test').default(),
};

export default (): AppConfig => {
    const config = configs[env] || configs.development;
    return config();
};
