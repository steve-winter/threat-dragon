import BitbucketEnv from '../env/Bitbucket.js';
import EncryptionEnv from '../env/Encryption.js';
import env from '../env/Env.js';
import GithubEnv from '../env/Github.js';
import ThreatDragonEnv from '../env/ThreatDragon.js';

const tryLoadDotEnv = () => {
    const github = new GithubEnv();
    const bitbucket = new BitbucketEnv();
    const encryption = new EncryptionEnv();
    const threatDragon = new ThreatDragonEnv();
    env.get().addProvider(github);
    env.get().addProvider(encryption);
    env.get().addProvider(bitbucket);
    env.get().addProvider(threatDragon);
    env.get().hydrate();
};

export default { tryLoadDotEnv };
