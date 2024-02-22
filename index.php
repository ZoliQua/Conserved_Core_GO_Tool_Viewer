<?php
// Conserved Core GO_TOOL - Main PHP File
// Get visitor's IP address. Considering the possibility of the visitor being behind a proxy
$ip = $_SERVER['REMOTE_ADDR'];
if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER)) {
    $ip = array_pop(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']));
}

// Get visitor's browser information
$browser = $_SERVER['HTTP_USER_AGENT'];

// Create a string to log
$logString = date("Y-m-d H:i:s") . " - IP: " . $ip . " - Browser: " . $browser . "\n";

// Specify the file path
$filePath = "visitors.log";

// Append the logString to the file
file_put_contents($filePath, $logString, FILE_APPEND);

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Viewer</title>
    <link rel="stylesheet" type="text/css" href="media/css/go_tool_style.css">
    <link rel="stylesheet" type="text/css" href="media/css/go.css" type="text/css" />
    <link rel="stylesheet" type="text/css" href="media/css/table.css" type="text/css" />
    <link rel="stylesheet" type="text/css" href="media/css/table_jui.css" type="text/css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.2.2/css/buttons.dataTables.min.css">
    <link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.13.1/themes/base/jquery-ui.css">
    <script type="text/javascript" charset="utf8" src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://code.jquery.com/ui/1.13.1/jquery-ui.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.html5.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.print.min.js"></script>
</head>
<body>
    <div class="container">
        <h1>Gene Ontology Data Viewer</h1>
        <div id="goHeaderContainer"></div>

        <div id="goTermInformation">
            Currently we are using data retreived in 2022.02 from the <a href="http://www.geneontology.org/" target="_blank">Gene Ontology</a> website.
        </div>

        <div id="goTermRequest">
            <label for="goSelector">GO Term: </label>
            <select id="goSelector">
                <!-- Options will be added using jQuery -->
            </select>
            <select id="hitSelector">
                <option value="hit">hit Proteins</option>
                <option value="total">total Proteins</option>
            </select>
            <button id="loadDataBtn">Load Data</button>
        </div>

        <div id="diagramBox">
            <div id="diagramDetailContainer">
                <div id="diagramContainer"></div>
                <div id="detailsBox">
                    <div id="detailsHeaderBox">Listed KOG Groups</div>
                    <div id="detailsContentBox">
                        <!-- KOG group details will be displayed here -->
                    </div>
                </div>
            </div>
        </div>       

        <table id="dataTable">
            <!-- Data will be loaded here using jQuery -->
        </table>
        <div id="detailsTableWrapper">
            <button id="closeDetailsTable">Close</button>
            <h3 id="detailsTableHeaderText">Details:</h3> 
            <table id="detailsTable">
                <!-- Details Table Content -->
            </table>
        </div>
    </div>


    <script src="js/go_tool_scripts.js"></script>

</body>
</html>