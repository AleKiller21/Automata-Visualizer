
var events = {
    blankPointerClick: blankPointerClick,
    cellPointerDown: cellPointerDown,
    cellPointerClick: cellPointerClick,
    changeSourceChangeTarget:changeSourceChangeTarget,
    changeTarget: changeTarget,
    changeSource: changeSource,
    remove: remove
};

function blankPointerClick(evt, x, y) {
    if(selectedState) selectedCell.attr({circle: {fill: '#5755a1'}});
    selectedCell = null;
    selectedState = null;
    $('#toolbar').hide();
    if(toolbarAction === 'insert') {
        let element = new joint.shapes.fsa.State({
            position: { x: x, y: y },
            size: { width: 60, height: 60 },
            attrs: {
                text: {text: 'q' + automaton.getCounter()}
            }
        });
        graph.addCell(element);
        // let initialSymbol =  new joint.shapes.basic.initialSymbol({
        //     position: { x: x - 40, y: y + 50 },
        //     size: { width: 40, height: 40 }
        // }); 
        // initialSymbol.attr({

        //     polygon: { fill: '#000000', 'stroke-width': 2, stroke: 'black' }
        // });
        // graph.addCell(initialSymbol);
        // element.embed(initialSymbol);

        automaton.insertState(element.id);
        console.log(automaton);
    }
}

function cellPointerDown(cellView, evt, x, y) {
    if(toolbarAction === 'remove') {
        cellView.model.remove();
        automaton.removeState(cellView.model.attributes.attrs.text.text);
        $('#toolbar').hide();
        selectedCell = null;
        selectedState = null;
        console.log(automaton);
    }
}

function cellPointerClick(cellView, evt, x, y) {
    if(toolbarAction === 'select') {
        if(cellView.model.isElement()) {
            if(selectedState && !selectedState.isInitial()) selectedCell.attr({circle: {fill: '#5755a1'}});

            selectedState = automaton.getState(cellView.model.id);
            selectedCell = cellView.model;
            selectedCell.attr({circle: {fill: 'green'}});
            document.getElementById('initialCheckbox').checked = selectedState.isInitial();
            document.getElementById('finalCheckbox').checked = selectedState.isFinal();
            $('#toolbar').show();
        }
    }
}

function changeSourceChangeTarget(link) {
    if(link.get('source').id && link.get('target').id && !link.attributes.labels) {
        setTransition(link);
    }
}

function changeTarget(link) {
    if(link.get('target').id) {
        console.log('cambio');
    }
}

function changeSource(link) {
    if(link.get('source').id) {
        console.log('cambio');
    }
}

function remove(cell) {
    if(cell.isLink()) removeLink(cell);
}