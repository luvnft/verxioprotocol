/**
 * Client
 **/

import * as runtime from './runtime/library.js'
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>

/**
 * Model LoyaltyProgram
 *
 */
export type LoyaltyProgram = $Result.DefaultSelection<Prisma.$LoyaltyProgramPayload>
/**
 * Model LoyaltyPass
 *
 */
export type LoyaltyPass = $Result.DefaultSelection<Prisma.$LoyaltyPassPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more LoyaltyPrograms
 * const loyaltyPrograms = await prisma.loyaltyProgram.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions
    ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<ClientOptions['log']>
      : never
    : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

  /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more LoyaltyPrograms
   * const loyaltyPrograms = await prisma.loyaltyProgram.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>)
  $on<V extends U>(
    eventType: V,
    callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void,
  ): PrismaClient

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

  /**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(
    arg: [...P],
    options?: { isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(
    fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>,
    options?: { maxWait?: number; timeout?: number; isolationLevel?: Prisma.TransactionIsolationLevel },
  ): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<
    'extends',
    Prisma.TypeMapCb<ClientOptions>,
    ExtArgs,
    $Utils.Call<
      Prisma.TypeMapCb<ClientOptions>,
      {
        extArgs: ExtArgs
      }
    >
  >

  /**
   * `prisma.loyaltyProgram`: Exposes CRUD operations for the **LoyaltyProgram** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more LoyaltyPrograms
   * const loyaltyPrograms = await prisma.loyaltyProgram.findMany()
   * ```
   */
  get loyaltyProgram(): Prisma.LoyaltyProgramDelegate<ExtArgs, ClientOptions>

  /**
   * `prisma.loyaltyPass`: Exposes CRUD operations for the **LoyaltyPass** model.
   * Example usage:
   * ```ts
   * // Fetch zero or more LoyaltyPasses
   * const loyaltyPasses = await prisma.loyaltyPass.findMany()
   * ```
   */
  get loyaltyPass(): Prisma.LoyaltyPassDelegate<ExtArgs, ClientOptions>
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
   * Extensions
   */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */

  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
     * Type of `Prisma.DbNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
     * Type of `Prisma.JsonNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
     * Type of `Prisma.AnyNull`.
     *
     * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
     *
     * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
     */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P]
  }

  export type Enumerable<T> = T | Array<T>

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  }

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } & (T extends SelectAndInclude
    ? 'Please either choose `select` or `include`.'
    : T extends SelectAndOmit
      ? 'Please either choose `select` or `omit`.'
      : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } & K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> = T extends object ? (U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U) : T

  /**
   * Is T a Record?
   */
  type IsObject<T extends any> =
    T extends Array<any>
      ? False
      : T extends Date
        ? False
        : T extends Uint8Array
          ? False
          : T extends BigInt
            ? False
            : T extends object
              ? True
              : False

  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown
    ? _Either<O, K, strict>
    : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K]
  } & {}

  type _Merge<U extends object> = IntersectOf<
    Overwrite<
      U,
      {
        [K in keyof U]-?: At<U, K>
      }
    >
  >

  type Key = string | number | symbol
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never
  type AtStrict<O extends object, K extends Key> = O[K & keyof O]
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>
    0: AtLoose<O, K>
  }[strict]

  export type ComputeRaw<A extends any> = A extends Function
    ? A
    : {
        [K in keyof A]: A[K]
      } & {}

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K]
  } & {}

  type _Record<K extends keyof any, T> = {
    [P in K]: T
  }

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
      ? (K extends keyof O ? { [P in K]: O[P] } & O : O) | ({ [P in keyof O as P extends K ? P : never]-?: O[P] } & O)
      : never
  >

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
      ? 1
      : 0

  export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B

  export const type: unique symbol

  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object
    ? {
        [P in keyof T]: P extends keyof O ? O[P] : never
      }
    : never

  type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
        ? never
        : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T

  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>

  export const ModelName: {
    LoyaltyProgram: 'LoyaltyProgram'
    LoyaltyPass: 'LoyaltyPass'
  }

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]

  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}>
    extends $Utils.Fn<{ extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<
      this['params']['extArgs'],
      ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}
    >
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: 'loyaltyProgram' | 'loyaltyPass'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      LoyaltyProgram: {
        payload: Prisma.$LoyaltyProgramPayload<ExtArgs>
        fields: Prisma.LoyaltyProgramFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoyaltyProgramFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoyaltyProgramFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload>
          }
          findFirst: {
            args: Prisma.LoyaltyProgramFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoyaltyProgramFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload>
          }
          findMany: {
            args: Prisma.LoyaltyProgramFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload>[]
          }
          create: {
            args: Prisma.LoyaltyProgramCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload>
          }
          createMany: {
            args: Prisma.LoyaltyProgramCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoyaltyProgramCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload>[]
          }
          delete: {
            args: Prisma.LoyaltyProgramDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload>
          }
          update: {
            args: Prisma.LoyaltyProgramUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload>
          }
          deleteMany: {
            args: Prisma.LoyaltyProgramDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoyaltyProgramUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoyaltyProgramUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload>[]
          }
          upsert: {
            args: Prisma.LoyaltyProgramUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyProgramPayload>
          }
          aggregate: {
            args: Prisma.LoyaltyProgramAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoyaltyProgram>
          }
          groupBy: {
            args: Prisma.LoyaltyProgramGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoyaltyProgramGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoyaltyProgramCountArgs<ExtArgs>
            result: $Utils.Optional<LoyaltyProgramCountAggregateOutputType> | number
          }
        }
      }
      LoyaltyPass: {
        payload: Prisma.$LoyaltyPassPayload<ExtArgs>
        fields: Prisma.LoyaltyPassFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoyaltyPassFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoyaltyPassFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload>
          }
          findFirst: {
            args: Prisma.LoyaltyPassFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoyaltyPassFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload>
          }
          findMany: {
            args: Prisma.LoyaltyPassFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload>[]
          }
          create: {
            args: Prisma.LoyaltyPassCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload>
          }
          createMany: {
            args: Prisma.LoyaltyPassCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoyaltyPassCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload>[]
          }
          delete: {
            args: Prisma.LoyaltyPassDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload>
          }
          update: {
            args: Prisma.LoyaltyPassUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload>
          }
          deleteMany: {
            args: Prisma.LoyaltyPassDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoyaltyPassUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoyaltyPassUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload>[]
          }
          upsert: {
            args: Prisma.LoyaltyPassUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoyaltyPassPayload>
          }
          aggregate: {
            args: Prisma.LoyaltyPassAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoyaltyPass>
          }
          groupBy: {
            args: Prisma.LoyaltyPassGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoyaltyPassGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoyaltyPassCountArgs<ExtArgs>
            result: $Utils.Optional<LoyaltyPassCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]]
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]]
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]]
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]]
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     *
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    loyaltyProgram?: LoyaltyProgramOmit
    loyaltyPass?: LoyaltyPassOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition
    ? T['emit'] extends 'event'
      ? T['level']
      : never
    : never
  export type GetEvents<T extends any> =
    T extends Array<LogLevel | LogDefinition>
      ? GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
      : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */

  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */

  /**
   * Models
   */

  /**
   * Model LoyaltyProgram
   */

  export type AggregateLoyaltyProgram = {
    _count: LoyaltyProgramCountAggregateOutputType | null
    _min: LoyaltyProgramMinAggregateOutputType | null
    _max: LoyaltyProgramMaxAggregateOutputType | null
  }

  export type LoyaltyProgramMinAggregateOutputType = {
    id: string | null
    creator: string | null
    publicKey: string | null
    privateKey: string | null
    signature: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoyaltyProgramMaxAggregateOutputType = {
    id: string | null
    creator: string | null
    publicKey: string | null
    privateKey: string | null
    signature: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoyaltyProgramCountAggregateOutputType = {
    id: number
    creator: number
    publicKey: number
    privateKey: number
    signature: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type LoyaltyProgramMinAggregateInputType = {
    id?: true
    creator?: true
    publicKey?: true
    privateKey?: true
    signature?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoyaltyProgramMaxAggregateInputType = {
    id?: true
    creator?: true
    publicKey?: true
    privateKey?: true
    signature?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoyaltyProgramCountAggregateInputType = {
    id?: true
    creator?: true
    publicKey?: true
    privateKey?: true
    signature?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LoyaltyProgramAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoyaltyProgram to aggregate.
     */
    where?: LoyaltyProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyPrograms to fetch.
     */
    orderBy?: LoyaltyProgramOrderByWithRelationInput | LoyaltyProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: LoyaltyProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyPrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyPrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned LoyaltyPrograms
     **/
    _count?: true | LoyaltyProgramCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: LoyaltyProgramMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: LoyaltyProgramMaxAggregateInputType
  }

  export type GetLoyaltyProgramAggregateType<T extends LoyaltyProgramAggregateArgs> = {
    [P in keyof T & keyof AggregateLoyaltyProgram]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoyaltyProgram[P]>
      : GetScalarType<T[P], AggregateLoyaltyProgram[P]>
  }

  export type LoyaltyProgramGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoyaltyProgramWhereInput
    orderBy?: LoyaltyProgramOrderByWithAggregationInput | LoyaltyProgramOrderByWithAggregationInput[]
    by: LoyaltyProgramScalarFieldEnum[] | LoyaltyProgramScalarFieldEnum
    having?: LoyaltyProgramScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoyaltyProgramCountAggregateInputType | true
    _min?: LoyaltyProgramMinAggregateInputType
    _max?: LoyaltyProgramMaxAggregateInputType
  }

  export type LoyaltyProgramGroupByOutputType = {
    id: string
    creator: string
    publicKey: string
    privateKey: string
    signature: string
    createdAt: Date
    updatedAt: Date
    _count: LoyaltyProgramCountAggregateOutputType | null
    _min: LoyaltyProgramMinAggregateOutputType | null
    _max: LoyaltyProgramMaxAggregateOutputType | null
  }

  type GetLoyaltyProgramGroupByPayload<T extends LoyaltyProgramGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoyaltyProgramGroupByOutputType, T['by']> & {
        [P in keyof T & keyof LoyaltyProgramGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], LoyaltyProgramGroupByOutputType[P]>
          : GetScalarType<T[P], LoyaltyProgramGroupByOutputType[P]>
      }
    >
  >

  export type LoyaltyProgramSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        creator?: boolean
        publicKey?: boolean
        privateKey?: boolean
        signature?: boolean
        createdAt?: boolean
        updatedAt?: boolean
      },
      ExtArgs['result']['loyaltyProgram']
    >

  export type LoyaltyProgramSelectCreateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      creator?: boolean
      publicKey?: boolean
      privateKey?: boolean
      signature?: boolean
      createdAt?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['loyaltyProgram']
  >

  export type LoyaltyProgramSelectUpdateManyAndReturn<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = $Extensions.GetSelect<
    {
      id?: boolean
      creator?: boolean
      publicKey?: boolean
      privateKey?: boolean
      signature?: boolean
      createdAt?: boolean
      updatedAt?: boolean
    },
    ExtArgs['result']['loyaltyProgram']
  >

  export type LoyaltyProgramSelectScalar = {
    id?: boolean
    creator?: boolean
    publicKey?: boolean
    privateKey?: boolean
    signature?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LoyaltyProgramOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetOmit<
      'id' | 'creator' | 'publicKey' | 'privateKey' | 'signature' | 'createdAt' | 'updatedAt',
      ExtArgs['result']['loyaltyProgram']
    >

  export type $LoyaltyProgramPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'LoyaltyProgram'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        creator: string
        publicKey: string
        /**
         * @encrypted
         */
        privateKey: string
        signature: string
        createdAt: Date
        updatedAt: Date
      },
      ExtArgs['result']['loyaltyProgram']
    >
    composites: {}
  }

  type LoyaltyProgramGetPayload<S extends boolean | null | undefined | LoyaltyProgramDefaultArgs> = $Result.GetResult<
    Prisma.$LoyaltyProgramPayload,
    S
  >

  type LoyaltyProgramCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    LoyaltyProgramFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: LoyaltyProgramCountAggregateInputType | true
  }

  export interface LoyaltyProgramDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoyaltyProgram']; meta: { name: 'LoyaltyProgram' } }
    /**
     * Find zero or one LoyaltyProgram that matches the filter.
     * @param {LoyaltyProgramFindUniqueArgs} args - Arguments to find a LoyaltyProgram
     * @example
     * // Get one LoyaltyProgram
     * const loyaltyProgram = await prisma.loyaltyProgram.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoyaltyProgramFindUniqueArgs>(
      args: SelectSubset<T, LoyaltyProgramFindUniqueArgs<ExtArgs>>,
    ): Prisma__LoyaltyProgramClient<
      $Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one LoyaltyProgram that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoyaltyProgramFindUniqueOrThrowArgs} args - Arguments to find a LoyaltyProgram
     * @example
     * // Get one LoyaltyProgram
     * const loyaltyProgram = await prisma.loyaltyProgram.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoyaltyProgramFindUniqueOrThrowArgs>(
      args: SelectSubset<T, LoyaltyProgramFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__LoyaltyProgramClient<
      $Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first LoyaltyProgram that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyProgramFindFirstArgs} args - Arguments to find a LoyaltyProgram
     * @example
     * // Get one LoyaltyProgram
     * const loyaltyProgram = await prisma.loyaltyProgram.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoyaltyProgramFindFirstArgs>(
      args?: SelectSubset<T, LoyaltyProgramFindFirstArgs<ExtArgs>>,
    ): Prisma__LoyaltyProgramClient<
      $Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first LoyaltyProgram that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyProgramFindFirstOrThrowArgs} args - Arguments to find a LoyaltyProgram
     * @example
     * // Get one LoyaltyProgram
     * const loyaltyProgram = await prisma.loyaltyProgram.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoyaltyProgramFindFirstOrThrowArgs>(
      args?: SelectSubset<T, LoyaltyProgramFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__LoyaltyProgramClient<
      $Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more LoyaltyPrograms that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyProgramFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoyaltyPrograms
     * const loyaltyPrograms = await prisma.loyaltyProgram.findMany()
     *
     * // Get first 10 LoyaltyPrograms
     * const loyaltyPrograms = await prisma.loyaltyProgram.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const loyaltyProgramWithIdOnly = await prisma.loyaltyProgram.findMany({ select: { id: true } })
     *
     */
    findMany<T extends LoyaltyProgramFindManyArgs>(
      args?: SelectSubset<T, LoyaltyProgramFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a LoyaltyProgram.
     * @param {LoyaltyProgramCreateArgs} args - Arguments to create a LoyaltyProgram.
     * @example
     * // Create one LoyaltyProgram
     * const LoyaltyProgram = await prisma.loyaltyProgram.create({
     *   data: {
     *     // ... data to create a LoyaltyProgram
     *   }
     * })
     *
     */
    create<T extends LoyaltyProgramCreateArgs>(
      args: SelectSubset<T, LoyaltyProgramCreateArgs<ExtArgs>>,
    ): Prisma__LoyaltyProgramClient<
      $Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many LoyaltyPrograms.
     * @param {LoyaltyProgramCreateManyArgs} args - Arguments to create many LoyaltyPrograms.
     * @example
     * // Create many LoyaltyPrograms
     * const loyaltyProgram = await prisma.loyaltyProgram.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends LoyaltyProgramCreateManyArgs>(
      args?: SelectSubset<T, LoyaltyProgramCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoyaltyPrograms and returns the data saved in the database.
     * @param {LoyaltyProgramCreateManyAndReturnArgs} args - Arguments to create many LoyaltyPrograms.
     * @example
     * // Create many LoyaltyPrograms
     * const loyaltyProgram = await prisma.loyaltyProgram.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many LoyaltyPrograms and only return the `id`
     * const loyaltyProgramWithIdOnly = await prisma.loyaltyProgram.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends LoyaltyProgramCreateManyAndReturnArgs>(
      args?: SelectSubset<T, LoyaltyProgramCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Delete a LoyaltyProgram.
     * @param {LoyaltyProgramDeleteArgs} args - Arguments to delete one LoyaltyProgram.
     * @example
     * // Delete one LoyaltyProgram
     * const LoyaltyProgram = await prisma.loyaltyProgram.delete({
     *   where: {
     *     // ... filter to delete one LoyaltyProgram
     *   }
     * })
     *
     */
    delete<T extends LoyaltyProgramDeleteArgs>(
      args: SelectSubset<T, LoyaltyProgramDeleteArgs<ExtArgs>>,
    ): Prisma__LoyaltyProgramClient<
      $Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one LoyaltyProgram.
     * @param {LoyaltyProgramUpdateArgs} args - Arguments to update one LoyaltyProgram.
     * @example
     * // Update one LoyaltyProgram
     * const loyaltyProgram = await prisma.loyaltyProgram.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends LoyaltyProgramUpdateArgs>(
      args: SelectSubset<T, LoyaltyProgramUpdateArgs<ExtArgs>>,
    ): Prisma__LoyaltyProgramClient<
      $Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more LoyaltyPrograms.
     * @param {LoyaltyProgramDeleteManyArgs} args - Arguments to filter LoyaltyPrograms to delete.
     * @example
     * // Delete a few LoyaltyPrograms
     * const { count } = await prisma.loyaltyProgram.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends LoyaltyProgramDeleteManyArgs>(
      args?: SelectSubset<T, LoyaltyProgramDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoyaltyPrograms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyProgramUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoyaltyPrograms
     * const loyaltyProgram = await prisma.loyaltyProgram.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends LoyaltyProgramUpdateManyArgs>(
      args: SelectSubset<T, LoyaltyProgramUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoyaltyPrograms and returns the data updated in the database.
     * @param {LoyaltyProgramUpdateManyAndReturnArgs} args - Arguments to update many LoyaltyPrograms.
     * @example
     * // Update many LoyaltyPrograms
     * const loyaltyProgram = await prisma.loyaltyProgram.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more LoyaltyPrograms and only return the `id`
     * const loyaltyProgramWithIdOnly = await prisma.loyaltyProgram.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends LoyaltyProgramUpdateManyAndReturnArgs>(
      args: SelectSubset<T, LoyaltyProgramUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Create or update one LoyaltyProgram.
     * @param {LoyaltyProgramUpsertArgs} args - Arguments to update or create a LoyaltyProgram.
     * @example
     * // Update or create a LoyaltyProgram
     * const loyaltyProgram = await prisma.loyaltyProgram.upsert({
     *   create: {
     *     // ... data to create a LoyaltyProgram
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoyaltyProgram we want to update
     *   }
     * })
     */
    upsert<T extends LoyaltyProgramUpsertArgs>(
      args: SelectSubset<T, LoyaltyProgramUpsertArgs<ExtArgs>>,
    ): Prisma__LoyaltyProgramClient<
      $Result.GetResult<Prisma.$LoyaltyProgramPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of LoyaltyPrograms.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyProgramCountArgs} args - Arguments to filter LoyaltyPrograms to count.
     * @example
     * // Count the number of LoyaltyPrograms
     * const count = await prisma.loyaltyProgram.count({
     *   where: {
     *     // ... the filter for the LoyaltyPrograms we want to count
     *   }
     * })
     **/
    count<T extends LoyaltyProgramCountArgs>(
      args?: Subset<T, LoyaltyProgramCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoyaltyProgramCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoyaltyProgram.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyProgramAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends LoyaltyProgramAggregateArgs>(
      args: Subset<T, LoyaltyProgramAggregateArgs>,
    ): Prisma.PrismaPromise<GetLoyaltyProgramAggregateType<T>>

    /**
     * Group by LoyaltyProgram.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyProgramGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends LoyaltyProgramGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoyaltyProgramGroupByArgs['orderBy'] }
        : { orderBy?: LoyaltyProgramGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, LoyaltyProgramGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetLoyaltyProgramGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the LoyaltyProgram model
     */
    readonly fields: LoyaltyProgramFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoyaltyProgram.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoyaltyProgramClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the LoyaltyProgram model
   */
  interface LoyaltyProgramFieldRefs {
    readonly id: FieldRef<'LoyaltyProgram', 'String'>
    readonly creator: FieldRef<'LoyaltyProgram', 'String'>
    readonly publicKey: FieldRef<'LoyaltyProgram', 'String'>
    readonly privateKey: FieldRef<'LoyaltyProgram', 'String'>
    readonly signature: FieldRef<'LoyaltyProgram', 'String'>
    readonly createdAt: FieldRef<'LoyaltyProgram', 'DateTime'>
    readonly updatedAt: FieldRef<'LoyaltyProgram', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * LoyaltyProgram findUnique
   */
  export type LoyaltyProgramFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
    /**
     * Filter, which LoyaltyProgram to fetch.
     */
    where: LoyaltyProgramWhereUniqueInput
  }

  /**
   * LoyaltyProgram findUniqueOrThrow
   */
  export type LoyaltyProgramFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    {
      /**
       * Select specific fields to fetch from the LoyaltyProgram
       */
      select?: LoyaltyProgramSelect<ExtArgs> | null
      /**
       * Omit specific fields from the LoyaltyProgram
       */
      omit?: LoyaltyProgramOmit<ExtArgs> | null
      /**
       * Filter, which LoyaltyProgram to fetch.
       */
      where: LoyaltyProgramWhereUniqueInput
    }

  /**
   * LoyaltyProgram findFirst
   */
  export type LoyaltyProgramFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
    /**
     * Filter, which LoyaltyProgram to fetch.
     */
    where?: LoyaltyProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyPrograms to fetch.
     */
    orderBy?: LoyaltyProgramOrderByWithRelationInput | LoyaltyProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for LoyaltyPrograms.
     */
    cursor?: LoyaltyProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyPrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyPrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LoyaltyPrograms.
     */
    distinct?: LoyaltyProgramScalarFieldEnum | LoyaltyProgramScalarFieldEnum[]
  }

  /**
   * LoyaltyProgram findFirstOrThrow
   */
  export type LoyaltyProgramFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
    /**
     * Filter, which LoyaltyProgram to fetch.
     */
    where?: LoyaltyProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyPrograms to fetch.
     */
    orderBy?: LoyaltyProgramOrderByWithRelationInput | LoyaltyProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for LoyaltyPrograms.
     */
    cursor?: LoyaltyProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyPrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyPrograms.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LoyaltyPrograms.
     */
    distinct?: LoyaltyProgramScalarFieldEnum | LoyaltyProgramScalarFieldEnum[]
  }

  /**
   * LoyaltyProgram findMany
   */
  export type LoyaltyProgramFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
    /**
     * Filter, which LoyaltyPrograms to fetch.
     */
    where?: LoyaltyProgramWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyPrograms to fetch.
     */
    orderBy?: LoyaltyProgramOrderByWithRelationInput | LoyaltyProgramOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing LoyaltyPrograms.
     */
    cursor?: LoyaltyProgramWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyPrograms from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyPrograms.
     */
    skip?: number
    distinct?: LoyaltyProgramScalarFieldEnum | LoyaltyProgramScalarFieldEnum[]
  }

  /**
   * LoyaltyProgram create
   */
  export type LoyaltyProgramCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
    /**
     * The data needed to create a LoyaltyProgram.
     */
    data: XOR<LoyaltyProgramCreateInput, LoyaltyProgramUncheckedCreateInput>
  }

  /**
   * LoyaltyProgram createMany
   */
  export type LoyaltyProgramCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoyaltyPrograms.
     */
    data: LoyaltyProgramCreateManyInput | LoyaltyProgramCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoyaltyProgram createManyAndReturn
   */
  export type LoyaltyProgramCreateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
    /**
     * The data used to create many LoyaltyPrograms.
     */
    data: LoyaltyProgramCreateManyInput | LoyaltyProgramCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoyaltyProgram update
   */
  export type LoyaltyProgramUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
    /**
     * The data needed to update a LoyaltyProgram.
     */
    data: XOR<LoyaltyProgramUpdateInput, LoyaltyProgramUncheckedUpdateInput>
    /**
     * Choose, which LoyaltyProgram to update.
     */
    where: LoyaltyProgramWhereUniqueInput
  }

  /**
   * LoyaltyProgram updateMany
   */
  export type LoyaltyProgramUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoyaltyPrograms.
     */
    data: XOR<LoyaltyProgramUpdateManyMutationInput, LoyaltyProgramUncheckedUpdateManyInput>
    /**
     * Filter which LoyaltyPrograms to update
     */
    where?: LoyaltyProgramWhereInput
    /**
     * Limit how many LoyaltyPrograms to update.
     */
    limit?: number
  }

  /**
   * LoyaltyProgram updateManyAndReturn
   */
  export type LoyaltyProgramUpdateManyAndReturnArgs<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
  > = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
    /**
     * The data used to update LoyaltyPrograms.
     */
    data: XOR<LoyaltyProgramUpdateManyMutationInput, LoyaltyProgramUncheckedUpdateManyInput>
    /**
     * Filter which LoyaltyPrograms to update
     */
    where?: LoyaltyProgramWhereInput
    /**
     * Limit how many LoyaltyPrograms to update.
     */
    limit?: number
  }

  /**
   * LoyaltyProgram upsert
   */
  export type LoyaltyProgramUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
    /**
     * The filter to search for the LoyaltyProgram to update in case it exists.
     */
    where: LoyaltyProgramWhereUniqueInput
    /**
     * In case the LoyaltyProgram found by the `where` argument doesn't exist, create a new LoyaltyProgram with this data.
     */
    create: XOR<LoyaltyProgramCreateInput, LoyaltyProgramUncheckedCreateInput>
    /**
     * In case the LoyaltyProgram was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoyaltyProgramUpdateInput, LoyaltyProgramUncheckedUpdateInput>
  }

  /**
   * LoyaltyProgram delete
   */
  export type LoyaltyProgramDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
    /**
     * Filter which LoyaltyProgram to delete.
     */
    where: LoyaltyProgramWhereUniqueInput
  }

  /**
   * LoyaltyProgram deleteMany
   */
  export type LoyaltyProgramDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoyaltyPrograms to delete
     */
    where?: LoyaltyProgramWhereInput
    /**
     * Limit how many LoyaltyPrograms to delete.
     */
    limit?: number
  }

  /**
   * LoyaltyProgram without action
   */
  export type LoyaltyProgramDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyProgram
     */
    select?: LoyaltyProgramSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyProgram
     */
    omit?: LoyaltyProgramOmit<ExtArgs> | null
  }

  /**
   * Model LoyaltyPass
   */

  export type AggregateLoyaltyPass = {
    _count: LoyaltyPassCountAggregateOutputType | null
    _min: LoyaltyPassMinAggregateOutputType | null
    _max: LoyaltyPassMaxAggregateOutputType | null
  }

  export type LoyaltyPassMinAggregateOutputType = {
    id: string | null
    collection: string | null
    recipient: string | null
    publicKey: string | null
    privateKey: string | null
    signature: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoyaltyPassMaxAggregateOutputType = {
    id: string | null
    collection: string | null
    recipient: string | null
    publicKey: string | null
    privateKey: string | null
    signature: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LoyaltyPassCountAggregateOutputType = {
    id: number
    collection: number
    recipient: number
    publicKey: number
    privateKey: number
    signature: number
    createdAt: number
    updatedAt: number
    _all: number
  }

  export type LoyaltyPassMinAggregateInputType = {
    id?: true
    collection?: true
    recipient?: true
    publicKey?: true
    privateKey?: true
    signature?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoyaltyPassMaxAggregateInputType = {
    id?: true
    collection?: true
    recipient?: true
    publicKey?: true
    privateKey?: true
    signature?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LoyaltyPassCountAggregateInputType = {
    id?: true
    collection?: true
    recipient?: true
    publicKey?: true
    privateKey?: true
    signature?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LoyaltyPassAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoyaltyPass to aggregate.
     */
    where?: LoyaltyPassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyPasses to fetch.
     */
    orderBy?: LoyaltyPassOrderByWithRelationInput | LoyaltyPassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: LoyaltyPassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyPasses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyPasses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned LoyaltyPasses
     **/
    _count?: true | LoyaltyPassCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
     **/
    _min?: LoyaltyPassMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
     **/
    _max?: LoyaltyPassMaxAggregateInputType
  }

  export type GetLoyaltyPassAggregateType<T extends LoyaltyPassAggregateArgs> = {
    [P in keyof T & keyof AggregateLoyaltyPass]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoyaltyPass[P]>
      : GetScalarType<T[P], AggregateLoyaltyPass[P]>
  }

  export type LoyaltyPassGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoyaltyPassWhereInput
    orderBy?: LoyaltyPassOrderByWithAggregationInput | LoyaltyPassOrderByWithAggregationInput[]
    by: LoyaltyPassScalarFieldEnum[] | LoyaltyPassScalarFieldEnum
    having?: LoyaltyPassScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoyaltyPassCountAggregateInputType | true
    _min?: LoyaltyPassMinAggregateInputType
    _max?: LoyaltyPassMaxAggregateInputType
  }

  export type LoyaltyPassGroupByOutputType = {
    id: string
    collection: string
    recipient: string
    publicKey: string
    privateKey: string
    signature: string
    createdAt: Date
    updatedAt: Date
    _count: LoyaltyPassCountAggregateOutputType | null
    _min: LoyaltyPassMinAggregateOutputType | null
    _max: LoyaltyPassMaxAggregateOutputType | null
  }

  type GetLoyaltyPassGroupByPayload<T extends LoyaltyPassGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoyaltyPassGroupByOutputType, T['by']> & {
        [P in keyof T & keyof LoyaltyPassGroupByOutputType]: P extends '_count'
          ? T[P] extends boolean
            ? number
            : GetScalarType<T[P], LoyaltyPassGroupByOutputType[P]>
          : GetScalarType<T[P], LoyaltyPassGroupByOutputType[P]>
      }
    >
  >

  export type LoyaltyPassSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        collection?: boolean
        recipient?: boolean
        publicKey?: boolean
        privateKey?: boolean
        signature?: boolean
        createdAt?: boolean
        updatedAt?: boolean
      },
      ExtArgs['result']['loyaltyPass']
    >

  export type LoyaltyPassSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        collection?: boolean
        recipient?: boolean
        publicKey?: boolean
        privateKey?: boolean
        signature?: boolean
        createdAt?: boolean
        updatedAt?: boolean
      },
      ExtArgs['result']['loyaltyPass']
    >

  export type LoyaltyPassSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    $Extensions.GetSelect<
      {
        id?: boolean
        collection?: boolean
        recipient?: boolean
        publicKey?: boolean
        privateKey?: boolean
        signature?: boolean
        createdAt?: boolean
        updatedAt?: boolean
      },
      ExtArgs['result']['loyaltyPass']
    >

  export type LoyaltyPassSelectScalar = {
    id?: boolean
    collection?: boolean
    recipient?: boolean
    publicKey?: boolean
    privateKey?: boolean
    signature?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LoyaltyPassOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<
    'id' | 'collection' | 'recipient' | 'publicKey' | 'privateKey' | 'signature' | 'createdAt' | 'updatedAt',
    ExtArgs['result']['loyaltyPass']
  >

  export type $LoyaltyPassPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: 'LoyaltyPass'
    objects: {}
    scalars: $Extensions.GetPayloadResult<
      {
        id: string
        collection: string
        recipient: string
        publicKey: string
        /**
         * @encrypted
         */
        privateKey: string
        signature: string
        createdAt: Date
        updatedAt: Date
      },
      ExtArgs['result']['loyaltyPass']
    >
    composites: {}
  }

  type LoyaltyPassGetPayload<S extends boolean | null | undefined | LoyaltyPassDefaultArgs> = $Result.GetResult<
    Prisma.$LoyaltyPassPayload,
    S
  >

  type LoyaltyPassCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = Omit<
    LoyaltyPassFindManyArgs,
    'select' | 'include' | 'distinct' | 'omit'
  > & {
    select?: LoyaltyPassCountAggregateInputType | true
  }

  export interface LoyaltyPassDelegate<
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoyaltyPass']; meta: { name: 'LoyaltyPass' } }
    /**
     * Find zero or one LoyaltyPass that matches the filter.
     * @param {LoyaltyPassFindUniqueArgs} args - Arguments to find a LoyaltyPass
     * @example
     * // Get one LoyaltyPass
     * const loyaltyPass = await prisma.loyaltyPass.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoyaltyPassFindUniqueArgs>(
      args: SelectSubset<T, LoyaltyPassFindUniqueArgs<ExtArgs>>,
    ): Prisma__LoyaltyPassClient<
      $Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'findUnique', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find one LoyaltyPass that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoyaltyPassFindUniqueOrThrowArgs} args - Arguments to find a LoyaltyPass
     * @example
     * // Get one LoyaltyPass
     * const loyaltyPass = await prisma.loyaltyPass.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoyaltyPassFindUniqueOrThrowArgs>(
      args: SelectSubset<T, LoyaltyPassFindUniqueOrThrowArgs<ExtArgs>>,
    ): Prisma__LoyaltyPassClient<
      $Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'findUniqueOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first LoyaltyPass that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPassFindFirstArgs} args - Arguments to find a LoyaltyPass
     * @example
     * // Get one LoyaltyPass
     * const loyaltyPass = await prisma.loyaltyPass.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoyaltyPassFindFirstArgs>(
      args?: SelectSubset<T, LoyaltyPassFindFirstArgs<ExtArgs>>,
    ): Prisma__LoyaltyPassClient<
      $Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'findFirst', GlobalOmitOptions> | null,
      null,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find the first LoyaltyPass that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPassFindFirstOrThrowArgs} args - Arguments to find a LoyaltyPass
     * @example
     * // Get one LoyaltyPass
     * const loyaltyPass = await prisma.loyaltyPass.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoyaltyPassFindFirstOrThrowArgs>(
      args?: SelectSubset<T, LoyaltyPassFindFirstOrThrowArgs<ExtArgs>>,
    ): Prisma__LoyaltyPassClient<
      $Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'findFirstOrThrow', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Find zero or more LoyaltyPasses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPassFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoyaltyPasses
     * const loyaltyPasses = await prisma.loyaltyPass.findMany()
     *
     * // Get first 10 LoyaltyPasses
     * const loyaltyPasses = await prisma.loyaltyPass.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const loyaltyPassWithIdOnly = await prisma.loyaltyPass.findMany({ select: { id: true } })
     *
     */
    findMany<T extends LoyaltyPassFindManyArgs>(
      args?: SelectSubset<T, LoyaltyPassFindManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'findMany', GlobalOmitOptions>>

    /**
     * Create a LoyaltyPass.
     * @param {LoyaltyPassCreateArgs} args - Arguments to create a LoyaltyPass.
     * @example
     * // Create one LoyaltyPass
     * const LoyaltyPass = await prisma.loyaltyPass.create({
     *   data: {
     *     // ... data to create a LoyaltyPass
     *   }
     * })
     *
     */
    create<T extends LoyaltyPassCreateArgs>(
      args: SelectSubset<T, LoyaltyPassCreateArgs<ExtArgs>>,
    ): Prisma__LoyaltyPassClient<
      $Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'create', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Create many LoyaltyPasses.
     * @param {LoyaltyPassCreateManyArgs} args - Arguments to create many LoyaltyPasses.
     * @example
     * // Create many LoyaltyPasses
     * const loyaltyPass = await prisma.loyaltyPass.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends LoyaltyPassCreateManyArgs>(
      args?: SelectSubset<T, LoyaltyPassCreateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoyaltyPasses and returns the data saved in the database.
     * @param {LoyaltyPassCreateManyAndReturnArgs} args - Arguments to create many LoyaltyPasses.
     * @example
     * // Create many LoyaltyPasses
     * const loyaltyPass = await prisma.loyaltyPass.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many LoyaltyPasses and only return the `id`
     * const loyaltyPassWithIdOnly = await prisma.loyaltyPass.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends LoyaltyPassCreateManyAndReturnArgs>(
      args?: SelectSubset<T, LoyaltyPassCreateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'createManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Delete a LoyaltyPass.
     * @param {LoyaltyPassDeleteArgs} args - Arguments to delete one LoyaltyPass.
     * @example
     * // Delete one LoyaltyPass
     * const LoyaltyPass = await prisma.loyaltyPass.delete({
     *   where: {
     *     // ... filter to delete one LoyaltyPass
     *   }
     * })
     *
     */
    delete<T extends LoyaltyPassDeleteArgs>(
      args: SelectSubset<T, LoyaltyPassDeleteArgs<ExtArgs>>,
    ): Prisma__LoyaltyPassClient<
      $Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'delete', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Update one LoyaltyPass.
     * @param {LoyaltyPassUpdateArgs} args - Arguments to update one LoyaltyPass.
     * @example
     * // Update one LoyaltyPass
     * const loyaltyPass = await prisma.loyaltyPass.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends LoyaltyPassUpdateArgs>(
      args: SelectSubset<T, LoyaltyPassUpdateArgs<ExtArgs>>,
    ): Prisma__LoyaltyPassClient<
      $Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'update', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Delete zero or more LoyaltyPasses.
     * @param {LoyaltyPassDeleteManyArgs} args - Arguments to filter LoyaltyPasses to delete.
     * @example
     * // Delete a few LoyaltyPasses
     * const { count } = await prisma.loyaltyPass.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends LoyaltyPassDeleteManyArgs>(
      args?: SelectSubset<T, LoyaltyPassDeleteManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoyaltyPasses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPassUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoyaltyPasses
     * const loyaltyPass = await prisma.loyaltyPass.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends LoyaltyPassUpdateManyArgs>(
      args: SelectSubset<T, LoyaltyPassUpdateManyArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoyaltyPasses and returns the data updated in the database.
     * @param {LoyaltyPassUpdateManyAndReturnArgs} args - Arguments to update many LoyaltyPasses.
     * @example
     * // Update many LoyaltyPasses
     * const loyaltyPass = await prisma.loyaltyPass.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more LoyaltyPasses and only return the `id`
     * const loyaltyPassWithIdOnly = await prisma.loyaltyPass.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends LoyaltyPassUpdateManyAndReturnArgs>(
      args: SelectSubset<T, LoyaltyPassUpdateManyAndReturnArgs<ExtArgs>>,
    ): Prisma.PrismaPromise<
      $Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'updateManyAndReturn', GlobalOmitOptions>
    >

    /**
     * Create or update one LoyaltyPass.
     * @param {LoyaltyPassUpsertArgs} args - Arguments to update or create a LoyaltyPass.
     * @example
     * // Update or create a LoyaltyPass
     * const loyaltyPass = await prisma.loyaltyPass.upsert({
     *   create: {
     *     // ... data to create a LoyaltyPass
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoyaltyPass we want to update
     *   }
     * })
     */
    upsert<T extends LoyaltyPassUpsertArgs>(
      args: SelectSubset<T, LoyaltyPassUpsertArgs<ExtArgs>>,
    ): Prisma__LoyaltyPassClient<
      $Result.GetResult<Prisma.$LoyaltyPassPayload<ExtArgs>, T, 'upsert', GlobalOmitOptions>,
      never,
      ExtArgs,
      GlobalOmitOptions
    >

    /**
     * Count the number of LoyaltyPasses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPassCountArgs} args - Arguments to filter LoyaltyPasses to count.
     * @example
     * // Count the number of LoyaltyPasses
     * const count = await prisma.loyaltyPass.count({
     *   where: {
     *     // ... the filter for the LoyaltyPasses we want to count
     *   }
     * })
     **/
    count<T extends LoyaltyPassCountArgs>(
      args?: Subset<T, LoyaltyPassCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoyaltyPassCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoyaltyPass.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPassAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
     **/
    aggregate<T extends LoyaltyPassAggregateArgs>(
      args: Subset<T, LoyaltyPassAggregateArgs>,
    ): Prisma.PrismaPromise<GetLoyaltyPassAggregateType<T>>

    /**
     * Group by LoyaltyPass.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoyaltyPassGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
     **/
    groupBy<
      T extends LoyaltyPassGroupByArgs,
      HasSelectOrTake extends Or<Extends<'skip', Keys<T>>, Extends<'take', Keys<T>>>,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoyaltyPassGroupByArgs['orderBy'] }
        : { orderBy?: LoyaltyPassGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
        ? `Error: "by" must not be empty.`
        : HavingValid extends False
          ? {
              [P in HavingFields]: P extends ByFields
                ? never
                : P extends string
                  ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
                  : [Error, 'Field ', P, ` in "having" needs to be provided in "by"`]
            }[HavingFields]
          : 'take' extends Keys<T>
            ? 'orderBy' extends Keys<T>
              ? ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields]
              : 'Error: If you provide "take", you also need to provide "orderBy"'
            : 'skip' extends Keys<T>
              ? 'orderBy' extends Keys<T>
                ? ByValid extends True
                  ? {}
                  : {
                      [P in OrderFields]: P extends ByFields
                        ? never
                        : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                    }[OrderFields]
                : 'Error: If you provide "skip", you also need to provide "orderBy"'
              : ByValid extends True
                ? {}
                : {
                    [P in OrderFields]: P extends ByFields
                      ? never
                      : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
                  }[OrderFields],
    >(
      args: SubsetIntersection<T, LoyaltyPassGroupByArgs, OrderByArg> & InputErrors,
    ): {} extends InputErrors ? GetLoyaltyPassGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
    /**
     * Fields of the LoyaltyPass model
     */
    readonly fields: LoyaltyPassFieldRefs
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoyaltyPass.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoyaltyPassClient<
    T,
    Null = never,
    ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs,
    GlobalOmitOptions = {},
  > extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise'
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null,
    ): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(
      onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null,
    ): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }

  /**
   * Fields of the LoyaltyPass model
   */
  interface LoyaltyPassFieldRefs {
    readonly id: FieldRef<'LoyaltyPass', 'String'>
    readonly collection: FieldRef<'LoyaltyPass', 'String'>
    readonly recipient: FieldRef<'LoyaltyPass', 'String'>
    readonly publicKey: FieldRef<'LoyaltyPass', 'String'>
    readonly privateKey: FieldRef<'LoyaltyPass', 'String'>
    readonly signature: FieldRef<'LoyaltyPass', 'String'>
    readonly createdAt: FieldRef<'LoyaltyPass', 'DateTime'>
    readonly updatedAt: FieldRef<'LoyaltyPass', 'DateTime'>
  }

  // Custom InputTypes
  /**
   * LoyaltyPass findUnique
   */
  export type LoyaltyPassFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * Filter, which LoyaltyPass to fetch.
     */
    where: LoyaltyPassWhereUniqueInput
  }

  /**
   * LoyaltyPass findUniqueOrThrow
   */
  export type LoyaltyPassFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * Filter, which LoyaltyPass to fetch.
     */
    where: LoyaltyPassWhereUniqueInput
  }

  /**
   * LoyaltyPass findFirst
   */
  export type LoyaltyPassFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * Filter, which LoyaltyPass to fetch.
     */
    where?: LoyaltyPassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyPasses to fetch.
     */
    orderBy?: LoyaltyPassOrderByWithRelationInput | LoyaltyPassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for LoyaltyPasses.
     */
    cursor?: LoyaltyPassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyPasses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyPasses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LoyaltyPasses.
     */
    distinct?: LoyaltyPassScalarFieldEnum | LoyaltyPassScalarFieldEnum[]
  }

  /**
   * LoyaltyPass findFirstOrThrow
   */
  export type LoyaltyPassFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * Filter, which LoyaltyPass to fetch.
     */
    where?: LoyaltyPassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyPasses to fetch.
     */
    orderBy?: LoyaltyPassOrderByWithRelationInput | LoyaltyPassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for LoyaltyPasses.
     */
    cursor?: LoyaltyPassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyPasses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyPasses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of LoyaltyPasses.
     */
    distinct?: LoyaltyPassScalarFieldEnum | LoyaltyPassScalarFieldEnum[]
  }

  /**
   * LoyaltyPass findMany
   */
  export type LoyaltyPassFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * Filter, which LoyaltyPasses to fetch.
     */
    where?: LoyaltyPassWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of LoyaltyPasses to fetch.
     */
    orderBy?: LoyaltyPassOrderByWithRelationInput | LoyaltyPassOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing LoyaltyPasses.
     */
    cursor?: LoyaltyPassWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` LoyaltyPasses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` LoyaltyPasses.
     */
    skip?: number
    distinct?: LoyaltyPassScalarFieldEnum | LoyaltyPassScalarFieldEnum[]
  }

  /**
   * LoyaltyPass create
   */
  export type LoyaltyPassCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * The data needed to create a LoyaltyPass.
     */
    data: XOR<LoyaltyPassCreateInput, LoyaltyPassUncheckedCreateInput>
  }

  /**
   * LoyaltyPass createMany
   */
  export type LoyaltyPassCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoyaltyPasses.
     */
    data: LoyaltyPassCreateManyInput | LoyaltyPassCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoyaltyPass createManyAndReturn
   */
  export type LoyaltyPassCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * The data used to create many LoyaltyPasses.
     */
    data: LoyaltyPassCreateManyInput | LoyaltyPassCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoyaltyPass update
   */
  export type LoyaltyPassUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * The data needed to update a LoyaltyPass.
     */
    data: XOR<LoyaltyPassUpdateInput, LoyaltyPassUncheckedUpdateInput>
    /**
     * Choose, which LoyaltyPass to update.
     */
    where: LoyaltyPassWhereUniqueInput
  }

  /**
   * LoyaltyPass updateMany
   */
  export type LoyaltyPassUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoyaltyPasses.
     */
    data: XOR<LoyaltyPassUpdateManyMutationInput, LoyaltyPassUncheckedUpdateManyInput>
    /**
     * Filter which LoyaltyPasses to update
     */
    where?: LoyaltyPassWhereInput
    /**
     * Limit how many LoyaltyPasses to update.
     */
    limit?: number
  }

  /**
   * LoyaltyPass updateManyAndReturn
   */
  export type LoyaltyPassUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * The data used to update LoyaltyPasses.
     */
    data: XOR<LoyaltyPassUpdateManyMutationInput, LoyaltyPassUncheckedUpdateManyInput>
    /**
     * Filter which LoyaltyPasses to update
     */
    where?: LoyaltyPassWhereInput
    /**
     * Limit how many LoyaltyPasses to update.
     */
    limit?: number
  }

  /**
   * LoyaltyPass upsert
   */
  export type LoyaltyPassUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * The filter to search for the LoyaltyPass to update in case it exists.
     */
    where: LoyaltyPassWhereUniqueInput
    /**
     * In case the LoyaltyPass found by the `where` argument doesn't exist, create a new LoyaltyPass with this data.
     */
    create: XOR<LoyaltyPassCreateInput, LoyaltyPassUncheckedCreateInput>
    /**
     * In case the LoyaltyPass was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoyaltyPassUpdateInput, LoyaltyPassUncheckedUpdateInput>
  }

  /**
   * LoyaltyPass delete
   */
  export type LoyaltyPassDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
    /**
     * Filter which LoyaltyPass to delete.
     */
    where: LoyaltyPassWhereUniqueInput
  }

  /**
   * LoyaltyPass deleteMany
   */
  export type LoyaltyPassDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoyaltyPasses to delete
     */
    where?: LoyaltyPassWhereInput
    /**
     * Limit how many LoyaltyPasses to delete.
     */
    limit?: number
  }

  /**
   * LoyaltyPass without action
   */
  export type LoyaltyPassDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoyaltyPass
     */
    select?: LoyaltyPassSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoyaltyPass
     */
    omit?: LoyaltyPassOmit<ExtArgs> | null
  }

  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted'
    ReadCommitted: 'ReadCommitted'
    RepeatableRead: 'RepeatableRead'
    Serializable: 'Serializable'
  }

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]

  export const LoyaltyProgramScalarFieldEnum: {
    id: 'id'
    creator: 'creator'
    publicKey: 'publicKey'
    privateKey: 'privateKey'
    signature: 'signature'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type LoyaltyProgramScalarFieldEnum =
    (typeof LoyaltyProgramScalarFieldEnum)[keyof typeof LoyaltyProgramScalarFieldEnum]

  export const LoyaltyPassScalarFieldEnum: {
    id: 'id'
    collection: 'collection'
    recipient: 'recipient'
    publicKey: 'publicKey'
    privateKey: 'privateKey'
    signature: 'signature'
    createdAt: 'createdAt'
    updatedAt: 'updatedAt'
  }

  export type LoyaltyPassScalarFieldEnum = (typeof LoyaltyPassScalarFieldEnum)[keyof typeof LoyaltyPassScalarFieldEnum]

  export const SortOrder: {
    asc: 'asc'
    desc: 'desc'
  }

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]

  export const QueryMode: {
    default: 'default'
    insensitive: 'insensitive'
  }

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]

  /**
   * Field references
   */

  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>

  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>

  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>

  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>

  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>

  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>

  /**
   * Deep Input Types
   */

  export type LoyaltyProgramWhereInput = {
    AND?: LoyaltyProgramWhereInput | LoyaltyProgramWhereInput[]
    OR?: LoyaltyProgramWhereInput[]
    NOT?: LoyaltyProgramWhereInput | LoyaltyProgramWhereInput[]
    id?: StringFilter<'LoyaltyProgram'> | string
    creator?: StringFilter<'LoyaltyProgram'> | string
    publicKey?: StringFilter<'LoyaltyProgram'> | string
    privateKey?: StringFilter<'LoyaltyProgram'> | string
    signature?: StringFilter<'LoyaltyProgram'> | string
    createdAt?: DateTimeFilter<'LoyaltyProgram'> | Date | string
    updatedAt?: DateTimeFilter<'LoyaltyProgram'> | Date | string
  }

  export type LoyaltyProgramOrderByWithRelationInput = {
    id?: SortOrder
    creator?: SortOrder
    publicKey?: SortOrder
    privateKey?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyProgramWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: LoyaltyProgramWhereInput | LoyaltyProgramWhereInput[]
      OR?: LoyaltyProgramWhereInput[]
      NOT?: LoyaltyProgramWhereInput | LoyaltyProgramWhereInput[]
      creator?: StringFilter<'LoyaltyProgram'> | string
      publicKey?: StringFilter<'LoyaltyProgram'> | string
      privateKey?: StringFilter<'LoyaltyProgram'> | string
      signature?: StringFilter<'LoyaltyProgram'> | string
      createdAt?: DateTimeFilter<'LoyaltyProgram'> | Date | string
      updatedAt?: DateTimeFilter<'LoyaltyProgram'> | Date | string
    },
    'id'
  >

  export type LoyaltyProgramOrderByWithAggregationInput = {
    id?: SortOrder
    creator?: SortOrder
    publicKey?: SortOrder
    privateKey?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LoyaltyProgramCountOrderByAggregateInput
    _max?: LoyaltyProgramMaxOrderByAggregateInput
    _min?: LoyaltyProgramMinOrderByAggregateInput
  }

  export type LoyaltyProgramScalarWhereWithAggregatesInput = {
    AND?: LoyaltyProgramScalarWhereWithAggregatesInput | LoyaltyProgramScalarWhereWithAggregatesInput[]
    OR?: LoyaltyProgramScalarWhereWithAggregatesInput[]
    NOT?: LoyaltyProgramScalarWhereWithAggregatesInput | LoyaltyProgramScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'LoyaltyProgram'> | string
    creator?: StringWithAggregatesFilter<'LoyaltyProgram'> | string
    publicKey?: StringWithAggregatesFilter<'LoyaltyProgram'> | string
    privateKey?: StringWithAggregatesFilter<'LoyaltyProgram'> | string
    signature?: StringWithAggregatesFilter<'LoyaltyProgram'> | string
    createdAt?: DateTimeWithAggregatesFilter<'LoyaltyProgram'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'LoyaltyProgram'> | Date | string
  }

  export type LoyaltyPassWhereInput = {
    AND?: LoyaltyPassWhereInput | LoyaltyPassWhereInput[]
    OR?: LoyaltyPassWhereInput[]
    NOT?: LoyaltyPassWhereInput | LoyaltyPassWhereInput[]
    id?: StringFilter<'LoyaltyPass'> | string
    collection?: StringFilter<'LoyaltyPass'> | string
    recipient?: StringFilter<'LoyaltyPass'> | string
    publicKey?: StringFilter<'LoyaltyPass'> | string
    privateKey?: StringFilter<'LoyaltyPass'> | string
    signature?: StringFilter<'LoyaltyPass'> | string
    createdAt?: DateTimeFilter<'LoyaltyPass'> | Date | string
    updatedAt?: DateTimeFilter<'LoyaltyPass'> | Date | string
  }

  export type LoyaltyPassOrderByWithRelationInput = {
    id?: SortOrder
    collection?: SortOrder
    recipient?: SortOrder
    publicKey?: SortOrder
    privateKey?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyPassWhereUniqueInput = Prisma.AtLeast<
    {
      id?: string
      AND?: LoyaltyPassWhereInput | LoyaltyPassWhereInput[]
      OR?: LoyaltyPassWhereInput[]
      NOT?: LoyaltyPassWhereInput | LoyaltyPassWhereInput[]
      collection?: StringFilter<'LoyaltyPass'> | string
      recipient?: StringFilter<'LoyaltyPass'> | string
      publicKey?: StringFilter<'LoyaltyPass'> | string
      privateKey?: StringFilter<'LoyaltyPass'> | string
      signature?: StringFilter<'LoyaltyPass'> | string
      createdAt?: DateTimeFilter<'LoyaltyPass'> | Date | string
      updatedAt?: DateTimeFilter<'LoyaltyPass'> | Date | string
    },
    'id'
  >

  export type LoyaltyPassOrderByWithAggregationInput = {
    id?: SortOrder
    collection?: SortOrder
    recipient?: SortOrder
    publicKey?: SortOrder
    privateKey?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LoyaltyPassCountOrderByAggregateInput
    _max?: LoyaltyPassMaxOrderByAggregateInput
    _min?: LoyaltyPassMinOrderByAggregateInput
  }

  export type LoyaltyPassScalarWhereWithAggregatesInput = {
    AND?: LoyaltyPassScalarWhereWithAggregatesInput | LoyaltyPassScalarWhereWithAggregatesInput[]
    OR?: LoyaltyPassScalarWhereWithAggregatesInput[]
    NOT?: LoyaltyPassScalarWhereWithAggregatesInput | LoyaltyPassScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<'LoyaltyPass'> | string
    collection?: StringWithAggregatesFilter<'LoyaltyPass'> | string
    recipient?: StringWithAggregatesFilter<'LoyaltyPass'> | string
    publicKey?: StringWithAggregatesFilter<'LoyaltyPass'> | string
    privateKey?: StringWithAggregatesFilter<'LoyaltyPass'> | string
    signature?: StringWithAggregatesFilter<'LoyaltyPass'> | string
    createdAt?: DateTimeWithAggregatesFilter<'LoyaltyPass'> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<'LoyaltyPass'> | Date | string
  }

  export type LoyaltyProgramCreateInput = {
    id?: string
    creator: string
    publicKey: string
    privateKey: string
    signature: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyProgramUncheckedCreateInput = {
    id?: string
    creator: string
    publicKey: string
    privateKey: string
    signature: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyProgramUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    privateKey?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyProgramUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    privateKey?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyProgramCreateManyInput = {
    id?: string
    creator: string
    publicKey: string
    privateKey: string
    signature: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyProgramUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    privateKey?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyProgramUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    creator?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    privateKey?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPassCreateInput = {
    id?: string
    collection: string
    recipient: string
    publicKey: string
    privateKey: string
    signature: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPassUncheckedCreateInput = {
    id?: string
    collection: string
    recipient: string
    publicKey: string
    privateKey: string
    signature: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPassUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    collection?: StringFieldUpdateOperationsInput | string
    recipient?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    privateKey?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPassUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    collection?: StringFieldUpdateOperationsInput | string
    recipient?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    privateKey?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPassCreateManyInput = {
    id?: string
    collection: string
    recipient: string
    publicKey: string
    privateKey: string
    signature: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LoyaltyPassUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    collection?: StringFieldUpdateOperationsInput | string
    recipient?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    privateKey?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoyaltyPassUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    collection?: StringFieldUpdateOperationsInput | string
    recipient?: StringFieldUpdateOperationsInput | string
    publicKey?: StringFieldUpdateOperationsInput | string
    privateKey?: StringFieldUpdateOperationsInput | string
    signature?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type LoyaltyProgramCountOrderByAggregateInput = {
    id?: SortOrder
    creator?: SortOrder
    publicKey?: SortOrder
    privateKey?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyProgramMaxOrderByAggregateInput = {
    id?: SortOrder
    creator?: SortOrder
    publicKey?: SortOrder
    privateKey?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyProgramMinOrderByAggregateInput = {
    id?: SortOrder
    creator?: SortOrder
    publicKey?: SortOrder
    privateKey?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type LoyaltyPassCountOrderByAggregateInput = {
    id?: SortOrder
    collection?: SortOrder
    recipient?: SortOrder
    publicKey?: SortOrder
    privateKey?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyPassMaxOrderByAggregateInput = {
    id?: SortOrder
    collection?: SortOrder
    recipient?: SortOrder
    publicKey?: SortOrder
    privateKey?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LoyaltyPassMinOrderByAggregateInput = {
    id?: SortOrder
    collection?: SortOrder
    recipient?: SortOrder
    publicKey?: SortOrder
    privateKey?: SortOrder
    signature?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
