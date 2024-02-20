// Conserved Core GO_TOOL - Scripts
// Description: This script is used to load the Venn Diagram SVG file and a selected GO term TSV file, calculate overlaps, and display the data in the DataTable.
// Author: Zoltan Dul, Phd 2024

var dataTableVar

// Path to the SVG file (Venn Diagram)
const svgFile = "data/ortholog_venn_7e.svg";

// List of the names of species to show in the SVG
const columnNames = {
    "NameA": "A. thaliana",
    "NameB": "C. elegans",
    "NameC": "D. melanogaster",
    "NameD": "D. rerio",
    "NameE": "H. sapiens",
    "NameF": "S. cerevisiae",
    "NameG": "S. pombe"
};

// List of terms that currently have a TSV file
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

function convertToLinks(cellData) {
    const uniprots = cellData.split(",");
    
    if (uniprots[0] === "") {
        return "0";
    }
    else {
        const count = uniprots.length;
        let linkedUniprots = uniprots.map(id => `<a href="https://www.uniprot.org/uniprot/${id}" target="_blank">${id}</a>`).join(", ");
        return `${count}: ${linkedUniprots}`;
    }
}

function loadSvg(svgFile) {
    $.ajax({
        url: svgFile,
        type: 'GET',
        dataType: 'xml',
        success: function(data) {
            // Empty the container and append the SVG content
            $('#diagramContainer').empty().append(data.documentElement);

            // Update labels after SVG is loaded
            updateSvgSpeciesLabels();
        },
        error: function() {
            console.error("Error loading the SVG file" + svgFile);
        }
    });
}

function updateSvgSpeciesLabels() {
    for (const [placeholder, columnName] of Object.entries(columnNames)) {
        $('#diagramContainer').find(`text:contains('${placeholder}')`).each(function() {
            $(this).text(columnName);
        });
    }
}

// Raw data from the TSV file
let kogGroupMapping = {};

function calculateOverlaps(data) {
    let combinations = getAllCombinations(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
    let overlaps = {};
    combinations.forEach(comb => overlaps[comb] = 0);

    // Retrieve the selected option from hitSelector
    let hitSelectorValue = $('#hitSelector').val();
    // Reset mapping
    kogGroupMapping = {}; 

    data.split('\n').forEach((line, index) => {
        // Skip header row
        if (index === 0) return; 
        // Split the line by tab to get the values
        const values = line.split('\t');
        // Ensure there are enough columns otherwise skip the line
        if (values.length < 21) return;
        // Assuming the first column contains the KOG group ID
        const kogGroupId = values[0];
        // Conditionally slice the data based on the selected option
        if (hitSelectorValue === "hit") {
            // For hit proteins
            speciesFlags = values.slice(14, 21).map(val => val.trim() !== ''); 
        } else if (hitSelectorValue === "total") {
            // For total proteins
            speciesFlags = values.slice(7, 14).map(val => val.trim() !== '');
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

function filterDataForKogGroups(kogGroupIds) {
    // Ensure kogGroupIds is treated as an array, even if it's a single value
    const idsArray = Array.isArray(kogGroupIds) ? kogGroupIds : [kogGroupIds];
    
    // Split the raw data into lines
    const lines = rawData.split('\n');
    
    // Filter lines based on the KOG group IDs
    const filteredLines = lines.filter(line => 
        idsArray.some(id => line.startsWith(id + '\t'))
    );
    
    // Return the filtered lines joined back into a string
    return filteredLines.join('\n');
}

function reloadDataIntoDataTable(filteredData, OverlappedSpecies) {
    // Split the filtered data back into lines
    const lines = filteredData.trim().split('\n');

    // Destroy the existing DataTable if it exists
    if ($.fn.dataTable.isDataTable('#dataTable')) {
        $('#dataTable').DataTable().destroy();
    }

    // Initialize the DataTable
    let dataTable = $('#dataTable').DataTable({
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'csv',
                filename: 'go_tool_export', // Custom file name for CSV
                exportOptions: {
                    columns: ':not(:last-child)' // Adjust selector as needed
                }
            },
            {
                extend: 'excelHtml5',
                title: 'GO_Tool_Export', // This sets the Excel file's sheet name
                filename: 'go_tool_export', // Custom file name for the Excel file
                exportOptions: {
                    columns: ':not(:last-child)',
                    format: {
                        header: function (data, columnIdx, node, config) {
                            // Check if the header ends with "Non-Hit" and replace it with "Total"
                            if (data.endsWith('Non-Hit')) {
                                return data.replace('Non-Hit', 'Total');
                            }
                            return data; // Return the original data if no replacement is needed
                        }
                    }
                },
                customize: function(xlsx) {
                    var sheet = xlsx.xl.worksheets['sheet1.xml'];
                    // Change the sheet name in the Excel file
                    $('worksheet', sheet).attr('name', 'GO_Tool_Export');
            
                    // Assuming OverlappedSpecies is a string or can be converted to a string.
                    var overlappedSpeciesText = OverlappedSpecies.toString();
            
                    // Insert custom row at the top of the Excel file
                    var row = sheet.createElement('row');
                    row.setAttribute('r', 1); // Sets the row number (1-based index)
            
                    var cell = sheet.createElement('c');
                    cell.setAttribute('t', 'inlineStr'); // Set cell type to inline string
                    cell.setAttribute('r', 'A1'); // Reference to the first cell in the row
            
                    var is = sheet.createElement('is'); // InlineStr element to hold the text
                    var t = sheet.createElement('t'); // Text element
                    t.textContent = overlappedSpeciesText; // Set text content to the variable
            
                    // Append elements correctly
                    is.appendChild(t);
                    cell.appendChild(is);
                    row.appendChild(cell);
            
                    // Prepend the custom row to the sheet
                    var sheetData = $('sheetData', sheet);
                    sheetData.prepend(row);
            
                    // Update row indices and cell references for existing rows to accommodate the new row
                    $('row', sheetData).each(function() {
                        // Skip the first row since it's our custom row
                        if (this !== row) {
                            var rowIndex = parseInt($(this).attr('r'), 10) + 1; // Increment row index
                            $(this).attr('r', rowIndex.toString());
                            $('c', this).each(function() {
                                var cellRef = $(this).attr('r');
                                var newRef = cellRef.replace(/\d+/, rowIndex.toString());
                                $(this).attr('r', newRef);
                            });
                        }
                    });
                }
            }, 'print'
        ]
    });

    // Clear the existing data in DataTable
    dataTable.clear();

    if (!(lines.length === 1 && lines[0] === '')) {
        lines.forEach(row => {
            // Split row by tab to get columns
            const columns = row.split('\t');

            // Construct newRow according to the specified order flip hit and non-hit.
            let newRow = [];

            // Columns 0-6 - First 7 columns
            for (let i = 0; i <= 6; i++) {
                if (i === 0) { 
                    // First column with a link to KOG
                    newRow.push(`<td><a href="http://eggnog5.embl.de/#/app/results?target_nogs=${columns[i]}" target="_blank">${columns[i]}</a></td>`);
                } else {
                    newRow.push(`<td>${columns[i]}</td>`);
                }
            }

            // Columns 14-20
            for (let i = 14; i <= 20; i++) {
                newRow.push(`<td class="extra" style="display:none;">${columns[i]}</td>`);
            }

            // Columns 7-13
            for (let i = 7; i <= 13; i++) {
                newRow.push(`<td class="extra" style="display:none;">${columns[i]}</td>`);
            }

            // Append "Show More" button in the last cell
            newRow.push(`<td><span class="show-more">Show More</span></td>`);

            // Join newRow array to form the row HTML
            let rowHtml = `<tr>${newRow.join("")}</tr>`;

            // Add the row HTML to the DataTable
            dataTable.row.add($(rowHtml)).draw(false); // Use draw(false) for optimal performance
        });

        // Redraw the DataTable to apply changes after all rows have been added
        dataTable.draw();
    }
}


function displayKogGroups(kogGroups, headerSpecies) {
    // Generate the HTML content for the list of KOG groups
    let contentToDisplay = '<ul>';
    kogGroups.forEach(group => {
        contentToDisplay += `<li><a href="#" class="kog-group" data-kog-id="${group}">${group}</a></li>`;
    });
    contentToDisplay += '</ul>';

    // Filter the data for the KOG groups and reload it into the DataTable in cases of click on SVG text.
    const filteredData = filterDataForKogGroups(kogGroups);
    reloadDataIntoDataTable(filteredData, headerSpecies);

    // Display the list of KOG Groups in the detailsContentBox
    $('#detailsContentBox').html(contentToDisplay).show();

    // Click event handler for a single KOG group link
    // If you click on a KOG group, the DataTable will be filtered for that KOG group
    $('.kog-group').click(function(e) {
        e.preventDefault();
        const kogGroupId = $(this).text();
        const filteredData = filterDataForKogGroups(kogGroupId);
        reloadDataIntoDataTable(filteredData, headerSpecies);
    });
}

function displayKogHeader(countId) {
    // Extract the combination from the countId (e.g., 'Count_ABC' -> 'ABC')
    var headerChars = countId.replace('Count_', '');

    const transformedColumnNames = Object.entries(columnNames).reduce((acc, [key, value]) => {
        // Extract the last character of the key which corresponds to the letter
        const newKey = key.charAt(key.length - 1);
        // Assign the value to the new key in the accumulator object
        acc[newKey] = value;
        return acc;
    }, {});

    let headerSpecies = "Combination of Species: "
    headerSpecies += headerChars.split('').map(char => transformedColumnNames[char]).join(', ');
    
    // Display the list of relevant species in the #detailsHeaderBox
    $('#detailsHeaderBox').html(headerSpecies).show();

    return headerSpecies;
}

function showKogGroups(countId, headerSpecies) {
    // Extract the combination from the countId (e.g., 'Count_ABC' -> 'ABC')
    const kogGroups = getKogGroupsForCount(countId);

    // Display the KOG groups
    displayKogGroups(kogGroups, headerSpecies);
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
      $('#dataTable').DataTable(); // Redraw the table without resetting paging
    });

    // Event listener for button click
    $('#loadDataBtn').click(function() {
        // Get the selected GO term
        const selectedGO = $('#goSelector').val();
        // Convert the selected GO term to the format used in the TSV file
        const goID = selectedGO.toUpperCase().replace(/-/g, ':')
        // Get the GO term name
        const goName = list_of_terms[goID];  // Get the GO term name

        // Check if a GO term is selected if not alert the user
        if (!selectedGO) {
            alert('Please select a GO term!');
            return;
        }

        // Create the header with the GO term name and link
        const goHeader = `<h1>
            <a href="https://amigo.geneontology.org/amigo/term/${goID}" target="_blank">
                ${goID} - ${goName} 
            </a>
        </h1>`;

        // Add the header to the DOM. Replace '#goHeaderContainer' with the ID of the container where you want to place the header
        $('#goHeaderContainer').html(goHeader);

        // Load the SVG file
        loadSvg(svgFile);

        // Set TSV filename based on the selected GO term
        const tsvFile = `data/${selectedGO}-ordered-2022-01.tsv`;

        // Fetch data from TSV file
        $.ajax({
            url: tsvFile,
            type: 'GET',
            dataType: 'text',
            success: function(data) {
                
                rawData = data;

                const overlaps = calculateOverlaps(data);
                console.log(overlaps);
                updateSvgCounts(overlaps);

                 // Add click event listener to SVG text elements
                $('#diagramContainer svg text').click(function() {
                    // Get the ID of the clicked text element from SVG image
                    const svgTextId = $(this).attr('id');

                    // Check if the clicked element is a count of a KOG group if not skip
                    if (svgTextId && svgTextId.startsWith('Count_')) {
                        // Get the KOG groups for the clicked count
                        const kogGroups = getKogGroupsForCount(svgTextId);
                        // Filter the DataTable based on the KOG groups
                        filterDataTableForKogGroups(kogGroups);
                        // Display the KOG header
                        const headerSpecies = displayKogHeader(svgTextId);
                        // Display the KOG groups
                        displayKogGroups(kogGroups, headerSpecies);
                        // Show the details table
                        showKogGroups(svgTextId, headerSpecies);
                    }
                });

                // Split the data into rows
                const rows = data.split('\n');
                let tableHead = `<thead>
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
                
                let tableHtml = tableHead;
                tableHtml += "<tbody>";

                $.each(rows, function(index, row) {
                    // Skip the header row
                    if (index === 0) return true;

                    const columns = row.split('\t');
                    // 7 initial columns + 14 extra columns, while flipping hit and non-hit columns
                    if (columns.length > 6) { 
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

                tableHtml += "</tbody>";

                // Copy the header to the footer
                tableHtml += tableHead.replace('thead', 'tfoot');

                $('#dataTable').html(tableHtml);
                if ($.fn.dataTable.isDataTable('#dataTable')) {
                    $('#dataTable').DataTable().destroy();
                }
                let dataTableVar = $('#dataTable').dataTable({
                    "paging": true,
                    "searching": true,
                    "ordering": true,
                    dom: 'Bfrtip',
                    buttons: [
                        {
                            extend: 'csv',
                            filename: 'go_tool_export', // Custom file name for CSV
                            exportOptions: {
                                columns: ':not(:last-child)' // Adjust selector as needed
                            }
                        },
                        {
                            extend: 'excelHtml5',
                            title: 'GO_Tool_Export', // This sets the Excel file's sheet name
                            filename: 'go_tool_export', // Custom file name for the Excel file
                            exportOptions: {
                                columns: ':not(:last-child)',
                                format: {
                                    header: function (data, columnIdx, node, config) {
                                        // Check if the header ends with "Non-Hit" and replace it with "Total"
                                        if (data.endsWith('Non-Hit')) {
                                            return data.replace('Non-Hit', 'Total');
                                        }
                                        // Return the original data if no replacement is needed
                                        return data; 
                                    }
                                }
                            },
                            customize: function(xlsx) {
                                var sheet = xlsx.xl.worksheets['sheet1.xml'];
                                // Change the sheet name in the Excel file
                                $('worksheet', sheet).attr('name', 'GO_Tool_Export');
                            }
                        },
                    ]
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
            
            if(nonHitData == 0) {
                detailsRow += `<td>${nonHitData}</td>`;
            }
            else {
                detailsRow += `<td>${convertToLinks(nonHitData)}</td>`;
            }
            
            detailsRow += '</tr>';
            $('#detailsTable').append(detailsRow);
        }

        // Display the detailsTable
        $('#detailsTable').show();
        $('#detailsTableWrapper').show();
    });

    // Event listener for the hitSelector dropdown change
    $('#hitSelector').change(function() {
        // Trigger the data loading and overlap calculation process here
        $('#loadDataBtn').click(); // This is a simple way to re-trigger data loading and processing
    });

});
