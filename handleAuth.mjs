import jwt from "jsonwebtoken";
import {Certs} from "./certs.mjs";

export class HandleAuth {
    #PUBLIC_ACTIONS = [
        // TODO: named api public here
    ];

    #pubKey = "";
    get #publicKey() {
        if (this.#pubKey === "") {
            this.#pubKey = Certs.PublicKey;
        }
        return this.#pubKey;
    }

    #actionIsPublic = ({ query }) => (
        this.#PUBLIC_ACTIONS.some(action => query.includes(action))
    )
    #isIntrospectionQuery = ({ operationName }) => (
        operationName === 'IntrospectionQuery'
    )
    #shouldAuthenticate = body => (
        !this.#isIntrospectionQuery(body) && !this.#actionIsPublic(body)
    )

    handle = ({ req }) => {
        return { payload: "OK" }; // TODO should pass a valid token to authenticate
        if (this.#shouldAuthenticate(req.body)) {
            const decoded = jwt.verify(req.headers.token, this.#publicKey, { algorithm: "RS256" });
            return { payload: decoded.payload }
        }
    }
}