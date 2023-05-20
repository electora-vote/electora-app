
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachedUint8Memory0 = new Uint8Array();

function getUint8Memory0() {
    if (cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = new Int32Array();

function getInt32Memory0() {
    if (cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

let cachedFloat64Memory0 = new Float64Array();

function getFloat64Memory0() {
    if (cachedFloat64Memory0.byteLength === 0) {
        cachedFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1);
    getUint8Memory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
    return instance.ptr;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
/**
* @param {PublicKey} delegating_pk
* @param {Uint8Array} plaintext
* @returns {[Capsule, Uint8Array]}
*/
export function encrypt(delegating_pk, plaintext) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(delegating_pk, PublicKey);
        const ptr0 = passArray8ToWasm0(plaintext, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.encrypt(retptr, delegating_pk.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SecretKey} delegating_sk
* @param {Capsule} capsule
* @param {Uint8Array} ciphertext
* @returns {Uint8Array}
*/
export function decryptOriginal(delegating_sk, capsule, ciphertext) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(delegating_sk, SecretKey);
        _assertClass(capsule, Capsule);
        const ptr0 = passArray8ToWasm0(ciphertext, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.decryptOriginal(retptr, delegating_sk.ptr, capsule.ptr, ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
            throw takeObject(r2);
        }
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
* @param {SecretKey} receiving_sk
* @param {PublicKey} delegating_pk
* @param {Capsule} capsule
* @param {VerifiedCapsuleFrag[]} vcfrags
* @param {Uint8Array} ciphertext
* @returns {Uint8Array}
*/
export function decryptReencrypted(receiving_sk, delegating_pk, capsule, vcfrags, ciphertext) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        _assertClass(receiving_sk, SecretKey);
        _assertClass(delegating_pk, PublicKey);
        _assertClass(capsule, Capsule);
        const ptr0 = passArray8ToWasm0(ciphertext, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.decryptReencrypted(retptr, receiving_sk.ptr, delegating_pk.ptr, capsule.ptr, addBorrowedObject(vcfrags), ptr0, len0);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        var r3 = getInt32Memory0()[retptr / 4 + 3];
        if (r3) {
            throw takeObject(r2);
        }
        var v1 = getArrayU8FromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 1);
        return v1;
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
* @param {SecretKey} delegating_sk
* @param {PublicKey} receiving_pk
* @param {Signer} signer
* @param {number} threshold
* @param {number} shares
* @param {boolean} sign_delegating_key
* @param {boolean} sign_receiving_key
* @returns {VerifiedKeyFrag[]}
*/
export function generateKFrags(delegating_sk, receiving_pk, signer, threshold, shares, sign_delegating_key, sign_receiving_key) {
    _assertClass(delegating_sk, SecretKey);
    _assertClass(receiving_pk, PublicKey);
    _assertClass(signer, Signer);
    const ret = wasm.generateKFrags(delegating_sk.ptr, receiving_pk.ptr, signer.ptr, threshold, shares, sign_delegating_key, sign_receiving_key);
    return takeObject(ret);
}

/**
* @param {Capsule} capsule
* @param {VerifiedKeyFrag} kfrag
* @returns {VerifiedCapsuleFrag}
*/
export function reencrypt(capsule, kfrag) {
    _assertClass(capsule, Capsule);
    _assertClass(kfrag, VerifiedKeyFrag);
    const ret = wasm.reencrypt(capsule.ptr, kfrag.ptr);
    return VerifiedCapsuleFrag.__wrap(ret);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
/**
*/
export class Address {

    static __wrap(ptr) {
        const obj = Object.create(Address.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_address_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address___getClassname(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {Uint8Array} address_bytes
    */
    constructor(address_bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(address_bytes, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.address_new(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.address_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Address} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, Address);
        const ret = wasm.address_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class Capsule {

    static __wrap(ptr) {
        const obj = Object.create(Capsule.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_capsule_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsule___getClassname(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsule_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytesSimple() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsule_toBytesSimple(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {Capsule}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.capsule_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Capsule.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsule_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {Capsule} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, Capsule);
        const ret = wasm.capsule_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class CapsuleFrag {

    static __wrap(ptr) {
        const obj = Object.create(CapsuleFrag.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_capsulefrag_free(ptr);
    }
    /**
    * @param {Capsule} capsule
    * @param {PublicKey} verifying_pk
    * @param {PublicKey} delegating_pk
    * @param {PublicKey} receiving_pk
    * @returns {VerifiedCapsuleFrag}
    */
    verify(capsule, verifying_pk, delegating_pk, receiving_pk) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(capsule, Capsule);
            _assertClass(verifying_pk, PublicKey);
            _assertClass(delegating_pk, PublicKey);
            _assertClass(receiving_pk, PublicKey);
            wasm.capsulefrag_verify(retptr, ptr, capsule.ptr, verifying_pk.ptr, delegating_pk.ptr, receiving_pk.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return VerifiedCapsuleFrag.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsulefrag_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytesSimple() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsulefrag_toBytesSimple(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {CapsuleFrag}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.capsulefrag_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return CapsuleFrag.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsulefrag_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {VerifiedCapsuleFrag}
    */
    skipVerification() {
        const ret = wasm.capsulefrag_skipVerification(this.ptr);
        return VerifiedCapsuleFrag.__wrap(ret);
    }
    /**
    * @param {CapsuleFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, CapsuleFrag);
        const ret = wasm.capsulefrag_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class Conditions {

    static __wrap(ptr) {
        const obj = Object.create(Conditions.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_conditions_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.conditions___getClassname(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} conditions
    */
    constructor(conditions) {
        const ptr0 = passStringToWasm0(conditions, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.conditions_new(ptr0, len0);
        return Conditions.__wrap(ret);
    }
    /**
    * @param {string} data
    * @returns {Conditions}
    */
    static fromBytes(data) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.conditions_fromBytes(ptr0, len0);
        return Conditions.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.conditions_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class Context {

    static __wrap(ptr) {
        const obj = Object.create(Context.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_context_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.context___getClassname(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {string} context
    */
    constructor(context) {
        const ptr0 = passStringToWasm0(context, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.context_new(ptr0, len0);
        return Context.__wrap(ret);
    }
    /**
    * @param {string} data
    * @returns {Context}
    */
    static fromBytes(data) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.context_fromBytes(ptr0, len0);
        return Context.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.context_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class CurvePoint {

    static __wrap(ptr) {
        const obj = Object.create(CurvePoint.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_curvepoint_free(ptr);
    }
    /**
    * @returns {[Uint8Array, Uint8Array] | undefined}
    */
    coordinates() {
        const ret = wasm.curvepoint_coordinates(this.ptr);
        return takeObject(ret);
    }
}
/**
*/
export class EncryptedKeyFrag {

    static __wrap(ptr) {
        const obj = Object.create(EncryptedKeyFrag.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptedkeyfrag_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.encryptedkeyfrag___getClassname(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {Signer} signer
    * @param {PublicKey} recipient_key
    * @param {HRAC} hrac
    * @param {VerifiedKeyFrag} verified_kfrag
    */
    constructor(signer, recipient_key, hrac, verified_kfrag) {
        _assertClass(signer, Signer);
        _assertClass(recipient_key, PublicKey);
        _assertClass(hrac, HRAC);
        _assertClass(verified_kfrag, VerifiedKeyFrag);
        const ret = wasm.encryptedkeyfrag_new(signer.ptr, recipient_key.ptr, hrac.ptr, verified_kfrag.ptr);
        return EncryptedKeyFrag.__wrap(ret);
    }
    /**
    * @param {SecretKey} sk
    * @param {HRAC} hrac
    * @param {PublicKey} publisher_verifying_key
    * @returns {VerifiedKeyFrag}
    */
    decrypt(sk, hrac, publisher_verifying_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(sk, SecretKey);
            _assertClass(hrac, HRAC);
            _assertClass(publisher_verifying_key, PublicKey);
            wasm.encryptedkeyfrag_decrypt(retptr, this.ptr, sk.ptr, hrac.ptr, publisher_verifying_key.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return VerifiedKeyFrag.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {EncryptedKeyFrag}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.encryptedkeyfrag_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return EncryptedKeyFrag.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.encryptedkeyfrag_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class EncryptedTreasureMap {

    static __wrap(ptr) {
        const obj = Object.create(EncryptedTreasureMap.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptedtreasuremap_free(ptr);
    }
    /**
    * @param {SecretKey} sk
    * @param {PublicKey} publisher_verifying_key
    * @returns {TreasureMap}
    */
    decrypt(sk, publisher_verifying_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(sk, SecretKey);
            _assertClass(publisher_verifying_key, PublicKey);
            wasm.encryptedtreasuremap_decrypt(retptr, this.ptr, sk.ptr, publisher_verifying_key.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TreasureMap.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {EncryptedTreasureMap}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.encryptedtreasuremap_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return EncryptedTreasureMap.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.encryptedtreasuremap_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class FleetStateChecksum {

    static __wrap(ptr) {
        const obj = Object.create(FleetStateChecksum.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_fleetstatechecksum_free(ptr);
    }
    /**
    * @param {NodeMetadata[]} other_nodes
    * @param {NodeMetadata | null} this_node
    */
    constructor(other_nodes, this_node) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fleetstatechecksum_new(retptr, addBorrowedObject(other_nodes), addBorrowedObject(this_node));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return FleetStateChecksum.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fleetstatechecksum_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fleetstatechecksum_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class HRAC {

    static __wrap(ptr) {
        const obj = Object.create(HRAC.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_hrac_free(ptr);
    }
    /**
    * @param {PublicKey} publisher_verifying_key
    * @param {PublicKey} bob_verifying_key
    * @param {Uint8Array} label
    */
    constructor(publisher_verifying_key, bob_verifying_key, label) {
        _assertClass(publisher_verifying_key, PublicKey);
        _assertClass(bob_verifying_key, PublicKey);
        const ptr0 = passArray8ToWasm0(label, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.hrac_new(publisher_verifying_key.ptr, bob_verifying_key.ptr, ptr0, len0);
        return HRAC.__wrap(ret);
    }
    /**
    * @param {Uint8Array} bytes
    * @returns {HRAC}
    */
    static fromBytes(bytes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.hrac_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return HRAC.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hrac_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.hrac_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class KeyFrag {

    static __wrap(ptr) {
        const obj = Object.create(KeyFrag.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keyfrag_free(ptr);
    }
    /**
    * @param {PublicKey} verifying_pk
    * @param {PublicKey | null} delegating_pk
    * @param {PublicKey | null} receiving_pk
    * @returns {VerifiedKeyFrag}
    */
    verify(verifying_pk, delegating_pk, receiving_pk) {
        try {
            const ptr = this.__destroy_into_raw();
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(verifying_pk, PublicKey);
            wasm.keyfrag_verify(retptr, ptr, verifying_pk.ptr, addBorrowedObject(delegating_pk), addBorrowedObject(receiving_pk));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return VerifiedKeyFrag.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keyfrag_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {KeyFrag}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.keyfrag_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return KeyFrag.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.keyfrag_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {VerifiedKeyFrag}
    */
    skipVerification() {
        const ret = wasm.keyfrag_skipVerification(this.ptr);
        return VerifiedKeyFrag.__wrap(ret);
    }
    /**
    * @param {KeyFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, KeyFrag);
        const ret = wasm.keyfrag_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class MessageKit {

    static __wrap(ptr) {
        const obj = Object.create(MessageKit.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_messagekit_free(ptr);
    }
    /**
    * @param {PublicKey} policy_encrypting_key
    * @param {Uint8Array} plaintext
    * @param {Conditions | null} conditions
    */
    constructor(policy_encrypting_key, plaintext, conditions) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(policy_encrypting_key, PublicKey);
            const ptr0 = passArray8ToWasm0(plaintext, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.messagekit_new(retptr, policy_encrypting_key.ptr, ptr0, len0, addBorrowedObject(conditions));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return MessageKit.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {SecretKey} sk
    * @returns {Uint8Array}
    */
    decrypt(sk) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(sk, SecretKey);
            wasm.messagekit_decrypt(retptr, this.ptr, sk.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Capsule}
    */
    get capsule() {
        const ret = wasm.messagekit_capsule(this.ptr);
        return Capsule.__wrap(ret);
    }
    /**
    * @returns {Conditions | undefined}
    */
    get conditions() {
        const ret = wasm.messagekit_conditions(this.ptr);
        return ret === 0 ? undefined : Conditions.__wrap(ret);
    }
    /**
    * @param {Uint8Array} data
    * @returns {MessageKit}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.messagekit_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return MessageKit.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.messagekit_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {SecretKey} sk
    * @param {PublicKey} policy_encrypting_key
    * @param {VerifiedCapsuleFrag[]} vcfrags
    * @returns {Uint8Array}
    */
    decryptReencrypted(sk, policy_encrypting_key, vcfrags) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(sk, SecretKey);
            _assertClass(policy_encrypting_key, PublicKey);
            wasm.messagekit_decryptReencrypted(retptr, this.ptr, sk.ptr, policy_encrypting_key.ptr, addBorrowedObject(vcfrags));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class MetadataRequest {

    static __wrap(ptr) {
        const obj = Object.create(MetadataRequest.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_metadatarequest_free(ptr);
    }
    /**
    * @param {FleetStateChecksum} fleet_state_checksum
    * @param {NodeMetadata[]} announce_nodes
    */
    constructor(fleet_state_checksum, announce_nodes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(fleet_state_checksum, FleetStateChecksum);
            wasm.metadatarequest_new(retptr, fleet_state_checksum.ptr, addBorrowedObject(announce_nodes));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return MetadataRequest.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {FleetStateChecksum}
    */
    get fleetStateChecksum() {
        const ret = wasm.metadatarequest_fleetStateChecksum(this.ptr);
        return FleetStateChecksum.__wrap(ret);
    }
    /**
    * @returns {NodeMetadata[]}
    */
    get announceNodes() {
        const ret = wasm.metadatarequest_announceNodes(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} data
    * @returns {MetadataRequest}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.metadatarequest_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return MetadataRequest.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.metadatarequest_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class MetadataResponse {

    static __wrap(ptr) {
        const obj = Object.create(MetadataResponse.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_metadataresponse_free(ptr);
    }
    /**
    * @param {Signer} signer
    * @param {MetadataResponsePayload} response
    */
    constructor(signer, response) {
        _assertClass(signer, Signer);
        _assertClass(response, MetadataResponsePayload);
        const ret = wasm.metadataresponse_new(signer.ptr, response.ptr);
        return MetadataResponse.__wrap(ret);
    }
    /**
    * @param {PublicKey} verifying_pk
    * @returns {MetadataResponsePayload}
    */
    verify(verifying_pk) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(verifying_pk, PublicKey);
            wasm.metadataresponse_verify(retptr, this.ptr, verifying_pk.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return MetadataResponsePayload.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {MetadataResponse}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.metadataresponse_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return MetadataResponse.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.metadataresponse_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class MetadataResponsePayload {

    static __wrap(ptr) {
        const obj = Object.create(MetadataResponsePayload.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_metadataresponsepayload_free(ptr);
    }
    /**
    * @param {number} timestamp_epoch
    * @param {NodeMetadata[]} announce_nodes
    */
    constructor(timestamp_epoch, announce_nodes) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.metadataresponsepayload_new(retptr, timestamp_epoch, addBorrowedObject(announce_nodes));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return MetadataResponsePayload.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {number}
    */
    get timestamp_epoch() {
        const ret = wasm.metadataresponsepayload_timestamp_epoch(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {NodeMetadata[]}
    */
    get announceNodes() {
        const ret = wasm.metadataresponsepayload_announceNodes(this.ptr);
        return takeObject(ret);
    }
}
/**
*/
export class NodeMetadata {

    static __wrap(ptr) {
        const obj = Object.create(NodeMetadata.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nodemetadata_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.nodemetadata___getClassname(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {Signer} signer
    * @param {NodeMetadataPayload} payload
    */
    constructor(signer, payload) {
        _assertClass(signer, Signer);
        _assertClass(payload, NodeMetadataPayload);
        const ret = wasm.nodemetadata_new(signer.ptr, payload.ptr);
        return NodeMetadata.__wrap(ret);
    }
    /**
    * @returns {boolean}
    */
    verify() {
        const ret = wasm.nodemetadata_verify(this.ptr);
        return ret !== 0;
    }
    /**
    * @returns {NodeMetadataPayload}
    */
    get payload() {
        const ret = wasm.nodemetadata_payload(this.ptr);
        return NodeMetadataPayload.__wrap(ret);
    }
    /**
    * @param {Uint8Array} data
    * @returns {NodeMetadata}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.nodemetadata_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return NodeMetadata.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.nodemetadata_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class NodeMetadataPayload {

    static __wrap(ptr) {
        const obj = Object.create(NodeMetadataPayload.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_nodemetadatapayload_free(ptr);
    }
    /**
    * @param {Address} staking_provider_address
    * @param {string} domain
    * @param {number} timestamp_epoch
    * @param {PublicKey} verifying_key
    * @param {PublicKey} encrypting_key
    * @param {Uint8Array} ferveo_public_key
    * @param {Uint8Array} certificate_der
    * @param {string} host
    * @param {number} port
    * @param {RecoverableSignature} operator_signature
    */
    constructor(staking_provider_address, domain, timestamp_epoch, verifying_key, encrypting_key, ferveo_public_key, certificate_der, host, port, operator_signature) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(staking_provider_address, Address);
            const ptr0 = passStringToWasm0(domain, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(verifying_key, PublicKey);
            _assertClass(encrypting_key, PublicKey);
            const ptr1 = passArray8ToWasm0(ferveo_public_key, wasm.__wbindgen_malloc);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passArray8ToWasm0(certificate_der, wasm.__wbindgen_malloc);
            const len2 = WASM_VECTOR_LEN;
            const ptr3 = passStringToWasm0(host, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len3 = WASM_VECTOR_LEN;
            _assertClass(operator_signature, RecoverableSignature);
            wasm.nodemetadatapayload_new(retptr, staking_provider_address.ptr, ptr0, len0, timestamp_epoch, verifying_key.ptr, encrypting_key.ptr, ptr1, len1, ptr2, len2, ptr3, len3, port, operator_signature.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return NodeMetadataPayload.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Address}
    */
    get staking_provider_address() {
        const ret = wasm.nodemetadatapayload_staking_provider_address(this.ptr);
        return Address.__wrap(ret);
    }
    /**
    * @returns {PublicKey}
    */
    get verifyingKey() {
        const ret = wasm.nodemetadatapayload_verifyingKey(this.ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {PublicKey}
    */
    get encryptingKey() {
        const ret = wasm.nodemetadatapayload_encryptingKey(this.ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {RecoverableSignature}
    */
    get operator_signature() {
        const ret = wasm.nodemetadatapayload_operator_signature(this.ptr);
        return RecoverableSignature.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    get domain() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.nodemetadatapayload_domain(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {string}
    */
    get host() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.nodemetadatapayload_host(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {number}
    */
    get port() {
        const ret = wasm.nodemetadatapayload_port(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get timestampEpoch() {
        const ret = wasm.nodemetadatapayload_timestampEpoch(this.ptr);
        return ret >>> 0;
    }
    /**
    * @returns {Uint8Array}
    */
    get certificate_der() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.nodemetadatapayload_certificate_der(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Address}
    */
    deriveOperatorAddress() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.nodemetadatapayload_deriveOperatorAddress(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Address.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class Parameters {

    static __wrap(ptr) {
        const obj = Object.create(Parameters.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_parameters_free(ptr);
    }
    /**
    */
    constructor() {
        const ret = wasm.parameters_new();
        return Parameters.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get u() {
        const ret = wasm.parameters_u(this.ptr);
        return CurvePoint.__wrap(ret);
    }
}
/**
*/
export class PublicKey {

    static __wrap(ptr) {
        const obj = Object.create(PublicKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_publickey_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey___getClassname(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toCompressedBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey_toCompressedBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {PublicKey}
    */
    static fromCompressedBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.publickey_fromCompressedBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return PublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} prehash
    * @param {RecoverableSignature} signature
    * @returns {PublicKey}
    */
    static recoverFromPrehash(prehash, signature) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(prehash, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            _assertClass(signature, RecoverableSignature);
            wasm.publickey_recoverFromPrehash(retptr, ptr0, len0, signature.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return PublicKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.publickey_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {PublicKey} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, PublicKey);
        const ret = wasm.publickey_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class RecoverableSignature {

    static __wrap(ptr) {
        const obj = Object.create(RecoverableSignature.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_recoverablesignature_free(ptr);
    }
    /**
    * @returns {Uint8Array}
    */
    toBEBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.recoverablesignature_toBEBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {RecoverableSignature}
    */
    static fromBEBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.recoverablesignature_fromBEBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return RecoverableSignature.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.recoverablesignature_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {RecoverableSignature} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, RecoverableSignature);
        const ret = wasm.recoverablesignature_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class ReencryptionEvidence {

    static __wrap(ptr) {
        const obj = Object.create(ReencryptionEvidence.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reencryptionevidence_free(ptr);
    }
    /**
    * @param {Capsule} capsule
    * @param {VerifiedCapsuleFrag} vcfrag
    * @param {PublicKey} verifying_pk
    * @param {PublicKey} delegating_pk
    * @param {PublicKey} receiving_pk
    */
    constructor(capsule, vcfrag, verifying_pk, delegating_pk, receiving_pk) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(capsule, Capsule);
            _assertClass(vcfrag, VerifiedCapsuleFrag);
            _assertClass(verifying_pk, PublicKey);
            _assertClass(delegating_pk, PublicKey);
            _assertClass(receiving_pk, PublicKey);
            wasm.reencryptionevidence_new(retptr, capsule.ptr, vcfrag.ptr, verifying_pk.ptr, delegating_pk.ptr, receiving_pk.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ReencryptionEvidence.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.reencryptionevidence_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {ReencryptionEvidence}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.reencryptionevidence_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ReencryptionEvidence.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {CurvePoint}
    */
    get e() {
        const ret = wasm.parameters_u(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get ez() {
        const ret = wasm.reencryptionevidence_ez(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get e1() {
        const ret = wasm.reencryptionevidence_e1(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get e1h() {
        const ret = wasm.reencryptionevidence_e1h(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get e2() {
        const ret = wasm.reencryptionevidence_e2(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get v() {
        const ret = wasm.reencryptionevidence_v(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get vz() {
        const ret = wasm.reencryptionevidence_vz(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get v1() {
        const ret = wasm.reencryptionevidence_v1(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get v1h() {
        const ret = wasm.reencryptionevidence_v1h(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get v2() {
        const ret = wasm.reencryptionevidence_v2(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get uz() {
        const ret = wasm.reencryptionevidence_uz(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get u1() {
        const ret = wasm.reencryptionevidence_u1(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get u1h() {
        const ret = wasm.reencryptionevidence_u1h(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {CurvePoint}
    */
    get u2() {
        const ret = wasm.reencryptionevidence_u2(this.ptr);
        return CurvePoint.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    get kfragValidityMessageHash() {
        const ret = wasm.reencryptionevidence_kfragValidityMessageHash(this.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {boolean}
    */
    get kfragSignatureV() {
        const ret = wasm.reencryptionevidence_kfragSignatureV(this.ptr);
        return ret !== 0;
    }
}
/**
*/
export class ReencryptionRequest {

    static __wrap(ptr) {
        const obj = Object.create(ReencryptionRequest.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reencryptionrequest_free(ptr);
    }
    /**
    * @param {Capsule[]} capsules
    * @param {HRAC} hrac
    * @param {EncryptedKeyFrag} encrypted_kfrag
    * @param {PublicKey} publisher_verifying_key
    * @param {PublicKey} bob_verifying_key
    * @param {Conditions | null} conditions
    * @param {Context | null} context
    */
    constructor(capsules, hrac, encrypted_kfrag, publisher_verifying_key, bob_verifying_key, conditions, context) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(hrac, HRAC);
            _assertClass(encrypted_kfrag, EncryptedKeyFrag);
            _assertClass(publisher_verifying_key, PublicKey);
            _assertClass(bob_verifying_key, PublicKey);
            wasm.reencryptionrequest_new(retptr, addBorrowedObject(capsules), hrac.ptr, encrypted_kfrag.ptr, publisher_verifying_key.ptr, bob_verifying_key.ptr, addBorrowedObject(conditions), addBorrowedObject(context));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ReencryptionRequest.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {HRAC}
    */
    get hrac() {
        const ret = wasm.reencryptionrequest_hrac(this.ptr);
        return HRAC.__wrap(ret);
    }
    /**
    * @returns {PublicKey}
    */
    get publisherVerifyingKey() {
        const ret = wasm.reencryptionrequest_publisherVerifyingKey(this.ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {PublicKey}
    */
    get bobVerifyingKey() {
        const ret = wasm.reencryptionrequest_bobVerifyingKey(this.ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {EncryptedKeyFrag}
    */
    get encryptedKfrag() {
        const ret = wasm.reencryptionrequest_encryptedKfrag(this.ptr);
        return EncryptedKeyFrag.__wrap(ret);
    }
    /**
    * @returns {Capsule[]}
    */
    get capsules() {
        const ret = wasm.reencryptionrequest_capsules(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} data
    * @returns {ReencryptionRequest}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.reencryptionrequest_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ReencryptionRequest.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.reencryptionrequest_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Conditions | undefined}
    */
    get conditions() {
        const ret = wasm.reencryptionrequest_conditions(this.ptr);
        return ret === 0 ? undefined : Conditions.__wrap(ret);
    }
    /**
    * @returns {Context | undefined}
    */
    get context() {
        const ret = wasm.reencryptionrequest_context(this.ptr);
        return ret === 0 ? undefined : Context.__wrap(ret);
    }
}
/**
*/
export class ReencryptionResponse {

    static __wrap(ptr) {
        const obj = Object.create(ReencryptionResponse.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reencryptionresponse_free(ptr);
    }
    /**
    * @param {Signer} signer
    * @param {[Capsule, VerifiedCapsuleFrag][]} capsules_and_vcfrags
    */
    constructor(signer, capsules_and_vcfrags) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(signer, Signer);
            wasm.reencryptionresponse_new(retptr, signer.ptr, addBorrowedObject(capsules_and_vcfrags));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ReencryptionResponse.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {ReencryptionResponse}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.reencryptionresponse_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ReencryptionResponse.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.reencryptionresponse_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Capsule[]} capsules
    * @param {PublicKey} alice_verifying_key
    * @param {PublicKey} ursula_verifying_key
    * @param {PublicKey} policy_encrypting_key
    * @param {PublicKey} bob_encrypting_key
    * @returns {VerifiedCapsuleFrag[]}
    */
    verify(capsules, alice_verifying_key, ursula_verifying_key, policy_encrypting_key, bob_encrypting_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(alice_verifying_key, PublicKey);
            _assertClass(ursula_verifying_key, PublicKey);
            _assertClass(policy_encrypting_key, PublicKey);
            _assertClass(bob_encrypting_key, PublicKey);
            wasm.reencryptionresponse_verify(retptr, this.ptr, addBorrowedObject(capsules), alice_verifying_key.ptr, ursula_verifying_key.ptr, policy_encrypting_key.ptr, bob_encrypting_key.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
}
/**
*/
export class RetrievalKit {

    static __wrap(ptr) {
        const obj = Object.create(RetrievalKit.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_retrievalkit_free(ptr);
    }
    /**
    * @param {Capsule} capsule
    * @param {Address[]} queried_addresses
    * @param {Conditions | null} conditions
    */
    constructor(capsule, queried_addresses, conditions) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(capsule, Capsule);
            wasm.retrievalkit_new(retptr, capsule.ptr, addBorrowedObject(queried_addresses), addBorrowedObject(conditions));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return RetrievalKit.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {MessageKit} message_kit
    * @returns {RetrievalKit}
    */
    static fromMessageKit(message_kit) {
        _assertClass(message_kit, MessageKit);
        const ret = wasm.retrievalkit_fromMessageKit(message_kit.ptr);
        return RetrievalKit.__wrap(ret);
    }
    /**
    * @returns {Capsule}
    */
    get capsule() {
        const ret = wasm.messagekit_capsule(this.ptr);
        return Capsule.__wrap(ret);
    }
    /**
    * @returns {Address[]}
    */
    get queriedAddresses() {
        const ret = wasm.retrievalkit_queriedAddresses(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {Uint8Array} data
    * @returns {RetrievalKit}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.retrievalkit_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return RetrievalKit.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.retrievalkit_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Conditions | undefined}
    */
    get conditions() {
        const ret = wasm.retrievalkit_conditions(this.ptr);
        return ret === 0 ? undefined : Conditions.__wrap(ret);
    }
}
/**
*/
export class RevocationOrder {

    static __wrap(ptr) {
        const obj = Object.create(RevocationOrder.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_revocationorder_free(ptr);
    }
    /**
    * @param {Signer} signer
    * @param {Address} staking_provider_address
    * @param {EncryptedKeyFrag} encrypted_kfrag
    */
    constructor(signer, staking_provider_address, encrypted_kfrag) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(signer, Signer);
            _assertClass(staking_provider_address, Address);
            _assertClass(encrypted_kfrag, EncryptedKeyFrag);
            wasm.revocationorder_new(retptr, signer.ptr, staking_provider_address.ptr, encrypted_kfrag.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return RevocationOrder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {PublicKey} alice_verifying_key
    * @returns {[Address, EncryptedKeyFrag]}
    */
    verify(alice_verifying_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(alice_verifying_key, PublicKey);
            wasm.revocationorder_verify(retptr, this.ptr, alice_verifying_key.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return takeObject(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {RevocationOrder}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.revocationorder_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return RevocationOrder.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.revocationorder_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class SecretKey {

    static __wrap(ptr) {
        const obj = Object.create(SecretKey.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_secretkey_free(ptr);
    }
    /**
    * Generates a secret key using the default RNG and returns it.
    * @returns {SecretKey}
    */
    static random() {
        const ret = wasm.secretkey_random();
        return SecretKey.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toBEBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkey_toBEBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {SecretKey}
    */
    static fromBEBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.secretkey_fromBEBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return SecretKey.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * Generates a secret key using the default RNG and returns it.
    * @returns {PublicKey}
    */
    publicKey() {
        const ret = wasm.secretkey_publicKey(this.ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkey_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class SecretKeyFactory {

    static __wrap(ptr) {
        const obj = Object.create(SecretKeyFactory.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_secretkeyfactory_free(ptr);
    }
    /**
    * Generates a secret key factory using the default RNG and returns it.
    * @returns {SecretKeyFactory}
    */
    static random() {
        const ret = wasm.secretkeyfactory_random();
        return SecretKeyFactory.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    static seedSize() {
        const ret = wasm.secretkeyfactory_seedSize();
        return ret >>> 0;
    }
    /**
    * @param {Uint8Array} seed
    * @returns {SecretKeyFactory}
    */
    static fromSecureRandomness(seed) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(seed, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.secretkeyfactory_fromSecureRandomness(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return SecretKeyFactory.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} label
    * @returns {Uint8Array}
    */
    makeSecret(label) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(label, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.secretkeyfactory_makeSecret(retptr, this.ptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v1 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v1;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} label
    * @returns {SecretKey}
    */
    makeKey(label) {
        const ptr0 = passArray8ToWasm0(label, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.secretkeyfactory_makeKey(this.ptr, ptr0, len0);
        return SecretKey.__wrap(ret);
    }
    /**
    * @param {Uint8Array} label
    * @returns {SecretKeyFactory}
    */
    makeFactory(label) {
        const ptr0 = passArray8ToWasm0(label, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.secretkeyfactory_makeFactory(this.ptr, ptr0, len0);
        return SecretKeyFactory.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.secretkeyfactory_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class Signature {

    static __wrap(ptr) {
        const obj = Object.create(Signature.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signature_free(ptr);
    }
    /**
    * @param {PublicKey} verifying_pk
    * @param {Uint8Array} message
    * @returns {boolean}
    */
    verify(verifying_pk, message) {
        _assertClass(verifying_pk, PublicKey);
        const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.signature_verify(this.ptr, verifying_pk.ptr, ptr0, len0);
        return ret !== 0;
    }
    /**
    * @returns {Uint8Array}
    */
    toDerBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signature_toDerBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {Signature}
    */
    static fromDerBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.signature_fromDerBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Signature.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBEBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signature_toBEBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {Signature}
    */
    static fromBEBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.signature_fromBEBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return Signature.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signature_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {Signature} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, Signature);
        const ret = wasm.signature_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class Signer {

    static __wrap(ptr) {
        const obj = Object.create(Signer.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signer_free(ptr);
    }
    /**
    * @param {SecretKey} secret_key
    */
    constructor(secret_key) {
        _assertClass(secret_key, SecretKey);
        const ret = wasm.signer_new(secret_key.ptr);
        return Signer.__wrap(ret);
    }
    /**
    * @param {Uint8Array} message
    * @returns {Signature}
    */
    sign(message) {
        const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.signer_sign(this.ptr, ptr0, len0);
        return Signature.__wrap(ret);
    }
    /**
    * @returns {PublicKey}
    */
    verifyingKey() {
        const ret = wasm.signer_verifyingKey(this.ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.signer_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
}
/**
*/
export class ThresholdDecryptionRequest {

    static __wrap(ptr) {
        const obj = Object.create(ThresholdDecryptionRequest.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_thresholddecryptionrequest_free(ptr);
    }
    /**
    * @param {number} id
    * @param {number} variant
    * @param {Uint8Array} ciphertext
    * @param {Conditions | null} conditions
    * @param {Context | null} context
    */
    constructor(id, variant, ciphertext, conditions, context) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(ciphertext, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.thresholddecryptionrequest_new(retptr, id, variant, ptr0, len0, addBorrowedObject(conditions), addBorrowedObject(context));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ThresholdDecryptionRequest.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @returns {number}
    */
    get id() {
        const ret = wasm.thresholddecryptionrequest_id(this.ptr);
        return ret;
    }
    /**
    * @returns {number}
    */
    get variant() {
        const ret = wasm.thresholddecryptionrequest_variant(this.ptr);
        return ret;
    }
    /**
    * @returns {Uint8Array}
    */
    get ciphertext() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.thresholddecryptionrequest_ciphertext(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {ThresholdDecryptionRequest}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.thresholddecryptionrequest_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ThresholdDecryptionRequest.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.thresholddecryptionrequest_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class ThresholdDecryptionResponse {

    static __wrap(ptr) {
        const obj = Object.create(ThresholdDecryptionResponse.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_thresholddecryptionresponse_free(ptr);
    }
    /**
    * @param {Uint8Array} decryption_share
    */
    constructor(decryption_share) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(decryption_share, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.thresholddecryptionresponse_new(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ThresholdDecryptionResponse.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    get decryptionShare() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.thresholddecryptionrequest_ciphertext(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @param {Uint8Array} data
    * @returns {ThresholdDecryptionResponse}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.thresholddecryptionresponse_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return ThresholdDecryptionResponse.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.thresholddecryptionresponse_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class TreasureMap {

    static __wrap(ptr) {
        const obj = Object.create(TreasureMap.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_treasuremap_free(ptr);
    }
    /**
    * @param {Signer} signer
    * @param {HRAC} hrac
    * @param {PublicKey} policy_encrypting_key
    * @param {[Address, [PublicKey, VerifiedKeyFrag]][]} assigned_kfrags
    * @param {number} threshold
    */
    constructor(signer, hrac, policy_encrypting_key, assigned_kfrags, threshold) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(signer, Signer);
            _assertClass(hrac, HRAC);
            _assertClass(policy_encrypting_key, PublicKey);
            wasm.treasuremap_new(retptr, signer.ptr, hrac.ptr, policy_encrypting_key.ptr, addBorrowedObject(assigned_kfrags), threshold);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TreasureMap.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
        }
    }
    /**
    * @param {Signer} signer
    * @param {PublicKey} recipient_key
    * @returns {EncryptedTreasureMap}
    */
    encrypt(signer, recipient_key) {
        _assertClass(signer, Signer);
        _assertClass(recipient_key, PublicKey);
        const ret = wasm.treasuremap_encrypt(this.ptr, signer.ptr, recipient_key.ptr);
        return EncryptedTreasureMap.__wrap(ret);
    }
    /**
    * @returns {[Address, EncryptedKeyFrag][]}
    */
    get destinations() {
        const ret = wasm.treasuremap_destinations(this.ptr);
        return takeObject(ret);
    }
    /**
    * @param {Signer} signer
    * @returns {RevocationOrder | null}
    */
    makeRevocationOrders(signer) {
        _assertClass(signer, Signer);
        const ret = wasm.treasuremap_makeRevocationOrders(this.ptr, signer.ptr);
        return takeObject(ret);
    }
    /**
    * @returns {HRAC}
    */
    get hrac() {
        const ret = wasm.treasuremap_hrac(this.ptr);
        return HRAC.__wrap(ret);
    }
    /**
    * @returns {number}
    */
    get threshold() {
        const ret = wasm.treasuremap_threshold(this.ptr);
        return ret;
    }
    /**
    * @returns {PublicKey}
    */
    get policyEncryptingKey() {
        const ret = wasm.treasuremap_policyEncryptingKey(this.ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @returns {PublicKey}
    */
    get publisherVerifyingKey() {
        const ret = wasm.treasuremap_publisherVerifyingKey(this.ptr);
        return PublicKey.__wrap(ret);
    }
    /**
    * @param {Uint8Array} data
    * @returns {TreasureMap}
    */
    static fromBytes(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
            const len0 = WASM_VECTOR_LEN;
            wasm.treasuremap_fromBytes(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            if (r2) {
                throw takeObject(r1);
            }
            return TreasureMap.__wrap(r0);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.treasuremap_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
}
/**
*/
export class VerifiedCapsuleFrag {

    static __wrap(ptr) {
        const obj = Object.create(VerifiedCapsuleFrag.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifiedcapsulefrag_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedcapsulefrag___getClassname(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {CapsuleFrag}
    */
    unverify() {
        const ret = wasm.capsulefrag_skipVerification(this.ptr);
        return CapsuleFrag.__wrap(ret);
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedcapsulefrag_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytesSimple() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.capsulefrag_toBytesSimple(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedcapsulefrag_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {VerifiedCapsuleFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, VerifiedCapsuleFrag);
        const ret = wasm.capsulefrag_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}
/**
*/
export class VerifiedKeyFrag {

    static __wrap(ptr) {
        const obj = Object.create(VerifiedKeyFrag.prototype);
        obj.ptr = ptr;

        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.ptr;
        this.ptr = 0;

        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verifiedkeyfrag_free(ptr);
    }
    /**
    * @returns {string}
    */
    __getClassname() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedkeyfrag___getClassname(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @returns {Uint8Array}
    */
    toBytes() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedkeyfrag_toBytes(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var r2 = getInt32Memory0()[retptr / 4 + 2];
            var r3 = getInt32Memory0()[retptr / 4 + 3];
            if (r3) {
                throw takeObject(r2);
            }
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }
    /**
    * @returns {string}
    */
    toString() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.verifiedkeyfrag_toString(retptr, this.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }
    /**
    * @param {VerifiedKeyFrag} other
    * @returns {boolean}
    */
    equals(other) {
        _assertClass(other, VerifiedKeyFrag);
        const ret = wasm.keyfrag_equals(this.ptr, other.ptr);
        return ret !== 0;
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_address_new = function(arg0) {
        const ret = Address.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_encryptedkeyfrag_new = function(arg0) {
        const ret = EncryptedKeyFrag.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        const ret = getObject(arg0) === null;
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = getObject(arg0);
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbg_revocationorder_new = function(arg0) {
        const ret = RevocationOrder.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_nodemetadata_new = function(arg0) {
        const ret = NodeMetadata.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_capsule_new = function(arg0) {
        const ret = Capsule.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_verifiedcapsulefrag_new = function(arg0) {
        const ret = VerifiedCapsuleFrag.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_verifiedkeyfrag_new = function(arg0) {
        const ret = VerifiedKeyFrag.__wrap(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_crypto_e1d53a1d73fb10b8 = function(arg0) {
        const ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_process_038c26bf42b093f8 = function(arg0) {
        const ret = getObject(arg0).process;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_versions_ab37218d2f0b24a8 = function(arg0) {
        const ret = getObject(arg0).versions;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_node_080f4b19d15bc1fe = function(arg0) {
        const ret = getObject(arg0).node;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(getObject(arg0)) === 'string';
        return ret;
    };
    imports.wbg.__wbg_msCrypto_6e7d3e1f92610cbb = function(arg0) {
        const ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_78a3dcfbdba9cbce = function() { return handleError(function () {
        const ret = module.require;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_getRandomValues_805f1c3d65988a5a = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_randomFillSync_6894564c2c334c42 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    }, arguments) };
    imports.wbg.__wbg_get_57245cc7d7c7619d = function(arg0, arg1) {
        const ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_6e3bbe7c8bd4dbd8 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_new_1d9a920c6bfc44a8 = function() {
        const ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newnoargs_b5b063fc6c2f0376 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_765201544a2b6869 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_call_97ae9d8645dc388b = function() { return handleError(function (arg0, arg1) {
        const ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        const ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_6d479506f72c6a71 = function() { return handleError(function () {
        const ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_f2557cc78490aceb = function() { return handleError(function () {
        const ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_7f206bda628d5286 = function() { return handleError(function () {
        const ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_ba75c50d1cf384f4 = function() { return handleError(function () {
        const ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_isArray_27c46c67f498e15d = function(arg0) {
        const ret = Array.isArray(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_push_740e4b286702d964 = function(arg0, arg1) {
        const ret = getObject(arg0).push(getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_new_8d2af00bc1e329ee = function(arg0, arg1) {
        const ret = new Error(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_168da88779e35f61 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_buffer_3f3d764d4747d564 = function(arg0) {
        const ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d9aa266703cb98be = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_8c3f0052272a457a = function(arg0) {
        const ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_83db9690f9353e79 = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_length_9e1ae1900cb0fbd5 = function(arg0) {
        const ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_newwithlength_f5933855e4f48a19 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_58ad4efbb5bcb886 = function(arg0, arg1, arg2) {
        const ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_apply_75f7334893eef4ad = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.apply(getObject(arg0), getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(getObject(arg1));
        const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return addHeapObject(ret);
    };

    return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedFloat64Memory0 = new Float64Array();
    cachedInt32Memory0 = new Int32Array();
    cachedUint8Memory0 = new Uint8Array();


    return wasm;
}

function initSync(module) {
    const imports = getImports();

    initMemory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('nucypher_core_wasm_bg.wasm', import.meta.url);
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
