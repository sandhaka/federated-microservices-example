import fs from 'fs';

export class Certs {
    static get PublicKey() {
        if (fs.existsSync('/run/secrets/auth_server_cert')) {
            return fs.readFileSync('/run/secrets/auth_server_cert', 'utf8');
        } else {
            return fs.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');
        }
    }
}