/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.grace = (function() {

    /**
     * Namespace grace.
     * @exports grace
     * @namespace
     */
    var grace = {};

    grace.proto = (function() {

        /**
         * Namespace proto.
         * @memberof grace
         * @namespace
         */
        var proto = {};

        proto.msg = (function() {

            /**
             * Namespace msg.
             * @memberof grace.proto
             * @namespace
             */
            var msg = {};

            msg.Player = (function() {

                /**
                 * Properties of a Player.
                 * @memberof grace.proto.msg
                 * @interface IPlayer
                 * @property {number|null} [id] Player id
                 * @property {string|null} [name] Player name
                 * @property {number|Long|null} [enterTime] Player enterTime
                 */

                /**
                 * Constructs a new Player.
                 * @memberof grace.proto.msg
                 * @classdesc Represents a Player.
                 * @implements IPlayer
                 * @constructor
                 * @param {grace.proto.msg.IPlayer=} [properties] Properties to set
                 */
                function Player(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }

                /**
                 * Player id.
                 * @member {number} id
                 * @memberof grace.proto.msg.Player
                 * @instance
                 */
                Player.prototype.id = 0;

                /**
                 * Player name.
                 * @member {string} name
                 * @memberof grace.proto.msg.Player
                 * @instance
                 */
                Player.prototype.name = "";

                /**
                 * Player enterTime.
                 * @member {number|Long} enterTime
                 * @memberof grace.proto.msg.Player
                 * @instance
                 */
                Player.prototype.enterTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

                /**
                 * Creates a new Player instance using the specified properties.
                 * @function create
                 * @memberof grace.proto.msg.Player
                 * @static
                 * @param {grace.proto.msg.IPlayer=} [properties] Properties to set
                 * @returns {grace.proto.msg.Player} Player instance
                 */
                Player.create = function create(properties) {
                    return new Player(properties);
                };

                /**
                 * Encodes the specified Player message. Does not implicitly {@link grace.proto.msg.Player.verify|verify} messages.
                 * @function encode
                 * @memberof grace.proto.msg.Player
                 * @static
                 * @param {grace.proto.msg.IPlayer} message Player message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Player.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.id != null && message.hasOwnProperty("id"))
                        writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
                    if (message.name != null && message.hasOwnProperty("name"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
                    if (message.enterTime != null && message.hasOwnProperty("enterTime"))
                        writer.uint32(/* id 3, wireType 0 =*/24).uint64(message.enterTime);
                    return writer;
                };

                /**
                 * Encodes the specified Player message, length delimited. Does not implicitly {@link grace.proto.msg.Player.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof grace.proto.msg.Player
                 * @static
                 * @param {grace.proto.msg.IPlayer} message Player message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Player.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };

                /**
                 * Decodes a Player message from the specified reader or buffer.
                 * @function decode
                 * @memberof grace.proto.msg.Player
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {grace.proto.msg.Player} Player
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Player.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.grace.proto.msg.Player();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.id = reader.uint32();
                            break;
                        case 2:
                            message.name = reader.string();
                            break;
                        case 3:
                            message.enterTime = reader.uint64();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };

                /**
                 * Decodes a Player message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof grace.proto.msg.Player
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {grace.proto.msg.Player} Player
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Player.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };

                /**
                 * Verifies a Player message.
                 * @function verify
                 * @memberof grace.proto.msg.Player
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Player.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.id != null && message.hasOwnProperty("id"))
                        if (!$util.isInteger(message.id))
                            return "id: integer expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    if (message.enterTime != null && message.hasOwnProperty("enterTime"))
                        if (!$util.isInteger(message.enterTime) && !(message.enterTime && $util.isInteger(message.enterTime.low) && $util.isInteger(message.enterTime.high)))
                            return "enterTime: integer|Long expected";
                    return null;
                };

                /**
                 * Creates a Player message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof grace.proto.msg.Player
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {grace.proto.msg.Player} Player
                 */
                Player.fromObject = function fromObject(object) {
                    if (object instanceof $root.grace.proto.msg.Player)
                        return object;
                    var message = new $root.grace.proto.msg.Player();
                    if (object.id != null)
                        message.id = object.id >>> 0;
                    if (object.name != null)
                        message.name = String(object.name);
                    if (object.enterTime != null)
                        if ($util.Long)
                            (message.enterTime = $util.Long.fromValue(object.enterTime)).unsigned = true;
                        else if (typeof object.enterTime === "string")
                            message.enterTime = parseInt(object.enterTime, 10);
                        else if (typeof object.enterTime === "number")
                            message.enterTime = object.enterTime;
                        else if (typeof object.enterTime === "object")
                            message.enterTime = new $util.LongBits(object.enterTime.low >>> 0, object.enterTime.high >>> 0).toNumber(true);
                    return message;
                };

                /**
                 * Creates a plain object from a Player message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof grace.proto.msg.Player
                 * @static
                 * @param {grace.proto.msg.Player} message Player
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Player.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.id = 0;
                        object.name = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.enterTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.enterTime = options.longs === String ? "0" : 0;
                    }
                    if (message.id != null && message.hasOwnProperty("id"))
                        object.id = message.id;
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    if (message.enterTime != null && message.hasOwnProperty("enterTime"))
                        if (typeof message.enterTime === "number")
                            object.enterTime = options.longs === String ? String(message.enterTime) : message.enterTime;
                        else
                            object.enterTime = options.longs === String ? $util.Long.prototype.toString.call(message.enterTime) : options.longs === Number ? new $util.LongBits(message.enterTime.low >>> 0, message.enterTime.high >>> 0).toNumber(true) : message.enterTime;
                    return object;
                };

                /**
                 * Converts this Player to JSON.
                 * @function toJSON
                 * @memberof grace.proto.msg.Player
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Player.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };

                return Player;
            })();

            return msg;
        })();

        return proto;
    })();

    return grace;
})();

$root.Person = (function() {

    /**
     * Properties of a Person.
     * @exports IPerson
     * @interface IPerson
     * @property {string} name Person name
     * @property {number} age Person age
     * @property {string|null} [address] Person address
     */

    /**
     * Constructs a new Person.
     * @exports Person
     * @classdesc Represents a Person.
     * @implements IPerson
     * @constructor
     * @param {IPerson=} [properties] Properties to set
     */
    function Person(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * Person name.
     * @member {string} name
     * @memberof Person
     * @instance
     */
    Person.prototype.name = "";

    /**
     * Person age.
     * @member {number} age
     * @memberof Person
     * @instance
     */
    Person.prototype.age = 0;

    /**
     * Person address.
     * @member {string} address
     * @memberof Person
     * @instance
     */
    Person.prototype.address = "";

    /**
     * Creates a new Person instance using the specified properties.
     * @function create
     * @memberof Person
     * @static
     * @param {IPerson=} [properties] Properties to set
     * @returns {Person} Person instance
     */
    Person.create = function create(properties) {
        return new Person(properties);
    };

    /**
     * Encodes the specified Person message. Does not implicitly {@link Person.verify|verify} messages.
     * @function encode
     * @memberof Person
     * @static
     * @param {IPerson} message Person message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Person.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
        writer.uint32(/* id 2, wireType 0 =*/16).int32(message.age);
        if (message.address != null && message.hasOwnProperty("address"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.address);
        return writer;
    };

    /**
     * Encodes the specified Person message, length delimited. Does not implicitly {@link Person.verify|verify} messages.
     * @function encodeDelimited
     * @memberof Person
     * @static
     * @param {IPerson} message Person message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Person.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Person message from the specified reader or buffer.
     * @function decode
     * @memberof Person
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {Person} Person
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Person.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.Person();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.name = reader.string();
                break;
            case 2:
                message.age = reader.int32();
                break;
            case 3:
                message.address = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        if (!message.hasOwnProperty("name"))
            throw $util.ProtocolError("missing required 'name'", { instance: message });
        if (!message.hasOwnProperty("age"))
            throw $util.ProtocolError("missing required 'age'", { instance: message });
        return message;
    };

    /**
     * Decodes a Person message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof Person
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {Person} Person
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Person.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Person message.
     * @function verify
     * @memberof Person
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Person.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (!$util.isString(message.name))
            return "name: string expected";
        if (!$util.isInteger(message.age))
            return "age: integer expected";
        if (message.address != null && message.hasOwnProperty("address"))
            if (!$util.isString(message.address))
                return "address: string expected";
        return null;
    };

    /**
     * Creates a Person message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof Person
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {Person} Person
     */
    Person.fromObject = function fromObject(object) {
        if (object instanceof $root.Person)
            return object;
        var message = new $root.Person();
        if (object.name != null)
            message.name = String(object.name);
        if (object.age != null)
            message.age = object.age | 0;
        if (object.address != null)
            message.address = String(object.address);
        return message;
    };

    /**
     * Creates a plain object from a Person message. Also converts values to other types if specified.
     * @function toObject
     * @memberof Person
     * @static
     * @param {Person} message Person
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Person.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.name = "";
            object.age = 0;
            object.address = "";
        }
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.age != null && message.hasOwnProperty("age"))
            object.age = message.age;
        if (message.address != null && message.hasOwnProperty("address"))
            object.address = message.address;
        return object;
    };

    /**
     * Converts this Person to JSON.
     * @function toJSON
     * @memberof Person
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Person.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return Person;
})();

module.exports = $root;
