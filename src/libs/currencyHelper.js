export function getDisplayname(currency) {
    for (var i = 0; i < options.length; i++) {
        if (options[i].value === currency) return options[i].label
    }
}

export function getCurrencyOptions() {
    //remove later
    return options;
}

const options = [
    { value: 'XZECZEUR', label: 'ZCash' },
    { value: 'XXBTZEUR', label: 'Bitcoin' },
    { value: 'XETHZEUR', label: 'Ether' },
    { value: 'DASHEUR', label: 'Dash' },
    { value: 'XZECZEUR', label: 'ZCash' },
    { value: 'BCHEUR', label: 'Bitcoin Cash (shitcoin)' },
    { value: 'XXMRZEUR', label: 'Monero' },
    { value: 'XLTCZEUR', label: 'Litecoin' },
    { value: 'XETCZEUR', label: 'Ether Classic (shitcoin)' },
    { value: 'XXRPZEUR', label: 'Ripple' },
    { value: 'XREPZEUR', label: 'Augur' }]