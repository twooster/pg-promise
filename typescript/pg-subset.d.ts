/*
 * Copyright (c) 2015-present, Vitaly Tomilov
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Removal or modification of this copyright notice is prohibited.
 */

//////////////////////////////////////////////////////////////////////////////
// Declaring only a subset of the 'pg' module that's useful within pg-promise.
//
// Calling it 'pg-subset' to avoid a conflict in case the application also
// includes the official 'pg' typings.
//
// Supported version of pg: 7.11.0 and later.
//
// pg: https://github.com/brianc/node-postgres
//////////////////////////////////////////////////////////////////////////////

import {EventEmitter} from 'events';
import {checkServerIdentity} from 'tls';

declare namespace pg {

    interface IColumn {
        name: string
        oid: number
        dataTypeID: number

        // NOTE: properties below are not available within Native Bindings:

        tableID: number
        columnID: number
        dataTypeSize: number
        dataTypeModifier: number
        format: string
    }

    interface IResult {
        command: string
        rowCount: number
        rows: any[]
        fields: IColumn[]

        // properties below are not available within Native Bindings:
        rowAsArray: boolean

        _types: {
            _types: any,
            text: any,
            binary: any
        };
        _parsers: Array<Function>;

    }

    // SSL configuration;
    // For property types and documentation see:
    // http://nodejs.org/api/tls.html#tls_tls_connect_options_callback
    type TSSLConfig = {
        ca?: string | Buffer | Array<string | Buffer>
        pfx?: string | Buffer | Array<string | Buffer | object>
        cert?: string | Buffer | Array<string | Buffer>
        key?: string | Buffer | Array<Buffer | object>
        passphrase?: string
        rejectUnauthorized?: boolean
        checkServerIdentity?: typeof checkServerIdentity
        secureOptions?: number
        NPNProtocols?: string[] | Buffer | Buffer[] | Uint8Array | Uint8Array[]
    }

    // See:
    // 1) https://github.com/brianc/node-postgres/blob/master/lib/defaults.js
    // 2) https://github.com/brianc/node-pg-pool
    type TConnectionParameters = {
        connectionString?: string
        host?: string
        database?: string
        user?: string
        password?: string
        port?: number
        ssl?: boolean | TSSLConfig
        binary?: boolean
        client_encoding?: string
        encoding?: string
        application_name?: string
        fallback_application_name?: string
        isDomainSocket?: boolean
        max?: number
        min?: number
        idleTimeoutMillis?: number
        parseInputDatesAsUTC?: boolean
        rows?: number
        statement_timeout?: boolean | number
        query_timeout?: boolean | number
        connect_timeout?: number
        keepAliveInitialDelayMillis?: number
        keepAlive?: boolean
        keepalives?: number
        keepalives_idle?: number
    }

    // Interface of 'pg-types' module;
    // See: https://github.com/brianc/node-pg-types
    interface ITypes {
        setTypeParser: (oid: number, format: string | ((value: string) => any)) => void
        getTypeParser: (oid: number, format?: string) => any
        arrayParser: (source: string, transform: (entry: any) => any) => any[]
    }

    interface IDefaults {

        // connection string for overriding defaults
        connectionString: string

        // database host. defaults to localhost
        host: string

        // database user's name
        user: string

        // name of database to connect
        database: string

        // database user's password
        password: string

        // database port
        port: number

        // number of rows to return at a time from a prepared statement's
        // portal. 0 will return all rows at once
        rows: number

        // binary result mode
        binary: boolean

        // Connection pool options - see https://github.com/brianc/node-pg-pool

        // number of connections to use in connection pool
        // 0 will disable connection pooling
        max: number,

        // max milliseconds a client can go unused before it is removed
        // from the pool and destroyed
        idleTimeoutMillis: number

        client_encoding: string

        ssl: boolean | TSSLConfig

        application_name: string

        fallback_application_name: string

        parseInputDatesAsUTC: boolean

        // max milliseconds any query using this connection will execute for before timing out in error.
        // false=unlimited
        statement_timeout: boolean | number

        // max milliseconds to wait for query to complete (client side)
        query_timeout: boolean | number

        connect_timeout: number

        keepalives: number

        keepalives_idle: number
    }

    class Connection {
        // not needed within pg-promise;
    }

    class Query {
        // not needed within pg-promise;
    }

    class Client extends EventEmitter {

        constructor(cn: string | TConnectionParameters)

        query: (config: any, values: any, callback: (err: Error, result: IResult) => void) => Query;

        on(event: 'drain', listener: () => void): this
        on(event: 'error', listener: (err: Error) => void): this
        on(event: 'notification', listener: (message: any) => void): this
        on(event: 'notice', listener: (message: any) => void): this
        on(event: string, listener: Function): this

        connectionParameters: TConnectionParameters;
        database: string;
        user: string;
        password: string;
        port: number;
        host: string;

        // properties below are not available within Native Bindings:

        queryQueue: Query[];
        binary: boolean;
        ssl: boolean | TSSLConfig;
        secretKey: number;
        processID: number;
        encoding: string;
        readyForQuery: boolean;
        activeQuery: Query;
    }

    const defaults: IDefaults;
    const types: ITypes;
}

export = pg;
