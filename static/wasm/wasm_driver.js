let wasm_bindgen;
(function() {
    const __exports = {};
    let script_src;
    if (typeof document !== 'undefined' && document.currentScript !== null) {
        script_src = new URL(document.currentScript.src, location.href).toString();
    }
    let wasm = undefined;

    const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

    if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

    let cachedUint8Memory0 = null;

    function getUint8Memory0() {
        if (cachedUint8Memory0 === null || cachedUint8Memory0.buffer !== wasm.memory.buffer) {
            cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachedUint8Memory0;
    }

    function getStringFromWasm0(ptr, len) {
        ptr = ptr >>> 0;
        return cachedTextDecoder.decode(getUint8Memory0().slice(ptr, ptr + len));
    }

    function _assertClass(instance, klass) {
        if (!(instance instanceof klass)) {
            throw new Error(`expected instance of ${klass.name}`);
        }
        return instance.ptr;
    }
    /**
    */
    __exports.Piece = Object.freeze({ J:1,"1":"J",L:2,"2":"L",S:3,"3":"S",Z:4,"4":"Z",T:5,"5":"T",I:6,"6":"I",O:7,"7":"O",None:0,"0":"None", });
    /**
    */
    __exports.Key = Object.freeze({ L:1,"1":"L",R:2,"2":"R",CW:3,"3":"CW",CCW:4,"4":"CCW",Drop:5,"5":"Drop",Hold:6,"6":"Hold",HardDrop:0,"0":"HardDrop", });
    /**
    */
    class Input {

        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(Input.prototype);
            obj.__wbg_ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_input_free(ptr);
        }
        /**
        * @returns {Input}
        */
        static new() {
            const ret = wasm.input_new();
            return Input.__wrap(ret);
        }
        /**
        * @param {number} x
        * @param {number} y
        */
        set_board(x, y) {
            wasm.input_set_board(this.__wbg_ptr, x, y);
        }
        /**
        * @param {number} i
        * @param {number} p
        */
        set_pieces(i, p) {
            wasm.input_set_pieces(this.__wbg_ptr, i, p);
        }
        /**
        * @param {number} p
        */
        set_hold(p) {
            wasm.input_set_hold(this.__wbg_ptr, p);
        }
    }
    __exports.Input = Input;
    /**
    */
    class Output {

        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(Output.prototype);
            obj.__wbg_ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_output_free(ptr);
        }
        /**
        * @returns {number}
        */
        next() {
            const ret = wasm.output_next(this.__wbg_ptr);
            return ret >>> 0;
        }
    }
    __exports.Output = Output;
    /**
    */
    class Wrapper {

        static __wrap(ptr) {
            ptr = ptr >>> 0;
            const obj = Object.create(Wrapper.prototype);
            obj.__wbg_ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.__wbg_ptr;
            this.__wbg_ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_wrapper_free(ptr);
        }
        /**
        * @param {number} threads
        * @returns {Wrapper}
        */
        static new(threads) {
            const ret = wasm.wrapper_new(threads);
            return Wrapper.__wrap(ret);
        }
        /**
        * @param {number} ms
        * @returns {Output}
        */
        run(ms) {
            const ret = wasm.wrapper_run(this.__wbg_ptr, ms);
            return Output.__wrap(ret);
        }
        /**
        * @param {Input} input
        */
        advance(input) {
            _assertClass(input, Input);
            var ptr0 = input.__destroy_into_raw();
            wasm.wrapper_advance(this.__wbg_ptr, ptr0);
        }
    }
    __exports.Wrapper = Wrapper;

    async function __wbg_load(module, imports) {
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

    function __wbg_get_imports() {
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbg_log_c00eea2aa97ca7bc = function(arg0, arg1) {
            console.log(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };

        return imports;
    }

    function __wbg_init_memory(imports, maybe_memory) {
        imports.wbg.memory = maybe_memory || new WebAssembly.Memory({initial:18,maximum:16384,shared:true});
    }

    function __wbg_finalize_init(instance, module) {
        wasm = instance.exports;
        __wbg_init.__wbindgen_wasm_module = module;
        cachedUint8Memory0 = null;

        wasm.__wbindgen_start();
        return wasm;
    }

    function initSync(module, maybe_memory) {
        if (wasm !== undefined) return wasm;

        const imports = __wbg_get_imports();

        __wbg_init_memory(imports, maybe_memory);

        if (!(module instanceof WebAssembly.Module)) {
            module = new WebAssembly.Module(module);
        }

        const instance = new WebAssembly.Instance(module, imports);

        return __wbg_finalize_init(instance, module);
    }

    async function __wbg_init(input, maybe_memory) {
        if (wasm !== undefined) return wasm;

        if (typeof input === 'undefined' && script_src !== 'undefined') {
            input = script_src.replace(/\.js$/, '_bg.wasm');
        }
        const imports = __wbg_get_imports();

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }

        __wbg_init_memory(imports, maybe_memory);

        const { instance, module } = await __wbg_load(await input, imports);

        return __wbg_finalize_init(instance, module);
    }

    wasm_bindgen = Object.assign(__wbg_init, { initSync }, __exports);

})();
