const BigNumber = require('bn.js');

const SethEncoder = function(alpha) {
    var alphabet = alpha || " '-0123456789abcdefghijklmnopqrstuvwxyz",
        base = new BigNumber(alphabet.length).add(new BigNumber(1));
    return {
        string2uint: function(input) {
            if(typeof input !== 'string')
                throw new Error('string2uint only accepts strings.');

            let encoded = new BigNumber(0);
            let enclength = input.length;

            [...Array(enclength).keys()].reverse().forEach((index) => {
                let alphaPos = alphabet.indexOf(input.charAt(index)) + 1;

                if (alphaPos < 1) {
                    throw new Error(`string2uint can't find "${input.charAt(index)}" in the alphabet "${alphabet}"`);
                }

                encoded = base.pow(new BigNumber(index))
                    .mul(new BigNumber(alphaPos))
                    .add(encoded);
            });
            return encoded;
        },
        uint2string: function(inp) {
            let remainder,
                input,
                decodedstr = '',
                zero = new BigNumber(0);

            // Avoid changing by referrence
            if (inp instanceof BigNumber) {
                input = inp.clone();
            } else {
                input = new BigNumber(inp);
            }

            while (input.gt(zero)) {
                let remainder = input.mod(base).toNumber();
                if (remainder < 1) throw new Error('uint2string remainder < 1');
                decodedstr += alphabet.charAt(remainder - 1);
                input.idivn(base);
            }
            return decodedstr;
        },
        string2hex: function(input) {
            return '0x' + this.string2uint(input).toString(16, 64);
        },
        hex2string: function(input) {
            return this.uint2string(new BigNumber(input.slice(2), 16));
        },
    };
};

export default SethEncoder;
