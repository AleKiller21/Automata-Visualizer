
var grammarCtrl = (function() {

function addNewRule() {
    let tr = $('#grammar-rules tbody tr:last-child td:last-child');
    if(!tr.find('input').val()) tr.find('input').val(epsilon);

    $('#grammar-rules > tbody:last-child').append('<tr><td><div class="input-field inline"><input class="lhs" placeholder="Production" type="text" autofocus></div></td><td><div class="input-field "><input type="text" value="&#x2192" disabled></div></td><td><div class="input-field inline"><input class="rhs" placeholder="Terminal" type="text"></div></td></tr>');
    $('.rhs').keypress(addNewGrammarRule);
    setEpsilonValue();
}

function setEpsilonValue() {
    let tr = $('#grammar-rules tbody tr:last-child td:last-child');
    tr.find('input').val(epsilon);
}

function parseGrammarFromModal() {
    let rows = $('#grammar-rules tbody tr');
    let productions = [];
    let production = {};
    let flag = true;

    rows.each(function(index) {
        production = {};
        production.left = $(this).find($('.lhs')).val();
        production.right = $(this).find($('.rhs')).val();

        if(production.left) {
            if(!production.right) production.right = epsilon;
            productions.push(production);
        }
    });

    if(!flag) { alert('You must specify a production variable!'); return null;}
    return productions;
}

function convertToPDA() {
    let productions = parseGrammarFromModal();
    let result = grammarConverter.convertGrammartoEmptyStackPDA(productions);
    result.pda.convertToFinalState(result.grammarInitialSymbol);

    return result.pda;
}

function saveGrammar(item) {
    let grammar = parseGrammarFromModal();
    if(!grammar) return null;
    saveToDisk(item, grammar, 'grammar.json');
}

function processImportedGrammar(json) {
    fillGrammarModal(JSON.parse(json));
}

function fillGrammarModal(productions) {
    clearGrammar();
    $('.lhs').val(productions[0].left);
    $('.rhs').val(productions[0].right);

    for(let i = 1; i < productions.length; i++) {
        $('#grammar-rules > tbody:last-child').append('<tr><td><div class="input-field inline"><input class="lhs" placeholder="Production" type="text" autofocus></div></td><td><div class="input-field "><input type="text" value="&#x2192" disabled></div></td><td><div class="input-field inline"><input class="rhs" placeholder="Terminal" type="text"></div></td></tr>');

        $('#grammar-rules tbody tr:last-child').find('.lhs').val(productions[i].left);
        $('#grammar-rules tbody tr:last-child').find('.rhs').val(productions[i].right);
    }

    $('.rhs').keypress(addNewGrammarRule);
    $('#modal-grammar').modal('open');
}

function clearGrammar() {
    let rows = $('#grammar-rules tbody tr');

    rows.remove();
    $('#grammar-rules > tbody:last-child').append('<tr><td><div class="input-field inline"><input class="lhs" placeholder="Production" type="text" autofocus></div></td><td><div class="input-field "><input type="text" value="&#x2192" disabled></div></td><td><div class="input-field inline"><input class="rhs" placeholder="Terminal" type="text"></div></td></tr>');
    $('.rhs').keypress(addNewGrammarRule);
    setEpsilonValue();
}

return {
    addNewRule: addNewRule,
    setEpsilonValue: setEpsilonValue,
    parseGrammarFromModal: parseGrammarFromModal,
    saveGrammar: saveGrammar,
    processImportedGrammar: processImportedGrammar,
    clearGrammar: clearGrammar,
    fillGrammarModal: fillGrammarModal,
    convertToPDA: convertToPDA
}

})();