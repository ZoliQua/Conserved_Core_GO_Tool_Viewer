$(document).ready(function() {
    // Load SVG file names into the diagramSelector dropdown
    $.getJSON('./data/diagrams.json', function(data) {
        for (let i = 2; i <= 7; i++) {
            const diagramName = `ortholog_venn_${i}.svg`;
            const option = $('<option></option>').text(diagramName);
            $('#diagramSelector').append(option);
        }
    });

    $('#showDiagramButton').click(function() {
    const diagramName = $('#diagramSelector option:selected').text();
    const diagramIndex = $('#diagramSelector option:selected').index();
    const diagramURL = './data/ortholog_venn_' + (diagramIndex + 2) + '.svg';
    $('#diagramContainer').html('<img src="' + diagramURL + '" alt="Venn Diagram">');
    });
});