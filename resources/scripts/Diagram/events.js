
var events = {
    blankPointerClick: blankPointerClick,
    cellPointerDown: cellPointerDown,
    cellPointerClick: cellPointerClick,
    changeTarget: changeTarget,
    changeSource: changeSource,
    changePosition: changePosition,
    remove: remove
};

function blankPointerClick(evt, x, y) {
    if(selectedState) selectedCell.attr({circle: {fill: '#5755a1'}});
    selectedCell = null;
    selectedState = null;
    $('#toolbar').hide();
    if(toolbarAction === 'insert') {
        let element = diagram.generateVisualElement(x, y, 'q' + automaton.getCounter());

        graph.addCell(element);
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
            if(selectedState) selectedCell.attr({circle: {fill: '#5755a1'}});

            selectedState = automaton.getState(cellView.model.id);
            selectedCell = cellView.model;
            selectedCell.attr({circle: {fill: 'green'}});
            document.getElementById('initialCheckbox').checked = selectedState.isInitial();
            document.getElementById('finalCheckbox').checked = selectedState.isFinal();
            $('#toolbar').show();
        }
    }
}

function changeTarget(link) {
    if(link.get('target').id) {
        if(!link.attributes.labels) {
            createNewTransition(link);
        }
        else {
            events.remove(link);
            updateTransition(link);
        }
    }
}

function changeSource(link) {
    if(link.get('source').id) {
        removeLinkSource(link);
        updateTransition(link);
    }
}

function changePosition(element) {
    let links = graph.getConnectedLinks(element, {outbound: true});
    let posX = element.get('position').x;
    let posY = element.get('position').y;
    let vertices = null;
    let newVertices = null;
    let counterX = 20;

     _.each(links, function(link) {
        if(link.hasLoop()) {
            vertices = link.get('vertices');
            if (vertices && vertices.length) {
                newVertices = [];
                _.each(vertices, function(vertex) {
                    newVertices.push({ x: (posX-vertex.x)+vertex.x+counterX, y: posY-40 });
                    counterX += 20;
                });
                link.set('vertices', newVertices);
            }
        }
    });
}

function remove(cell) {
    if(cell.isLink()) diagram.removeLink(cell);
}

function createNewTransition(link) {
    newTransition = link;
    if(automaton instanceof PDA) $('#modal-pda').modal('open');
    else if(automaton instanceof Turing) $('#modal-turing').modal('open');
    else setTransition();
}

function updateTransition(link) {
    newTransition = link;
    changeTransition();
}

function removeLinkSource(link) {
    diagram.removeLinkSource(link);
}