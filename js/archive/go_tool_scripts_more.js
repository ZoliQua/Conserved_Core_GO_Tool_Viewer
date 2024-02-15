var dataTableVar

function convertToLinks(cellData) {
    const uniprots = cellData.split(",");
    
    if (uniprots[0] === "") {
        return "0";
    } else {
        const count = uniprots.length;
        let linkedUniprots = uniprots.map(id => `<a href="https://www.uniprot.org/uniprot/${id}" target="_blank">${id}</a>`).join(", ");
        return `${count}: ${linkedUniprots}`;
    }
}

function loadSvg() {
    // Path to the SVG file
    const svgFile = "data/ortholog_venn_7e.svg";

    $.ajax({
        url: svgFile,
        type: 'GET',
        dataType: 'xml',
        success: function(data) {
            // Empty the container and append the SVG content
            $('#diagramContainer').empty().append(data.documentElement);
            // Update labels after SVG is loaded
            updateSvgLabels();
        },
        error: function() {
            console.error("Error loading the SVG file");
        }
    });
}

    const columnNames = {
        "NameA": "A. thaliana Total",
        "NameB": "C. elegans Total",
        "NameC": "D. melanogaster Total",
        "NameD": "D. rerio Total",
        "NameE": "H. sapiens Total",
        "NameF": "S. cerevisiae Total",
        "NameG": "S. pombe Total"
    };

function updateSvgLabels() {

    for (const [placeholder, columnName] of Object.entries(columnNames)) {
        $('#diagramContainer').find(`text:contains('${placeholder}')`).each(function() {
            $(this).text(columnName);
        });
    }
}

let kogGroupMapping = {};

function calculateOverlaps(data) {
    let combinations = getAllCombinations(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    let overlaps = {};
    combinations.forEach(comb => overlaps[comb] = 0);

    // Retrieve the selected option from hitSelector
    let hitSelectorValue = $('#hitSelector').val();

    kogGroupMapping = {}; // Reset mapping

    data.split('\n').forEach((line, index) => {
        if (index === 0) return; // Skip header row

        const values = line.split('\t');
        if (values.length < 21) return; // Ensure there are enough columns

        const kogGroupId = values[0]; // Assuming the first column contains the KOG group ID
        // Conditionally slice the data based on the selected option
        if (hitSelectorValue === "hit") {
            speciesFlags = values.slice(14, 21).map(val => val.trim() !== ''); // For hit proteins
        } else if (hitSelectorValue === "total") {
            speciesFlags = values.slice(7, 14).map(val => val.trim() !== ''); // For total proteins
        }

        combinations.forEach(comb => {
            if (isExactMatch(comb, speciesFlags)) {
                overlaps[comb]++;
                // Add the KOG group to the mapping
                if (!kogGroupMapping[comb]) {
                    kogGroupMapping[comb] = [];
                }
                kogGroupMapping[comb].push(kogGroupId);
            }
        });
    });

    console.log('Calculated overlaps:', overlaps);
    return overlaps;
}

function getKogGroupsForCount(countId) {
    // Extract the combination from the countId (e.g., 'Count_ABC' -> 'ABC')
    const combination = countId.replace('Count_', '');

    // Return the KOG groups associated with this combination
    return kogGroupMapping[combination] || [];

}
console.log(dataTableVar);

function filterDataForKogGroup(kogGroupId) {
    // Split the raw data into lines
    const lines = rawData.split('\n');
    // Filter lines based on the KOG group ID
    const filteredLines = lines.filter(line => line.startsWith(kogGroupId + '\t'));
    // Return the filtered lines joined back into a string
    return filteredLines.join('\n');
}

function reloadDataIntoDataTable(filteredData) {
    // Start with an empty table HTML string
    let tableHtml = `<thead>
                        <tr>
                            <th>Group ID</th>
                            <th>Average H/M</th>
                            <th>Total H/M</th>
                            <th>Hit Proteins</th>
                            <th>Total Proteins</th>
                            <th>Hit Species</th>
                            <th>Total Species</th>
                            <!-- Assume these are the columns you want to keep hidden initially but maintain the structure -->
                            <th class="extra" style="display:none;">A. thaliana Hit</th>
                            <th class="extra" style="display:none;">C. elegans Hit</th>
                            <th class="extra" style="display:none;">D. melanogaster Hit</th>
                            <th class="extra" style="display:none;">D. rerio Hit</th>
                            <th class="extra" style="display:none;">H. sapiens Hit</th>
                            <th class="extra" style="display:none;">S. cerevisiae Hit</th>
                            <th class="extra" style="display:none;">S. pombe Hit</th>
                            <th class="extra" style="display:none;">A. thaliana Non-Hit</th>
                            <th class="extra" style="display:none;">C. elegans Non-Hit</th>
                            <th class="extra" style="display:none;">D. melanogaster Non-Hit</th>
                            <th class="extra" style="display:none;">D. rerio Non-Hit</th>
                            <th class="extra" style="display:none;">H. sapiens Non-Hit</th>
                            <th class="extra" style="display:none;">S. cerevisiae Non-Hit</th>
                            <th class="extra" style="display:none;">S. pombe Non-Hit</th>
                            <th>More</th>
                        </tr>
                    </thead>`;
    tableHtml += "<tbody>";

    // Iterate over your filteredData to create rows
    filteredData.forEach(row => {
        tableHtml += `<tr>
                        <td>${row.groupId}</td>
                        <td>${row.avgHM}</td>
                        <td>${row.totalHM}</td>
                        <td>${row.hitProteins}</td>
                        <td>${row.totalProteins}</td>
                        <td>${row.hitSpecies}</td>
                        <td>${row.totalSpecies}</td>
                        <!-- Keep the extra data, but it will be hidden due to the class style -->
                        <td class="extra" style="display:none;">${row.aThalianaHit}</td>
                        <td class="extra" style="display:none;">${row.cElegansHit}</td>
                        <td class="extra" style="display:none;">${row.dMelanogasterHit}</td>
                        <td class="extra" style="display:none;">${row.dRerioHit}</td>
                        <td class="extra" style="display:none;">${row.hSapiensHit}</td>
                        <td class="extra" style="display:none;">${row.sCerevisiaeHit}</td>
                        <td class="extra" style="display:none;">${row.sPombeHit}</td>
                        <td class="extra" style="display:none;">${row.aThalianaNonHit}</td>
                        <td class="extra" style="display:none;">${row.cElegansNonHit}</td>
                        <td class="extra" style="display:none;">${row.dMelanogasterNonHit}</td>
                        <td class="extra" style="display:none;">${row.dRerioNonHit}</td>
                        <td class="extra" style="display:none;">${row.hSapiensNonHit}</td>
                        <td class="extra" style="display:none;">${row.sCerevisiaeNonHit}</td>
                        <td class="extra" style="display:none;">${row.sPombeNonHit}</td>
                        <!-- Add the rest of the .extra data cells similarly -->
                        <td><span class="show-more">Show More</span></td>
                      </tr>`;
    });

    tableHtml += "</tbody>";

    // Replace the current table HTML with the new one
    $('#dataTable').html(tableHtml);

    // Re-initialize the DataTable or adjust it as necessary
    $('#dataTable').DataTable().draw();
}


function displayKogGroups(kogGroups) {
    let content = '<ul>';
    kogGroups.forEach(group => {
        content += `<li><a href="#" class="kog-group" data-kog-id="${group}">${group}</a></li>`;
    });
    content += '</ul>';

    $('#detailsBox').html(content).show();

    // Click event handler for KOG group links
    $('.kog-group').click(function(e) {
        e.preventDefault();
        const kogGroupId = $(this).text(); // Assuming the text of the clicked element is the KOG group ID
        const filteredData = filterDataForKogGroup(kogGroupId);
        reloadDataIntoDataTable(filteredData);
    });
}

function showKogGroups(countId) {
    // You need to implement logic here to identify which KOG groups
    // correspond to the clicked count.
    // For example:
    const kogGroups = getKogGroupsForCount(countId); // Implement this function

    // Now, display these KOG groups
    displayKogGroups(kogGroups);
}


function getAllCombinations(elements) {
    let result = [];

    const combine = (prefix, elems) => {
        for (let i = 0; i < elems.length; i++) {
            result.push(prefix + elems[i]);
            combine(prefix + elems[i], elems.slice(i + 1));
        }
    };

    combine('', elements);
    return result;
}

function isExactMatch(combination, dataFlags) {
    let matchCount = 0;

    for (let i = 0; i < dataFlags.length; i++) {
        if (dataFlags[i]) {
            if (combination.includes(String.fromCharCode(65 + i))) {
                matchCount++;
            } else {
                return false; // Extra column has data which is not in the combination
            }
        }
    }

    return matchCount === combination.length;
}



function updateSvgCounts(overlaps) {
    for (const [combination, count] of Object.entries(overlaps)) {
        const elementId = `Count_${combination}`;
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = count;
        } else {
            console.error(`Element with id '${elementId}' not found`);
        }
    }
}



$('#closeDetailsTable').click(function() {
    $('#detailsTableWrapper').hide();
});

$( "#detailsTableWrapper" ).draggable();

$(document).ready(function() {
    const list_of_terms = {
    'GO:1901135': 'carbohydrate derivative metabolic process',
    'GO:0140053': 'mitochondrial gene expression',
    'GO:0140014': 'mitotic nuclear division',
    'GO:0140013': 'meiotic nuclear division',
    'GO:0098754': 'detoxification',
    'GO:0098542': 'defense response to other organism',
    'GO:0072659': 'protein localization to plasma membrane',
    'GO:0071941': 'nitrogen cycle metabolic process',
    'GO:0071554': 'cell wall organization or biogenesis',
    'GO:0065003': 'protein-containing complex assembly',
    'GO:0061024': 'membrane organization',
    'GO:0061007': 'hepaticobiliary system process',
    'GO:0055086': 'nucleobase-containing small molecule metabolic process',
    'GO:0055085': 'transmembrane transport',
    'GO:0055065': 'metal ion homeostasis',
    'GO:0051604': 'protein maturation',
    'GO:0050886': 'endocrine process',
    'GO:0050877': 'nervous system process',
    'GO:0048870': 'cell motility',
    'GO:0048856': 'anatomical structure development',
    'GO:0044782': 'cilium organization',
    'GO:0042254': 'ribosome biogenesis',
    'GO:0042060': 'wound healing',
    'GO:0036211': 'protein modification process',
    'GO:0034330': 'cell junction organization',
    'GO:0032200': 'telomere organization',
    'GO:0031047': 'gene silencing by RNA',
    'GO:0030198': 'extracellular matrix organization',
    'GO:0030163': 'protein catabolic process',
    'GO:0030154': 'cell differentiation',
    'GO:0023052': 'signaling',
    'GO:0022600': 'digestive system process',
    'GO:0022414': 'reproductive process',
    'GO:0016192': 'vesicle-mediated transport',
    'GO:0016073': 'snRNA metabolic process',
    'GO:0016071': 'mRNA metabolic process',
    'GO:0015979': 'photosynthesis',
    'GO:0012501': 'programmed cell death',
    'GO:0007568': 'aging',
    'GO:0007163': 'establishment or maintenance of cell polarity',
    'GO:0007155': 'cell adhesion',
    'GO:0007059': 'chromosome segregation',
    'GO:0007040': 'lysosome organization',
    'GO:0007031': 'peroxisome organization',
    'GO:0007018': 'microtubule-based movement',
    'GO:0007010': 'cytoskeleton organization',
    'GO:0007005': 'mitochondrion organization',
    'GO:0006954': 'inflammatory response',
    'GO:0006914': 'autophagy',
    'GO:0006913': 'nucleocytoplasmic transport',
    'GO:0006886': 'intracellular protein transport',
    'GO:0006790': 'sulfur compound metabolic process',
    'GO:0006766': 'vitamin metabolic process',
    'GO:0006629': 'lipid metabolic process',
    'GO:0006575': 'cellular modified amino acid metabolic process',
    'GO:0006520': 'cellular amino acid metabolic process',
    'GO:0006486': 'protein glycosylation',
    'GO:0006457': 'protein folding',
    'GO:0006399': 'tRNA metabolic process',
    'GO:0006355': 'regulation of transcription, DNA-templated',
    'GO:0006351': 'transcription, DNA-templated',
    'GO:0006325': 'chromatin organization',
    'GO:0006310': 'DNA recombination',
    'GO:0006281': 'DNA repair',
    'GO:0006260': 'DNA replication',
    'GO:0006091': 'generation of precursor metabolites and energy',
    'GO:0005975': 'carbohydrate metabolic process',
    'GO:0003016': 'respiratory system process',
    'GO:0003014': 'renal system process',
    'GO:0003013': 'circulatory system process',
    'GO:0003012': 'muscle system process',
    'GO:0002376': 'immune system process',
    'GO:0002181': 'cytoplasmic translation',
    'GO:0000910': 'cytokinesis',
    'GO:0000278': 'mitotic cell cycle',
    'GO:0007049': 'cell cycle',
    'GO:0000902': 'cell morphogenesis',
    'GO:0006259': 'DNA metabolic process',
    'GO:0008361': 'regulation of cell size',
    'GO:0051726': 'regulation of cell cycle',
    'GO:0051301': 'cell division',
    'GO:0006412': 'translation',
    'GO:0006099': 'tricarboxylic acid cycle',
    'GO:0000502': 'proteasome complex',
    'GO:0009295': 'nucleoid'
    };

    // Function to filter DataTable based on KOG groups
    function filterDataTableForKogGroups(kogGroups) {
        if (dataTableVar && dataTableVar.api) {
            // Clear current search
            dataTableVar.api().search('');

            // Apply search for each KOG group and draw. Adjust as necessary for your DataTable version.
            kogGroups.forEach(kogGroup => {
                dataTableVar.api().search(kogGroup, true, false);
            });

            dataTableVar.api().draw();
        }
    }

    // Add options to the selector dynamically
    $.each(list_of_terms, function(key, value) {
        $('#goSelector').append($('<option>', {
            value: key.toLowerCase().replace(/:/g, '-'),
            text: `${key}: ${value}`
        }));
    });

    $('#detailsTable').hide();

     // Make each row clickable to toggle extra columns
    $('#dataTable').on('click', 'tr', function() {
     // $(this).find('.extra').toggle();
     // $('#dataTable th.extra').toggle();
      $('#dataTable').DataTable(); // Redraw the table without resetting paging
    });

    // Event listener for button click
    $('#loadDataBtn').click(function() {
        const selectedGO = $('#goSelector').val();
        const goID = selectedGO.toUpperCase().replace(/-/g, ':')
        const goName = list_of_terms[goID];  // Get the GO term name

        // Check if a GO term is selected
        if (!selectedGO) {
            alert('Please select a GO term!');
            return;
        }

        // Create the header with the GO term name and link
        const goHeader = `<h1>
            <a href="https://amigo.geneontology.org/amigo/term/${goID}" target="_blank">
                ${goID} - ${goName} 
            </a>
        </h1>
        `;

        // Add the header to the DOM. Replace '#goHeaderContainer' with the ID of the container where you want to place the header
        $('#goHeaderContainer').html(goHeader);

        // Load the SVG file
        loadSvg();


        const fileName = `data/${selectedGO}-ordered-2022-01.tsv`;

        // Fetch data file
        $.ajax({
            url: fileName,
            type: 'GET',
            dataType: 'text',
            success: function(data) {
                
                rawData = data;

                const overlaps = calculateOverlaps(data);
                console.log(overlaps);
                updateSvgCounts(overlaps);

                 // Add click event listener to SVG text elements
                $('#diagramContainer svg text').click(function() {
                    const textId = $(this).attr('id');
                    if (textId && textId.startsWith('Count_')) {
                        const kogGroups = getKogGroupsForCount(textId);
                        filterDataTableForKogGroups(kogGroups);
                        displayKogGroups(kogGroups); // Assuming this function correctly populates #detailsBox
                        showKogGroups(textId);
                    }
                });

                // Parse the TSV data and display in table
                // Note: This assumes a specific structure of your TSV file and may need adjustment
                const rows = data.split('\n');
                let tableHtml = `<thead>
                                <tr>
                                    <th>Group ID</th>
                                    <th>Average H/M</th>
                                    <th>Total H/M</th>
                                    <th>Hit Proteins</th>
                                    <th>Total Proteins</th>
                                    <th>Hit Species</th>
                                    <th>Total Species</th>
                                    <th class="extra">A. thaliana Hit</th>
                                    <th class="extra">C. elegans Hit</th>
                                    <th class="extra">D. melanogaster Hit</th>
                                    <th class="extra">D. rerio Hit</th>
                                    <th class="extra">H. sapiens Hit</th>
                                    <th class="extra">S. cerevisiae Hit</th>
                                    <th class="extra">S. pombe Hit</th>
                                    <th class="extra">A. thaliana Non-Hit</th>
                                    <th class="extra">C. elegans Non-Hit</th>
                                    <th class="extra">D. melanogaster Non-Hit</th>
                                    <th class="extra">D. rerio Non-Hit</th>
                                    <th class="extra">H. sapiens Non-Hit</th>
                                    <th class="extra">S. cerevisiae Non-Hit</th>
                                    <th class="extra">S. pombe Non-Hit</th>
                                    <th>More</th>
                                </tr>
                                </thead>`;
                $.each(rows, function(index, row) {
                    if (index === 0) return true; // Skip the header row

                    const columns = row.split('\t');
                    if (columns.length > 6) { // 7 initial columns + 14 extra columns
                        tableHtml += `<tr>
                                        <td class="lineKOGHeader"><a href="http://eggnog5.embl.de/#/app/results?target_nogs=${columns[0]}" target="_blank">${columns[0]}</a></td>
                                        <td>${columns[1]}</td>
                                        <td>${columns[2]}</td>
                                        <td>${columns[3]}</td>
                                        <td>${columns[4]}</td>
                                        <td>${columns[5]}</td>
                                        <td>${columns[6]}</td>
                                        <td class="extra">${columns[14]}</td>
                                        <td class="extra">${columns[15]}</td>
                                        <td class="extra">${columns[16]}</td>
                                        <td class="extra">${columns[17]}</td>
                                        <td class="extra">${columns[18]}</td>
                                        <td class="extra">${columns[19]}</td>
                                        <td class="extra">${columns[20]}</td>
                                        <td class="extra">${columns[7]}</td>
                                        <td class="extra">${columns[8]}</td>
                                        <td class="extra">${columns[9]}</td>
                                        <td class="extra">${columns[10]}</td>
                                        <td class="extra">${columns[11]}</td>
                                        <td class="extra">${columns[12]}</td>
                                        <td class="extra">${columns[13]}</td>
                                        <td><span class="show-more">Show More</span></td>
                                    </tr>`;
                    }
                });
                $('#dataTable').html(tableHtml);
                if ($.fn.dataTable.isDataTable('#dataTable')) {
                    $('#dataTable').DataTable().destroy();
                }
                let dataTableVar = $('#dataTable').dataTable({
                    "paging": true,
                    "searching": true,
                    "ordering": true
                });

            },
            error: function(error) {
                console.error("Error fetching the data", error);
            }
        });
    });

    // When a row in the main table is clicked
    $('#dataTable').on('click', '.show-more', function() {

        // Find the parent row of the clicked "Show More" element
        const parentRow = $(this).closest('tr');

        // Clear the detailsTable
        $('#detailsTable').empty();

        // Extract the 14 extra columns data from the parent row
        const extraColumnsData = parentRow.find('.extra').map(function() {
            return $(this).html();  // Use `.html()` to retain the clickable hyperlinks
        }).get();

        const lineKOGHeader = parentRow.find('.lineKOGHeader').map(function() {
            return $(this).text();  // Use `.html()` to retain the clickable hyperlinks
        }).get();

        $('#detailsTableHeaderText').text(lineKOGHeader + " Details");

        // Define the headers
        const headers = [
            "A. thaliana", "C. elegans", "D. melanogaster", "D. rerio", 
            "H. sapiens", "S. cerevisiae", "S. pombe"
        ];

        // Add headers to the detailsTable
        let tableHeaders = `
            <tr>
                <th>Species</th>
                <th>Hit</th>
                <th>Non-Hit</th>
            </tr>
        `;
        $('#detailsTable').append(tableHeaders);

        // Construct and append the new rows to the detailsTable
        for (let i = 0; i < headers.length; i++) {
            let detailsRow = '<tr>';
            detailsRow += `<td>${headers[i]}</td>`;
            let hitData = extraColumnsData[i];
            let hitArray = hitData.split(',');
            detailsRow += `<td>${convertToLinks(hitData)}</td>`;
            let nonHitData = extraColumnsData[i + headers.length];
            // Filter out the "Hit" results from the "Non-Hit" data
            let nonHitArray = nonHitData.split(',');
            nonHitArray = nonHitArray.filter(item => !hitArray.includes(item));
            nonHitData = nonHitArray.length > 0 ? nonHitArray.join(',') : '0';
            detailsRow += `<td>${convertToLinks(nonHitData)}</td>`;
            detailsRow += '</tr>';
            $('#detailsTable').append(detailsRow);
        }

        // Display the detailsTable
        $('#detailsTable').show();
        $('#detailsTableWrapper').show();
    });

/*     $('#dataTable').on('click', '.show-more', function() {

        // Find the parent row of the clicked "Show More" element
        const parentRow = $(this).closest('tr');

        // Clear the detailsTable
        $('#detailsTable').empty();

        // Add headers to the detailsTable
        let headers = `
            <tr>
                <th>A. thaliana Hit</th>
                <th>C. elegans Hit</th>
                <th>D. melanogaster Hit</th>
                <th>D. rerio Hit</th>
                <th>H. sapiens Hit</th>
                <th>S. cerevisiae Hit</th>
                <th>S. pombe Hit</th>
                <th>A. thaliana Non-Hit</th>
                <th>C. elegans Non-Hit</th>
                <th>D. melanogaster Non-Hit</th>
                <th>D. rerio Non-Hit</th>
                <th>H. sapiens Non-Hit</th>
                <th>S. cerevisiae Non-Hit</th>
                <th>S. pombe Non-Hit</th>
            </tr>
        `;
        $('#detailsTable').append(headers);

        // Extract the 14 extra columns data from the parent row
        const extraColumnsData = parentRow.find('.extra').map(function() {
            return $(this).html();  // Use `.html()` to retain the clickable hyperlinks
        }).get();

        // Construct and append the new row to the detailsTable
        let detailsRow = '<tr>';
        $.each(extraColumnsData, function(index, cellData) {
            detailsRow += `<td>${cellData}</td>`;
        });
        detailsRow += '</tr>';
        $('#detailsTable').append(detailsRow);

        // Display the detailsTable
        $('#detailsTable').show();
        $('#detailsTableWrapper').show();
    }); */

    // Event listener for the hitSelector dropdown change
    $('#hitSelector').change(function() {
        // Trigger the data loading and overlap calculation process here
        $('#loadDataBtn').click(); // This is a simple way to re-trigger data loading and processing
    });

});

