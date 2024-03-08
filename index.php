<?php
// // Conserved Core GO_TOOL - MAIN FILE
// Include the log.php file
include("log.php"); 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Conserved Core Finder GO_Tool</title>
    <link rel="stylesheet" type="text/css" href="media/css/go_tool_style.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.13.6/css/jquery.dataTables.min.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/buttons/2.2.2/css/buttons.dataTables.min.css">
    <link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.13.2/themes/base/jquery-ui.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <script type="text/javascript" charset="utf8" src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script type="text/javascript" charset="utf8" src="https://code.jquery.com/ui/1.13.2/jquery-ui.min.js" integrity="sha256-lSjKY0/srUM9BE3dPm+c4fBo1dky2v27Gdjm2uoZaL0=" crossorigin="anonymous"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/2.2.2/js/dataTables.buttons.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.html5.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/buttons/2.2.2/js/buttons.print.min.js"></script>
    <script type="text/javascript" charset="utf8" src="https://string-db.org/javascript/combined_embedded_network_v2.0.4.js"></script>
</head>
<body>
    <div class="containerMain">
        <div id="header">
            <div id="headerContent">
                <div id="headerContentLeft">
                    <!-- Logo image added via CSS -->
                </div>
                <div id="headerContentRight">
                    <div id="headerContentRightTop">
                        <h1>Conserved Core Finder GO_Tool</h1>
                    </div>
                    <div id="headerContentRightBottom">
                        <a href="index.php" class="headerLinks">Home</a>
                        <a href="index.php" class="headerLinks">Data Sources</a>
                        <a href="index.php" class="headerLinks">Contact</a>
                    </div>
                </div>
            </div>
        </div>

        <div id="goTermBeforeHeader">
            Currently we are using data retreived in 2022.02 from the <a href="http://www.geneontology.org/" target="_blank">Gene Ontology</a> website.
        </div>

        <div id="loadingScreen">
            <div id="loadingScreenContent">
                <h1>Loading...</h1>
                <div id="loadingScreenContentText">Please wait while the data is being loaded.</div>
            </div>
        </div>

        <div id="goTermRequest">
            <div id="goTermRequestHeader">
                <label for="goSelector">GO Term: </label>
                <input type="text" id="goSelectorInput">
                <input type="hidden" id="goSelectedTermId">

                <select id="yearSelector">
                    <option value="2022">2022</option>
                    <option value="2024">2024</option>
                </select>

                <select id="hitSelector">
                    <option value="hit">hit Proteins</option>
                    <option value="total">total Proteins</option>
                </select>
                <button id="loadDataBtn">Load GO Term</button>
            </div>
            <div id="goTermRequestSettings">

                <label for="checkboxGOInfo">Show GO Info</label>
                <label class="switch">
                    <input type="checkbox" id="checkboxGOInfo" checked>
                    <span class="slider"></span>
                </label>

                <label for="checkboxVenn">Show Venn Diagram</label>
                <label class="switch">
                    <input type="checkbox" id="checkboxVenn" checked>
                    <span class="slider"></span>
                </label>

                <label for="checkboxKOG">Show Listed KOG Groups</label>
                <label class="switch">
                    <input type="checkbox" id="checkboxKOG" checked>
                    <span class="slider"></span>
                </label>

                <label for="checkboxTable">Show Table</label>
                <label class="switch">
                    <input type="checkbox" id="checkboxTable" checked>
                    <span class="slider"></span>
                </label>
            </div>
        </div>
        
        <div id="goHeaderContainer"></div>

        <div id="goTermInformation">
            <div id="goTermInfo1"></div>
            <div id="goTermInfo2"></div>
            <div id="goTermInfo3"></div>
            <button id="closeGoTermInformation">Close</button>
        </div>

        <div id="diagramBox">
            <div id="diagramDetailContainer">
                <div id="diagramContainer"></div>
                <button id="closeDiagramBox">Close</button>
                <div id="detailsBox">
                    <div id="detailsHeaderBox">Listed KOG Groups</div>
                    <div id="detailsContentBox">
                        <!-- KOG group details will be displayed here -->
                    </div>
                </div>
            </div>
        </div>       

        <div id="dataTableContainer">
            <div id="dataTableBox">
                <table id="dataTable">
                    <!-- eggNOG groups will be loaded here using jQuery -->
                </table>
            </div>
            <button id="closeDataTable">Close</button>
        </div>

        <div id="detailsTableContainer">
            <div id="detailsTableHeaderWrapper">
                <button id="closeStringNetworkDetailsTable">Close Network</button>
                <button id="closeDetailsTableContainer">Close</button>
                <h3 id="detailsTableHeaderText">Details:</h3>
            </div>
            <div id="detailsTableWrapper">
                <div id="stringEmbedded"></div>
                <table id="detailsTable">
                    <!-- Details Table Content -->
                </table>
            </div>
            <div id="detailsTableFooterWrapper">
                <h4 id="dragDetailsTableButton">« Move »</h4>
            </div>
        </div>

        <div id="footer"> King's College London & Fondazione Edmund Mach - 2024
        </div>

    </div>

    <script src="js/go_tool_scripts.js"></script>

</body>
</html>