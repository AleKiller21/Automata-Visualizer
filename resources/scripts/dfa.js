
var DFA = Automaton.extend({
    run: run,
    _runValidations: _runValidations,
    _processWord: _processWord,
    _validateWord: _validateWord,
    _validateStateTransitions: _validateStateTransitions,
    _checkTransitionForEachSymbolInAlphabet: _checkTransitionForEachSymbolInAlphabet,
    _checkSymbolDuplication: _checkSymbolDuplication
});

function run(word) {
    let status = this._runValidations(word);
    if(!status.valid) return status;

    return this._processWord(word);
}

function _processWord(word) {
    this.currentState = this.initialState;
    let transitions;

    for(symbol in word) {
        transitions = this.getConnectedLinks(this.currentState, {outbound: true});
        for(transition in transitions) {
            if(this.getTransitionSymbol(transitions[transition]) === word[symbol]) {
                this.currentState = transitions[transition].getTargetElement();
                break;
            }
        }
    }

    if(this.currentState.final) return {valid: true, msg: 'Word accepted!'};
    return {valid: false, msg: 'The inserted word is not accepted.'};
}

function _runValidations(word) {
    let status = this._validateWord(word);
    if(!status.valid) return status;

    status = this._validateStateTransitions();
    if(!status.valid) return status;

    return this.checkInitialState();
}

function _validateWord(word) {
    for(let symbol in word) {
        if(!this.alphabet.includes(word[symbol])) return {valid: false, msg: 'The inserted word has the symbol ' + word[symbol] + ' which is not supported by the alphabet.'};
    }

    return {valid: true};
}

function _validateStateTransitions() {
    let states = this.getElements();
    let status;

    for(let state in states) {
        let transitions = this.getConnectedLinks(states[state], {outbound: true});
        let symbols = this.getTransitionSymbols(transitions);

        status = this._checkTransitionForEachSymbolInAlphabet(symbols);
        if(!status.valid) {
            status.msg = 'The state ' + states[state].getName() + ' lacks a transition for the symbol ' + status.msg;
            return status;
        }

        status = this._checkSymbolDuplication(symbols);
        if(!status.valid) {
            status.msg = 'The state ' + states[state].getName() + ' has more than one transition for the symbol ' + status.msg;
            return status;
        }

        status = this.checkTransitionsValidity(symbols);
        if(!status.valid) {
            status.msg = 'The state ' + states[state].getName() + ' has a transition with the symbol ' + status.msg + ' which is not supported by the alphabet.';
            return status;
        }
    }

    return {valid: true};
}

function _checkTransitionForEachSymbolInAlphabet(symbols) {
    for(let symbol in this.alphabet) {
        if(!symbols.includes(this.alphabet[symbol])) return {valid: false, msg: this.alphabet[symbol]};
    }

    return {valid: true};
}

function _checkSymbolDuplication(symbols) {
    for(let i = 0; i < symbols.length - 1; i++) {
        for(let x = i + 1; x < symbols.length; x++) {
            if(symbols[i] === symbols[x]) return {valid: false, msg: symbols[i]};
        }
    }

    return {valid: true};
}